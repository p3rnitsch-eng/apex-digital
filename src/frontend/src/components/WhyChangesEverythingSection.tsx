import { motion } from "motion/react";

const comparisonRows = [
  {
    label: "Cost model",
    cheap: "Starts cheap, grows over time",
    apex: "Fixed upfront",
  },
  {
    label: "Hosting",
    cheap: "Monthly fees",
    apex: "None",
  },
  {
    label: "Maintenance",
    cheap: "Plugins, updates, fixes",
    apex: "None",
  },
  {
    label: "Reliability",
    cheap: "Can break or go down",
    apex: "Built to stay up",
  },
  {
    label: "Security",
    cheap: "Your responsibility",
    apex: "Secure by design",
  },
  {
    label: "Long-term cost",
    cheap: "Keeps increasing",
    apex: "What you pay is what it costs",
  },
];

export default function WhyChangesEverythingSection() {
  return (
    <section id="real-cost" className="relative bg-[oklch(0.05_0_0)] py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.p
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-mono-label text-orange"
        >
          THE REAL DIFFERENCE
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="mt-5 max-w-5xl font-display text-4xl font-bold uppercase leading-[0.94] tracking-tight text-foreground md:text-6xl lg:text-7xl"
        >
          THE $40 WEBSITE COSTS MORE THAN YOU THINK.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="mt-6 max-w-2xl font-body text-base leading-7 text-[oklch(0.58_0_0)]"
        >
          Most websites look similar. What matters is what happens after
          launch.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.22 }}
          className="mt-12 overflow-hidden border border-[oklch(0.1_0_0)] bg-[oklch(0.055_0_0)]"
        >
          <div className="grid grid-cols-[200px_1fr_1fr] border-b border-[rgba(255,255,255,0.06)] px-6 py-5 md:px-8">
            <div />
            <div className="flex min-h-[5.25rem] flex-col justify-start pr-6">
              <p className="font-display text-2xl font-semibold tracking-tight text-[oklch(0.74_0_0)] md:text-3xl">
                $40 Website
              </p>
              <p className="mt-2 font-body text-sm text-[oklch(0.46_0_0)]">
                Wix / WordPress / Squarespace
              </p>
            </div>
            <div className="flex min-h-[5.25rem] flex-col justify-start bg-[rgba(255,120,0,0.02)] pl-6">
              <p className="font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                Apex
              </p>
              <p className="mt-2 font-body text-sm text-[oklch(0.72_0.02_80)]">
                Built on the Internet Computer
              </p>
            </div>
          </div>

          <div className="px-6 md:px-8">
            {comparisonRows.map((row, index) => (
              <div
                key={row.label}
                className={`grid grid-cols-[200px_1fr_1fr] items-start py-[14px] ${
                  index !== comparisonRows.length - 1
                    ? "border-b border-[rgba(255,255,255,0.06)]"
                    : ""
                }`}
              >
                <div className="pr-5">
                  <p className="font-body text-sm text-[rgba(255,255,255,0.6)] md:text-[0.95rem]">
                    {row.label}
                  </p>
                </div>
                <div className="pr-6">
                  <p className="font-body text-sm leading-6 text-[oklch(0.56_0_0)] md:text-[0.98rem]">
                    {row.cheap}
                  </p>
                </div>
                <div className="bg-[rgba(255,120,0,0.02)] pl-6">
                  <p
                    className={`font-body text-sm leading-6 text-foreground md:text-[0.98rem] ${
                      row.label === "Long-term cost" ? "font-semibold" : "font-medium"
                    }`}
                  >
                    {row.apex}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.28 }}
          className="mt-7"
        >
          <p className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            One keeps costing you.
          </p>
          <p className="mt-2 font-display text-2xl font-semibold tracking-tight text-orange md:text-3xl">
            One is done properly from day one.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
