import BrandMark from "@/components/BrandMark";
import { Loader2, LogOut, Mail, Shield, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Contact } from "../backend.d";
import { useActor } from "../hooks/useActor";

const SESSION_KEY = "apex-admin-session";

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

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }
  return fallback;
}

export default function AdminPanel() {
  const { actor, isFetching: actorLoading } = useActor();
  const [password, setPassword] = useState("");
  const [session, setSession] = useState<string | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }
    return window.localStorage.getItem(SESSION_KEY);
  });
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState("");
  const [deletingTimestamp, setDeletingTimestamp] = useState<bigint | null>(null);

  const sortedContacts = useMemo(
    () =>
      [...contacts].sort((a, b) => {
        if (a.timestamp === b.timestamp) {
          return 0;
        }
        return a.timestamp > b.timestamp ? -1 : 1;
      }),
    [contacts],
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (session) {
      window.localStorage.setItem(SESSION_KEY, session);
    } else {
      window.localStorage.removeItem(SESSION_KEY);
    }
  }, [session]);

  useEffect(() => {
    if (!actor || !session) {
      return;
    }

    let cancelled = false;

    const loadContacts = async () => {
      setLoading(true);
      setError("");

      try {
        const isValid = await actor.adminValidateSession(session);
        if (!isValid) {
          if (!cancelled) {
            setSession(null);
            setContacts([]);
            setError("Your admin session expired. Please sign in again.");
          }
          return;
        }

        const dashboard = await actor.adminGetDashboard(session);
        if (!cancelled) {
          setContacts(dashboard.contacts);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(getErrorMessage(loadError, "Could not load contact submissions."));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadContacts();

    return () => {
      cancelled = true;
    };
  }, [actor, session]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!actor || !password.trim()) {
      return;
    }

    setAuthLoading(true);
    setError("");

    try {
      const token = await actor.adminLogin(password.trim());
      if (!token) {
        setError("Incorrect password.");
        return;
      }

      setPassword("");
      setSession(token);
    } catch (loginError) {
      setError(getErrorMessage(loginError, "Could not sign in."));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!actor || !session) {
      setSession(null);
      return;
    }

    try {
      await actor.adminLogout(session);
    } catch {
      // Clearing the local session is enough even if the remote logout fails.
    } finally {
      setSession(null);
      setContacts([]);
      setError("");
    }
  };

  const handleDelete = async (timestamp: bigint) => {
    if (!actor || !session) {
      return;
    }

    setDeletingTimestamp(timestamp);
    setError("");

    try {
      await actor.adminDeleteContact(session, timestamp);
      setContacts((current) => current.filter((contact) => contact.timestamp !== timestamp));
    } catch (deleteError) {
      setError(getErrorMessage(deleteError, "Could not delete this message."));
    } finally {
      setDeletingTimestamp(null);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-[oklch(0.08_0_0)] px-6 py-12 text-foreground">
        <div className="mx-auto max-w-md border border-[oklch(0.18_0_0)] bg-[oklch(0.1_0_0)] p-8">
          <div className="mb-8 flex items-center gap-3">
            <BrandMark className="h-8 w-auto" />
            <div>
              <p className="font-display text-xl font-bold tracking-tight">
                Apex Architects
              </p>
              <p className="font-mono-label text-[oklch(0.56_0_0)]">
                CONTACTS INBOX
              </p>
            </div>
          </div>

          <div className="mb-8 flex items-start gap-3 border border-orange/25 bg-[oklch(0.11_0.01_35)] px-4 py-3">
            <Shield className="mt-0.5 h-4 w-4 shrink-0 text-orange" />
            <p className="font-body text-sm leading-6 text-[oklch(0.7_0_0)]">
              Sign in to review contact form submissions from the website.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="admin-password"
                className="font-mono-label text-[oklch(0.62_0_0)]"
              >
                ADMIN PASSWORD
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-12 w-full rounded-none border border-[oklch(0.22_0_0)] bg-[oklch(0.12_0_0)] px-4 font-body text-foreground outline-none transition-colors focus:border-orange"
                disabled={authLoading || actorLoading}
              />
            </div>

            {error && (
              <p className="border border-[oklch(0.36_0.16_28)] bg-[oklch(0.16_0.04_28)] px-4 py-3 font-body text-sm text-[oklch(0.82_0.08_28)]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={authLoading || actorLoading || !password.trim()}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-none bg-orange px-5 font-display text-sm font-bold tracking-[0.14em] text-black transition-colors hover:bg-[oklch(0.6_0.22_37)] disabled:opacity-60"
            >
              {authLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              SIGN IN
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[oklch(0.08_0_0)] px-6 py-10 text-foreground">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-5 border-b border-[oklch(0.18_0_0)] pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <BrandMark className="h-8 w-auto" />
              <p className="font-display text-2xl font-bold tracking-tight">
                Apex Architects Inbox
              </p>
            </div>
            <p className="max-w-2xl font-body text-sm leading-7 text-[oklch(0.62_0_0)]">
              Contact form submissions only. No pipeline, no quotes, no CRM clutter.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="border border-[oklch(0.18_0_0)] bg-[oklch(0.1_0_0)] px-4 py-3">
              <p className="font-mono-label text-[oklch(0.56_0_0)]">
                TOTAL MESSAGES
              </p>
              <p className="mt-1 font-display text-2xl font-bold">
                {sortedContacts.length}
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex h-12 items-center gap-2 border border-[oklch(0.22_0_0)] px-4 font-display text-sm font-bold tracking-[0.12em] text-foreground transition-colors hover:border-orange hover:text-orange"
            >
              <LogOut className="h-4 w-4" />
              SIGN OUT
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 border border-[oklch(0.36_0.16_28)] bg-[oklch(0.16_0.04_28)] px-4 py-3 font-body text-sm text-[oklch(0.82_0.08_28)]">
            {error}
          </div>
        )}

        {loading || actorLoading ? (
          <div className="flex min-h-[240px] items-center justify-center border border-[oklch(0.18_0_0)] bg-[oklch(0.1_0_0)]">
            <div className="flex items-center gap-3 font-body text-[oklch(0.62_0_0)]">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading contact submissions...
            </div>
          </div>
        ) : sortedContacts.length === 0 ? (
          <div className="border border-[oklch(0.18_0_0)] bg-[oklch(0.1_0_0)] px-8 py-14 text-center">
            <Mail className="mx-auto mb-4 h-8 w-8 text-orange" />
            <p className="font-display text-2xl font-bold tracking-tight">
              No messages yet
            </p>
            <p className="mx-auto mt-3 max-w-lg font-body text-sm leading-7 text-[oklch(0.62_0_0)]">
              New website submissions will appear here after visitors use the contact form.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {sortedContacts.map((contact) => {
              const isDeleting = deletingTimestamp === contact.timestamp;

              return (
                <article
                  key={contact.timestamp.toString()}
                  className="border border-[oklch(0.18_0_0)] bg-[oklch(0.1_0_0)] p-6"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
                          {contact.name}
                        </h2>
                        <a
                          href={`mailto:${contact.email}`}
                          className="font-body text-sm text-orange underline-offset-4 hover:underline"
                        >
                          {contact.email}
                        </a>
                      </div>

                      <p className="font-mono-label text-[oklch(0.56_0_0)]">
                        {formatTimestamp(contact.timestamp)}
                      </p>

                      <p className="max-w-3xl whitespace-pre-wrap font-body text-sm leading-7 text-[oklch(0.76_0_0)]">
                        {contact.message}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => void handleDelete(contact.timestamp)}
                      disabled={isDeleting}
                      className="inline-flex h-11 items-center justify-center gap-2 self-start border border-[oklch(0.22_0_0)] px-4 font-display text-xs font-bold tracking-[0.12em] text-foreground transition-colors hover:border-[oklch(0.36_0.16_28)] hover:text-[oklch(0.82_0.08_28)] disabled:opacity-60"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      DELETE
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
