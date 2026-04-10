import { Link2Off, PlugZap, ShieldAlert, TriangleAlert } from "lucide-react";
import { motion } from "motion/react";

const breakpoints = [
  {
    icon: PlugZap,
    title: "Plugins fail",
    description: "Updates break things. Nobody knows why.",
  },
  {
    icon: TriangleAlert,
    title: "Hosting goes down",
    description: "Traffic spikes. Servers fail. Your site disappears.",
  },
  {
    icon: ShieldAlert,
    title: "Security is on you",
    description: "Miss one update and you risk everything.",
  },
  {
    icon: Link2Off,
    title: "Everything is stitched together",
    description: "Too many tools. One weak link breaks it.",
  },
];

export default function WhyWebsitesBreakSection() {
  return (
    <section className="relative py-20 md:py-22">
      <div className="absolute inset-0 dot-grid-bg opacity-35" />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mb-4 font-mono-label text-orange"
        >
          WHY WEBSITES BREAK
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="max-w-5xl font-display text-4xl font-bold uppercase leading-[0.94] tracking-tight text-foreground md:text-6xl lg:text-7xl"
        >
          MOST WEBSITES DEPEND
          <br />
          ON TOO MANY THINGS.
        </motion.h2>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {breakpoints.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: index * 0.1 }}
                className="border border-[oklch(0.2_0.01_25)] bg-[oklch(0.095_0.005_25)] p-7"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center border border-[oklch(0.55_0.15_35/0.35)]">
                  <Icon className="h-5 w-5 text-[oklch(0.64_0.18_30)]" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-3 font-body text-sm leading-7 text-[oklch(0.62_0_0)]">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-8 max-w-xl font-body text-sm leading-7 text-[oklch(0.56_0_0)]"
        >
          Most websites are fragile by design.
        </motion.p>
      </div>
    </section>
  );
}
