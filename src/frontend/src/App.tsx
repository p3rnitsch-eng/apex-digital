import { Toaster } from "@/components/ui/sonner";
import AdminPanel from "./components/AdminPanel";
import ContactSection from "./components/ContactSection";
import DifferentiatorSection from "./components/DifferentiatorSection";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import Navigation from "./components/Navigation";
import PricingSection from "./components/PricingSection";
import QuotePage from "./components/QuotePage";
import TechnologySection from "./components/TechnologySection";
import WhatWeDoSection from "./components/WhatWeDoSection";
import WhyChangesEverythingSection from "./components/WhyChangesEverythingSection";
import WhyUsSection from "./components/WhyUsSection";

const isAdminRoute = window.location.pathname === "/admin";
const isQuoteRoute = window.location.pathname.startsWith("/pay/");

export default function App() {
  if (isAdminRoute) {
    return <AdminPanel />;
  }

  if (isQuoteRoute) {
    return <QuotePage />;
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <div className="noise-bg" />
      <Navigation />
      <main>
        <HeroSection />
        <DifferentiatorSection />
        <WhatWeDoSection />
        <WhyUsSection />
        <WhyChangesEverythingSection />
        <PricingSection />
        <TechnologySection />
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
