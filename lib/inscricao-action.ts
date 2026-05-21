"use server";

import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { Validate, cpfDigits, dateBrToIso } from "@/lib/validation";
import type { InscricaoForm, SubmitResult } from "@/lib/types";

function genProtocolo(): string {
  const a = Math.floor(Math.random() * 900) + 100;
  const b = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
  return `2026.${a}.${b}`;
}

function validateAll(form: InscricaoForm): string | null {
  if (Validate.required(form.email) || Validate.email(form.email)) return "E-mail inválido.";
  if (Validate.required(form.name)) return "Nome obrigatório.";
  if (Validate.cpf(form.cpf)) return "CPF inválido.";
  if (Validate.date(form.dob)) return "Data de nascimento inválida.";
  if (!form.uf || !form.city) return "Selecione estado e município.";
  if (Validate.phone(form.phone)) return "Telefone inválido.";
  if (!["Militar", "Civil"].includes(form.publico)) return "Selecione o público.";
  if (!form.inst || !form.area) return "Preencha instituição e área de atuação.";
  if (!["Sim", "Não"].includes(form.cert)) return "Informe se necessita de certificado.";
  if (!["Sim", "Não"].includes(form.acess)) return "Informe se possui necessidade especial.";
  if (!form.source) return "Informe como soube do evento.";
  if (!["Sim, autorizo", "Não autorizo"].includes(form.imgUse)) return "Informe a autorização de imagem.";
  if (!form.lgpd) return "É necessário aceitar o consentimento LGPD.";
  return null;
}

export async function submitInscricao(form: InscricaoForm): Promise<SubmitResult> {
  const validationError = validateAll(form);
  if (validationError) return { ok: false, error: validationError, field: "form" };

  let supabase;
  try {
    supabase = getSupabaseAdminClient();
  } catch {
    return { ok: false, error: "Servidor não configurado. Tente novamente mais tarde.", field: "form" };
  }

  const cpf = cpfDigits(form.cpf);
  const emailNormalized = form.email.trim().toLowerCase();

  // Checagem amigável de duplicados antes do insert (mensagens específicas).
  const { data: dup } = await supabase
    .from("inscricoes")
    .select("id, cpf, email")
    .or(`cpf.eq.${cpf},email.eq.${emailNormalized}`)
    .limit(2);

  if (dup && dup.length > 0) {
    if (dup.some(r => r.cpf === cpf))
      return { ok: false, error: "CPF já cadastrado neste evento.", field: "cpf" };
    if (dup.some(r => r.email?.toLowerCase() === emailNormalized))
      return { ok: false, error: "Este e-mail já possui inscrição registrada.", field: "email" };
  }

  let protocolo = genProtocolo();
  // Em caso (raríssimo) de colisão, regenerar até 3 vezes.
  for (let attempt = 0; attempt < 3; attempt++) {
    const { error } = await supabase.from("inscricoes").insert({
      protocolo,
      email: emailNormalized,
      nome: form.name.trim(),
      cpf,
      data_nascimento: dateBrToIso(form.dob),
      uf: form.uf,
      municipio: form.city,
      telefone: form.phone,
      publico: form.publico,
      posto: form.publico === "Militar" ? form.posto || null : null,
      instituicao: form.inst.trim(),
      area_atuacao: form.area,
      necessita_certificado: form.cert === "Sim",
      necessita_acessibilidade: form.acess === "Sim",
      acessibilidade_desc: form.acess === "Sim" ? (form.acessDesc || null) : null,
      como_soube: form.source,
      autoriza_imagem: form.imgUse === "Sim, autorizo",
      consentimento_lgpd: form.lgpd,
      status: "confirmada",
    });

    if (!error) return { ok: true, protocolo };

    // Tratamento de violação de unique constraint
    const code = (error as { code?: string }).code;
    if (code === "23505") {
      const msg = (error.message || "").toLowerCase();
      if (msg.includes("cpf"))
        return { ok: false, error: "CPF já cadastrado neste evento.", field: "cpf" };
      if (msg.includes("email"))
        return { ok: false, error: "Este e-mail já possui inscrição registrada.", field: "email" };
      if (msg.includes("protocolo")) {
        protocolo = genProtocolo();
        continue;
      }
    }
    return { ok: false, error: "Falha ao registrar inscrição. Tente novamente.", field: "form" };
  }

  return { ok: false, error: "Não foi possível gerar protocolo único. Tente novamente.", field: "form" };
}
