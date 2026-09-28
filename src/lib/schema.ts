// schema.org JSON-LD builders. Search engines and AI answer engines read these to
// understand who we are, where we serve, prices, hours and Q&A — keep them factual
// and in sync with the visible page content.
import { CITIES, SITE } from "./site";
import type { FAQ } from "./faq";

const abs = (path: string) => `${SITE.url}${path}`;
const BUSINESS_ID = `${SITE.url}/#business`;
const WEBSITE_ID = `${SITE.url}/#website`;

const areaServed = CITIES.map((c) => ({
  "@type": "City",
  name: c.name,
  containedInPlace: { "@type": "Country", name: "台灣" },
}));

export function businessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "NailSalon",
    "@id": BUSINESS_ID,
    name: `${SITE.name} ${SITE.nameEn}`,
    alternateName: [SITE.name, SITE.nameEn],
    description: SITE.description,
    url: `${SITE.url}/`,
    logo: abs("/icon-512.png"),
    image: abs(SITE.ogImage),
    telephone: "+886-926-192-178",
    priceRange: `NT$${SITE.basePrice}起`,
    currenciesAccepted: "TWD",
    paymentAccepted: "現金, 銀行匯款",
    areaServed,
    // Mobile service with no storefront: open around the clock unless a notice says otherwise.
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
    sameAs: [SITE.lineUrl],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: "+886-926-192-178",
      areaServed: "TW",
      availableLanguage: ["zh-Hant"],
    },
    knowsAbout: ["手術前卸甲", "術前卸除指甲油", "光療指甲卸除", "水晶指甲卸除", "住院卸指甲"],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: `${SITE.name} ${SITE.nameEn}`,
    alternateName: [SITE.name, SITE.nameEn],
    url: `${SITE.url}/`,
    inLanguage: "zh-Hant-TW",
    publisher: { "@id": BUSINESS_ID },
  };
}

export function serviceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "手術前指甲卸除（到府／到院病房）",
    serviceType: "手術前指甲油、光療、水晶指甲卸除",
    description:
      "手術、麻醉前卸除手腳指甲油、光療凝膠、水晶指甲、甲片與鑽飾。到府或到院病房服務，全天候接急件。",
    provider: { "@id": BUSINESS_ID },
    areaServed,
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: abs("/book/"),
      servicePhone: "+886-926-192-178",
    },
    offers: [
      {
        "@type": "Offer",
        name: "卸甲服務（台北市）",
        price: SITE.basePrice,
        priceCurrency: "TWD",
        priceSpecification: {
          "@type": "PriceSpecification",
          minPrice: SITE.basePrice,
          priceCurrency: "TWD",
        },
        description: "起價，依部位、指甲種類與指數報價；新北、桃園另計車馬費。",
      },
      {
        "@type": "Offer",
        name: "急件加價",
        price: SITE.rushFee,
        priceCurrency: "TWD",
        description: "服務時間距手術或距預約當下 24 小時內。",
      },
    ],
  };
}

export function faqSchema(items: typeof FAQ) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function articleSchema({ path, title, description }: { path: string; title: string; description: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    inLanguage: "zh-Hant-TW",
    mainEntityOfPage: abs(path),
    image: abs(SITE.ogImage),
    datePublished: "2026-09-28",
    dateModified: SITE.updated,
    author: { "@id": BUSINESS_ID },
    publisher: { "@id": BUSINESS_ID },
    citation: { "@type": "CreativeWork", name: SITE.sourceName, url: SITE.sourceUrl },
    about: ["脈搏血氧儀", "術前準備", "指甲油卸除"],
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  const items = [{ name: "首頁", path: "/" }, ...trail];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  };
}
