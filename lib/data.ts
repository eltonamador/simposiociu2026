export const UF_LIST: [string, string][] = [
  ["AC", "Acre"], ["AL", "Alagoas"], ["AP", "Amapá"], ["AM", "Amazonas"],
  ["BA", "Bahia"], ["CE", "Ceará"], ["DF", "Distrito Federal"], ["ES", "Espírito Santo"],
  ["GO", "Goiás"], ["MA", "Maranhão"], ["MT", "Mato Grosso"], ["MS", "Mato Grosso do Sul"],
  ["MG", "Minas Gerais"], ["PA", "Pará"], ["PB", "Paraíba"], ["PR", "Paraná"],
  ["PE", "Pernambuco"], ["PI", "Piauí"], ["RJ", "Rio de Janeiro"], ["RN", "Rio Grande do Norte"],
  ["RS", "Rio Grande do Sul"], ["RO", "Rondônia"], ["RR", "Roraima"], ["SC", "Santa Catarina"],
  ["SP", "São Paulo"], ["SE", "Sergipe"], ["TO", "Tocantins"],
];

export const CITIES: Record<string, string[]> = {
  AP: ["Macapá", "Santana", "Laranjal do Jari", "Oiapoque", "Mazagão", "Porto Grande", "Tartarugalzinho", "Pedra Branca do Amapari", "Vitória do Jari", "Calçoene", "Amapá", "Cutias", "Ferreira Gomes", "Itaubal", "Pracuúba", "Serra do Navio"],
  PA: ["Belém", "Ananindeua", "Santarém", "Marabá", "Castanhal", "Parauapebas", "Itaituba", "Cametá", "Bragança"],
  AM: ["Manaus", "Parintins", "Itacoatiara", "Manacapuru", "Coari", "Tefé"],
  RR: ["Boa Vista", "Rorainópolis", "Caracaraí", "Pacaraima"],
  MA: ["São Luís", "Imperatriz", "Caxias", "Codó", "Bacabal"],
  SP: ["São Paulo", "Guarulhos", "Campinas", "São Bernardo do Campo", "Santos", "Ribeirão Preto"],
  RJ: ["Rio de Janeiro", "Niterói", "Duque de Caxias", "Petrópolis", "Volta Redonda"],
  DF: ["Brasília"],
  MG: ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora"],
  CE: ["Fortaleza", "Caucaia", "Sobral", "Juazeiro do Norte"],
};

export const DEFAULT_CITIES = ["Capital", "Outro município"];

export function getCities(uf: string): string[] {
  return CITIES[uf] || DEFAULT_CITIES;
}

export const AREAS = [
  "Bombeiro Militar",
  "Defesa Civil",
  "Brigadista",
  "Segurança do Trabalho",
  "Engenharia e afins",
  "Saúde/APH",
  "Acadêmico",
  "Profissional da iniciativa privada",
  "Outro",
] as const;

export const SOURCES = [
  "Instagram",
  "WhatsApp",
  "Site institucional",
  "Indicação",
  "Corporação/Instituição",
  "Outro",
] as const;

export const POSTOS = [
  "Soldado", "Cabo", "3º Sargento", "2º Sargento", "1º Sargento", "Subtenente",
  "Aspirante a Oficial", "2º Tenente", "1º Tenente", "Capitão", "Major",
  "Tenente-Coronel", "Coronel",
] as const;

export const EVENT = {
  title: "I Simpósio Estadual de Combate a Incêndio Urbano",
  date: "24, 25 e 26 de junho de 2026",
  isoStart: "2026-06-24T08:00:00-03:00",
  venue: "Anfiteatro da UNIFAP",
  city: "Macapá / AP",
  lema: "Vidas Alheias e Riquezas Salvar",
  org: "Corpo de Bombeiros Militar do Amapá — CBMAP",
};

export type Speaker = {
  name: string; corp: string; role: string; topic: string; day: number; featured?: boolean;
};

export const SPEAKERS: Speaker[] = [
  { name: "Ten Cel Leal", corp: "CBMSC",
    role: "Comandante do 15º BBM (Rio do Sul/SC) · Presidente do Comitê Nacional de Combate a Incêndio da LIGABOM · Instrutor de Combate a Incêndio (desde 2012) · Perito em Incêndios e Explosões",
    topic: "Combate a Incêndio em Veículos Elétricos", day: 1, featured: true },
  { name: "Cel Jhon", corp: "CBMDF",
    role: "Oficial Superior · Corpo de Bombeiros Militar do Distrito Federal",
    topic: "Combate a Incêndio Envolvendo Painéis Solares", day: 1 },
  { name: "Maj Falcão", corp: "CBMMG",
    role: "Oficial Superior · Corpo de Bombeiros Militar de Minas Gerais",
    topic: "O perfil de ocorrências de incêndio em edificações pelo CBMMG", day: 1 },
  { name: "TC Lívia", corp: "CBMAP",
    role: "Oficial Superior · Corpo de Bombeiros Militar do Amapá",
    topic: "A importância da Área de Recuperação de Bombeiros nas operações", day: 1 },
  { name: "Cap Schuelter", corp: "CBMSC",
    role: "Oficial · Corpo de Bombeiros Militar de Santa Catarina",
    topic: "Ventilação Tática", day: 2 },
  { name: "Sgt De Lima", corp: "CBMSC",
    role: "Graduado · Corpo de Bombeiros Militar de Santa Catarina",
    topic: "Utilização da Auto Escada Mecânica no incêndio — relatos do CBMSC", day: 2 },
  { name: "ST Pasini", corp: "CBMAP",
    role: "Subtenente · Corpo de Bombeiros Militar do Amapá",
    topic: "Equipe de Resgate Bombeiro (ERB) — princípios, importância e contexto no Brasil", day: 2 },
  { name: "Maj Chucre", corp: "CBMAP",
    role: "Oficial Superior · Corpo de Bombeiros Militar do Amapá",
    topic: "Uso da espuma no combate a incêndio urbano", day: 3 },
];

export type ScheduleRow = {
  day: number; time: string; title: string; desc: string; who: string;
  tag: string; headline?: boolean;
};

export const SCHEDULE: ScheduleRow[] = [
  { day: 1, time: "08h00 – 09h00", title: "Credenciamento", desc: "Entrega do crachá, kit de participação e registro de presença por QRCode. Apresentação cultural com Banda de Música.", who: "Banda de Música · CBMAP", tag: "Abertura" },
  { day: 1, time: "09h00 – 10h00", title: "Cerimônia de abertura", desc: "Solenidade formal de abertura do simpósio com formalidade militar habitual.", who: "CECOMS", tag: "Cerimônia" },
  { day: 1, time: "10h00 – 10h30", title: "Intervalo · Coffee break", desc: "Apresentação cultural, networking com patrocinadores e parceiros. Estande temático de Energia Solar (07h30 – 12h30).", who: "Patrocinadores", tag: "Intervalo" },
  { day: 1, time: "10h30 – 11h45", title: "Combate a incêndio envolvendo painéis solares", desc: "Painel temático abordando técnicas e cuidados específicos em incêndios com sistemas fotovoltaicos.", who: "Cel Jhon · CBMDF", tag: "Palestra", headline: true },
  { day: 1, time: "12h00 – 14h00", title: "Almoço (por conta do participante)", desc: "O almoço não está incluso nas despesas do evento.", who: "Não se aplica", tag: "Refeição" },
  { day: 1, time: "14h00 – 15h00", title: "Perfil de ocorrências de incêndio em edificações pelo CBMMG", desc: "Análise estatística e operacional das ocorrências de incêndio urbano em Minas Gerais.", who: "Maj Falcão · CBMMG", tag: "Palestra", headline: true },
  { day: 1, time: "15h10 – 16h10", title: "A importância da Área de Recuperação de Bombeiros", desc: "ARB nas operações de incêndio — função, dimensionamento e procedimentos.", who: "TC Lívia · CBMAP", tag: "Palestra", headline: true },
  { day: 1, time: "16h10 – 16h30", title: "Intervalo · Coffee break", desc: "Networking com patrocinadores e parceiros.", who: "Patrocinadores", tag: "Intervalo" },
  { day: 1, time: "16h30 – 17h30", title: "Combate a incêndio em veículos elétricos", desc: "Os desafios das ocorrências envolvendo veículos elétricos — fundamentos, riscos e técnicas atuais.", who: "Ten Cel Leal · CBMSC", tag: "Palestra", headline: true },
  { day: 2, time: "08h00 – 09h00", title: "Ventilação tática", desc: "Conceitos, indicações e aplicação prática da ventilação tática em incêndios estruturais.", who: "Cap Schuelter · CBMSC", tag: "Palestra", headline: true },
  { day: 2, time: "09h00 – 09h30", title: "Intervalo · Coffee break", desc: "Networking com patrocinadores e parceiros.", who: "Patrocinadores", tag: "Intervalo" },
  { day: 2, time: "09h30 – 10h30", title: "Auto Escada Mecânica em incêndio", desc: "Relatos de experiência do CBMSC com Auto Escada Mecânica em ocorrências de incêndio.", who: "Sgt De Lima · CBMSC", tag: "Palestra", headline: true },
  { day: 2, time: "10h45 – 11h45", title: "Painel tecnológico — demonstrações", desc: "Demonstração de tecnologias e equipamentos por empresas convidadas.", who: "Empresa convidada", tag: "Demo" },
  { day: 2, time: "11h45 – 14h00", title: "Almoço (por conta do participante)", desc: "O almoço não está incluso nas despesas do evento.", who: "Não se aplica", tag: "Refeição" },
  { day: 2, time: "14h00 – 16h00", title: "Painel tecnológico — demonstrações", desc: "Continuação das demonstrações de tecnologia e equipamentos pelos parceiros.", who: "Empresa convidada", tag: "Demo" },
  { day: 2, time: "16h00 – 16h30", title: "Intervalo · Coffee break", desc: "Networking com patrocinadores e parceiros.", who: "Patrocinadores", tag: "Intervalo" },
  { day: 2, time: "16h30 – 18h00", title: "Equipe de Resgate Bombeiro (ERB)", desc: "Demonstração em pátio aberto — princípios, importância e contexto no Brasil.", who: "ST Pasini · CBMAP", tag: "Palestra", headline: true },
  { day: 3, time: "08h00 – 09h00", title: "Uso da espuma no combate a incêndio urbano", desc: "Tipos de espuma, aplicação operacional e estudos de caso.", who: "Maj Chucre · CBMAP", tag: "Palestra", headline: true },
  { day: 3, time: "09h00 – 09h30", title: "Intervalo · Coffee break", desc: "Networking com patrocinadores e parceiros.", who: "Patrocinadores", tag: "Intervalo" },
  { day: 3, time: "09h30 – 10h30", title: "Mesa redonda — Atuação do CBMAP", desc: "Análise da atuação do CBMAP nas operações de combate a incêndio urbano — o que evoluímos e o que podemos melhorar?", who: "Especialistas convidados", tag: "Painel", headline: true },
  { day: 3, time: "10h30 – 11h30", title: "Cerimônia de encerramento", desc: "Solenidade formal de encerramento do I Simpósio.", who: "CECOMS", tag: "Cerimônia" },
];

export const FAQ_ITEMS = [
  { q: "A inscrição é gratuita?", a: "Sim. O simpósio é uma iniciativa institucional do CBMAP com inscrição gratuita, condicionada à disponibilidade de vagas e ao preenchimento correto do formulário oficial." },
  { q: "Quem pode participar?", a: "Bombeiros militares e civis, profissionais da defesa civil, brigadistas, equipes de segurança do trabalho, engenharia e afins, profissionais de saúde/APH, acadêmicos e profissionais da iniciativa privada com atuação correlata à área de combate a incêndio." },
  { q: "Como é feita a confirmação da inscrição?", a: "Após enviar o formulário, você receberá um número de protocolo na tela de sucesso. Mantenha o protocolo guardado — ele agiliza o credenciamento presencial." },
  { q: "Haverá emissão de certificado?", a: "Sim. A emissão de certificado é condicionada à participação presencial integral e ao registro de presença diário por QR Code no local do evento." },
  { q: "O almoço e o transporte estão inclusos?", a: "Não. Almoço e transporte são por conta do participante. O evento oferece coffee breaks nos intervalos com apoio dos patrocinadores e parceiros." },
  { q: "Há previsão de transmissão online?", a: "O simpósio é presencial. Eventuais conteúdos selecionados poderão ser publicados posteriormente nos canais oficiais do CBMAP." },
  { q: "Posso transferir minha inscrição para outra pessoa?", a: "Não. Cada inscrição é nominal e vinculada ao CPF do participante. Em caso de impedimento, comunique a organização para liberar a vaga." },
];
