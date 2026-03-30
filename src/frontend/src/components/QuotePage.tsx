import { useEffect, useMemo, useState } from "react";
import type { PublicQuote } from "../backend.d";
import { useActor } from "../hooks/useActor";
import { useEvmWallet } from "../hooks/useEvmWallet";
import WalletPickerModal from "./WalletPickerModal";

const OWNER_ETH_ADDRESS = "0x0000000000000000000000000000000000000000";

function formatQuoteExpiry(value?: bigint): string {
  if (!value) {
    return "Open-ended";
  }
  return new Date(Number(value / 1_000_000n)).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function QuotePage() {
  const { actor } = useActor();
  const { address, isConnected, connect } = useEvmWallet();
  const [quote, setQuote] = useState<PublicQuote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [walletPickerOpen, setWalletPickerOpen] = useState(false);
  const [payError, setPayError] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  const pathParts = useMemo(
    () => window.location.pathname.split("/").filter(Boolean),
    [],
  );
  const projectId = pathParts[1] ?? "";
  const quoteToken = pathParts[2] ?? "";

  useEffect(() => {
    if (!actor || !projectId || !quoteToken) {
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError("");
    actor
      .getPublicQuote(projectId, quoteToken)
      .then((result) => {
        if (cancelled) return;
        if (!result) {
          setError("This quote link is invalid or no longer available.");
          return;
        }
        setQuote(result);
      })
      .catch(() => {
        if (!cancelled) {
          setError("We could not load this quote right now.");
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
  }, [actor, projectId, quoteToken]);

  const handlePay = async () => {
    if (!actor || !quote) {
      return;
    }
    if (OWNER_ETH_ADDRESS === "0x0000000000000000000000000000000000000000") {
      setPayError(
        "Online payment is not configured yet. Please contact Apex Architects to complete payment manually.",
      );
      return;
    }
    if (!isConnected || !address) {
      setWalletPickerOpen(true);
      return;
    }
    setIsPaying(true);
    setPayError("");
    try {
      const txHash: string = await window.ethereum?.request({
        method: "eth_sendTransaction",
        params: [{ from: address, to: OWNER_ETH_ADDRESS, value: "0x0" }],
      });
      await actor.updatePaymentStatus(quote.projectId, "paid", txHash);
      setPaid(true);
    } catch (err: any) {
      setPayError(err?.message ?? "Payment was cancelled or failed.");
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-foreground">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <p className="font-mono-label text-[10px] tracking-[0.28em] text-orange">
          APEX ARCHITECTS
        </p>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section>
            <h1 className="font-display text-5xl leading-none text-foreground md:text-6xl">
              Review your quote and pay when you&apos;re ready.
            </h1>
            <p className="mt-6 max-w-xl font-body text-lg text-[oklch(0.62_0_0)]">
              A private project quote for design, build, and launch work with Apex Architects.
            </p>
          </section>

          <section className="border border-[oklch(0.18_0_0)] bg-[oklch(0.10_0_0)] px-6 py-6">
            {loading ? (
              <p className="font-body text-sm text-[oklch(0.64_0_0)]">Loading quote...</p>
            ) : error ? (
              <p className="font-body text-sm text-red-400">{error}</p>
            ) : quote ? (
              <>
                <p className="font-mono-label text-[10px] tracking-[0.22em] text-orange">
                  PROJECT QUOTE
                </p>
                <h2 className="mt-3 font-display text-3xl text-foreground">
                  {quote.businessName || quote.clientName}
                </h2>
                <p className="mt-2 font-body text-sm text-[oklch(0.6_0_0)]">
                  {quote.package} · {quote.projectId}
                </p>

                <div className="mt-6 border border-[oklch(0.16_0_0)] divide-y divide-[oklch(0.14_0_0)]">
                  <div className="px-4 py-4">
                    <p className="font-mono-label text-[10px] tracking-[0.18em] text-[oklch(0.46_0_0)]">
                      AMOUNT
                    </p>
                    <p className="mt-2 font-display text-4xl text-foreground">
                      {quote.quoteAmount || "TBD"}
                    </p>
                  </div>
                  <div className="px-4 py-4">
                    <p className="font-mono-label text-[10px] tracking-[0.18em] text-[oklch(0.46_0_0)]">
                      SCOPE
                    </p>
                    <p className="mt-2 font-body text-sm leading-7 text-[oklch(0.72_0_0)]">
                      {quote.quoteSummary || "Custom project scope will be shared directly."}
                    </p>
                  </div>
                  <div className="px-4 py-4">
                    <p className="font-mono-label text-[10px] tracking-[0.18em] text-[oklch(0.46_0_0)]">
                      EXPIRES
                    </p>
                    <p className="mt-2 font-body text-sm text-[oklch(0.72_0_0)]">
                      {formatQuoteExpiry(quote.quoteExpiresAt)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button
                    type="button"
                    onClick={handlePay}
                    disabled={isPaying || paid}
                    className="flex w-full items-center justify-center gap-3 bg-orange px-4 py-4 font-display text-sm tracking-[0.18em] text-white transition-colors hover:bg-[oklch(0.6_0.22_37)] disabled:opacity-60"
                  >
                    <svg
                      viewBox="0 0 35 33"
                      width="22"
                      height="22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path d="M32.9582 1L19.4473 10.7183L21.9573 4.99099L32.9582 1Z" fill="#ffffff" fillOpacity="0.95" />
                      <path d="M2.04858 1L15.4383 10.809L13.0491 4.99099L2.04858 1Z" fill="#ffffff" fillOpacity="0.88" />
                      <path d="M28.2292 23.5334L24.7346 28.872L32.2451 30.9323L34.4036 23.6501L28.2292 23.5334Z" fill="#ffffff" fillOpacity="0.88" />
                      <path d="M0.608398 23.6501L2.75458 30.9323L10.2542 28.872L6.77182 23.5334L0.608398 23.6501Z" fill="#ffffff" fillOpacity="0.88" />
                      <path d="M9.85336 14.6681L7.75439 17.8308L15.1867 18.1642L14.9322 10.1505L9.85336 14.6681Z" fill="#ffffff" fillOpacity="0.9" />
                      <path d="M25.1531 14.6681L20.0052 10.0605L19.8398 18.1642L27.2503 17.8308L25.1531 14.6681Z" fill="#ffffff" fillOpacity="0.9" />
                      <path d="M10.2542 28.872L14.7252 26.6942L10.8604 23.7034L10.2542 28.872Z" fill="#ffffff" fillOpacity="0.84" />
                      <path d="M20.2812 26.6942L24.7346 28.872L24.1459 23.7034L20.2812 26.6942Z" fill="#ffffff" fillOpacity="0.84" />
                    </svg>
                    <span>
                      {paid
                        ? "PAYMENT SUBMITTED"
                        : isPaying
                          ? "PROCESSING PAYMENT..."
                          : "PAY NOW"}
                    </span>
                  </button>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="border border-[oklch(0.2_0_0)] px-4 py-4 opacity-60">
                      <div className="flex min-h-14 items-center justify-center">
                        <svg
                          viewBox="0 0 40 25"
                          width="34"
                          height="22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            d="M8.19 5.41C14.69-1.09 25.31-1.09 31.81 5.41L32.61 6.21C32.94 6.54 32.94 7.08 32.61 7.41L30.16 9.86C30 10.02 29.73 10.02 29.57 9.86L28.49 8.78C23.92 4.21 16.08 4.21 11.51 8.78L10.35 9.94C10.19 10.1 9.92 10.1 9.76 9.94L7.31 7.49C6.98 7.16 6.98 6.62 7.31 6.29L8.19 5.41ZM37.39 10.99L39.58 13.18C39.91 13.51 39.91 14.05 39.58 14.38L29.97 23.99C29.64 24.32 29.1 24.32 28.77 23.99L21.98 17.2C21.9 17.12 21.76 17.12 21.68 17.2L14.89 23.99C14.56 24.32 14.02 24.32 13.69 23.99L4.08 14.38C3.75 14.05 3.75 13.51 4.08 13.18L6.27 10.99C6.6 10.66 7.14 10.66 7.47 10.99L14.26 17.78C14.34 17.86 14.48 17.86 14.56 17.78L21.35 10.99C21.68 10.66 22.22 10.66 22.55 10.99L29.34 17.78C29.42 17.86 29.56 17.86 29.64 17.78L36.43 10.99C36.56 10.66 37.06 10.66 37.39 10.99Z"
                            fill="#3B99FC"
                          />
                        </svg>
                      </div>
                      <p className="mt-2 text-center font-body text-sm text-[oklch(0.56_0_0)]">
                        Coming soon
                      </p>
                    </div>
                    <div className="border border-[oklch(0.2_0_0)] px-4 py-4 opacity-60">
                      <div className="flex min-h-14 items-center justify-center">
                        <div className="inline-flex items-center rounded-sm bg-[#003087] px-3 py-1.5">
                          <span className="text-[11px] font-black tracking-wide text-white">
                            Pay
                          </span>
                          <span className="text-[11px] font-black tracking-wide text-[#009CDE]">
                            Pal
                          </span>
                        </div>
                      </div>
                      <p className="mt-2 text-center font-body text-sm text-[oklch(0.56_0_0)]">
                        Coming soon
                      </p>
                    </div>
                    <div className="border border-[oklch(0.2_0_0)] px-4 py-4 opacity-60">
                      <div className="flex min-h-14 items-center justify-center gap-2">
                        <div className="rounded-sm bg-white px-2 py-1 text-[10px] font-bold tracking-wide text-[#1A1F71]">
                          VISA
                        </div>
                        <div className="flex items-center rounded-sm bg-white px-2 py-1">
                          <span className="h-3 w-3 rounded-full bg-[#EB001B]" />
                          <span className="-ml-1 h-3 w-3 rounded-full bg-[#F79E1B]" />
                          <span className="ml-2 text-[9px] font-bold tracking-wide text-[#222]">
                            MC
                          </span>
                        </div>
                      </div>
                      <p className="mt-2 text-center font-body text-sm text-[oklch(0.56_0_0)]">
                        Coming soon
                      </p>
                    </div>
                  </div>
                </div>

                {payError && (
                  <p className="mt-4 font-body text-sm text-red-400">{payError}</p>
                )}
              </>
            ) : null}
          </section>
        </div>
      </div>

      <WalletPickerModal
        open={walletPickerOpen}
        onOpenChange={setWalletPickerOpen}
        onSelectMetaMask={connect}
      />
    </div>
  );
}
