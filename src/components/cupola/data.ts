import deck from "@/data/deck.json";

export { deck };

export type ModuleId = "suite" | "leadflow" | "bomify";
export type ViewId =
  | "suite-dashboard"
  | "operations"
  | "lf-dashboard"
  | "lf-pipeline"
  | "bm-queue"
  | "bm-review"
  | "settings";
export type TabState = "active" | "background" | "done" | "error";

export interface Tab {
  id: string;
  module: ModuleId;
  view: ViewId;
  title: string;
  state: TabState;
  progress?: number | undefined;
  recordId?: string | undefined;
}

export const MODULES: Record<ModuleId, { name: string; short: string; tagline: string }> = {
  suite: { name: "Cupola", short: "CU", tagline: "Suite" },
  leadflow: { name: "LeadFlow", short: "LF", tagline: "Prospeção comercial" },
  bomify: { name: "BOMify", short: "BM", tagline: "Pedidos e listas de materiais" },
};

const companies = [
  "Ferrosteel Ibérica", "Mecânica do Tejo", "Metalúrgica Oeste", "Serviço Metal Norte", "Fundição Ribeira",
  "Aços do Vouga", "Perfis Lis", "Indústrias Carvalho", "TornoTec", "Caldeiraria Sado", "Lusoforja",
  "Estruturas Mondego", "Corte Laser Douro", "Metalo Algarve", "Soldaduras Minho", "Prensas Atlântico",
];
const people = ["Ana Ribeiro", "Rui Costa", "Marta Sousa", "João Pires", "Inês Lopes", "Pedro Matos", "Sofia Neves", "Tiago Faria"];
const stages = ["Nova", "Qualificada", "Contactada", "Proposta", "Em risco"] as const;

export interface Lead {
  id: string; company: string; contact: string | null; score: number; stage: (typeof stages)[number];
  source: "Agente" | "Manual"; sector: string; city: string; updated: string;
}

const cities = ["Leiria", "Aveiro", "Porto", "Braga", "Setúbal", "Coimbra", "Guimarães", "Marinha Grande"];
export const LEADS: Lead[] = companies.map((c, i) => ({
  id: `LD-${1047 - i}`,
  company: `${c} ${i % 3 === 0 ? "S.A." : "Lda."}`,
  contact: i % 5 === 3 ? null : people[i % people.length]!,
  score: [92, 88, 81, 77, 74, 69, 66, 63, 58, 55, 51, 47, 42, 38, 33, 29][i]!,
  stage: stages[i % 5 === 4 ? 4 : i % 4]!,
  source: i % 10 < 7 ? "Agente" : "Manual",
  sector: "Metalomecânica",
  city: cities[i % cities.length]!,
  updated: `${(i % 6) + 1} set`,
}));

export interface Order {
  id: string; client: string; lines: number; status: "Done" | "Draft" | "Cancelled"; when: string; alert?: string;
}
const d = deck.bomify;
export const ORDERS: Order[] = [
  ...d.ultimas_boms_com_erro.map((o) => ({ id: o.order_number, client: o.cliente, lines: 0, status: "Draft" as const, when: o.timestamp, alert: o.descricao })),
  ...d.ultimas_boms_confirmadas.map((o) => ({ id: o.order_number, client: o.cliente, lines: o.linhas, status: "Done" as const, when: o.timestamp })),
  { id: "ORD2026/0406", client: "Lusoforja Lda.", lines: 12, status: "Draft", when: "2026-09-03T12:00:00Z" },
  { id: "ORD2026/0405", client: "Perfis Lis S.A.", lines: 0, status: "Cancelled", when: "2026-09-02T09:00:00Z" },
].sort((a, b) => b.when.localeCompare(a.when));

export const BOM_LINES = [
  { ref: "P-1040", desc: "Chapa aço S235 3mm", qty: 12, unit: "un", conf: 0.98 },
  { ref: "P-2210", desc: "Perfil UPN 100", qty: 6, unit: "m", conf: 0.95 },
  { ref: "P-3310", desc: "Parafuso M10x40 8.8", qty: 120, unit: "un", conf: 0.99 },
  { ref: "P-7821-X", desc: "Flange Ø 4.0 (?)", qty: 4, unit: "un", conf: 0.41 },
  { ref: "P-5502", desc: "Tubo quadrado 40x40x2", qty: 18, unit: "m", conf: 0.87 },
  { ref: "P-6001", desc: "Cantoneira L 50x5", qty: 9, unit: "m", conf: 0.62 },
];

export function fmtTime(iso: string) {
  const dt = new Date(iso);
  return dt.toLocaleString("pt-PT", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Lisbon" });
}
export const nf = (n: number) => n.toLocaleString("pt-PT");
