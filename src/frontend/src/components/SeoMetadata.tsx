import { useEffect } from "react";

const SITE_NAME = "Apex Architects";
const SITE_URL = "https://r5jz6-caaaa-aaaai-q727a-cai.icp0.io";

type SeoConfig = {
  title: string;
  description: string;
  path: string;
  robots?: string;
  schema?: Record<string, unknown> | null;
};

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value);
  }
}

function upsertLink(rel: string, href: string) {
  let element = document.head.querySelector(
    `link[rel="${rel}"]`,
  ) as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement("link");
    element.rel = rel;
    document.head.appendChild(element);
  }

  element.href = href;
}

function upsertJsonLd(schema: Record<string, unknown> | null) {
  const id = "apex-seo-schema";
  const existing = document.getElementById(id);

  if (!schema) {
    existing?.remove();
    return;
  }

  const script =
    existing instanceof HTMLScriptElement
      ? existing
      : document.createElement("script");

  script.id = id;
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(schema);

  if (!existing) {
    document.head.appendChild(script);
  }
}

function getSeoConfig(pathname: string): SeoConfig {
  if (pathname === "/admin") {
    return {
      title: "Apex Architects Admin",
      description: "Private contacts inbox for Apex Architects.",
      path: "/admin",
      robots: "noindex,nofollow",
      schema: null,
    };
  }

  return {
    title: "Apex Architects | Internet Computer Websites",
    description:
      "Apex Architects builds high-trust business websites on the Internet Computer. No AWS. No hosting account. No single point of failure.",
    path: "/",
    robots: "index,follow",
    schema: {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: SITE_NAME,
      url: SITE_URL,
      description:
        "Apex Architects builds business websites on the Internet Computer.",
      areaServed: "Global",
      serviceType: [
        "Website Design",
        "Website Development",
        "On-Chain Deployment",
      ],
    },
  };
}

export default function SeoMetadata() {
  useEffect(() => {
    const config = getSeoConfig(window.location.pathname);
    const canonical = `${SITE_URL}${config.path === "/" ? "/" : config.path}`;

    document.title = config.title;

    upsertMeta('meta[name="description"]', {
      name: "description",
      content: config.description,
    });
    upsertMeta('meta[name="robots"]', {
      name: "robots",
      content: config.robots ?? "index,follow",
    });
    upsertMeta('meta[property="og:type"]', {
      property: "og:type",
      content: "website",
    });
    upsertMeta('meta[property="og:site_name"]', {
      property: "og:site_name",
      content: SITE_NAME,
    });
    upsertMeta('meta[property="og:title"]', {
      property: "og:title",
      content: config.title,
    });
    upsertMeta('meta[property="og:description"]', {
      property: "og:description",
      content: config.description,
    });
    upsertMeta('meta[property="og:url"]', {
      property: "og:url",
      content: canonical,
    });
    upsertMeta('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: "summary_large_image",
    });
    upsertMeta('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: config.title,
    });
    upsertMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: config.description,
    });
    upsertLink("canonical", canonical);
    upsertJsonLd(config.schema ?? null);
  }, []);

  return null;
}
