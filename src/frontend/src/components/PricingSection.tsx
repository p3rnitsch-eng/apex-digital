import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Brush,
  FileText,
  Globe,
  LayoutTemplate,
  Search,
  Shield,
  Users,
  Workflow,
  Wrench,
} from "lucide-react";
import { motion } from "motion/react";

const plans = [
  {
    name: "STARTER",
    price: "$750",
    description: "For simple sites that just need to work.",
    features: [
      { label: "1-page website", icon: LayoutTemplate },
      { label: "Mobile responsive", icon: Globe },
      { label: "Contact form", icon: FileText },
      { label: "Basic SEO", icon: Search },
      { label: ".xyz domain first year included", icon: Globe },
    ],
    cta: "START PROJECT",
    highlight: false,
  },
  {
    name: "GROWTH",
    price: "$1,500",
    description: "Everything most businesses need.",
    features: [
      { label: "No hosting fees ever", icon: Shield },
      { label: "Up to 4 pages", icon: LayoutTemplate },
      { label: "Custom design", icon: Brush },
      { label: "Lead capture", icon: Users },
      { label: "SEO-ready pages", icon: Search },
      { label: ".xyz domain first year included", icon: Globe },
    ],
    cta: "START PROJECT",
    highlight: true,
    badge: "MOST POPULAR",
  },
  {
    name: "PRO",
    price: "$4,500+",
    description: "For apps, dashboards, and real systems.",
    features: [
      { label: "User accounts", icon: Users },
      { label: "Private admin tools", icon: Shield },
      { label: "Custom backend logic", icon: Wrench },
      { label: "Custom workflows", icon: Workflow },
      { label: "Fully on-chain", icon: Globe },
    ],
    cta: "BOOK CONSULTATION",
    highlight: false,
  },
];

export default function PricingSection() {
  const scrollToContact = (planName: string) => {
    window.dispatchEvent(
      new CustomEvent("apex:selected-plan", {
        detail: { plan: planName },
      }),
    );

    document
      .getElementById("contact")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="pricing" className="relative py-20 md:py-22">
      <div className="mx-auto max-w-7xl px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-4 font-mono-label text-orange"
        >
          INVESTMENT
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 max-w-5xl font-display text-4xl font-bold uppercase leading-[0.94] tracking-tight text-foreground md:text-6xl lg:text-7xl"
        >
          SIMPLE PRICING.
          <br />
          NO SURPRISES.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12 max-w-2xl font-body text-muted-foreground"
        >
          Clear upfront pricing for most businesses. No hosting fees. No
          maintenance stack.
        </motion.p>

        <div
          className="grid grid-cols-1 gap-6 lg:grid-cols-3"
          data-ocid="pricing.list"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.12 }}
              className={`relative flex min-h-full flex-col border p-8 ${
                plan.highlight
                  ? "border-orange bg-[oklch(0.11_0_0)] shadow-[0_0_0_1px_rgba(255,92,0,0.14)]"
                  : "border-[oklch(0.18_0_0)] bg-[oklch(0.06_0_0)]"
              }`}
              data-ocid={`pricing.item.${index + 1}`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="rounded-none border border-orange/35 bg-[oklch(0.08_0_0)] px-4 py-1 text-orange">
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <p className="mb-4 font-mono-label text-muted-foreground">
                {plan.name}
              </p>

              <div className="mb-5 flex items-end gap-1">
                <span className="font-display text-5xl font-bold text-foreground">
                  {plan.price}
                </span>
              </div>

              <p className="mb-8 max-w-[17rem] font-body text-sm leading-6 text-[oklch(0.66_0_0)]">
                {plan.description}
              </p>

              <ul className="mb-10 flex-1 space-y-3">
                {plan.features.map((feature) => {
                  const Icon = feature.icon;

                  return (
                  <li
                    key={feature.label}
                    className="flex items-start gap-3 text-sm font-body"
                  >
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[oklch(0.9_0_0)]" />
                    <span className="text-muted-foreground">{feature.label}</span>
                  </li>
                  );
                })}
              </ul>

              <Button
                onClick={() => scrollToContact(plan.name)}
                data-ocid={`pricing.primary_button.${index + 1}`}
                className={`w-full rounded-none py-6 font-display text-sm font-bold tracking-wider ${
                  plan.highlight
                    ? "border border-[oklch(0.22_0_0)] bg-transparent text-foreground hover:border-orange hover:bg-transparent hover:text-orange"
                    : "border border-[oklch(0.22_0_0)] bg-transparent text-foreground hover:border-orange hover:bg-transparent hover:text-orange"
                }`}
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="mt-8 text-center font-body text-sm text-[oklch(0.54_0_0)]"
        >
          Need advanced integrations or a larger build? Contact us for custom
          scope.
        </motion.p>
      </div>
    </section>
  );
}
