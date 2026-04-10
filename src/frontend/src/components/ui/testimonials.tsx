import { MarqueeCardTestimonials } from "@/components/ui/marquee-card";

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-[oklch(0.05_0_0)] py-20 md:py-24"
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0.055_0_0),oklch(0.045_0_0))]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-10 max-w-3xl md:mb-12">
          <p className="mb-4 font-mono-label text-orange">CLIENT FEEDBACK</p>
          <h2 className="max-w-5xl font-display text-4xl font-bold uppercase leading-[0.94] tracking-tight text-foreground md:text-6xl lg:text-7xl">
            WHAT YOU STOP WORRYING ABOUT
          </h2>
          <p className="mt-5 max-w-2xl font-body text-base leading-7 text-muted-foreground">
            No downtime. No maintenance. No surprises.
          </p>
        </div>
      </div>

      <div className="relative mt-4">
        <MarqueeCardTestimonials />
      </div>
    </section>
  );
}
