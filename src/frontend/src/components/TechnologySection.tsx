import { motion } from "motion/react";

const points = [
  "No hosting bill. Ever.",
  "Runs globally",
  "Loads fast",
  "Nothing to patch",
];

export default function TechnologySection() {
  return (
    <section id="technology" className="py-20 md:py-22 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-mono-label text-orange mb-4"
        >
          THE STACK
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-5xl font-display text-4xl font-bold uppercase leading-[0.94] tracking-tight text-foreground mb-6 md:text-6xl lg:text-7xl"
        >
          BUILT ON BETTER
          <br />
          INFRASTRUCTURE
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-muted-foreground max-w-xl mb-12 font-body"
        >
          No AWS. No hosting accounts. No single point of failure.
        </motion.p>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          data-ocid="technology.list"
        >
          {points.map((point, i) => (
            <motion.div
              key={point}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="p-8 border border-[oklch(0.22_0_0)] bg-[oklch(0.11_0_0)] relative"
              data-ocid={`technology.item.${i + 1}`}
            >
              <div className="w-8 h-1 bg-orange mb-6" />
              <p className="font-body text-foreground leading-relaxed">
                {point}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 max-w-xl font-body text-sm leading-7 text-[oklch(0.56_0_0)]"
        >
          The infrastructure is complex. Your experience won&apos;t be.
        </motion.p>
      </div>
    </section>
  );
}
