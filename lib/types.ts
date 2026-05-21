export type InscricaoForm = {
  email: string;
  name: string;
  cpf: string;
  dob: string;
  uf: string;
  city: string;
  phone: string;
  publico: "" | "Militar" | "Civil";
  posto: string;
  inst: string;
  area: string;
  cert: "" | "Sim" | "Não";
  acess: "" | "Sim" | "Não";
  acessDesc: string;
  source: string;
  imgUse: "" | "Sim, autorizo" | "Não autorizo";
  lgpd: boolean;
};

export type InscricaoRow = {
  id: string;
  protocolo: string;
  email: string;
  nome: string;
  cpf: string;
  data_nascimento: string;
  uf: string;
  municipio: string;
  telefone: string;
  publico: "Militar" | "Civil";
  posto: string | null;
  instituicao: string;
  area_atuacao: string;
  necessita_certificado: boolean;
  necessita_acessibilidade: boolean;
  acessibilidade_desc: string | null;
  como_soube: string;
  autoriza_imagem: boolean;
  consentimento_lgpd: boolean;
  status: "confirmada" | "cancelada" | "pendente";
  created_at: string;
  updated_at: string;
};

export type SubmitResult =
  | { ok: true; protocolo: string }
  | { ok: false; error: string; field?: "email" | "cpf" | "form" };
