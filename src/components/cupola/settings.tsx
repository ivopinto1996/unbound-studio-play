import { useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, Check, ChevronRight, Plus, RefreshCw, Trash2, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Section = "account" | "notif" | "company" | "integrations" | "leadflow" | "bomify";

const SECTIONS: { id: Section; title: string; sub: string }[] = [
  { id: "account", title: "Conta e perfil", sub: "Nome, email, idioma" },
  { id: "notif", title: "Notificações", sub: "Operations e email" },
  { id: "company", title: "Empresa e utilizadores", sub: "Membros e permissões" },
  { id: "integrations", title: "Integrações", sub: "LinkedIn, Outlook, SAP" },
  { id: "leadflow", title: "LeadFlow", sub: "Setores, scoring, limites" },
  { id: "bomify", title: "BOMify", sub: "Caixa de entrada, catálogo, unidades" },
];

/* ---------- primitives ---------- */
const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{children}</div>
);
function Card({ title, desc, children, action }: { title: string; desc?: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="mb-5 rounded-2xl border bg-card">
      <header className="flex items-start justify-between gap-4 border-b px-5 py-4">
        <div>
          <h3 className="text-base font-bold">{title}</h3>
          {desc && <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>}
        </div>
        {action}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}
function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={cn("relative h-5 w-9 shrink-0 rounded-full transition-colors", on ? "bg-primary" : "bg-secondary border")}
    >
      <span className={cn("absolute top-0.5 size-4 rounded-full bg-card shadow transition-all", on ? "left-[18px]" : "left-0.5")} />
    </button>
  );
}
function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-6 border-b py-3 first:pt-0 last:border-0 last:pb-0">
      <div>
        <div className="text-sm font-medium">{label}</div>
        {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
      </div>
      {children}
    </div>
  );
}
function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border bg-paper px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/20" />
    </label>
  );
}
function Segmented<T extends string>({ value, options, onChange }: { value: T; options: { v: T; l: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="inline-flex rounded-lg border bg-paper p-0.5">
      {options.map((o) => (
        <button key={o.v} onClick={() => onChange(o.v)} className={cn("rounded-md px-3 py-1 text-xs font-medium transition-colors", value === o.v ? "bg-chrome text-chrome-foreground" : "text-muted-foreground hover:text-foreground")}>{o.l}</button>
      ))}
    </div>
  );
}
function Chip({ children, onRemove }: { children: React.ReactNode; onRemove?: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border bg-paper px-3 py-1 text-xs">
      {children}
      {onRemove && <button onClick={onRemove} aria-label="Remover" className="text-muted-foreground hover:text-destructive"><X className="size-3" /></button>}
    </span>
  );
}
const saved = () => toast.success("Alterações guardadas");

/* ---------- shell ---------- */
export function SettingsView() {
  const [sec, setSec] = useState<Section>("account");
  const cur = SECTIONS.find((s) => s.id === sec)!;
  return (
    <div className="mx-auto flex max-w-6xl gap-8 px-8 py-8 animate-in fade-in duration-300">
      <nav className="w-60 shrink-0">
        <h1 className="mb-6 text-3xl font-bold">Definições</h1>
        <Eyebrow>Geral</Eyebrow>
        {SECTIONS.slice(0, 4).map((s) => <NavItem key={s.id} s={s} active={sec === s.id} onClick={() => setSec(s.id)} />)}
        <div className="mt-5" />
        <Eyebrow>Módulos</Eyebrow>
        {SECTIONS.slice(4).map((s) => <NavItem key={s.id} s={s} active={sec === s.id} onClick={() => setSec(s.id)} />)}
      </nav>
      <div key={sec} className="min-w-0 flex-1 animate-in fade-in slide-in-from-bottom-1 duration-200">
        <div className="mb-6 mt-2">
          <h2 className="text-2xl font-bold">{cur.title}</h2>
          <p className="text-sm text-muted-foreground">{cur.sub}</p>
        </div>
        {sec === "account" && <Account />}
        {sec === "notif" && <Notifications />}
        {sec === "company" && <Company />}
        {sec === "integrations" && <Integrations />}
        {sec === "leadflow" && <LeadFlowSettings />}
        {sec === "bomify" && <BomifySettings />}
      </div>
    </div>
  );
}
function NavItem({ s, active, onClick }: { s: { title: string; sub: string }; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={cn("group mb-0.5 flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors", active ? "bg-card font-medium shadow-float" : "text-muted-foreground hover:bg-card/60 hover:text-foreground")}>
      <span>{s.title}</span>
      <ChevronRight className={cn("size-3.5", active ? "text-primary" : "opacity-0 group-hover:opacity-100")} />
    </button>
  );
}

/* ---------- account ---------- */
function Account() {
  const [name, setName] = useState("Marta Ribeiro");
  const [email, setEmail] = useState("marta.ribeiro@metalurgica-norte.pt");
  const [role, setRole] = useState("Diretora comercial");
  const [lang, setLang] = useState<"pt" | "en">("pt");
  const [density, setDensity] = useState<"comfy" | "compact">("comfy");
  const [tz, setTz] = useState("Europe/Lisbon");
  return (
    <>
      <Card title="Perfil" desc="Como aparece aos colegas e nos emails enviados pela IA.">
        <div className="mb-5 flex items-center gap-4">
          <span className="flex size-14 items-center justify-center rounded-full bg-ai font-display text-lg font-bold text-primary-foreground">{name.split(" ").map((p) => p[0]).slice(0, 2).join("")}</span>
          <button onClick={() => toast("Carregar foto — disponível em breve")} className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-paper"><Upload className="size-3.5" /> Mudar foto</button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Nome" value={name} onChange={setName} />
          <Field label="Cargo" value={role} onChange={setRole} />
          <div className="col-span-2"><Field label="Email" type="email" value={email} onChange={setEmail} /></div>
        </div>
      </Card>
      <Card title="Preferências">
        <Row label="Idioma da interface" hint="Os documentos são lidos em qualquer idioma."><Segmented value={lang} onChange={setLang} options={[{ v: "pt", l: "Português" }, { v: "en", l: "English" }]} /></Row>
        <Row label="Densidade das tabelas"><Segmented value={density} onChange={setDensity} options={[{ v: "comfy", l: "Confortável" }, { v: "compact", l: "Compacta" }]} /></Row>
        <Row label="Fuso horário">
          <select value={tz} onChange={(e) => setTz(e.target.value)} className="rounded-lg border bg-paper px-3 py-1.5 text-sm">
            <option>Europe/Lisbon</option><option>Europe/Madrid</option><option>Europe/London</option><option>America/Sao_Paulo</option>
          </select>
        </Row>
      </Card>
      <Card title="Segurança">
        <Row label="Palavra-passe" hint="Alterada há 3 meses"><button onClick={() => toast("Enviámos um link para o seu email")} className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-paper">Alterar</button></Row>
        <Row label="Sessões ativas" hint="Este portátil · iPhone · 1 sessão em Porto"><button onClick={() => toast.success("Outras sessões terminadas")} className="rounded-lg border px-3 py-1.5 text-xs font-medium text-destructive hover:bg-paper">Terminar outras</button></Row>
      </Card>
      <SaveBar />
    </>
  );
}
function SaveBar() {
  return (
    <div className="sticky bottom-4 flex justify-end">
      <button onClick={saved} className="flex items-center gap-1.5 rounded-xl bg-chrome px-5 py-2.5 text-sm font-medium text-chrome-foreground shadow-float hover:bg-chrome-raised"><Check className="size-4" /> Guardar alterações</button>
    </div>
  );
}

/* ---------- notifications ---------- */
function Notifications() {
  const events = [
    { k: "done", l: "Uma ação da IA terminou", h: "Ex.: geração de leads, leitura de BOM" },
    { k: "fail", l: "Uma ação falhou ou precisa de mim", h: "Erros, revisões pendentes" },
    { k: "mention", l: "Alguém me mencionou numa nota" },
    { k: "assign", l: "Foi-me atribuído um pedido" },
    { k: "integr", l: "Uma integração deixou de funcionar" },
    { k: "digest", l: "Resumo semanal de créditos e resultados" },
  ];
  const [m, setM] = useState<Record<string, { ops: boolean; mail: boolean }>>(() =>
    Object.fromEntries(events.map((e) => [e.k, { ops: true, mail: ["fail", "integr", "digest"].includes(e.k) }])),
  );
  const [quiet, setQuiet] = useState(true);
  const [sound, setSound] = useState(false);
  return (
    <>
      <Card title="O que me avisa" desc="Escolha onde recebe cada tipo de aviso.">
        <div className="mb-2 grid grid-cols-[1fr_80px_80px] text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          <span /> <span className="text-center">Operations</span> <span className="text-center">Email</span>
        </div>
        {events.map((e) => (
          <div key={e.k} className="grid grid-cols-[1fr_80px_80px] items-center border-t py-3">
            <div><div className="text-sm font-medium">{e.l}</div>{e.h && <div className="text-xs text-muted-foreground">{e.h}</div>}</div>
            {(["ops", "mail"] as const).map((c) => (
              <div key={c} className="flex justify-center">
                <Toggle label={`${e.l} ${c}`} on={m[e.k]![c]} onChange={(v) => setM({ ...m, [e.k]: { ...m[e.k]!, [c]: v } })} />
              </div>
            ))}
          </div>
        ))}
      </Card>
      <Card title="Horário">
        <Row label="Não incomodar fora de horas" hint="Sem emails entre 19:00 e 08:00 e ao fim de semana"><Toggle label="Não incomodar" on={quiet} onChange={setQuiet} /></Row>
        <Row label="Som quando uma ação termina"><Toggle label="Som" on={sound} onChange={setSound} /></Row>
      </Card>
      <SaveBar />
    </>
  );
}

/* ---------- company ---------- */
type Member = { n: string; e: string; r: "Administrador" | "Comercial" | "Engenharia" | "Leitura"; last: string };
function Company() {
  const [company, setCompany] = useState("Metalúrgica do Norte, S.A.");
  const [vat, setVat] = useState("PT 509 123 456");
  const [members, setMembers] = useState<Member[]>([
    { n: "Marta Ribeiro", e: "marta.ribeiro@", r: "Administrador", last: "agora" },
    { n: "João Pereira", e: "joao.pereira@", r: "Comercial", last: "há 2 h" },
    { n: "Ana Costa", e: "ana.costa@", r: "Engenharia", last: "ontem" },
    { n: "Rui Fernandes", e: "rui.fernandes@", r: "Leitura", last: "há 6 dias" },
  ]);
  const [invite, setInvite] = useState("");
  const perms: [string, boolean[]][] = [
    ["Ver todos os módulos", [true, true, true, true]],
    ["Lançar ações da IA (gasta créditos)", [true, true, true, false]],
    ["Aprovar e enviar BOMs", [true, false, true, false]],
    ["Exportar dados", [true, true, false, false]],
    ["Gerir utilizadores e integrações", [true, false, false, false]],
  ];
  return (
    <>
      <Card title="Empresa">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Nome legal" value={company} onChange={setCompany} />
          <Field label="NIF" value={vat} onChange={setVat} />
        </div>
        <div className="mt-5 rounded-xl border bg-paper p-4">
          <div className="mb-2 flex justify-between text-sm"><span className="font-medium">Créditos de IA este mês</span><span className="num">7 420 / 10 000</span></div>
          <div className="h-2 rounded-full bg-secondary"><div className="h-full w-[74%] rounded-full bg-ai" /></div>
          <div className="mt-2 text-xs text-muted-foreground">Renova a 1 de novembro · LeadFlow 61% · BOMify 28% · outros 11%</div>
        </div>
      </Card>
      <Card
        title="Membros"
        desc={`${members.length} pessoas com acesso`}
        action={
          <form onSubmit={(e) => { e.preventDefault(); if (!invite.includes("@")) { toast.error("Escreva um email válido"); return; } setMembers([...members, { n: invite.split("@")[0]!, e: invite, r: "Leitura", last: "convite enviado" }]); setInvite(""); toast.success("Convite enviado"); }} className="flex gap-2">
            <input value={invite} onChange={(e) => setInvite(e.target.value)} placeholder="email@empresa.pt" className="w-48 rounded-lg border bg-paper px-3 py-1.5 text-sm outline-none focus:border-primary" />
            <button className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"><Plus className="size-3.5" /> Convidar</button>
          </form>
        }
      >
        {members.map((mb, i) => (
          <div key={mb.e + i} className="flex items-center gap-3 border-b py-3 first:pt-0 last:border-0 last:pb-0">
            <span className="flex size-8 items-center justify-center rounded-full bg-chrome text-xs font-medium text-chrome-foreground">{mb.n.slice(0, 1).toUpperCase()}</span>
            <div className="flex-1"><div className="text-sm font-medium">{mb.n}</div><div className="text-xs text-muted-foreground">{mb.last}</div></div>
            <select value={mb.r} disabled={i === 0} onChange={(e) => setMembers(members.map((x, j) => (j === i ? { ...x, r: e.target.value as Member["r"] } : x)))} className="rounded-lg border bg-paper px-2 py-1 text-xs disabled:opacity-60">
              {["Administrador", "Comercial", "Engenharia", "Leitura"].map((r) => <option key={r}>{r}</option>)}
            </select>
            <button disabled={i === 0} onClick={() => { setMembers(members.filter((_, j) => j !== i)); toast(`${mb.n} removido`); }} aria-label="Remover membro" className="text-muted-foreground hover:text-destructive disabled:invisible"><Trash2 className="size-4" /></button>
          </div>
        ))}
      </Card>
      <Card title="Permissões por papel">
        <div className="grid grid-cols-[1fr_repeat(4,90px)] text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          <span />{["Admin", "Comercial", "Engenharia", "Leitura"].map((r) => <span key={r} className="text-center">{r}</span>)}
        </div>
        {perms.map(([p, v]) => (
          <div key={p} className="grid grid-cols-[1fr_repeat(4,90px)] items-center border-t py-2.5 text-sm">
            <span>{p}</span>
            {v.map((ok, i) => <span key={i} className="flex justify-center">{ok ? <Check className="size-4 text-success" /> : <span className="size-1.5 rounded-full bg-border" />}</span>)}
          </div>
        ))}
      </Card>
      <SaveBar />
    </>
  );
}

/* ---------- integrations ---------- */
type Integ = { id: string; n: string; d: string; state: "ok" | "warn" | "off"; meta: string; logo: string };
function Integrations() {
  const [list, setList] = useState<Integ[]>([
    { id: "li", n: "LinkedIn", d: "Perfis de empresas e decisores para o LeadFlow", state: "warn", meta: "12% dos pedidos falharam nas últimas 24 h", logo: "in" },
    { id: "ol", n: "Outlook", d: "Caixa monitorizada de pedidos do BOMify", state: "ok", meta: "pedidos@metalurgica-norte.pt · sincronizado há 2 min", logo: "O" },
    { id: "sap", n: "SAP Business One", d: "Catálogo de peças e preços", state: "ok", meta: "18 432 referências · última leitura às 06:00", logo: "S" },
    { id: "hs", n: "HubSpot", d: "Enviar leads qualificadas para o CRM", state: "off", meta: "Não ligado", logo: "H" },
    { id: "tm", n: "Microsoft Teams", d: "Avisos de Operations num canal", state: "off", meta: "Não ligado", logo: "T" },
  ]);
  const [busy, setBusy] = useState<string | null>(null);
  const act = (id: string, to: Integ["state"], msg: string) => {
    setBusy(id);
    setTimeout(() => {
      setList((l) => l.map((x) => (x.id === id ? { ...x, state: to, meta: to === "ok" ? "Ligado agora" : to === "off" ? "Não ligado" : x.meta } : x)));
      setBusy(null);
      toast.success(msg);
    }, 900);
  };
  return (
    <>
      {list.some((x) => x.state === "warn") && (
        <div className="mb-5 flex items-center gap-3 rounded-2xl border border-warning/40 bg-warning/10 px-5 py-3 text-sm">
          <AlertTriangle className="size-4 text-warning" /> O LinkedIn está com falhas. O enriquecimento de contactos pode ficar incompleto.
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        {list.map((x) => (
          <div key={x.id} className="flex flex-col rounded-2xl border bg-card p-5">
            <div className="mb-3 flex items-center gap-3">
              <span className="num flex size-10 items-center justify-center rounded-xl bg-chrome text-sm font-medium text-chrome-foreground">{x.logo}</span>
              <div className="flex-1"><div className="font-display font-bold">{x.n}</div></div>
              <span className={cn("flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium", x.state === "ok" ? "bg-success/15 text-success" : x.state === "warn" ? "bg-warning/15 text-warning" : "bg-secondary text-muted-foreground")}>
                <span className={cn("size-1.5 rounded-full", x.state === "ok" ? "bg-success" : x.state === "warn" ? "bg-warning animate-pulse-dot" : "bg-muted-foreground")} />
                {x.state === "ok" ? "Ligado" : x.state === "warn" ? "Com falhas" : "Desligado"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{x.d}</p>
            <p className="mt-2 flex-1 text-xs text-muted-foreground">{x.meta}</p>
            <div className="mt-4 flex gap-2">
              {x.state === "off" ? (
                <button disabled={busy === x.id} onClick={() => act(x.id, "ok", `${x.n} ligado`)} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-60">{busy === x.id ? "A ligar…" : "Ligar"}</button>
              ) : (
                <>
                  <button disabled={busy === x.id} onClick={() => act(x.id, "ok", `${x.n} sincronizado`)} className="flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-paper disabled:opacity-60"><RefreshCw className={cn("size-3.5", busy === x.id && "animate-spin")} /> {x.state === "warn" ? "Voltar a ligar" : "Sincronizar"}</button>
                  <button onClick={() => act(x.id, "off", `${x.n} desligado`)} className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-destructive">Desligar</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      <Card title="Acesso por API" desc="Para ligar o Cupola a sistemas internos.">
        <Row label="Chave de API" hint="Criada a 12 mar · usada há 1 h"><code className="num rounded-md bg-paper px-2 py-1 text-xs">cup_live_••••••••4f2a</code></Row>
        <Row label="Gerar nova chave" hint="A chave atual deixa de funcionar."><button onClick={() => toast.success("Nova chave gerada")} className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-paper">Gerar</button></Row>
      </Card>
    </>
  );
}

/* ---------- LeadFlow ---------- */
function LeadFlowSettings() {
  const [sectors, setSectors] = useState(["Metalomecânica", "Moldes e plásticos", "Agroalimentar", "Automóvel (Tier 2)"]);
  const [newSector, setNewSector] = useState("");
  const [countries, setCountries] = useState(["Portugal", "Espanha", "França"]);
  const [weights, setWeights] = useState({ Dimensão: 30, "Encaixe no setor": 25, "Equipamento concorrente": 20, "Sinais de compra": 15, Localização: 10 });
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  const [minEmp, setMinEmp] = useState("50");
  const [minRev, setMinRev] = useState("5");
  const [roles, setRoles] = useState(["Diretor de produção", "Diretor de compras", "CEO"]);
  const [limit, setLimit] = useState(200);
  const [reenrich, setReenrich] = useState(true);
  return (
    <>
      <Card title="Onde procurar" desc="Os critérios usados quando a IA gera novas leads.">
        <Eyebrow>Setores-alvo</Eyebrow>
        <div className="mb-4 flex flex-wrap gap-2">
          {sectors.map((s) => <Chip key={s} onRemove={() => setSectors(sectors.filter((x) => x !== s))}>{s}</Chip>)}
          <form onSubmit={(e) => { e.preventDefault(); if (newSector.trim()) { setSectors([...sectors, newSector.trim()]); setNewSector(""); } }}>
            <input value={newSector} onChange={(e) => setNewSector(e.target.value)} placeholder="+ adicionar setor" className="w-36 rounded-full border border-dashed bg-transparent px-3 py-1 text-xs outline-none focus:border-primary" />
          </form>
        </div>
        <Eyebrow>Países</Eyebrow>
        <div className="flex flex-wrap gap-2">
          {["Portugal", "Espanha", "França", "Alemanha", "Itália", "Marrocos"].map((c) => {
            const on = countries.includes(c);
            return <button key={c} onClick={() => setCountries(on ? countries.filter((x) => x !== c) : [...countries, c])} className={cn("rounded-full border px-3 py-1 text-xs transition-colors", on ? "border-primary bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground")}>{c}</button>;
          })}
        </div>
      </Card>
      <Card title="Mínimos para entrar no pipeline" desc="Empresas abaixo destes valores são descartadas.">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Nº mínimo de funcionários" value={minEmp} onChange={setMinEmp} />
          <Field label="Faturação mínima (M€)" value={minRev} onChange={setMinRev} />
        </div>
      </Card>
      <Card title="Regras de scoring" desc="O peso de cada fator na pontuação de 0 a 100." action={<span className={cn("num rounded-full px-2.5 py-0.5 text-xs font-medium", total === 100 ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive")}>Total {total}%</span>}>
        <div className="space-y-4">
          {Object.entries(weights).map(([k, v]) => (
            <div key={k}>
              <div className="mb-1 flex justify-between text-sm"><span>{k}</span><span className="num text-muted-foreground">{v}%</span></div>
              <input type="range" min={0} max={60} value={v} onChange={(e) => setWeights({ ...weights, [k]: Number(e.target.value) })} className="w-full accent-[var(--primary)]" />
            </div>
          ))}
        </div>
        {total !== 100 && <p className="mt-3 text-xs text-destructive">Os pesos têm de somar 100% para guardar.</p>}
      </Card>
      <Card title="Contactos">
        <Eyebrow>Cargos a procurar</Eyebrow>
        <div className="mb-4 flex flex-wrap gap-2">{roles.map((r) => <Chip key={r} onRemove={() => setRoles(roles.filter((x) => x !== r))}>{r}</Chip>)}</div>
        <Row label="Não voltar a enriquecer contactos recentes" hint="Poupa créditos em contactos atualizados há menos de 90 dias"><Toggle label="Re-enriquecimento" on={reenrich} onChange={setReenrich} /></Row>
      </Card>
      <Card title="Limites e custos">
        <Row label="Máximo de leads por pesquisa" hint={`≈ ${Math.round(limit * 2.4)} créditos por pesquisa`}>
          <div className="flex items-center gap-3"><input type="range" min={50} max={1000} step={50} value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="w-40 accent-[var(--primary)]" /><span className="num w-12 text-right text-sm">{limit}</span></div>
        </Row>
      </Card>
      <div className="sticky bottom-4 flex justify-end">
        <button disabled={total !== 100} onClick={saved} className="flex items-center gap-1.5 rounded-xl bg-chrome px-5 py-2.5 text-sm font-medium text-chrome-foreground shadow-float hover:bg-chrome-raised disabled:opacity-50"><Check className="size-4" /> Guardar alterações</button>
      </div>
    </>
  );
}

/* ---------- BOMify ---------- */
function BomifySettings() {
  const [mailbox, setMailbox] = useState("pedidos@metalurgica-norte.pt");
  const [auto, setAuto] = useState(true);
  const [conf, setConf] = useState(85);
  const [unitLen, setUnitLen] = useState<"mm" | "in">("mm");
  const [unitW, setUnitW] = useState<"kg" | "lb">("kg");
  const [assign, setAssign] = useState<"round" | "client" | "manual">("client");
  const [formats, setFormats] = useState({ PDF: true, Excel: true, "Desenho digitalizado": true, DWG: false, STEP: false });
  return (
    <>
      <Card title="Receção de pedidos">
        <div className="mb-4"><Field label="Caixa de email monitorizada" value={mailbox} onChange={setMailbox} /></div>
        <Row label="Ler anexos automaticamente" hint="Cada email novo cria um pedido na fila"><Toggle label="Leitura automática" on={auto} onChange={setAuto} /></Row>
        <Row label="Atribuir pedidos a">
          <Segmented value={assign} onChange={setAssign} options={[{ v: "client", l: "Dono do cliente" }, { v: "round", l: "Rotativo" }, { v: "manual", l: "Manual" }]} />
        </Row>
        <div className="mt-4">
          <Eyebrow>Formatos aceites</Eyebrow>
          <div className="flex flex-wrap gap-2">
            {Object.entries(formats).map(([f, on]) => (
              <button key={f} onClick={() => setFormats({ ...formats, [f]: !on })} className={cn("rounded-full border px-3 py-1 text-xs transition-colors", on ? "border-primary bg-accent text-accent-foreground" : "text-muted-foreground")}>{f}{!on && (f === "DWG" || f === "STEP") ? " · em breve" : ""}</button>
            ))}
          </div>
        </div>
      </Card>
      <Card title="Revisão pela IA" desc="Linhas abaixo deste nível de confiança vão para revisão humana.">
        <div className="flex items-center gap-4">
          <input type="range" min={50} max={99} value={conf} onChange={(e) => setConf(Number(e.target.value))} className="flex-1 accent-[var(--primary)]" />
          <span className="num w-14 text-right text-2xl">{conf}%</span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Com este valor, cerca de {Math.round((conf - 45) * 0.6)}% das linhas pedem revisão.</p>
      </Card>
      <Card title="Unidades por defeito" desc="Usadas quando o documento não indica unidade.">
        <Row label="Comprimento"><Segmented value={unitLen} onChange={setUnitLen} options={[{ v: "mm", l: "mm" }, { v: "in", l: "polegadas" }]} /></Row>
        <Row label="Peso"><Segmented value={unitW} onChange={setUnitW} options={[{ v: "kg", l: "kg" }, { v: "lb", l: "lb" }]} /></Row>
      </Card>
      <Card title="Catálogo de peças" action={<button onClick={() => toast("Importar catálogo — disponível em breve")} className="flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-paper"><Upload className="size-3.5" /> Importar</button>}>
        <div className="grid grid-cols-3 gap-3">
          {[["Referências", "18 432"], ["Com preço", "17 905"], ["Sinónimos aprendidos", "1 214"]].map(([l, v]) => (
            <div key={l} className="rounded-xl border bg-paper p-4"><div className="text-xs text-muted-foreground">{l}</div><div className="num mt-1 text-xl">{v}</div></div>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Origem: SAP Business One · atualizado todos os dias às 06:00</p>
      </Card>
      <SaveBar />
    </>
  );
}
