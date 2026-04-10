import { Lock, Server, Wrench } from "lucide-react";
import { motion } from "motion/react";

const reasons = [
  {
    icon: Server,
    title: "Fewer moving parts",
    lines: ["No plugins. No patchwork. No fragile setup."],
    emphasis: "",
  },
  {
    icon: Lock,
    title: "Built to stay up",
    lines: ["Runs on infrastructure designed not to fail."],
    emphasis: "",
  },
  {
    icon: Wrench,
    title: "Less to manage",
    lines: ["No maintenance routine. No cleanup. No stress."],
    emphasis: "",
  },
];

function emphasizeLine(line: string, emphasis: string) {
  if (!emphasis) {
    return line;
  }

  const index = line.toLowerCase().indexOf(emphasis.toLowerCase());

  if (index === -1) {
    return line;
  }

  const before = line.slice(0, index);
  const match = line.slice(index, index + emphasis.length);
  const after = line.slice(index + emphasis.length);

  return (
    <>
      {before}
      <strong className="font-semibold text-foreground">{match}</strong>
      {after}
    </>
  );
}

export default function WhyUsSection() {
  return (
    <section id="why-us" className="py-20 md:py-22 relative">
      <div className="absolute inset-0 dot-grid-bg opacity-40" />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-mono-label text-orange mb-4"
        >
          WHY CHOOSE US
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-5xl font-display text-4xl font-bold uppercase leading-[0.94] tracking-tight text-foreground md:text-6xl lg:text-7xl mb-12"
        >
          BUILT DIFFERENT FROM
          <br />
          THE START.
        </motion.h2>

        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          data-ocid="reasons.list"
        >
          {reasons.map((reason, i) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="p-8 border border-[oklch(0.22_0_0)] bg-[oklch(0.10_0_0)]"
                data-ocid={`reasons.item.${i + 1}`}
              >
                <div className="w-10 h-10 flex items-center justify-center border border-orange/40 mb-5">
                  <Icon className="w-5 h-5 text-orange" />
                </div>
                <h3 className="font-display font-bold text-lg text-foreground mb-3">
                  {reason.title}
                </h3>
                <div className="space-y-1 text-muted-foreground text-sm leading-relaxed font-body">
                  {reason.lines.map((line) => (
                    <p key={line}>{emphasizeLine(line, reason.emphasis)}</p>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-8 max-w-xl font-body text-sm leading-7 text-[oklch(0.56_0_0)]"
        >
          You&apos;re not maintaining a website. You&apos;re running your
          business.
        </motion.p>
      </div>
    </section>
  );
}
