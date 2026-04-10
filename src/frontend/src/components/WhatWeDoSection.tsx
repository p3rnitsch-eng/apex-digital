import { Boxes, Globe, LayoutTemplate, Smartphone } from "lucide-react";
import { motion } from "motion/react";

const services = [
  {
    icon: LayoutTemplate,
    title: "Websites",
    description: "Clean, fast, and built to convert.",
  },
  {
    icon: Smartphone,
    title: "Apps",
    description: "Client portals and custom flows when needed.",
  },
  {
    icon: Boxes,
    title: "Systems",
    description: "Tools that support how your business runs.",
  },
  {
    icon: Globe,
    title: "Built on-chain",
    description: "No hosting. No plugin stack. No failure points.",
  },
];

const buildStats = [
  { value: "$0", label: "MONTHLY HOSTING" },
  { value: "<2s", label: "GLOBAL FINALITY" },
  { value: "100%", label: "ON-CHAIN" },
  { value: "LIVE", label: "STATUS" },
];

export default function WhatWeDoSection() {
  return (
    <section id="what-we-do" className="pt-20 pb-3 md:pt-22 md:pb-4 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-mono-label text-orange mb-4"
        >
          OUR SERVICES
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-5xl font-display text-4xl font-bold uppercase leading-[0.94] tracking-tight text-foreground mb-16 md:text-6xl lg:text-7xl"
        >
          WHAT YOU ACTUALLY NEED
        </motion.h2>

        <div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
          data-ocid="services.list"
        >
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="card-hover group p-8 border border-[oklch(0.22_0_0)] bg-[oklch(0.11_0_0)] relative overflow-hidden cursor-pointer"
                data-ocid={`services.item.${i + 1}`}
              >
                <div className="absolute top-0 right-0 w-12 h-12 bg-orange opacity-0 group-hover:opacity-10 transition-opacity duration-300" />

                <div>
                  <div className="w-12 h-12 flex items-center justify-center border border-orange/30 mb-6 group-hover:border-orange transition-colors duration-300">
                    <Icon className="w-6 h-6 text-orange" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-foreground mb-3">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed font-body">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="mt-6 border border-[oklch(0.22_0_0)] bg-[oklch(0.11_0_0)] px-6 py-5 md:px-8"
        >
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="max-w-xl">
              <p className="font-body text-sm leading-7 text-[oklch(0.56_0_0)]">
                Built on the Internet Computer instead of the usual fragile stack.
              </p>
              <p className="font-body text-sm leading-7 text-[oklch(0.56_0_0)]">
                Fewer dependencies. Lower upkeep. Stronger foundation.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-12 gap-y-4 sm:grid-cols-4 lg:ml-14 xl:ml-20">
              {buildStats.map((stat) => (
                <div
                  key={stat.label}
                  className="min-w-[88px] text-center"
                >
                  <div className="font-display text-2xl font-bold uppercase leading-none tracking-tight text-orange">
                    {stat.value}
                  </div>
                  <div className="mt-2 font-mono-label text-[oklch(0.46_0_0)]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
