import { Toaster } from "@/components/ui/sonner";
import AdminPanel from "./components/AdminPanel";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import Navigation from "./components/Navigation";
import PricingSection from "./components/PricingSection";
import ProofSection from "./components/ProofSection";
import SeoMetadata from "./components/SeoMetadata";
import TestimonialsSection from "./components/TestimonialsSection";
import TechnologySection from "./components/TechnologySection";
import WhatWeDoSection from "./components/WhatWeDoSection";
import WhyChangesEverythingSection from "./components/WhyChangesEverythingSection";
import WhyWebsitesBreakSection from "./components/WhyWebsitesBreakSection";
import WhyUsSection from "./components/WhyUsSection";

const isAdminRoute = window.location.pathname === "/admin";

export default function App() {
  if (isAdminRoute) {
    return (
      <>
        <SeoMetadata />
        <AdminPanel />
      </>
    );
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <SeoMetadata />
      <Navigation />
      <main>
        <HeroSection />
        <WhyWebsitesBreakSection />
        <WhyUsSection />
        <WhatWeDoSection />
        <ProofSection />
        <WhyChangesEverythingSection />
        <PricingSection />
        <TechnologySection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
      <Toaster
        theme="dark"
        toastOptions={{
          style: {
            background: "oklch(0.15 0 0)",
            border: "1px solid oklch(0.22 0 0)",
            color: "oklch(0.94 0 0)",
          },
        }}
      />
    </div>
  );
}
