import { redirect } from "next/navigation";
import { getSupabaseAdminClient, getSupabaseServerClient } from "@/lib/supabase/server";
import { maskCpf } from "@/lib/validation";
import { AREAS } from "@/lib/data";
import type { InscricaoRow } from "@/lib/types";
import AdminDashboard from "./dashboard";

export const dynamic = "force-dynamic";

export default async function AdminInscricoesPage() {
  const ssr = getSupabaseServerClient();
  const { data: { user } } = await ssr.auth.getUser();
  if (!user) redirect("/admin/login");

  let rows: InscricaoRow[] = [];
  let dbError = "";
  try {
    const admin = getSupabaseAdminClient();
    const { data, error } = await admin
      .from("inscricoes")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(2000);
    if (error) dbError = "Não foi possível carregar as inscrições.";
    else rows = (data || []) as InscricaoRow[];
  } catch {
    dbError = "Servidor não configurado corretamente.";
  }

  const safeRows = rows.map(r => ({
    id: r.id,
    protocolo: r.protocolo,
    nome: r.nome,
    email: r.email,
    cpfMasked: maskCpf(r.cpf),
    telefone: r.telefone,
    instituicao: r.instituicao,
    area_atuacao: r.area_atuacao,
    publico: r.publico,
    uf: r.uf,
    municipio: r.municipio,
    necessita_certificado: r.necessita_certificado,
    necessita_acessibilidade: r.necessita_acessibilidade,
    created_at: r.created_at,
  }));

  return (
    <AdminDashboard
      rows={safeRows}
      areas={AREAS as unknown as string[]}
      dbError={dbError}
      userEmail={user.email ?? ""}
    />
  );
}
