import { motion } from "motion/react";

const comparisonRows = [
  {
    label: "Upfront cost",
    old: "$40",
    next: "From $400",
  },
  {
    label: "Monthly hosting",
    old: "$10-50/mo",
    next: "Cycles, pennies a year",
    nextTone: "text-orange",
  },
  {
    label: "Plugin / update maintenance",
    old: "Ongoing",
    next: "None",
    nextTone: "text-orange",
  },
  {
    label: "Can the host pull it down?",
    old: "Yes",
    next: "No",
    nextTone: "text-orange",
  },
  {
    label: "Verifiable on-chain",
    old: "No",
    next: "Yes",
    nextTone: "text-orange",
  },
  {
    label: "Typical 3-year total",
    old: "$800-2,000+",
    oldTone: "text-red-400",
    next: "What you paid. Nothing more.",
    nextTone: "text-orange",
    isFinal: true,
  },
];

export default function WhyChangesEverythingSection() {
  return (
    <section id="real-cost" className="relative py-28 md:py-36">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange to-transparent opacity-80" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-orange to-transparent opacity-80" />

      <div className="mx-auto max-w-7xl px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-4 font-mono-label text-orange"
        >
          THE REAL COST
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-[68rem] font-display text-[clamp(2.9rem,6vw,5.2rem)] font-bold uppercase leading-[0.92] tracking-tight text-foreground"
        >
          <span className="block md:whitespace-nowrap">
            THE $40 WEBSITE COSTS MORE
          </span>
          <span className="block text-orange">THAN YOU THINK.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 max-w-2xl font-body text-lg leading-8 text-[oklch(0.62_0_0)]"
        >
          Cheap websites are only cheap to start. By year three, many small
          businesses have spent far more on hosting, emergency fixes, plugin
          updates, and rebuilds than they would have paid to build it properly
          in the first place.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-14 max-w-[58rem] overflow-hidden border border-[oklch(0.18_0_0)]"
        >
          <div className="grid grid-cols-[1.15fr_0.92fr_0.93fr] border-b border-[oklch(0.22_0_0)] bg-[oklch(0.16_0_0)]">
            <div className="border-r border-[oklch(0.22_0_0)] px-4 py-3.5">
              <p className="font-mono-label text-[10px] tracking-[0.22em] text-[oklch(0.62_0_0)]">
                WHAT YOU&apos;RE COMPARING
              </p>
            </div>
            <div className="border-r border-[oklch(0.22_0_0)] px-4 py-3.5 text-center">
              <p className="font-mono-label text-[10px] tracking-[0.22em] text-[oklch(0.62_0_0)]">
                $40 FIVERR SITE
              </p>
            </div>
            <div className="px-4 py-3.5 text-center">
              <p className="font-mono-label text-[10px] tracking-[0.22em] text-orange">
                APEX ON ICP
              </p>
            </div>
          </div>

          {comparisonRows.map((row) => (
            <div
              key={row.label}
              className={`grid grid-cols-[1.15fr_0.92fr_0.93fr] ${
                row.isFinal ? "bg-[oklch(0.095_0.005_40)]" : "bg-[oklch(0.08_0_0)]"
              }`}
            >
              <div className="border-r border-t border-[oklch(0.14_0_0)] px-4 py-3.5">
                <p
                  className={`font-body text-[13px] leading-snug ${
                    row.isFinal ? "font-semibold text-foreground" : "text-[oklch(0.68_0_0)]"
                  }`}
                >
                  {row.label}
                </p>
              </div>
              <div className="border-r border-t border-[oklch(0.14_0_0)] px-4 py-3.5 text-center">
                <p
                  className={`font-body text-[13px] leading-snug ${
                    row.oldTone ?? "text-[oklch(0.56_0_0)]"
                  }`}
                >
                  {row.old}
                </p>
              </div>
              <div className="border-t border-[oklch(0.14_0_0)] px-4 py-3.5 text-center">
                <p
                  className={`font-body text-[13px] leading-snug ${
                    row.nextTone ?? "text-foreground"
                  } ${row.isFinal ? "font-semibold" : ""}`}
                >
                  {row.next}
                </p>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-14 max-w-[54rem] border border-[oklch(0.18_0_0)] bg-[oklch(0.08_0_0)] px-8 py-10 md:px-10 md:py-11"
        >
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">
            <div className="max-w-[31rem]">
              <p className="font-mono-label text-orange">
                VERIFY IT YOURSELF
              </p>
              <h3 className="mt-5 max-w-xl font-display text-4xl font-bold uppercase leading-[0.94] tracking-tight text-foreground md:text-6xl">
                THIS SITE IS
                <br />
                THE PROOF.
              </h3>
              <p className="mt-6 max-w-md font-body text-[oklch(0.56_0_0)] text-lg leading-[1.65]">
                You&apos;re not looking at a demo. This website runs entirely on
                the Internet Computer. No AWS, no Cloudflare, no hosting panel.
                Click to inspect our canister on the public ICP dashboard.
              </p>
              <p className="mt-7 max-w-sm text-[oklch(0.4_0_0)] text-[12px] leading-7 tracking-[0.08em] [font-family:'Courier_New',monospace]">
                Canister ID: r5jz6-caaaa-aaaai-q727a-cai
              </p>
            </div>

            <div className="flex items-center lg:justify-end">
              <a
                href="https://dashboard.internetcomputer.org/canister/r5jz6-caaaa-aaaai-q727a-cai"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[58px] w-full items-center justify-center bg-orange px-5 py-3 text-center font-display text-sm font-bold uppercase tracking-[0.14em] text-black transition-colors hover:bg-[oklch(0.6_0.22_37)] lg:max-w-[260px]"
              >
                VIEW ON-CHAIN
                <span className="ml-2 text-xl leading-none">→</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
