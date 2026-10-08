import features from "@/data/features.json";

export interface Feature { id: string; n: string; g: string; s: string; a: string }
export type Tone = "good" | "bad" | "warn" | "info" | "muted";
export interface ModuleDef {
  id: string;
  name: string;
  short: string;
  group: "Comercial" | "Operações" | "Conhecimento" | "Pessoas" | "Aprendizagem" | "Voz";
  tagline: string;
  featureKey: string;
  kpis: { label: string; value: string; sub?: string; tone?: Tone }[];
  list: { title: string; cols: [string, string, string]; rows: { id: string; title: string; sub: string; c2: string; c3: string; tone: Tone }[] };
  primary: string;
  secondary: string[];
  chat?: { placeholder: string; q: string; a: string; sources?: string[] };
}

/* Modules with bespoke workspaces (LeadFlow, BOMify) are defined here too, for catalogue + features. */
export const MODULE_DEFS: ModuleDef[] = [
  {
    id: "leadflow", name: "LeadFlow", short: "LF", group: "Comercial", featureKey: "LeadFlow",
    tagline: "Agentes que descobrem, qualificam e pontuam empresas B2B.",
    kpis: [], list: { title: "", cols: ["", "", ""], rows: [] }, primary: "Gerar leads", secondary: [],
  },
  {
    id: "quotegenius", name: "QuoteGenius", short: "QG", group: "Comercial", featureKey: "QuoteGenius",
    tagline: "Transforma um pedido ou uma BOM numa proposta custeada e aprovada.",
    kpis: [
      { label: "Propostas · set", value: "38", sub: "+9 vs agosto", tone: "good" },
      { label: "Valor em aberto", value: "412 k€" },
      { label: "Margem média", value: "21,4%", sub: "alvo 22%", tone: "warn" },
      { label: "A aguardar aprovação", value: "5", tone: "bad", sub: "2 acima de 50 k€" },
    ],
    list: {
      title: "Propostas", cols: ["Valor", "Margem", "Estado"],
      rows: [
        { id: "QT-2291", title: "Ferrosteel Ibérica S.A.", sub: "a partir de ORD2026/0412", c2: "48 320 €", c3: "Aprovação", tone: "warn" },
        { id: "QT-2290", title: "Mecânica do Tejo Lda.", sub: "9 linhas", c2: "6 140 €", c3: "Enviada", tone: "info" },
        { id: "QT-2289", title: "Indústrias Carvalho & Filhos", sub: "37 linhas", c2: "92 800 €", c3: "Aprovação", tone: "warn" },
        { id: "QT-2288", title: "Serviço Metal Norte S.A.", sub: "15 linhas", c2: "18 450 €", c3: "Ganha", tone: "good" },
        { id: "QT-2287", title: "Fábrica de Peças Alentejo", sub: "6 linhas", c2: "3 210 €", c3: "Perdida", tone: "bad" },
      ],
    },
    primary: "Gerar proposta", secondary: ["Comparar fornecedores", "Pedir aprovação"],
  },
  {
    id: "conversai", name: "ConversAI", short: "CA", group: "Comercial", featureKey: "ConversAI",
    tagline: "Transforma emails recebidos em registos de CRM e documentos arquivados.",
    kpis: [
      { label: "Emails hoje", value: "214" },
      { label: "Registados automaticamente", value: "86%", tone: "good" },
      { label: "Para decidir", value: "11", tone: "warn", sub: "correspondência ambígua" },
      { label: "Tempo poupado · semana", value: "17 h" },
    ],
    list: {
      title: "Fila de intakes", cols: ["Correspondência", "Confiança", "Estado"],
      rows: [
        { id: "IN-8812", title: "Pedido de cotação — chapa 3mm", sub: "compras@ferrosteel.es", c2: "Ferrosteel Ibérica", c3: "Decidir", tone: "warn" },
        { id: "IN-8811", title: "Fatura 2026/0931", sub: "faturacao@tejo.pt", c2: "Mecânica do Tejo", c3: "Registado", tone: "good" },
        { id: "IN-8810", title: "Re: prazo de entrega", sub: "joao.pires@lusoforja.pt", c2: "2 contactos possíveis", c3: "Decidir", tone: "warn" },
        { id: "IN-8809", title: "Certificado de material 3.1", sub: "qualidade@acosvouga.pt", c2: "Aços do Vouga", c3: "Arquivado", tone: "good" },
        { id: "IN-8808", title: "Newsletter setembro", sub: "news@feira-metal.pt", c2: "—", c3: "Ignorado", tone: "muted" },
      ],
    },
    primary: "Processar caixa", secondary: ["Decidir próximo", "Criar regra"],
  },
  {
    id: "bomify", name: "BOMify", short: "BM", group: "Operações", featureKey: "BOMify",
    tagline: "Documentos e desenhos técnicos convertidos em listas de materiais prontas a comprar.",
    kpis: [], list: { title: "", cols: ["", "", ""], rows: [] }, primary: "Processar pedido", secondary: [],
  },
  {
    id: "conforma", name: "Conforma", short: "CF", group: "Operações", featureKey: "Conforma",
    tagline: "Regista cada não-conformidade onde é encontrada e leva-a até ao fecho validado.",
    kpis: [
      { label: "NC abertas", value: "23", tone: "warn" },
      { label: "Fechadas · set", value: "41", tone: "good" },
      { label: "Tempo médio de fecho", value: "4,2 d" },
      { label: "Sem prova", value: "3", tone: "bad", sub: "fecho bloqueado" },
    ],
    list: {
      title: "Não-conformidades", cols: ["Local", "Gravidade", "Estado"],
      rows: [
        { id: "NC-0417", title: "Soldadura com porosidade", sub: "Registada offline · foto", c2: "Obra Leiria · piso 2", c3: "Alta", tone: "bad" },
        { id: "NC-0416", title: "Cota fora de tolerância", sub: "Peça P-2210", c2: "Linha de corte 3", c3: "Média", tone: "warn" },
        { id: "NC-0415", title: "Pintura com escorridos", sub: "Lote 88", c2: "Cabine 1", c3: "Baixa", tone: "info" },
        { id: "NC-0414", title: "Parafusos classe errada", sub: "Fornecedor externo", c2: "Receção", c3: "Fechada", tone: "good" },
      ],
    },
    primary: "Registar NC", secondary: ["Validar fecho", "Atribuir"],
  },
  {
    id: "documiner", name: "DocuMiner AI", short: "DM", group: "Conhecimento", featureKey: "DocuMiner AI",
    tagline: "Documentos classificados e convertidos em dados, com respostas que citam fontes.",
    kpis: [
      { label: "Documentos indexados", value: "18 402" },
      { label: "Extraídos · semana", value: "1 126", tone: "good" },
      { label: "Confiança média", value: "93%" },
      { label: "Para rever", value: "37", tone: "warn", sub: "campos abaixo de 70%" },
    ],
    list: {
      title: "Biblioteca", cols: ["Tipo", "Confiança", "Estado"],
      rows: [
        { id: "DOC-9921", title: "Contrato_fornecimento_2026.pdf", sub: "SharePoint · Jurídico", c2: "Contrato", c3: "98%", tone: "good" },
        { id: "DOC-9920", title: "Proposta_Lusoforja_v3.pdf", sub: "Upload", c2: "Proposta", c3: "71%", tone: "warn" },
        { id: "DOC-9919", title: "EN-1090-2_extract.pdf", sub: "Normas", c2: "Norma", c3: "96%", tone: "good" },
        { id: "DOC-9918", title: "Digitalização_0042.tif", sub: "Scanner", c2: "Desconhecido", c3: "Erro OCR", tone: "bad" },
        { id: "DOC-9917", title: "Caderno_encargos_obra22.docx", sub: "SharePoint · Obras", c2: "Especificação", c3: "94%", tone: "good" },
      ],
    },
    primary: "Extrair dados", secondary: ["Verificar conjunto", "Tabular propostas"],
    chat: { placeholder: "Pergunte sobre os seus documentos…", q: "Que propostas cumprem a EN 1090-2 classe EXC3?", a: "Duas das cinco propostas declaram EXC3: Lusoforja (v3, p. 12) e Estruturas Mondego (p. 4). A Lusoforja não anexa o certificado de controlo de produção.", sources: ["Proposta_Lusoforja_v3.pdf · p.12", "Proposta_Mondego.pdf · p.4", "EN-1090-2_extract.pdf"] },
  },
  {
    id: "vera", name: "Vera", short: "VE", group: "Conhecimento", featureKey: "Vera",
    tagline: "Perguntas de negócio em linguagem natural sobre os dados da empresa.",
    kpis: [
      { label: "Perguntas · semana", value: "342" },
      { label: "Respostas verificadas", value: "91%", tone: "good" },
      { label: "Fontes ligadas", value: "6", sub: "SAP, CRM, Excel…" },
      { label: "Sem resposta", value: "14", tone: "warn" },
    ],
    list: {
      title: "Dashboards guardados", cols: ["Fonte", "Atualizado", "Dono"],
      rows: [
        { id: "VD-12", title: "Vendas por região", sub: "Semanal", c2: "SAP", c3: "Ana R.", tone: "info" },
        { id: "VD-11", title: "Margem por família", sub: "Mensal", c2: "SAP + Excel", c3: "Rui C.", tone: "info" },
        { id: "VD-10", title: "Atrasos de entrega", sub: "Diário", c2: "ERP", c3: "Marta S.", tone: "warn" },
      ],
    },
    primary: "Nova pergunta", secondary: ["Guardar como dashboard", "Agendar relatório"],
    chat: { placeholder: "Pergunte algo sobre os seus dados…", q: "Quais os 3 clientes com maior crescimento este trimestre?", a: "Ferrosteel Ibérica (+38%), Indústrias Carvalho (+24%) e Mecânica do Tejo (+19%). O crescimento da Ferrosteel vem quase todo de chapa S235.", sources: ["SAP · faturação Q3", "SQL gerado · ver consulta"] },
  },
  {
    id: "riskradar", name: "RiskRadar", short: "RR", group: "Pessoas", featureKey: "RiskRadar",
    tagline: "Alerta precoce com regras explicáveis; as decisões ficam com as pessoas.",
    kpis: [
      { label: "Pessoas monitorizadas", value: "1 284" },
      { label: "Risco alto", value: "42", tone: "bad", sub: "+6 esta semana" },
      { label: "Intervenções abertas", value: "19", tone: "warn" },
      { label: "Resolvidas · mês", value: "27", tone: "good" },
    ],
    list: {
      title: "Perfis em risco", cols: ["Sinal principal", "Score", "Nível"],
      rows: [
        { id: "P-3021", title: "Aluno #3021", sub: "Eng. Mecânica · 2º ano", c2: "Faltas +40%", c3: "Alto", tone: "bad" },
        { id: "P-2877", title: "Aluno #2877", sub: "Gestão · 1º ano", c2: "Notas em queda", c3: "Alto", tone: "bad" },
        { id: "P-2650", title: "Aluno #2650", sub: "Informática · 3º ano", c2: "Sem acesso LMS 14 d", c3: "Médio", tone: "warn" },
        { id: "P-2411", title: "Aluno #2411", sub: "Design · 1º ano", c2: "Propina em atraso", c3: "Médio", tone: "warn" },
      ],
    },
    primary: "Recalcular risco", secondary: ["Criar intervenção", "Rever regras"],
  },
  {
    id: "talentalert", name: "TalentAlert", short: "TA", group: "Pessoas", featureKey: "TalentAlert",
    tagline: "Inteligência de talento contínua com decisões explicáveis.",
    kpis: [
      { label: "Jogadores seguidos", value: "3 912" },
      { label: "Alertas novos", value: "17", tone: "good" },
      { label: "Shortlists ativas", value: "4" },
      { label: "Dossiers gerados · mês", value: "22" },
    ],
    list: {
      title: "Feed de talento", cols: ["Posição", "Potencial", "Sinal"],
      rows: [
        { id: "TL-0881", title: "M. Ferreira · 19", sub: "Liga 3 · SC Lusitânia", c2: "Médio centro", c3: "A subir", tone: "good" },
        { id: "TL-0880", title: "D. Almeida · 21", sub: "Liga 2 · CD Norte", c2: "Lateral esq.", c3: "Estável", tone: "info" },
        { id: "TL-0879", title: "R. Tavares · 18", sub: "Sub-19 · FC Vale", c2: "Avançado", c3: "A subir", tone: "good" },
        { id: "TL-0878", title: "J. Santos · 24", sub: "Liga 2 · UD Sul", c2: "Defesa central", c3: "Lesão", tone: "bad" },
      ],
    },
    primary: "Talent.Search", secondary: ["Gerar dossier", "Adicionar à shortlist"],
  },
  {
    id: "levelup", name: "LevelUP", short: "LU", group: "Pessoas", featureKey: "LevelUP",
    tagline: "Perfil de competências que cresce só com conquistas validadas.",
    kpis: [
      { label: "Perfis", value: "212" },
      { label: "Conquistas a validar", value: "31", tone: "warn" },
      { label: "Prontos para promoção", value: "8", tone: "good" },
      { label: "Lacunas críticas", value: "5", tone: "bad" },
    ],
    list: {
      title: "Conquistas a validar", cols: ["Competência", "Evidência", "Estado"],
      rows: [
        { id: "AC-551", title: "Inês Lopes", sub: "Soldadora", c2: "TIG em inox", c3: "Pendente", tone: "warn" },
        { id: "AC-550", title: "Tiago Faria", sub: "Programador CNC", c2: "Fanuc avançado", c3: "Pendente", tone: "warn" },
        { id: "AC-549", title: "Sofia Neves", sub: "Chefe de turno", c2: "Liderança nível 2", c3: "Validada", tone: "good" },
      ],
    },
    primary: "Validar conquista", secondary: ["Comparar com função", "Plano de desenvolvimento"],
  },
  {
    id: "ailms", name: "AI LMS", short: "LM", group: "Aprendizagem", featureKey: "AI LMS",
    tagline: "Manuais e procedimentos transformados em cursos revistos e publicados no Moodle.",
    kpis: [
      { label: "Cursos publicados", value: "27" },
      { label: "Em revisão", value: "4", tone: "warn" },
      { label: "Certificados emitidos", value: "1 106", tone: "good" },
      { label: "Taxa de aprovação", value: "84%" },
    ],
    list: {
      title: "Cursos", cols: ["Origem", "Módulos", "Estado"],
      rows: [
        { id: "CRS-31", title: "Segurança em trabalho a quente", sub: "Manual HSE v4", c2: "6", c3: "Em revisão", tone: "warn" },
        { id: "CRS-30", title: "Onboarding produção", sub: "12 procedimentos", c2: "9", c3: "Publicado", tone: "good" },
        { id: "CRS-29", title: "RGPD para comerciais", sub: "Política interna", c2: "3", c3: "A gerar 72%", tone: "info" },
        { id: "CRS-28", title: "Leitura de desenho técnico", sub: "Formação externa", c2: "5", c3: "Publicado", tone: "good" },
      ],
    },
    primary: "Gerar curso", secondary: ["Gerar exame", "Publicar no Moodle"],
  },
  {
    id: "its", name: "ITS", short: "IT", group: "Aprendizagem", featureKey: "ITS",
    tagline: "Tutor socrático 24/7 que guia com perguntas e pistas.",
    kpis: [
      { label: "Sessões · semana", value: "1 893" },
      { label: "Alunos ativos", value: "642", tone: "good" },
      { label: "Duração média", value: "14 min" },
      { label: "Pedidos de ajuda humana", value: "9", tone: "warn" },
    ],
    list: {
      title: "Sessões recentes", cols: ["Curso", "Duração", "Resultado"],
      rows: [
        { id: "S-7712", title: "Aluno #1180", sub: "há 12 min", c2: "Resistência de materiais", c3: "Compreendeu", tone: "good" },
        { id: "S-7711", title: "Aluno #0942", sub: "há 31 min", c2: "Termodinâmica", c3: "Pediu humano", tone: "warn" },
        { id: "S-7710", title: "Aluno #1007", sub: "há 1 h", c2: "Cálculo II", c3: "Compreendeu", tone: "good" },
      ],
    },
    primary: "Abrir tutor", secondary: ["Rever material", "Ver uso"],
    chat: { placeholder: "Escreva a sua dúvida…", q: "Não percebo porque é que a viga deforma mais no meio.", a: "Boa pergunta. Pense no momento fletor: onde é que ele é máximo numa viga simplesmente apoiada com carga distribuída? O que acontece à curvatura nesse ponto?", sources: ["Cap. 4 · Flexão simples"] },
  },
  {
    id: "studyflow", name: "StudyFlow", short: "SF", group: "Aprendizagem", featureKey: "StudyFlow",
    tagline: "Blocos de estudo reutilizáveis colocados na semana real de cada aluno.",
    kpis: [
      { label: "Blocos ativos", value: "146" },
      { label: "Alunos com agenda", value: "512", tone: "good" },
      { label: "Cumprimento", value: "71%", tone: "warn" },
      { label: "Conflitos de agenda", value: "12", tone: "bad" },
    ],
    list: {
      title: "Blocos de estudo", cols: ["Turma", "Duração", "Estado"],
      rows: [
        { id: "BL-208", title: "Revisão para exame · Cálculo", sub: "Prof. Marta Sousa", c2: "2º A", c3: "Ativo", tone: "good" },
        { id: "BL-207", title: "Leitura guiada · cap. 5", sub: "Prof. Rui Costa", c2: "1º B", c3: "Rascunho", tone: "muted" },
        { id: "BL-206", title: "Projeto em grupo", sub: "Prof. Ana Ribeiro", c2: "3º A", c3: "Conflitos", tone: "bad" },
      ],
    },
    primary: "Desenhar bloco", secondary: ["Recolocar agendas", "Ver turma"],
  },
  {
    id: "voicisai", name: "Voicis AI", short: "VA", group: "Voz", featureKey: "Voicis AI",
    tagline: "Agente de voz que atende chamadas 24/7 e passa a humano quando é preciso.",
    kpis: [
      { label: "Chamadas hoje", value: "318" },
      { label: "Resolvidas sem humano", value: "78%", tone: "good" },
      { label: "Transferidas", value: "41" },
      { label: "Chamadas perdidas", value: "2", tone: "bad" },
    ],
    list: {
      title: "Chamadas", cols: ["Intenção", "Duração", "Resultado"],
      rows: [
        { id: "CL-4402", title: "+351 912 *** 118", sub: "há 3 min", c2: "Estado de encomenda", c3: "Resolvida", tone: "good" },
        { id: "CL-4401", title: "+351 244 *** 902", sub: "há 9 min", c2: "Reclamação", c3: "Transferida", tone: "warn" },
        { id: "CL-4400", title: "+34 600 *** 551", sub: "há 14 min", c2: "Pedido de cotação", c3: "Registada", tone: "good" },
        { id: "CL-4399", title: "+351 961 *** 007", sub: "há 22 min", c2: "—", c3: "Perdida", tone: "bad" },
      ],
    },
    primary: "Testar agente", secondary: ["Editar guião", "Ouvir gravações"],
    chat: { placeholder: "Simule o que o cliente diz…", q: "Olá, queria saber quando chega a minha encomenda 0412.", a: "Olá! A encomenda ORD2026/0412 da Ferrosteel foi confirmada ontem e tem entrega prevista para sexta-feira, 11. Quer que lhe envie o número de seguimento por SMS?" },
  },
  {
    id: "voiciscore", name: "Voicis Core", short: "VC", group: "Voz", featureKey: "Voicis Core",
    tagline: "Central telefónica IP em software, gerida por consola web ou API.",
    kpis: [
      { label: "Extensões", value: "148" },
      { label: "Troncos ativos", value: "4/4", tone: "good" },
      { label: "Chamadas simultâneas", value: "23" },
      { label: "Alertas de qualidade", value: "1", tone: "warn", sub: "jitter tronco 2" },
    ],
    list: {
      title: "Fluxos de chamada", cols: ["Número", "Passos", "Estado"],
      rows: [
        { id: "FL-12", title: "Receção geral", sub: "Horário 9h–18h", c2: "244 000 100", c3: "Ativo", tone: "good" },
        { id: "FL-11", title: "Apoio técnico", sub: "Fila + agente Voicis AI", c2: "244 000 200", c3: "Ativo", tone: "good" },
        { id: "FL-10", title: "Fora de horas", sub: "Correio de voz", c2: "—", c3: "Rascunho", tone: "muted" },
      ],
    },
    primary: "Novo fluxo", secondary: ["Adicionar extensão", "Ver troncos"],
  },
];

export const FEATURES = features as Record<string, Feature[]>;
export const getDef = (id: string) => MODULE_DEFS.find((m) => m.id === id);
export const GROUPS = ["Comercial", "Operações", "Conhecimento", "Pessoas", "Aprendizagem", "Voz"] as const;
