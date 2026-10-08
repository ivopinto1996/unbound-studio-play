import { useState } from "react";
import { AlertTriangle, ArrowUpRight, CheckCircle2, FileText, Sparkles, X, CircleDashed } from "lucide-react";
import { cn } from "@/lib/utils";
import { BOM_LINES, LEADS, ORDERS, deck, fmtTime, nf, type Lead, type ModuleId, type Tab, type ViewId } from "./data";

interface Props {
  tab: Tab;
  query: string;
  navigate: (v: ViewId, title?: string, recordId?: string) => void;
  open: (m: ModuleId, v: ViewId, title: string, recordId?: string) => void;
  openOps: () => void;
}

export function Workspace(p: Props) {
  switch (p.tab.view) {
    case "lf-dashboard": return <LeadDashboard {...p} />;
    case "lf-pipeline": return <Pipeline {...p} />;
    case "bm-queue": return <OrderQueue {...p} />;
    case "bm-review": return <BomReview {...p} />;
    case "settings": return <SettingsView />;
    default: return <SuiteDashboard {...p} />;
  }
}

/* ---------- shared ---------- */
const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{children}</div>
);
function Stat({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone?: "warn" | "bad" | "good" }) {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <Eyebrow>{label}</Eyebrow>
      <div className="num text-3xl font-medium tracking-tight">{value}</div>
      {sub && <div className={cn("mt-1 text-xs", tone === "good" ? "text-success" : tone === "bad" ? "text-destructive" : tone === "warn" ? "text-warning" : "text-muted-foreground")}>{sub}</div>}
    </div>
  );
}
function Bars({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <div key={d.label}>
          <div className="mb-1 flex justify-between text-xs"><span>{d.label}</span><span className="num text-muted-foreground">{nf(d.value)}</span></div>
          <div className="h-2 rounded-full bg-secondary"><div className={cn("h-full rounded-full", i === 0 ? "bg-ai" : "bg-chart-2")} style={{ width: `${(d.value / max) * 100}%` }} /></div>
        </div>
      ))}
    </div>
  );
}
const Page = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("mx-auto max-w-6xl px-8 py-8 animate-in fade-in duration-300", className)}>{children}</div>
);

/* ---------- suite dashboard ---------- */
function SuiteDashboard({ open, openOps }: Props) {
  const t = deck.transversal;
  return (
    <Page>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Segunda-feira, 7 de setembro</p>
          <h1 className="mt-1 text-4xl font-bold">Bom dia, Ivo.</h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Há <b className="text-foreground">{t.erros_ativos.length} situações</b> à espera de decisão e uma qualificação a correr no LeadFlow.
          </p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-4 gap-4">
        <Stat label="Leads novas · ago" value={nf(deck.leadflow.leads_novas.agosto_2026)} sub={`+${deck.leadflow.leads_novas.variacao_pct}% vs 2025`} tone="good" />
        <Stat label="Pedidos BOM · ago" value={nf(deck.bomify.volume_agosto_2026.total_pedidos)} sub={`${deck.bomify.performance.taxa_confirmacao_primeira_pct}% confirmados à 1ª`} />
        <Stat label="Alertas abertos" value={String(deck.bomify.alertas.total_abertos_hoje)} sub="3 da Metalúrgica Oeste" tone="bad" />
        <Stat label="Créditos usados" value={`${t.creditos.percentagem_usada}%`} sub="Quota pode esgotar em setembro" tone="warn" />
      </div>

      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3 rounded-2xl border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Atividade recente</h2>
            <span className="text-xs text-muted-foreground">Últimos 3 dias</span>
          </div>
          <ol className="relative space-y-4 border-l pl-5">
            {t.atividade_recente.slice(0, 8).map((a, i) => (
              <li key={i} className="relative">
                <span className={cn("absolute -left-[25px] top-1.5 size-2.5 rounded-full ring-4 ring-card", a.tipo === "erro" ? "bg-destructive" : a.tipo === "operacao_em_curso" ? "bg-primary animate-pulse-dot" : "bg-success")} />
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-sm">{a.evento}</span>
                  <span className="num shrink-0 text-[11px] text-muted-foreground">{fmtTime(a.timestamp)}</span>
                </div>
                <span className="text-xs text-muted-foreground">{a.modulo}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="col-span-2 space-y-4">
          <div className="rounded-2xl bg-chrome p-6 text-chrome-foreground">
            <div className="mb-3 flex items-center gap-2 text-xs font-medium text-primary"><Sparkles className="size-3.5" /> Leitura da semana</div>
            <p className="text-sm leading-relaxed text-chrome-foreground/90">
              A campanha metalomecânica trouxe um pico de leads, mas a falha do LinkedIn deixou <b>{deck.leadflow.pipeline.sem_contacto_identificado}</b> sem contacto. No BOMify, os DWG em polegadas da Metalúrgica Oeste explicam 7 dos 11 conflitos.
            </p>
            <button onClick={openOps} className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">Ver em Operations <ArrowUpRight className="size-3" /></button>
          </div>
          <div className="rounded-2xl border bg-card p-6">
            <h2 className="mb-4 text-lg font-bold">Créditos por módulo</h2>
            <Bars data={Object.entries(t.creditos.por_modulo).map(([k, v]) => ({ label: k, value: v.tokens }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <ModuleCard name="LeadFlow" sub="Prospeção" onClick={() => open("leadflow", "lf-dashboard", "LeadFlow")} />
            <ModuleCard name="BOMify" sub="Pedidos" onClick={() => open("bomify", "bm-queue", "Fila de pedidos")} />
          </div>
        </div>
      </div>
    </Page>
  );
}
const ModuleCard = ({ name, sub, onClick }: { name: string; sub: string; onClick: () => void }) => (
  <button onClick={onClick} className="group rounded-2xl border bg-card p-4 text-left transition-colors hover:border-primary/50">
    <div className="flex items-center justify-between"><span className="font-display font-bold">{name}</span><ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary" /></div>
    <span className="text-xs text-muted-foreground">{sub}</span>
  </button>
);

/* ---------- leadflow ---------- */
function LeadDashboard({ navigate }: Props) {
  const l = deck.leadflow;
  return (
    <Page>
      <h1 className="mb-6 text-3xl font-bold">LeadFlow</h1>
      <div className="mb-6 grid grid-cols-4 gap-4">
        <Stat label="Total de leads" value={nf(l.pipeline.total_leads)} />
        <Stat label="Ativas" value={nf(l.pipeline.ativas)} tone="good" sub="58% do pipeline" />
        <Stat label="Em risco" value={nf(l.pipeline.em_risco)} tone="bad" sub="Sem atividade há 30+ dias" />
        <Stat label="Geradas por agente" value={`${l.origem.pct_agente}%`} sub={`${l.origem.geradas_por_agente} de ${l.origem.geradas_por_agente + l.origem.registadas_manualmente} em agosto`} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl border bg-card p-6">
          <h2 className="mb-4 text-lg font-bold">Últimas operações</h2>
          <div className="divide-y">
            {l.ultimas_operacoes.map((o) => (
              <div key={o.id} className="flex items-center gap-3 py-2.5 text-sm">
                {o.estado === "erro" ? <AlertTriangle className="size-4 text-destructive" /> : <CheckCircle2 className="size-4 text-success" />}
                <span className="flex-1 capitalize">{o.tipo}</span>
                <span className="num text-xs text-muted-foreground">{"leads_trazidas" in o ? `+${o.leads_trazidas}` : `${o.leads_processadas} proc.`}</span>
                <span className="num w-28 text-right text-xs text-muted-foreground">{fmtTime(o.timestamp)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-6">
          <h2 className="mb-4 text-lg font-bold">Créditos · agosto</h2>
          <Bars data={Object.entries(l.creditos_agosto_2026.por_tipo).map(([k, v]) => ({ label: k.charAt(0).toUpperCase() + k.slice(1), value: v }))} />
          <button onClick={() => navigate("lf-pipeline", "Pipeline")} className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">Abrir pipeline <ArrowUpRight className="size-3.5" /></button>
        </div>
      </div>
    </Page>
  );
}

const stageTone: Record<Lead["stage"], string> = {
  Nova: "bg-info/10 text-info", Qualificada: "bg-success/10 text-success", Contactada: "bg-secondary text-secondary-foreground",
  Proposta: "bg-accent text-accent-foreground", "Em risco": "bg-destructive/10 text-destructive",
};

function Pipeline({ query, tab }: Props) {
  const [sel, setSel] = useState<Lead | null>(null);
  const rows = LEADS.filter((l) => (l.company + l.city + (l.contact ?? "")).toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="relative flex h-full">
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {tab.state === "background" && (
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-primary/30 bg-accent px-4 py-3 text-sm text-accent-foreground">
            <Sparkles className="size-4" />
            <span className="flex-1">A qualificar 28 leads da campanha metalomecânica…</span>
            <span className="num">{Math.round(tab.progress ?? 0)}%</span>
          </div>
        )}
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
              <th className="pb-3 font-semibold">Empresa</th><th className="pb-3 font-semibold">Contacto</th><th className="pb-3 font-semibold">Fase</th>
              <th className="pb-3 font-semibold">Score</th><th className="pb-3 font-semibold">Origem</th><th className="pb-3 text-right font-semibold">Atualizada</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((l) => (
              <tr key={l.id} onClick={() => setSel(l)} className={cn("cursor-pointer border-t transition-colors hover:bg-paper", sel?.id === l.id && "bg-accent/60")}>
                <td className="py-3"><div className="font-medium">{l.company}</div><div className="text-xs text-muted-foreground">{l.city}</div></td>
                <td className="py-3">{l.contact ?? <span className="inline-flex items-center gap-1 text-xs text-warning"><CircleDashed className="size-3" />Sem contacto</span>}</td>
                <td className="py-3"><span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", stageTone[l.stage])}>{l.stage}</span></td>
                <td className="py-3"><ScoreBar v={l.score} /></td>
                <td className="py-3 text-xs">{l.source === "Agente" ? <span className="inline-flex items-center gap-1 text-primary"><Sparkles className="size-3" />Agente</span> : "Manual"}</td>
                <td className="num py-3 text-right text-xs text-muted-foreground">{l.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sel && (
        <aside className="w-96 shrink-0 overflow-y-auto border-l bg-paper p-6 animate-in slide-in-from-right-8 duration-200">
          <div className="mb-4 flex items-start justify-between">
            <div><div className="num text-xs text-muted-foreground">{sel.id}</div><h2 className="text-xl font-bold">{sel.company}</h2></div>
            <button onClick={() => setSel(null)} className="rounded-md p-1 hover:bg-secondary"><X className="size-4" /></button>
          </div>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <Field k="Contacto" v={sel.contact ?? "—"} /><Field k="Cidade" v={sel.city} />
            <Field k="Setor" v={sel.sector} /><Field k="Score" v={String(sel.score)} />
          </dl>
          <div className="mt-6 rounded-xl border bg-card p-4">
            <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-primary"><Sparkles className="size-3.5" />Porquê esta lead</div>
            <p className="text-sm text-muted-foreground">Fabrica estruturas em aço para construção; contratou 3 pessoas em produção no último trimestre e procura fornecedor de corte a laser.</p>
          </div>
          <Eyebrow><span className="mt-6 block">Histórico</span></Eyebrow>
          <ol className="space-y-2 border-l pl-4 text-sm">
            <li>Criada pelo agente · campanha metalomecânica</li>
            <li>Enriquecida · LinkedIn</li>
            <li>Score recalculado · {sel.score}</li>
          </ol>
        </aside>
      )}
    </div>
  );
}
const ScoreBar = ({ v }: { v: number }) => (
  <div className="flex items-center gap-2"><div className="h-1.5 w-16 rounded-full bg-secondary"><div className={cn("h-full rounded-full", v > 70 ? "bg-success" : v > 50 ? "bg-warning" : "bg-destructive")} style={{ width: `${v}%` }} /></div><span className="num text-xs">{v}</span></div>
);
const Field = ({ k, v }: { k: string; v: string }) => (<div><dt className="text-xs text-muted-foreground">{k}</dt><dd className="font-medium">{v}</dd></div>);

/* ---------- bomify ---------- */
function OrderQueue({ query, navigate }: Props) {
  const rows = ORDERS.filter((o) => (o.id + o.client).toLowerCase().includes(query.toLowerCase()));
  const p = deck.bomify.performance;
  return (
    <Page>
      <div className="mb-6 grid grid-cols-3 gap-4">
        <Stat label="Tempo médio" value={`${p.tempo_medio_processamento_min} min`} sub="por pedido" />
        <Stat label="Sem alertas" value={`${p.pedidos_sem_alertas}/${p.pedidos_sem_alertas + p.pedidos_com_alertas}`} tone="good" sub="pedidos em agosto" />
        <Stat label="Alertas abertos" value={String(deck.bomify.alertas.total_abertos_hoje)} tone="bad" sub="3 conflitos · 2 dados · 1 peça" />
      </div>
      <div className="overflow-hidden rounded-2xl border bg-card">
        {rows.map((o) => (
          <button key={o.id} onClick={() => navigate("bm-review", o.id, o.id)} className="flex w-full items-center gap-4 border-b px-5 py-3.5 text-left last:border-0 hover:bg-paper">
            <span className={cn("size-2 rounded-full", o.alert ? "bg-destructive" : o.status === "Done" ? "bg-success" : o.status === "Draft" ? "bg-warning" : "bg-muted-foreground/40")} />
            <span className="num w-32 text-sm font-medium">{o.id}</span>
            <span className="flex-1"><span className="text-sm">{o.client}</span>{o.alert && <span className="block text-xs text-destructive">{o.alert}</span>}</span>
            <span className="num w-20 text-right text-xs text-muted-foreground">{o.lines ? `${o.lines} linhas` : "—"}</span>
            <span className="w-20 text-xs">{o.status}</span>
            <span className="num w-28 text-right text-xs text-muted-foreground">{fmtTime(o.when)}</span>
          </button>
        ))}
      </div>
    </Page>
  );
}

function BomReview({ tab }: Props) {
  const [pick, setPick] = useState(3);
  const line = BOM_LINES[pick] ?? BOM_LINES[0]!;
  return (
    <div className="grid h-full grid-cols-2">
      <div className="flex flex-col border-r bg-paper">
        <div className="flex items-center gap-2 border-b px-6 py-3 text-xs text-muted-foreground"><FileText className="size-3.5" /> Origem · email + desenho_0413.dwg</div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="rounded-xl border bg-card p-5 text-sm leading-relaxed">
            <div className="mb-3 text-xs text-muted-foreground">De: compras@metalurgicaoeste.pt</div>
            Bom dia, segue em anexo o desenho para o pedido {tab.recordId}. Precisamos de <mark className="rounded bg-accent px-0.5">4 flanges de 100 mm</mark> e 6 m de perfil UPN 100, entre outros.
          </div>
          <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-xl border bg-card">
            <svg viewBox="0 0 400 300" className="size-full text-muted-foreground">
              <defs><pattern id="g" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="currentColor" strokeOpacity=".12" /></pattern></defs>
              <rect width="400" height="300" fill="url(#g)" />
              <rect x="60" y="80" width="200" height="120" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="310" cy="140" r="40" fill="none" stroke="var(--destructive)" strokeWidth="2" strokeDasharray="4 3" />
              <circle cx="310" cy="140" r="14" fill="none" stroke="currentColor" />
              <text x="282" y="200" fontSize="11" fill="var(--destructive)" fontFamily="JetBrains Mono">Ø 4.0 in ?</text>
              <text x="130" y="72" fontSize="11" fill="currentColor" fontFamily="JetBrains Mono">UPN 100</text>
            </svg>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        {tab.state === "error" && (
          <div className="flex items-start gap-3 border-b border-destructive/20 bg-destructive/5 px-6 py-3 text-sm">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
            <span><b>Conflito email vs desenho.</b> O DWG está em polegadas, o email em mm. Aguarda ficheiro corrigido ou resolução manual.</span>
          </div>
        )}
        <div className="flex-1 overflow-y-auto">
          {BOM_LINES.map((l, i) => (
            <button key={l.ref} onClick={() => setPick(i)} className={cn("flex w-full items-center gap-4 border-b px-6 py-3 text-left text-sm hover:bg-paper", pick === i && "bg-accent/60")}>
              <span className="num w-20 text-xs">{l.ref}</span>
              <span className="flex-1">{l.desc}</span>
              <span className="num w-16 text-right">{l.qty} {l.unit}</span>
              <span className={cn("num w-12 text-right text-xs", l.conf > 0.9 ? "text-success" : l.conf > 0.6 ? "text-warning" : "text-destructive")}>{Math.round(l.conf * 100)}%</span>
            </button>
          ))}
        </div>
        <div className="border-t bg-paper p-6">
          <Eyebrow>Linha selecionada · confiança por campo</Eyebrow>
          <div className="grid grid-cols-3 gap-3 text-sm">
            {[["Referência", line.ref, line.conf], ["Quantidade", `${line.qty} ${line.unit}`, Math.min(1, line.conf + 0.3)], ["Dimensão", pick === 3 ? "4.0 in ≠ 100 mm" : "ok", line.conf]].map(([k, v, c]) => (
              <div key={k as string} className="rounded-lg border bg-card p-3">
                <div className="text-xs text-muted-foreground">{k}</div>
                <div className="num mt-0.5 font-medium">{v}</div>
                <div className="mt-2 h-1 rounded bg-secondary"><div className={cn("h-full rounded", (c as number) > 0.8 ? "bg-success" : (c as number) > 0.55 ? "bg-warning" : "bg-destructive")} style={{ width: `${(c as number) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- settings ---------- */
function SettingsView() {
  const groups = [
    ["Conta e perfil", "Nome, email, idioma"],
    ["Notificações", "O que chega a Operations e por email"],
    ["Empresa e utilizadores", "4 membros · 2 grupos de permissões"],
    ["Integrações", "LinkedIn (com falhas), Outlook, SAP"],
    ["LeadFlow", "Setores-alvo, regras de scoring"],
    ["BOMify", "Catálogo de peças, unidades por defeito"],
  ];
  return (
    <Page className="max-w-3xl">
      <h1 className="mb-6 text-3xl font-bold">Definições</h1>
      <div className="overflow-hidden rounded-2xl border bg-card">
        {groups.map(([t, s]) => (
          <div key={t} className="flex items-center justify-between border-b px-5 py-4 last:border-0 hover:bg-paper">
            <div><div className="font-medium">{t}</div><div className="text-xs text-muted-foreground">{s}</div></div>
            <ArrowUpRight className="size-4 text-muted-foreground" />
          </div>
        ))}
      </div>
    </Page>
  );
}
