import { Star } from "lucide-react";

import { CardContent, LiquidCard } from "@/components/ui/liquid-glass-card";
import { Marquee } from "@/components/ui/marquee";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "CXO",
    company: "Doodle",
    content:
      "The whole thing feels cleaner, faster, and easier to manage. We are not babysitting a website anymore.",
    detail:
      "Everything just works, and that has made a bigger difference to the business than we expected.",
    avatar: "/testimonials/client-2.avif",
    rating: 5,
  },
  {
    name: "Peter Davis",
    role: "Founder",
    company: "Atomic",
    content:
      "What sold us was the lack of maintenance. No hosting mess, no plugin stack, no ongoing cleanup.",
    detail:
      "It gave us something solid to run the business on instead of another thing to keep fixing.",
    avatar: "/testimonials/client-3.avif",
    rating: 5,
  },
  {
    name: "Nina Cole",
    role: "Director",
    company: "Northline Studio",
    content:
      "Security and reliability used to sit in the back of our minds all the time. Now they do not.",
    detail:
      "Apex built something that feels premium, dependable, and much lighter to live with day to day.",
    avatar: "/testimonials/client-4.avif",
    rating: 5,
  },
  {
    name: "John Fisher",
    role: "CEO",
    company: "T&B Real Estate",
    content:
      "Apex rebuilt our site properly. We stopped worrying about downtime, plugins, and random fixes almost immediately.",
    detail:
      "It feels like the first website we have owned that does its job without constantly needing attention.",
    avatar: "/testimonials/client-1.avif",
    rating: 5,
  },
];

export function MarqueeCardTestimonials() {
  return (
    <div className="mx-auto max-w-[90rem] px-6">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[oklch(0.05_0_0)] via-[oklch(0.05_0_0/0.98)] to-transparent md:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[oklch(0.05_0_0)] via-[oklch(0.05_0_0/0.98)] to-transparent md:w-28" />

        <Marquee
          pauseOnHover
          repeat={4}
          speed="slow"
          className="py-1"
        >
          {testimonials.map((testimonial) => (
            <LiquidCard
              key={testimonial.name}
              className="mx-1 h-[15.75rem] w-[20.5rem] rounded-[1.4rem] border-[oklch(0.095_0_0)] bg-[oklch(0.05_0_0)] py-0"
            >
              <CardContent className="flex h-full flex-col justify-between p-5">
                <div>
                  <div className="mb-4 flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, index) => (
                      <Star
                        key={index}
                        className="h-3.5 w-3.5 fill-[#fff200] text-[#fff200]"
                      />
                    ))}
                  </div>

                  <p className="max-w-[15ch] font-body text-[1.18rem] leading-[1.12] tracking-[-0.028em] text-foreground/88">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  <p className="mt-3 text-[0.82rem] leading-5 text-[oklch(0.5_0_0)]">
                    {testimonial.detail}
                  </p>
                </div>

                <div className="mt-5 flex items-center gap-3 border-t border-[oklch(0.1_0_0)] pt-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-display text-[0.96rem] font-medium tracking-[-0.03em] text-foreground">
                      {testimonial.name}
                    </h4>
                    <p className="text-[0.78rem] text-primary/60">
                      {testimonial.role} - {testimonial.company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </LiquidCard>
          ))}
        </Marquee>
      </div>
    </div>
  );
}
