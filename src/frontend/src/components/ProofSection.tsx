import { motion } from "motion/react";

const proofPoints = [
  { label: "LIVE CANISTER", value: "YES" },
  { label: "PUBLICLY VERIFIABLE", value: "YES" },
  { label: "ON-CHAIN DEPLOYMENT", value: "YES" },
  { label: "HOSTING REQUIRED", value: "NO" },
  { label: "MONTHLY COST", value: "$0", accent: true },
];

export default function ProofSection() {
  return (
    <section className="relative pt-0 pb-12 md:pb-14">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="group relative overflow-hidden border border-[oklch(0.22_0_0)] bg-[oklch(0.11_0_0)] px-10 py-8 transition-[border-color,box-shadow] duration-300 hover:border-orange hover:shadow-[0_0_28px_rgba(255,92,0,0.12),inset_0_0_0_1px_rgba(255,92,0,0.28)] md:px-12 md:py-9"
        >
          <div className="pointer-events-none absolute right-0 top-0 h-10 w-10 bg-orange/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">
            <div className="flex min-h-full flex-col">
              <div className="max-w-[35rem]">
                <p className="font-mono-label text-orange">VERIFY IT YOURSELF</p>
                <h3 className="mt-6 font-display text-5xl font-bold uppercase leading-[0.9] tracking-tight text-foreground md:text-7xl">
                  THIS SITE IS
                  <br />
                  THE PROOF.
                </h3>
                <p className="mt-7 max-w-[31rem] font-body text-lg leading-[1.72] text-[oklch(0.56_0_0)]">
                  This isn&apos;t a demo. This site runs entirely on the
                  Internet Computer. No AWS. No hosting panel. No hidden
                  layers.
                </p>
              </div>

              <div className="mt-4 flex flex-col items-start space-y-2">
                <p className="text-[12px] leading-7 tracking-[0.08em] whitespace-nowrap text-[oklch(0.4_0_0)] [font-family:'Courier_New',monospace]">
                  Canister ID: r5jz6-caaaa-aaaai-q727a-cai
                </p>
                <a
                  href="https://dashboard.internetcomputer.org/canister/r5jz6-caaaa-aaaai-q727a-cai"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-[58px] w-full max-w-[260px] items-center justify-center bg-orange px-5 py-3 text-center font-display text-sm font-bold uppercase tracking-[0.14em] text-black transition-colors hover:bg-[oklch(0.6_0.22_37)]"
                >
                  VIEW ON-CHAIN
                  <span className="ml-2 text-xl leading-none">→</span>
                </a>
              </div>
            </div>

            <div className="flex min-h-full flex-col justify-start border-t border-[oklch(0.18_0_0)] pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
              <div className="space-y-0">
                <div className="flex items-center justify-between pb-5">
                  <span className="font-mono-label text-[oklch(0.56_0_0)]">
                    LIVE STATUS
                  </span>
                  <span className="flex items-center gap-2 text-[11px] tracking-[0.12em] text-green-400">
                    <span className="size-2 rounded-full bg-green-400" />
                    ACTIVE
                  </span>
                </div>

                {proofPoints.map((point) => (
                  <div
                    key={point.label}
                    className="flex items-center justify-between gap-5 border-t border-[oklch(0.18_0_0)] py-5"
                  >
                    <span className="font-mono-label text-[oklch(0.56_0_0)]">
                      {point.label}
                    </span>
                    <span
                      className={`text-sm font-semibold ${
                        point.accent ? "text-orange" : "text-foreground"
                      }`}
                    >
                      {point.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
