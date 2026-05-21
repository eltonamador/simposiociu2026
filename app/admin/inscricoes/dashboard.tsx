"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { Alert, BrandMark, Button } from "@/components/primitives";
import { Icon } from "@/components/icons";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type Row = {
  id: string; protocolo: string;
  nome: string; email: string; cpfMasked: string; telefone: string;
  instituicao: string; area_atuacao: string;
  publico: "Militar" | "Civil";
  uf: string; municipio: string;
  necessita_certificado: boolean; necessita_acessibilidade: boolean;
  created_at: string;
};

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).map(p => p[0]).slice(0, 2).join("").toUpperCase();
}
function fmtDT(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AdminDashboard({
  rows, areas, dbError, userEmail,
}: {
  rows: Row[]; areas: string[]; dbError: string; userEmail: string;
}) {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [fPub, setFPub] = React.useState("");
  const [fArea, setFArea] = React.useState("");
  const [fCert, setFCert] = React.useState("");
  const [page, setPage] = React.useState(0);
  const pageSize = 25;

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter(r => {
      if (fPub && r.publico !== fPub) return false;
      if (fArea && r.area_atuacao !== fArea) return false;
      if (fCert === "Sim" && !r.necessita_certificado) return false;
      if (fCert === "Não" && r.necessita_certificado) return false;
      if (q && !`${r.nome} ${r.email} ${r.cpfMasked} ${r.instituicao}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [rows, search, fPub, fArea, fCert]);

  const stats = React.useMemo(() => {
    const total = rows.length || 1;
    return {
      total: rows.length,
      militares: rows.filter(r => r.publico === "Militar").length,
      civis: rows.filter(r => r.publico === "Civil").length,
      cert: rows.filter(r => r.necessita_certificado).length,
      acess: rows.filter(r => r.necessita_acessibilidade).length,
      _div: total,
    };
  }, [rows]);

  const visible = filtered.slice(page * pageSize, page * pageSize + pageSize);
  const lastPage = Math.max(0, Math.ceil(filtered.length / pageSize) - 1);

  async function logout() {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="admin-app">
      <header className="admin-topbar">
        <BrandMark />
        <div className="brand-text">
          <span className="brand-eyebrow">Painel administrativo</span>
          <span className="brand-title">I Simpósio CBMAP · 2026</span>
        </div>
        <div className="right">
          <div className="who">
            <div className="avatar">{initials(userEmail || "CB")}</div>
            <span>{userEmail || "Administrador"}</span>
          </div>
          <button onClick={logout} className="btn btn--ghost" style={{ minHeight: 34, padding: "6px 12px", fontSize: 12 }}>
            <Icon.Logout />
            <span>Sair</span>
          </button>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-h1">
          <div>
            <h1>Inscrições</h1>
            <div className="sub">
              {stats.total} {stats.total === 1 ? "registro" : "registros"} · Atualizado em tempo real
            </div>
          </div>
          <div className="actions">
            <a href="/api/admin/export" target="_blank" rel="noreferrer">
              <Button variant="secondary" icon={<Icon.Download />}>Exportar CSV</Button>
            </a>
          </div>
        </div>

        {dbError && <Alert tone="error" title="Erro ao carregar dados">{dbError}</Alert>}

        <div className="stats">
          <div className="stat stat--accent">
            <div className="lbl">Total de inscritos</div>
            <div className="val">{stats.total}</div>
            <div className="meta">Todas as inscrições confirmadas</div>
            <div className="stat-bar" style={{ width: "100%" }}></div>
          </div>
          <StatCard label="Militares" value={stats.militares} total={stats._div} />
          <StatCard label="Civis" value={stats.civis} total={stats._div} />
          <StatCard label="Necessitam certificado" value={stats.cert} total={stats._div} />
          <StatCard label="Acessibilidade" value={stats.acess} total={stats._div} note="Atenção especial" />
        </div>

        <div className="list-toolbar">
          <div className="search-input">
            <Icon.Search />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(0); }}
              placeholder="Buscar por nome, e-mail, CPF ou instituição…"
            />
          </div>

          <FilterPill label="Público" value={fPub} onClear={() => { setFPub(""); setPage(0); }}
            options={["Militar", "Civil"]} onPick={v => { setFPub(v); setPage(0); }} />
          <FilterPill label="Área de atuação" value={fArea} onClear={() => { setFArea(""); setPage(0); }}
            options={areas} onPick={v => { setFArea(v); setPage(0); }} />
          <FilterPill label="Certificado" value={fCert} onClear={() => { setFCert(""); setPage(0); }}
            options={["Sim", "Não"]} onPick={v => { setFCert(v); setPage(0); }} />
        </div>

        <div className="table-wrap">
          {filtered.length === 0 ? <EmptyTable /> : (
            <div className="table-scroll">
              <table className="table">
                <thead>
                  <tr>
                    <th>Participante</th>
                    <th>CPF</th>
                    <th>Telefone</th>
                    <th>Instituição</th>
                    <th>Área</th>
                    <th>Público</th>
                    <th>Cert.</th>
                    <th>Inscrição</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map(r => (
                    <tr key={r.id}>
                      <td>
                        <div className="cell-name">
                          <div className="avatar-circle">{initials(r.nome)}</div>
                          <div>
                            <div className="name">{r.nome}</div>
                            <div className="sub">{r.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="cell-mono">{r.cpfMasked}</td>
                      <td className="cell-mono">{r.telefone}</td>
                      <td>
                        <div>{r.instituicao}</div>
                        <div style={{ fontSize: 11, color: "var(--text-3)" }}>{r.municipio}/{r.uf}</div>
                      </td>
                      <td><span style={{ fontSize: 12 }}>{r.area_atuacao}</span></td>
                      <td>
                        <span className={`badge ${r.publico === "Militar" ? "badge--mil" : "badge--civ"}`}>
                          <span className="dot"></span>
                          {r.publico}
                        </span>
                      </td>
                      <td>
                        {r.necessita_certificado
                          ? <span className="badge badge--green"><Icon.Check />Sim</span>
                          : <span className="badge badge--neutral">Não</span>}
                      </td>
                      <td className="cell-time">{fmtDT(r.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filtered.length > pageSize && (
            <div className="pagination">
              <span>
                Mostrando {page * pageSize + 1}–{Math.min((page + 1) * pageSize, filtered.length)} de {filtered.length}
              </span>
              <div className="arrows">
                <button disabled={page === 0} onClick={() => setPage(p => Math.max(0, p - 1))}>‹ Anterior</button>
                <button disabled={page >= lastPage} onClick={() => setPage(p => Math.min(lastPage, p + 1))}>Próximo ›</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, total, note }: { label: string; value: number; total: number; note?: string }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="stat">
      <div className="lbl">{label}</div>
      <div className="val">{value}</div>
      <div className="meta">{note || `${pct}% do total`}</div>
      <div className="stat-bar" style={{ width: `${pct}%`, opacity: .35 }}></div>
    </div>
  );
}

function FilterPill({
  label, value, options, onPick, onClear,
}: {
  label: string; value: string; options: string[];
  onPick: (v: string) => void; onClear: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    function h(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button className={`filter-pill ${value ? "is-active" : ""}`} onClick={() => setOpen(o => !o)}>
        <Icon.Filter />
        <span>{label}{value ? `: ${value}` : ""}</span>
        {value && (
          <span className="x" onClick={(e) => { e.stopPropagation(); onClear(); }}>×</span>
        )}
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 30,
          background: "var(--bg-3)", border: "1px solid var(--border-2)",
          borderRadius: "var(--r-sm)", padding: 6, minWidth: 200,
          boxShadow: "var(--shadow-2)", maxHeight: 260, overflowY: "auto",
        }}>
          {options.map(o => (
            <button key={o} onClick={() => { onPick(o); setOpen(false); }}
              style={{
                display: "block", width: "100%", textAlign: "left",
                background: value === o ? "rgba(225,30,44,0.12)" : "transparent",
                border: 0, color: value === o ? "var(--red-300)" : "var(--text-2)",
                padding: "7px 10px", fontSize: 12, borderRadius: 4, cursor: "pointer",
                fontFamily: "var(--font-sans)",
              }}>
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyTable() {
  return (
    <div className="empty-state">
      <div className="icon"><Icon.Inbox /></div>
      <h3>Nenhuma inscrição encontrada</h3>
      <p>Nenhum registro corresponde aos filtros aplicados. Ajuste a busca ou limpe os filtros para ver mais resultados.</p>
    </div>
  );
}
