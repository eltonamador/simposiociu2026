import { NextResponse } from "next/server";
import { getSupabaseAdminClient, getSupabaseServerClient } from "@/lib/supabase/server";
import type { InscricaoRow } from "@/lib/types";

export const dynamic = "force-dynamic";

const HEADERS = [
  "protocolo", "created_at", "updated_at", "status",
  "nome", "email", "cpf", "data_nascimento", "uf", "municipio", "telefone",
  "publico", "posto", "instituicao", "area_atuacao",
  "necessita_certificado", "necessita_acessibilidade", "acessibilidade_desc",
  "como_soube", "autoriza_imagem", "consentimento_lgpd",
] as const;

function csvEscape(v: unknown): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (/[",\r\n;]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET(request: Request) {
  // Auth: Supabase session OU header X-Admin-Token (para scripts).
  const ssr = getSupabaseServerClient();
  const { data: { user } } = await ssr.auth.getUser();

  if (!user) {
    const headerToken = request.headers.get("x-admin-token");
    if (!process.env.ADMIN_TOKEN || headerToken !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("inscricoes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "fetch_failed" }, { status: 500 });
  }

  const rows = (data || []) as InscricaoRow[];
  const lines: string[] = [HEADERS.join(",")];
  for (const r of rows) {
    lines.push(HEADERS.map(h => csvEscape((r as unknown as Record<string, unknown>)[h])).join(","));
  }

  const today = new Date().toISOString().slice(0, 10);
  return new NextResponse("﻿" + lines.join("\r\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="inscricoes-simposio-cbmap-${today}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
