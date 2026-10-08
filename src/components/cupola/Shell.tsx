import { useCallback, useEffect, useMemo, useState } from "react";
import {
  LayoutGrid, Radar, Users, Boxes, Settings, LifeBuoy, Plus, X, Search, SlidersHorizontal,
  ArrowUpDown, Rows3, Upload, Download, ChevronRight, Sparkles, MoreHorizontal, Loader2,
  Check, AlertTriangle, Command, Building2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { deck, homeView, MODULES, type ModuleId, type Tab, type ViewId } from "./data";
import { GROUPS, MODULE_DEFS, getDef } from "./modules";
import { Workspace } from "./views";

let seq = 10;
const uid = () => `t${++seq}`;

const DEFAULT_TABS: Tab[] = [
  { id: "t1", module: "suite", view: "suite-dashboard", title: "Visão geral", state: "active" },
  { id: "t2", module: "leadflow", view: "lf-pipeline", title: "Campanha metalomecânica", state: "background", progress: 64 },
  { id: "t3", module: "bomify", view: "bm-review", title: "ORD2026/0413", state: "error", recordId: "ORD2026/0413" },
  { id: "t4", module: "bomify", view: "bm-queue", title: "Fila de pedidos", state: "done" },
];

export interface Action { label: string; icon?: typeof Sparkles; run: () => void; ai?: boolean }

export function CupolaShell() {
  const [tabs, setTabs] = useState<Tab[]>(DEFAULT_TABS);
  const [activeId, setActiveId] = useState("t1");
  const [opsOpen, setOpsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const active: Tab = tabs.find((t) => t.id === activeId) ?? tabs[0] ?? DEFAULT_TABS[0]!;

  const patch = useCallback((id: string, p: Partial<Tab>) => setTabs((ts) => ts.map((t) => (t.id === id ? { ...t, ...p } : t))), []);

  // background progress simulation
  useEffect(() => {
    const iv = setInterval(() => {
      setTabs((ts) =>
        ts.map((t) => {
          if (t.state !== "background") return t;
          const p = Math.min(100, (t.progress ?? 0) + 6 + Math.random() * 6);
          if (p >= 100) {
            toast.success(`${MODULES[t.module]?.name}: operação concluída`, { description: t.title });
            return { ...t, state: "done", progress: 100 };
          }
          return { ...t, progress: p };
        }),
      );
    }, 1200);
    return () => clearInterval(iv);
  }, []);

  const open = (module: ModuleId, view: ViewId, title: string, recordId?: string) => {
    const existing = tabs.find((t) => t.view === view && t.recordId === recordId && t.module === module);
    if (existing) return setActiveId(existing.id);
    const t: Tab = { id: uid(), module, view, title, state: "active", recordId };
    setTabs((ts) => [...ts, t]);
    setActiveId(t.id);
  };
  const navigate = (view: ViewId, title?: string, recordId?: string) =>
    patch(active.id, { view, recordId, ...(title ? { title } : {}) });
  const close = (id: string) => {
    setTabs((ts) => {
      const next = ts.filter((t) => t.id !== id);
      if (id === activeId && next.length) setActiveId(next[next.length - 1]!.id);
      return next.length ? next : DEFAULT_TABS.slice(0, 1);
    });
  };
  const runBackground = (label: string) => {
    patch(active.id, { state: "background", progress: 4 });
    toast(`${label} em segundo plano`, { description: "Pode mudar de separador. Avisamos quando terminar." });
  };

  const actions: Action[] = useMemo(() => {
    switch (active.view) {
      case "lf-pipeline":
      case "lf-dashboard":
        return [
          { label: "Gerar leads", ai: true, icon: Sparkles, run: () => runBackground("Geração de leads") },
          { label: "Qualificar seleção", icon: Sparkles, run: () => runBackground("Qualificação") },
          { label: "Retentar enrichment", run: () => runBackground("Enrichment") },
          { label: "Nova lead", icon: Plus, run: () => toast("Formulário de nova lead") },
        ];
      case "bm-queue":
        return [
          { label: "Processar pedido", ai: true, icon: Sparkles, run: () => runBackground("Extração de BOM") },
          { label: "Rever próximo", run: () => navigate("bm-review", "ORD2026/0413", "ORD2026/0413") },
          { label: "Novo pedido", icon: Plus, run: () => toast("Carregar email ou desenho") },
        ];
      case "bm-review":
        return [
          { label: "Confirmar BOM", ai: false, icon: Check, run: () => { patch(active.id, { state: "done" }); toast.success("BOM confirmada"); } },
          { label: "Resolver com IA", ai: true, icon: Sparkles, run: () => runBackground("Resolução de conflitos") },
          { label: "Pedir ficheiro ao cliente", run: () => toast("Email preparado para Metalúrgica Oeste") },
          { label: "Passar a orçamento", run: () => toast("Enviado para QuoteGenius") },
        ];
      case "operations":
        return [
          { label: "Marcar tudo como lido", icon: Check, run: () => toast("Notificações marcadas") },
          { label: "Retentar falhadas", ai: true, icon: Sparkles, run: () => runBackground("Retentativa") },
        ];
      case "settings":
        return [{ label: "Guardar alterações", icon: Check, run: () => toast.success("Guardado") }];
      case "catalogue":
        return [{ label: "Pedir recomendação de módulo", ai: true, icon: Sparkles, run: () => runBackground("Recomendação") }];
      case "mod-dashboard":
      case "mod-list":
      case "mod-chat":
      case "mod-features": {
        const def = getDef(active.module);
        if (!def) return [];
        return [
          { label: def.primary, ai: true, icon: Sparkles, run: () => runBackground(def.primary) },
          ...def.secondary.map((s) => ({ label: s, run: () => toast(s, { description: def.name }) })),
        ];
      }
      default:
        return [
          { label: "Pedir resumo da semana", ai: true, icon: Sparkles, run: () => runBackground("Resumo semanal") },
          { label: "Abrir Operations", run: () => setOpsOpen(true) },
        ];
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active.view, active.id]);

  const crumbs = crumbsFor(active);
  const hasList = ["lf-pipeline", "bm-queue", "operations", "mod-list", "mod-features", "catalogue"].includes(active.view);
  const errors = deck.transversal.erros_ativos.length + tabs.filter((t) => t.state === "error").length - 1;

  return (
    <div className="flex h-screen overflow-hidden bg-chrome text-foreground">
      {/* 1 · Sidebar */}
      <aside className="flex w-60 shrink-0 flex-col bg-chrome text-chrome-foreground">
        <div className="flex items-center gap-2.5 px-5 pb-4 pt-5">
          <CupolaMark />
          <span className="font-display text-lg font-bold tracking-tight">Cupola</span>
        </div>
        <button className="mx-3 mb-4 flex items-center gap-2 rounded-lg border border-chrome-border px-3 py-2 text-left text-xs text-chrome-muted hover:bg-chrome-raised">
          <Building2 className="size-3.5" />
          <span className="flex-1 truncate">Empresa demo</span>
          <ChevronRight className="size-3.5" />
        </button>
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 text-sm">
          <SideItem icon={LayoutGrid} label="Visão geral" onClick={() => open("suite", "suite-dashboard", "Visão geral")} on={active.view === "suite-dashboard"} />
          <SideItem icon={Radar} label="Operations" badge={errors} onClick={() => setOpsOpen(true)} on={opsOpen} />
          <SideItem icon={Boxes} label="Todos os módulos" onClick={() => open("suite", "catalogue", "Módulos")} on={active.view === "catalogue"} />
          {GROUPS.map((g) => (
            <div key={g}>
              <SideLabel>{g}</SideLabel>
              {MODULE_DEFS.filter((m) => m.group === g).map((m) => (
                <button
                  key={m.id}
                  onClick={() => open(m.id, homeView(m.id), m.name)}
                  className={cn("flex w-full items-center gap-2.5 rounded-lg px-3 py-1.5 text-left transition-colors", active.module === m.id ? "bg-chrome-raised text-chrome-foreground" : "text-chrome-muted hover:bg-chrome-raised hover:text-chrome-foreground")}
                >
                  <span className={cn("num flex h-5 w-6 items-center justify-center rounded text-[9px] font-medium", active.module === m.id ? "bg-primary text-primary-foreground" : "bg-chrome-raised")}>{m.short}</span>
                  <span className="truncate">{m.name}</span>
                </button>
              ))}
            </div>
          ))}
          <SideLabel>Intenções abertas</SideLabel>
          {tabs.filter((t) => t.module !== "suite").map((t) => (
            <button key={t.id} onClick={() => setActiveId(t.id)} className="flex items-center gap-2 rounded-md px-3 py-1.5 text-left text-xs text-chrome-muted hover:bg-chrome-raised hover:text-chrome-foreground">
              <StateDot state={t.state} />
              <span className="truncate">{t.title}</span>
            </button>
          ))}
        </nav>
        <div className="space-y-3 border-t border-chrome-border p-4">
          <div>
            <div className="mb-1.5 flex justify-between text-[11px] text-chrome-muted">
              <span>Créditos · agosto</span>
              <span className="num">{deck.transversal.creditos.percentagem_usada}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-chrome-raised">
              <div className="h-full bg-ai" style={{ width: `${deck.transversal.creditos.percentagem_usada}%` }} />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <SideIcon icon={Settings} label="Definições" onClick={() => open("suite", "settings", "Definições")} />
            <SideIcon icon={LifeBuoy} label="Ajuda" onClick={() => toast("Centro de ajuda")} />
            <div className="ml-auto flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">IP</div>
          </div>
        </div>
      </aside>

      {/* Right column */}
      <div className="flex min-w-0 flex-1 flex-col pr-2 pt-2">
        {/* 2 · Tabs */}
        <div className="flex items-end gap-1 overflow-x-auto pl-1">
          {tabs.map((t) => (
            <div
              key={t.id}
              onClick={() => setActiveId(t.id)}
              className={cn(
                "group relative flex min-w-0 max-w-56 cursor-pointer items-center gap-2 rounded-t-xl px-3.5 py-2.5 text-xs transition-colors",
                t.id === active.id ? "bg-background text-foreground" : "text-chrome-muted hover:bg-chrome-raised hover:text-chrome-foreground",
              )}
            >
              <span className={cn("num rounded px-1 text-[10px]", t.id === active.id ? "bg-secondary text-muted-foreground" : "bg-chrome-raised")}>{MODULES[t.module]?.short}</span>
              <span className="truncate font-medium">{t.title}</span>
              <StateDot state={t.state} />
              <button onClick={(e) => { e.stopPropagation(); close(t.id); }} className="opacity-0 transition-opacity group-hover:opacity-60 hover:opacity-100!">
                <X className="size-3" />
              </button>
              {t.state === "background" && (
                <span className="absolute inset-x-3 bottom-0 h-0.5 overflow-hidden rounded bg-chrome-border">
                  <span className="block h-full bg-ai transition-all" style={{ width: `${t.progress}%` }} />
                </span>
              )}
            </div>
          ))}
          <button
            onClick={() => { const m = active.module === "suite" ? "leadflow" : active.module; const v: ViewId = m === "bomify" ? "bm-queue" : m === "leadflow" ? "lf-pipeline" : "mod-list"; const t: Tab = { id: uid(), module: m, view: v, title: `Nova intenção · ${MODULES[m]?.name}`, state: "active" }; setTabs((ts) => [...ts, t]); setActiveId(t.id); }}
            className="mb-1.5 ml-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-chrome-muted hover:bg-chrome-raised hover:text-chrome-foreground"
            title="Nova intenção"
          >
            <Plus className="size-4" />
          </button>
        </div>

        <main className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-b-2xl rounded-tr-2xl bg-background">
          {/* 3 · Top zone */}
          <header className="flex flex-wrap items-center gap-3 border-b px-6 py-3">
            <nav className="flex items-center gap-1.5 text-sm">
              {crumbs.map((c, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  {i > 0 && <ChevronRight className="size-3.5 text-muted-foreground" />}
                  <button
                    onClick={() => c.view && navigate(c.view, c.title)}
                    className={cn(i === crumbs.length - 1 ? "font-semibold text-foreground" : "text-muted-foreground hover:text-foreground")}
                  >
                    {c.label}
                  </button>
                </span>
              ))}
            </nav>
            <div className="ml-auto flex items-center gap-1">
              {hasList && (
                <>
                  <label className="mr-1 flex items-center gap-2 rounded-lg border bg-paper px-2.5 py-1.5 text-sm focus-within:ring-2 focus-within:ring-ring/30">
                    <Search className="size-3.5 text-muted-foreground" />
                    <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Pesquisar nesta vista" className="w-44 bg-transparent outline-none placeholder:text-muted-foreground" />
                  </label>
                  <Util icon={SlidersHorizontal} label="Filtrar" />
                  <Util icon={ArrowUpDown} label="Ordenar" />
                  <Util icon={Rows3} label="Vista" />
                  <span className="mx-1 h-5 w-px bg-border" />
                </>
              )}
              <Util icon={Upload} label="Importar" />
              <Util icon={Download} label="Exportar" />
            </div>
          </header>

          {/* 4 · Workspace */}
          <div className="min-h-0 flex-1 overflow-y-auto">
            <Workspace tab={active} query={query} navigate={navigate} open={open} openOps={() => setOpsOpen(true)} />
          </div>

          {/* 5 · Action bar */}
          <footer className="flex items-center gap-2 border-t bg-paper px-6 py-3">
            {active.state === "background" ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin text-primary" />
                Agente a trabalhar · <span className="num">{Math.round(active.progress ?? 0)}%</span>
              </div>
            ) : active.state === "error" ? (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertTriangle className="size-4" /> Requer atenção
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Command className="size-3.5" /> <span className="num">K</span> para comandos
              </div>
            )}
            <div className="ml-auto flex items-center gap-2">
              {actions.slice(1).map((a) => (
                <button key={a.label} onClick={a.run} disabled={active.state === "background"} className="flex items-center gap-1.5 rounded-lg border bg-card px-3.5 py-2 text-sm font-medium hover:bg-secondary disabled:opacity-40">
                  {a.icon && <a.icon className="size-3.5" />}
                  {a.label}
                </button>
              ))}
              <button className="flex size-9 items-center justify-center rounded-lg border bg-card hover:bg-secondary" title="Mais ações">
                <MoreHorizontal className="size-4" />
              </button>
              {actions[0] && (
                <button
                  onClick={actions[0].run}
                  disabled={active.state === "background"}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-primary-foreground shadow-float transition-transform hover:-translate-y-px disabled:opacity-50",
                    actions[0].ai ? "bg-ai" : "bg-foreground text-background",
                  )}
                >
                  {actions[0].icon && (() => { const I = actions[0].icon!; return <I className="size-4" />; })()}
                  {actions[0].label}
                </button>
              )}
            </div>
          </footer>
        </main>
        <div className="h-2" />
      </div>

      {opsOpen && <OperationsPanel tabs={tabs} onClose={() => setOpsOpen(false)} goTab={(id) => { setActiveId(id); setOpsOpen(false); }} />}
    </div>
  );
}

function crumbsFor(t: Tab): { label: string; view?: ViewId; title?: string }[] {
  const m = MODULES[t.module]?.name;
  switch (t.view) {
    case "lf-dashboard": return [{ label: m }, { label: "Dashboard" }];
    case "lf-pipeline": return [{ label: m, view: "lf-dashboard", title: "LeadFlow" }, { label: "Pipeline" }];
    case "bm-queue": return [{ label: m }, { label: "Pedidos" }];
    case "bm-review": return [{ label: m }, { label: "Pedidos", view: "bm-queue", title: "Fila de pedidos" }, { label: t.recordId ?? "" }, { label: "Revisão" }];
    case "settings": return [{ label: "Cupola" }, { label: "Definições" }];
    case "catalogue": return [{ label: "Cupola" }, { label: "Módulos" }];
    case "mod-dashboard": return [{ label: m }, { label: "Dashboard" }];
    case "mod-list": return [{ label: m, view: "mod-dashboard" }, { label: getDef(t.module)?.list.title ?? "" }];
    case "mod-chat": return [{ label: m, view: "mod-dashboard" }, { label: "Conversa" }];
    case "mod-features": return [{ label: m, view: "mod-dashboard" }, { label: "Funcionalidades" }];
    default: return [{ label: "Cupola" }, { label: "Visão geral" }];
  }
}

function OperationsPanel({ tabs, onClose, goTab }: { tabs: Tab[]; onClose: () => void; goTab: (id: string) => void }) {
  const t = deck.transversal;
  const running = tabs.filter((x) => x.state === "background");
  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      <div className="flex-1 bg-chrome/40 backdrop-blur-[2px] animate-in fade-in" />
      <aside onClick={(e) => e.stopPropagation()} className="flex w-[420px] flex-col bg-paper shadow-float animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-xl font-bold">Operations</h2>
            <p className="text-xs text-muted-foreground">O que precisa de acompanhamento agora</p>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 hover:bg-secondary"><X className="size-4" /></button>
        </div>
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          <section>
            <OpsLabel>Em curso</OpsLabel>
            {running.length === 0 && <p className="text-sm text-muted-foreground">Nada a correr.</p>}
            {running.map((r) => (
              <button key={r.id} onClick={() => goTab(r.id)} className="mb-2 w-full rounded-xl border bg-card p-4 text-left hover:border-primary/50">
                <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground"><span>{MODULES[r.module]?.name}</span><span className="num">{Math.round(r.progress ?? 0)}%</span></div>
                <div className="text-sm font-medium">{r.title}</div>
                <div className="mt-3 h-1 overflow-hidden rounded bg-secondary"><div className="h-full bg-ai transition-all" style={{ width: `${r.progress}%` }} /></div>
              </button>
            ))}
          </section>
          <section>
            <OpsLabel>Requer atenção · {t.erros_ativos.length}</OpsLabel>
            <div className="space-y-2">
              {t.erros_ativos.map((e) => (
                <div key={e.id} className="rounded-xl border border-destructive/25 bg-destructive/5 p-4">
                  <div className="mb-1 flex items-center gap-2 text-xs font-medium text-destructive"><AlertTriangle className="size-3.5" />{e.modulo} · {e.tipo.replaceAll("_", " ")}</div>
                  <div className="text-sm">{e.descricao}</div>
                  <div className="mt-2 text-xs text-muted-foreground">→ {e.acao_necessaria}</div>
                </div>
              ))}
            </div>
          </section>
          <section>
            <OpsLabel>Organização</OpsLabel>
            <div className="rounded-xl border bg-card p-4 text-sm">
              <div className="mb-1 text-xs font-medium text-warning">Créditos</div>
              {t.creditos.tendencia}
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
}

const OpsLabel = ({ children }: { children: React.ReactNode }) => <h3 className="mb-2.5 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{children}</h3>;

export function StateDot({ state }: { state: Tab["state"] }) {
  if (state === "background") return <Loader2 className="size-3 shrink-0 animate-spin text-primary" />;
  if (state === "done") return <span className="size-1.5 shrink-0 rounded-full bg-success" />;
  if (state === "error") return <span className="size-1.5 shrink-0 rounded-full bg-destructive animate-pulse-dot" />;
  return null;
}

function SideItem({ icon: I, label, on, onClick, badge }: { icon: typeof Users; label: string; on?: boolean; onClick: () => void; badge?: number }) {
  return (
    <button onClick={onClick} className={cn("flex items-center gap-2.5 rounded-lg px-3 py-2 text-left transition-colors", on ? "bg-chrome-raised text-chrome-foreground" : "text-chrome-muted hover:bg-chrome-raised hover:text-chrome-foreground")}>
      <I className="size-4" />
      <span className="flex-1">{label}</span>
      {!!badge && <span className="num rounded-full bg-destructive px-1.5 text-[10px] font-medium text-destructive-foreground">{badge}</span>}
    </button>
  );
}
const SideLabel = ({ children }: { children: React.ReactNode }) => <div className="px-3 pb-1 pt-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-chrome-muted/70">{children}</div>;
const SideIcon = ({ icon: I, label, onClick }: { icon: typeof Users; label: string; onClick: () => void }) => (
  <button onClick={onClick} title={label} className="flex size-8 items-center justify-center rounded-lg text-chrome-muted hover:bg-chrome-raised hover:text-chrome-foreground"><I className="size-4" /></button>
);
const Util = ({ icon: I, label }: { icon: typeof Users; label: string }) => (
  <button onClick={() => toast(label)} title={label} className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"><I className="size-4" /></button>
);

function CupolaMark() {
  return (
    <svg viewBox="0 0 32 32" className="size-7" aria-hidden>
      <path d="M4 22a12 12 0 0 1 24 0" fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" />
      <path d="M10 22a6 6 0 0 1 12 0" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity=".6" />
      <rect x="3" y="24" width="26" height="3" rx="1.5" fill="currentColor" />
    </svg>
  );
}
