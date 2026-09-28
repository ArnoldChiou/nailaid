export const SITE = {
  name: "甲援",
  nameEn: "NailAid",
  url: "https://nailaid.nordchiou.com",
  ogImage: "/og.jpg",
  // Bump when the health-education / pricing content changes (shown on /why/, used in JSON-LD + sitemap).
  updated: "2026-09-29",
  tagline: "手術前指甲卸除・到府到院・急件可接",
  description:
    "醫院多半會請病人在手術、麻醉前卸除指甲油、光療與水晶指甲。甲援提供台北、新北、桃園到府與到院病房卸甲服務，全天候接急件（另有公告暫停時除外）。",
  // One wording for availability everywhere (FAQ, JSON-LD, llms.txt).
  hours: "全天候接單，含夜間與假日；另有網站公告暫停時除外。",
  // Buttons that depend on these are hidden while they are empty.
  phone: "0926-192-178",
  lineId: "@059twduh",
  lineUrl: "https://line.me/R/ti/p/@059twduh",
  basePrice: 1500,
  rushFee: 500,
  sourceUrl: "https://www.taic.mohw.gov.tw/?aid=504&page_name=detail&iid=5456",
  sourceName: "衛生福利部臺中醫院 麻醉科衛教",
} as const;

export const CITIES = [
  { id: "taipei", name: "台北市", travel: "免車馬費" },
  { id: "new_taipei", name: "新北市", travel: "依距離酌收車馬費" },
  { id: "taoyuan", name: "桃園市", travel: "依距離酌收車馬費" },
] as const;
export type CityId = (typeof CITIES)[number]["id"];

export const SERVICE_MODES = [
  { id: "home", name: "到府服務", desc: "到您家中或指定地點" },
  { id: "hospital", name: "到院病房", desc: "住院中也可以，到病房床邊服務" },
] as const;
export type ServiceMode = (typeof SERVICE_MODES)[number]["id"];

export const BODY_PARTS = [
  { id: "hands", name: "手" },
  { id: "feet", name: "腳" },
  { id: "both", name: "手＋腳" },
] as const;
export type BodyPart = (typeof BODY_PARTS)[number]["id"];

export const NAIL_TYPES = [
  { id: "polish", name: "一般指甲油" },
  { id: "gel", name: "光療凝膠" },
  { id: "acrylic", name: "水晶／延甲" },
  { id: "tips", name: "甲片／貼片" },
  { id: "deco", name: "鑽飾／亮片" },
  { id: "unsure", name: "不確定" },
] as const;

export const NAV = [
  { href: "/why/", label: "為什麼要卸甲" },
  { href: "/services/", label: "服務與價格" },
  { href: "/area/", label: "服務範圍" },
  { href: "/faq/", label: "常見問題" },
  { href: "/contact/", label: "聯絡我們" },
] as const;

export function labelOf<T extends { id: string; name: string }>(list: readonly T[], id: string) {
  return list.find((x) => x.id === id)?.name ?? id;
}
