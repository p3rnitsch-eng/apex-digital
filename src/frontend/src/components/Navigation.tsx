import BrandMark from "@/components/BrandMark";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutGrid } from "lucide-react";
import { useEffect, useState } from "react";

const links = [
  { label: "What We Do", href: "#what-we-do" },
  { label: "Built Different", href: "#why-us" },
  { label: "Real Difference", href: "#real-cost" },
  { label: "Pricing", href: "#pricing" },
  { label: "Infrastructure", href: "#technology" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNav = (href: string) => {
    const id = href.slice(1);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-[oklch(0.14_0_0)] bg-[oklch(0.05_0_0/0.9)] backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center"
          data-ocid="nav.link"
        >
          <BrandMark className="h-14 w-auto shrink-0" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center text-foreground transition-colors hover:text-orange"
              data-ocid="nav.toggle"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-56 rounded-none border-[oklch(0.14_0_0)] bg-[oklch(0.055_0_0/0.98)] p-2"
          >
            {links.map((link) => (
              <DropdownMenuItem
                key={link.href}
                onClick={() => handleNav(link.href)}
                className="rounded-none px-3 py-2.5 font-body text-sm text-[oklch(0.72_0_0)] hover:text-foreground focus:text-foreground"
                data-ocid="nav.link"
              >
                {link.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  );
}
