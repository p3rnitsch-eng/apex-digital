import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Shield, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type {
  AdminStats,
  Contact,
  ProjectSubmission,
} from "../backend.d";
import { useActor } from "../hooks/useActor";

const SESSION_KEY = "apex-admin-session";

const STATUS_OPTIONS = [
  "new",
  "qualified",
  "proposal_sent",
  "won",
  "lost",
];

const PRIORITY_OPTIONS = ["low", "medium", "high", "vip"];

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  return new Date(ms).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toDateInput(value?: bigint): string {
  if (value === undefined) {
    return "";
  }
  const ms = Number(value / 1_000_000n);
  const date = new Date(ms);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

function toNanoseconds(value: string): bigint | undefined {
  if (!value) {
    return undefined;
  }
  return BigInt(new Date(value).getTime()) * 1_000_000n;
}

function metricValue(value: bigint): string {
  return Number(value).toLocaleString("en-US");
}

function statusTone(status: string): string {
  switch (status) {
    case "won":
    case "paid":
      return "text-emerald-300";
    case "qualified":
      return "text-sky-300";
    case "proposal_sent":
      return "text-amber-300";
    case "lost":
      return "text-red-300";
    default:
      return "text-orange";
  }
}

function priorityTone(priority: string): string {
  switch (priority) {
    case "vip":
      return "text-orange";
    case "high":
      return "text-amber-300";
    case "low":
      return "text-zinc-400";
    default:
      return "text-zinc-200";
  }
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}

function computeStats(
  projects: ProjectSubmission[],
  contacts: Contact[],
): AdminStats {
  const now = Date.now();
  const stats = {
    totalProjects: BigInt(projects.length),
    totalContacts: BigInt(contacts.length),
    paidProjects: 0n,
    pendingProjects: 0n,
    followUpsDue: 0n,
  };

  for (const project of projects) {
    if (project.paymentStatus === "paid") {
      stats.paidProjects += 1n;
    } else {
      stats.pendingProjects += 1n;
    }

    if (
      project.followUpAt !== undefined &&
      Number(project.followUpAt / 1_000_000n) <= now &&
      project.crmStatus !== "won" &&
      project.crmStatus !== "lost"
    ) {
      stats.followUpsDue += 1n;
    }
  }

  return stats;
}

function AdminMetric({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="border border-[oklch(0.18_0_0)] bg-[oklch(0.10_0_0)] px-5 py-4">
      <p className="font-mono-label text-[9px] tracking-[0.24em] text-[oklch(0.48_0_0)]">
        {label}
      </p>
      <p className="mt-3 font-display text-3xl text-foreground">{value}</p>
      <p className="mt-2 font-body text-sm text-[oklch(0.58_0_0)]">{hint}</p>
    </div>
  );
}

function ContactRow({ contact }: { contact: Contact }) {
  return (
    <div className="grid gap-3 border-b border-[oklch(0.16_0_0)] px-5 py-4 md:grid-cols-[1.1fr_1fr_1.4fr_180px]">
      <div>
        <p className="font-body text-sm text-foreground">{contact.name}</p>
        <p className="mt-1 font-mono-label text-[10px] tracking-[0.18em] text-[oklch(0.42_0_0)]">
          CONTACT
        </p>
      </div>
      <p className="font-body text-sm text-[oklch(0.66_0_0)] break-all">
        {contact.email}
      </p>
      <p className="font-body text-sm text-[oklch(0.62_0_0)]">{contact.message}</p>
      <p className="font-mono-label text-[10px] tracking-[0.18em] text-[oklch(0.42_0_0)]">
        {formatTimestamp(contact.timestamp)}
      </p>
    </div>
  );
}

function buildQuoteLink(project: ProjectSubmission): string | null {
  if (!project.quoteToken) {
    return null;
  }
  const base = window.location.origin;
  return `${base}/pay/${project.projectId}/${project.quoteToken}`;
}

export default function AdminPanel() {
  const { actor } = useActor();
  const [session, setSession] = useState<string | null>(() =>
    window.localStorage.getItem(SESSION_KEY),
  );
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState("");
  const [projects, setProjects] = useState<ProjectSubmission[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [selectedId, setSelectedId] = useState<string>("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [draftStatus, setDraftStatus] = useState("new");
  const [draftPriority, setDraftPriority] = useState("medium");
  const [draftFollowUp, setDraftFollowUp] = useState("");
  const [draftNote, setDraftNote] = useState("");
  const [quoteAmount, setQuoteAmount] = useState("");
  const [quoteSummary, setQuoteSummary] = useState("");
  const [quoteExpiresAt, setQuoteExpiresAt] = useState("");
  const [saving, setSaving] = useState(false);

  const selectedProject = useMemo(
    () => projects.find((project) => project.projectId === selectedId) ?? null,
    [projects, selectedId],
  );

  const filteredProjects = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesStatus =
        statusFilter === "all" || project.crmStatus === statusFilter;
      const haystack = [
        project.projectId,
        project.clientName,
        project.businessName,
        project.email,
        project.package,
        project.whatTheyNeed,
      ]
        .join(" ")
        .toLowerCase();
      const matchesQuery = !normalized || haystack.includes(normalized);
      return matchesStatus && matchesQuery;
    });
  }, [projects, query, statusFilter]);

  useEffect(() => {
    if (!selectedProject && filteredProjects[0]) {
      setSelectedId(filteredProjects[0].projectId);
    }
  }, [filteredProjects, selectedProject]);

  useEffect(() => {
    if (!selectedProject) {
      return;
    }
    setDraftStatus(selectedProject.crmStatus);
    setDraftPriority(selectedProject.priority);
    setDraftFollowUp(toDateInput(selectedProject.followUpAt));
    setDraftNote("");
    setQuoteAmount(selectedProject.quoteAmount);
    setQuoteSummary(selectedProject.quoteSummary);
    setQuoteExpiresAt(toDateInput(selectedProject.quoteExpiresAt));
  }, [selectedProject]);

  useEffect(() => {
    if (!actor || !session) {
      return;
    }

    let cancelled = false;
    setLoading(true);
    setDashboardError("");

    Promise.all([actor.getProjects(), actor.getContacts()])
      .then(([projectsResult, contactsResult]) => {
        if (cancelled) {
          return;
        }
        setProjects(projectsResult);
        setContacts(contactsResult);
        setStats(computeStats(projectsResult, contactsResult));
      })
      .catch((error) => {
        if (!cancelled) {
          setDashboardError(
            getErrorMessage(error, "Could not load the CRM workspace."),
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [actor, session]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!actor) {
      return;
    }
    setLoading(true);
    setPasswordError("");
    try {
      const token = await actor.adminLogin(password);
      if (!token) {
        setPasswordError("Incorrect password.");
        return;
      }
      const [projectsResult, contactsResult] = await Promise.all([
        actor.getProjects(),
        actor.getContacts(),
      ]);
      window.localStorage.setItem(SESSION_KEY, token);
      setProjects(projectsResult);
      setContacts(contactsResult);
      setStats(computeStats(projectsResult, contactsResult));
      setSession(token);
      setPassword("");
    } catch (error) {
      setPasswordError(
        getErrorMessage(error, "Could not reach the admin backend."),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (actor && session) {
      try {
        await actor.adminLogout(session);
      } catch {
        // Ignore logout transport errors and clear locally.
      }
    }
    window.localStorage.removeItem(SESSION_KEY);
    setSession(null);
    setProjects([]);
    setContacts([]);
    setStats(null);
  };

  const refreshDashboard = async () => {
    if (!actor || !session) {
      return;
    }
    const [projectsResult, contactsResult] = await Promise.all([
      actor.getProjects(),
      actor.getContacts(),
    ]);
    setProjects(projectsResult);
    setContacts(contactsResult);
    setStats(computeStats(projectsResult, contactsResult));
  };

  const handleSaveProject = async () => {
    if (!actor || !session || !selectedProject) {
      return;
    }
    setSaving(true);
    setDashboardError("");
    try {
      await actor.adminUpdateProject(
        session,
        selectedProject.projectId,
        draftStatus,
        draftPriority,
        toNanoseconds(draftFollowUp),
        draftNote.trim() || undefined,
      );
      await refreshDashboard();
    } catch {
      setDashboardError("Could not save the project update.");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateQuote = async () => {
    if (!actor || !session || !selectedProject) {
      return;
    }
    setSaving(true);
    setDashboardError("");
    try {
      await actor.adminCreateQuote(
        session,
        selectedProject.projectId,
        quoteAmount.trim(),
        quoteSummary.trim(),
        toNanoseconds(quoteExpiresAt),
      );
      await refreshDashboard();
    } catch (error) {
      setDashboardError(
        getErrorMessage(error, "Could not save the quote."),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!actor || !session || !selectedProject) {
      return;
    }
    const confirmed = window.confirm(
      `Delete ${selectedProject.projectId}? This cannot be undone.`,
    );
    if (!confirmed) {
      return;
    }
    setSaving(true);
    setDashboardError("");
    try {
      await actor.adminDeleteProject(session, selectedProject.projectId);
      setSelectedId("");
      await refreshDashboard();
    } catch (error) {
      setDashboardError(
        getErrorMessage(error, "Could not delete the project."),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteContact = async (timestamp: bigint) => {
    if (!actor || !session) {
      return;
    }
    const confirmed = window.confirm(
      "Delete this contact submission? This cannot be undone.",
    );
    if (!confirmed) {
      return;
    }
    setDashboardError("");
    try {
      await actor.adminDeleteContact(session, timestamp);
      await refreshDashboard();
    } catch (error) {
      setDashboardError(
        getErrorMessage(error, "Could not delete the contact."),
      );
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-[#090909] text-foreground">
        <div className="mx-auto grid min-h-screen max-w-6xl lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col justify-between border-b border-[oklch(0.16_0_0)] px-8 py-10 lg:border-b-0 lg:border-r">
            <div>
              <p className="font-mono-label text-[10px] tracking-[0.28em] text-orange">
                APEX ARCHITECTS
              </p>
              <h1 className="mt-6 max-w-xl font-display text-5xl leading-none text-foreground md:text-7xl">
                Private CRM for leads, follow-ups, and paid work.
              </h1>
              <p className="mt-6 max-w-md font-body text-lg text-[oklch(0.62_0_0)]">
                Clean operations, one protected workspace, and no public route
                access beyond <span className="text-orange">/admin</span>.
              </p>
            </div>

            <div className="grid gap-4 pt-12 md:grid-cols-2">
              <div className="border border-[oklch(0.16_0_0)] px-5 py-5">
                <Shield className="h-5 w-5 text-orange" />
                <p className="mt-4 font-mono-label text-[10px] tracking-[0.2em] text-[oklch(0.48_0_0)]">
                  ACCESS MODEL
                </p>
                <p className="mt-2 font-body text-sm text-[oklch(0.68_0_0)]">
                  Password-gated backend session with CRM-only reads.
                </p>
              </div>
              <div className="border border-[oklch(0.16_0_0)] px-5 py-5">
                <Sparkles className="h-5 w-5 text-orange" />
                <p className="mt-4 font-mono-label text-[10px] tracking-[0.2em] text-[oklch(0.48_0_0)]">
                  WORKSPACE
                </p>
                <p className="mt-2 font-body text-sm text-[oklch(0.68_0_0)]">
                  Lead pipeline, notes, follow-ups, and contact inbox in one view.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center px-8 py-10">
            <form
              onSubmit={handleLogin}
              className="w-full max-w-md border border-[oklch(0.18_0_0)] bg-[oklch(0.10_0_0)] px-8 py-8"
            >
              <p className="font-mono-label text-[10px] tracking-[0.24em] text-[oklch(0.46_0_0)]">
                ADMIN LOGIN
              </p>
              <h2 className="mt-3 font-display text-3xl text-foreground">
                Enter the Apex operations workspace
              </h2>
              <label className="mt-8 block font-mono-label text-[10px] tracking-[0.2em] text-[oklch(0.5_0_0)]">
                PASSWORD
              </label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-3 w-full border border-[oklch(0.2_0_0)] bg-black/20 px-4 py-4 font-body text-sm text-foreground outline-none transition-colors focus:border-orange"
                placeholder="Enter admin password"
              />
              {passwordError && (
                <p className="mt-3 font-body text-sm text-red-400">{passwordError}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="mt-8 w-full bg-orange px-4 py-4 font-display text-sm tracking-[0.22em] text-white transition-colors hover:bg-[oklch(0.6_0.22_37)] disabled:opacity-60"
              >
                {loading ? "OPENING..." : "ENTER ADMIN"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] text-foreground">
      <header className="border-b border-[oklch(0.15_0_0)]">
        <div className="mx-auto flex max-w-[1500px] items-end justify-between gap-6 px-6 py-6">
          <div>
            <p className="font-mono-label text-[10px] tracking-[0.28em] text-orange">
              APEX ARCHITECTS
            </p>
            <h1 className="mt-3 font-display text-3xl text-foreground md:text-4xl">
              CRM Workspace
            </h1>
            <p className="mt-2 font-body text-sm text-[oklch(0.6_0_0)]">
              Protected pipeline for project inquiries, contacts, payments, and follow-ups.
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="font-mono-label text-[10px] tracking-[0.22em] text-[oklch(0.52_0_0)] transition-colors hover:text-orange"
          >
            SIGN OUT
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-6 py-8">
        {stats && (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <AdminMetric
              label="Projects"
              value={metricValue(stats.totalProjects)}
              hint="All project intakes currently stored."
            />
            <AdminMetric
              label="Contacts"
              value={metricValue(stats.totalContacts)}
              hint="General inquiries from the public site."
            />
            <AdminMetric
              label="Paid"
              value={metricValue(stats.paidProjects)}
              hint="Projects marked paid by the checkout flow."
            />
            <AdminMetric
              label="Pending"
              value={metricValue(stats.pendingProjects)}
              hint="Projects still awaiting payment or closeout."
            />
            <AdminMetric
              label="Follow-Ups Due"
              value={metricValue(stats.followUpsDue)}
              hint="Projects with follow-up dates already due."
            />
          </section>
        )}

        <section className="mt-8">
          <Tabs defaultValue="projects">
            <TabsList className="h-auto gap-2 rounded-none border border-[oklch(0.18_0_0)] bg-transparent p-1">
              <TabsTrigger
                value="projects"
                className="rounded-none px-4 py-2 font-mono-label text-[11px] tracking-[0.2em] data-[state=active]:bg-orange data-[state=active]:text-white"
              >
                PIPELINE
              </TabsTrigger>
              <TabsTrigger
                value="contacts"
                className="rounded-none px-4 py-2 font-mono-label text-[11px] tracking-[0.2em] data-[state=active]:bg-orange data-[state=active]:text-white"
              >
                CONTACT INBOX
              </TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="mt-6">
              <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <section className="border border-[oklch(0.16_0_0)]">
                  <div className="border-b border-[oklch(0.16_0_0)] px-5 py-4">
                    <div className="grid gap-4 lg:grid-cols-[1fr_180px]">
                      <label className="flex items-center gap-3 border border-[oklch(0.18_0_0)] bg-[oklch(0.10_0_0)] px-4 py-3">
                        <Search className="h-4 w-4 text-[oklch(0.45_0_0)]" />
                        <input
                          value={query}
                          onChange={(event) => setQuery(event.target.value)}
                          placeholder="Search by project, client, business, email"
                          className="w-full bg-transparent font-body text-sm text-foreground outline-none placeholder:text-[oklch(0.4_0_0)]"
                        />
                      </label>
                      <select
                        value={statusFilter}
                        onChange={(event) => setStatusFilter(event.target.value)}
                        className="border border-[oklch(0.18_0_0)] bg-[oklch(0.10_0_0)] px-4 py-3 font-mono-label text-[11px] tracking-[0.18em] text-foreground outline-none"
                      >
                        <option value="all">ALL STATUSES</option>
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status.replaceAll("_", " ").toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="max-h-[720px] overflow-y-auto">
                    {filteredProjects.length === 0 ? (
                      <div className="px-5 py-24 text-center">
                        <p className="font-mono-label text-[10px] tracking-[0.24em] text-[oklch(0.4_0_0)]">
                          NO MATCHING LEADS
                        </p>
                      </div>
                    ) : (
                      filteredProjects.map((project) => (
                        <button
                          key={project.projectId}
                          type="button"
                          onClick={() => setSelectedId(project.projectId)}
                          className={`grid w-full gap-3 border-b border-[oklch(0.15_0_0)] px-5 py-4 text-left transition-colors md:grid-cols-[160px_1fr_140px_120px_160px] ${
                            selectedId === project.projectId
                              ? "bg-[oklch(0.12_0.01_40)] ring-1 ring-inset ring-orange/25"
                              : "hover:bg-[oklch(0.11_0_0)]"
                          }`}
                        >
                          <div>
                            <p className="font-mono-label text-[10px] tracking-[0.18em] text-orange">
                              {project.projectId}
                            </p>
                            <p className="mt-2 font-body text-sm text-[oklch(0.68_0_0)]">
                              {project.package}
                            </p>
                          </div>
                          <div>
                            <p className="font-body text-sm text-foreground">
                              {project.clientName}
                            </p>
                            <p className="mt-1 font-body text-sm text-[oklch(0.58_0_0)]">
                              {project.businessName}
                            </p>
                          </div>
                          <div>
                            <p
                              className={`font-mono-label text-[10px] tracking-[0.18em] ${statusTone(project.crmStatus)}`}
                            >
                              {project.crmStatus.replaceAll("_", " ").toUpperCase()}
                            </p>
                            <p
                              className={`mt-2 font-mono-label text-[10px] tracking-[0.18em] ${priorityTone(project.priority)}`}
                            >
                              {project.priority.toUpperCase()}
                            </p>
                          </div>
                          <div>
                            <p
                              className={`font-mono-label text-[10px] tracking-[0.18em] ${statusTone(project.paymentStatus)}`}
                            >
                              {project.paymentStatus.toUpperCase()}
                            </p>
                          </div>
                          <div>
                            <p className="font-mono-label text-[10px] tracking-[0.18em] text-[oklch(0.42_0_0)]">
                              {formatTimestamp(project.lastUpdated)}
                            </p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </section>

                <section className="border border-[oklch(0.16_0_0)] bg-[oklch(0.095_0_0)]">
                  {selectedProject ? (
                    <>
                      <div className="border-b border-[oklch(0.16_0_0)] px-6 py-5">
                        <p className="font-mono-label text-[10px] tracking-[0.24em] text-orange">
                          ACTIVE LEAD
                        </p>
                        <h2 className="mt-3 font-display text-3xl text-foreground">
                          {selectedProject.clientName}
                        </h2>
                        <p className="mt-2 font-body text-sm text-[oklch(0.62_0_0)]">
                          {selectedProject.businessName} · {selectedProject.email}
                        </p>
                      </div>

                      <div className="space-y-8 px-6 py-6">
                        <div className="grid gap-6 md:grid-cols-2">
                          <div>
                            <p className="font-mono-label text-[10px] tracking-[0.22em] text-[oklch(0.44_0_0)]">
                              PROJECT BRIEF
                            </p>
                            <p className="mt-3 font-body text-sm leading-7 text-[oklch(0.72_0_0)]">
                              {selectedProject.whatTheyNeed}
                            </p>
                          </div>
                          <div>
                            <p className="font-mono-label text-[10px] tracking-[0.22em] text-[oklch(0.44_0_0)]">
                              DETAIL SNAPSHOT
                            </p>
                            <div className="mt-3 grid gap-3 text-sm text-[oklch(0.68_0_0)]">
                              <p>Website: {selectedProject.currentWebsite || "N/A"}</p>
                              <p>Timeline: {selectedProject.timeline || "N/A"}</p>
                              <p>Content: {selectedProject.contentReadiness || "N/A"}</p>
                              <p>Needs dashboard: {selectedProject.needsDashboard ? "Yes" : "No"}</p>
                              <p>Needs payments: {selectedProject.needsPaymentIntegration ? "Yes" : "No"}</p>
                            </div>
                          </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                          <div>
                            <label className="font-mono-label text-[10px] tracking-[0.2em] text-[oklch(0.46_0_0)]">
                              STATUS
                            </label>
                            <select
                              value={draftStatus}
                              onChange={(event) => setDraftStatus(event.target.value)}
                              className="mt-2 w-full border border-[oklch(0.18_0_0)] bg-[oklch(0.10_0_0)] px-4 py-3 font-body text-sm text-foreground outline-none"
                            >
                              {STATUS_OPTIONS.map((status) => (
                                <option key={status} value={status}>
                                  {status.replaceAll("_", " ").toUpperCase()}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="font-mono-label text-[10px] tracking-[0.2em] text-[oklch(0.46_0_0)]">
                              PRIORITY
                            </label>
                            <select
                              value={draftPriority}
                              onChange={(event) => setDraftPriority(event.target.value)}
                              className="mt-2 w-full border border-[oklch(0.18_0_0)] bg-[oklch(0.10_0_0)] px-4 py-3 font-body text-sm text-foreground outline-none"
                            >
                              {PRIORITY_OPTIONS.map((priority) => (
                                <option key={priority} value={priority}>
                                  {priority.toUpperCase()}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="font-mono-label text-[10px] tracking-[0.2em] text-[oklch(0.46_0_0)]">
                              FOLLOW-UP
                            </label>
                            <input
                              type="datetime-local"
                              value={draftFollowUp}
                              onChange={(event) => setDraftFollowUp(event.target.value)}
                              className="mt-2 w-full border border-[oklch(0.18_0_0)] bg-[oklch(0.10_0_0)] px-4 py-3 font-body text-sm text-foreground outline-none"
                            />
                          </div>
                        </div>

                        <div className="border-t border-[oklch(0.16_0_0)] pt-6">
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="font-mono-label text-[10px] tracking-[0.22em] text-[oklch(0.44_0_0)]">
                                CLIENT QUOTE
                              </p>
                              <p className="mt-2 font-body text-sm text-[oklch(0.58_0_0)]">
                                Create a client-facing payment link for this project.
                              </p>
                            </div>
                            <p className={`font-mono-label text-[10px] tracking-[0.18em] ${statusTone(selectedProject.quoteStatus)}`}>
                              {selectedProject.quoteStatus.toUpperCase()}
                            </p>
                          </div>

                          <div className="mt-5 grid gap-4 md:grid-cols-2">
                            <div>
                              <label className="font-mono-label text-[10px] tracking-[0.2em] text-[oklch(0.46_0_0)]">
                                QUOTE AMOUNT
                              </label>
                              <input
                                value={quoteAmount}
                                onChange={(event) => setQuoteAmount(event.target.value)}
                                placeholder="$2,500"
                                className="mt-2 w-full border border-[oklch(0.18_0_0)] bg-[oklch(0.10_0_0)] px-4 py-3 font-body text-sm text-foreground outline-none placeholder:text-[oklch(0.38_0_0)]"
                              />
                            </div>
                            <div>
                              <label className="font-mono-label text-[10px] tracking-[0.2em] text-[oklch(0.46_0_0)]">
                                EXPIRES
                              </label>
                              <input
                                type="datetime-local"
                                value={quoteExpiresAt}
                                onChange={(event) => setQuoteExpiresAt(event.target.value)}
                                className="mt-2 w-full border border-[oklch(0.18_0_0)] bg-[oklch(0.10_0_0)] px-4 py-3 font-body text-sm text-foreground outline-none"
                              />
                            </div>
                          </div>

                          <div className="mt-4">
                            <label className="font-mono-label text-[10px] tracking-[0.2em] text-[oklch(0.46_0_0)]">
                              QUOTE SUMMARY
                            </label>
                            <textarea
                              value={quoteSummary}
                              onChange={(event) => setQuoteSummary(event.target.value)}
                              placeholder="Landing page build, contact form, and branded design system."
                              rows={4}
                              className="mt-2 w-full border border-[oklch(0.18_0_0)] bg-[oklch(0.10_0_0)] px-4 py-4 font-body text-sm text-foreground outline-none placeholder:text-[oklch(0.38_0_0)]"
                            />
                          </div>

                          {buildQuoteLink(selectedProject) && (
                            <div className="mt-4 border border-[oklch(0.16_0_0)] px-4 py-4">
                              <p className="font-mono-label text-[10px] tracking-[0.18em] text-orange">
                                CLIENT PAYMENT LINK
                              </p>
                              <a
                                href={buildQuoteLink(selectedProject) ?? "#"}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-3 block break-all font-body text-sm text-[oklch(0.72_0_0)] underline underline-offset-4 hover:text-orange"
                              >
                                {buildQuoteLink(selectedProject)}
                              </a>
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="font-mono-label text-[10px] tracking-[0.2em] text-[oklch(0.46_0_0)]">
                            INTERNAL NOTE
                          </label>
                          <textarea
                            value={draftNote}
                            onChange={(event) => setDraftNote(event.target.value)}
                            placeholder="Log next steps, proposal context, or call notes."
                            rows={5}
                            className="mt-2 w-full border border-[oklch(0.18_0_0)] bg-[oklch(0.10_0_0)] px-4 py-4 font-body text-sm text-foreground outline-none placeholder:text-[oklch(0.38_0_0)]"
                          />
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[oklch(0.16_0_0)] pt-5">
                          <p className="font-body text-sm text-[oklch(0.56_0_0)]">
                            Last updated {formatTimestamp(selectedProject.lastUpdated)}
                          </p>
                          <div className="flex flex-wrap items-center gap-3">
                            <button
                              type="button"
                              disabled={saving}
                              onClick={handleCreateQuote}
                              className="border border-[oklch(0.24_0_0)] px-5 py-3 font-mono-label text-[11px] tracking-[0.18em] text-[oklch(0.76_0_0)] transition-colors hover:border-orange hover:text-orange disabled:opacity-60"
                            >
                              {saving ? "SAVING..." : "SAVE QUOTE"}
                            </button>
                            <button
                              type="button"
                              disabled={saving}
                              onClick={handleSaveProject}
                              className="bg-orange px-5 py-3 font-display text-sm tracking-[0.18em] text-white transition-colors hover:bg-[oklch(0.6_0.22_37)] disabled:opacity-60"
                            >
                              {saving ? "SAVING..." : "SAVE CHANGES"}
                            </button>
                            <button
                              type="button"
                              disabled={saving}
                              onClick={handleDeleteProject}
                              className="border border-red-500/40 px-5 py-3 font-mono-label text-[11px] tracking-[0.18em] text-red-300 transition-colors hover:border-red-400 hover:text-red-200 disabled:opacity-60"
                            >
                              DELETE LEAD
                            </button>
                          </div>
                        </div>

                        <div className="border-t border-[oklch(0.16_0_0)] pt-6">
                          <p className="font-mono-label text-[10px] tracking-[0.22em] text-[oklch(0.44_0_0)]">
                            INTERNAL NOTES
                          </p>
                          <div className="mt-4 space-y-3">
                            {selectedProject.internalNotes.length === 0 ? (
                              <p className="font-body text-sm text-[oklch(0.5_0_0)]">
                                No internal notes yet.
                              </p>
                            ) : (
                              selectedProject.internalNotes
                                .slice()
                                .reverse()
                                .map((note) => (
                                  <div
                                    key={note.id}
                                    className="border border-[oklch(0.16_0_0)] px-4 py-4"
                                  >
                                    <p className="font-body text-sm leading-7 text-[oklch(0.72_0_0)]">
                                      {note.body}
                                    </p>
                                    <p className="mt-3 font-mono-label text-[10px] tracking-[0.18em] text-[oklch(0.42_0_0)]">
                                      {formatTimestamp(note.createdAt)}
                                    </p>
                                  </div>
                                ))
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="px-6 py-20 text-center">
                      <p className="font-mono-label text-[10px] tracking-[0.24em] text-[oklch(0.4_0_0)]">
                        SELECT A LEAD
                      </p>
                    </div>
                  )}
                </section>
              </div>
            </TabsContent>

            <TabsContent value="contacts" className="mt-6">
              <section className="border border-[oklch(0.16_0_0)]">
                <div className="border-b border-[oklch(0.16_0_0)] px-5 py-4">
                  <p className="font-mono-label text-[10px] tracking-[0.24em] text-[oklch(0.46_0_0)]">
                    CONTACT INBOX
                  </p>
                  <p className="mt-2 font-body text-sm text-[oklch(0.6_0_0)]">
                    Direct outreach submitted through the main site.
                  </p>
                </div>
                {contacts.length === 0 ? (
                  <div className="px-5 py-20 text-center">
                    <p className="font-mono-label text-[10px] tracking-[0.24em] text-[oklch(0.4_0_0)]">
                      NO CONTACTS YET
                    </p>
                  </div>
                ) : (
                  <div className="max-h-[760px] overflow-y-auto">
                    {contacts.map((contact) => (
                      <div
                        key={contact.email + String(contact.timestamp)}
                        className="relative"
                      >
                        <ContactRow contact={contact} />
                        <button
                          type="button"
                          onClick={() => handleDeleteContact(contact.timestamp)}
                          className="absolute right-5 top-4 border border-red-500/40 px-3 py-2 font-mono-label text-[10px] tracking-[0.16em] text-red-300 transition-colors hover:border-red-400 hover:text-red-200"
                        >
                          DELETE
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </TabsContent>
          </Tabs>
        </section>

        {(loading || dashboardError) && (
          <div className="mt-6 flex items-center justify-between border border-[oklch(0.16_0_0)] px-5 py-4">
            <p className="font-body text-sm text-[oklch(0.62_0_0)]">
              {loading ? "Refreshing CRM data..." : dashboardError}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
