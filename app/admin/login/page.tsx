"use client";
import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert, Button, BrandMark, Field } from "@/components/primitives";
import { Icon } from "@/components/icons";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  return (
    <React.Suspense fallback={<div className="admin-login" />}>
      <LoginForm />
    </React.Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/admin/inscricoes";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [err, setErr] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (!email || !password) {
      setErr("Informe e-mail e senha.");
      return;
    }
    setLoading(true);
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setErr("Credenciais inválidas ou acesso não autorizado.");
      return;
    }
    router.push(redirect);
    router.refresh();
  }

  return (
    <div className="admin-login">
      <div className="admin-login-card">
        <span className="admin-restricted-tag">
          <span className="dot"></span>
          ACESSO RESTRITO · CBMAP
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22, position: "relative", zIndex: 1 }}>
          <BrandMark />
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--text-3)" }}>
              I Simpósio CBMAP · 2026
            </div>
            <h1 style={{ fontSize: 20, fontWeight: 600, margin: "4px 0 0", letterSpacing: "-.01em" }}>
              Painel Administrativo
            </h1>
          </div>
        </div>

        <form onSubmit={submit} style={{ position: "relative", zIndex: 1 }}>
          {err && <Alert tone="error">{err}</Alert>}

          <Field label="E-mail" htmlFor="admin-email" required>
            <input
              id="admin-email" type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              className="input" placeholder="organizacao@cbmap.ap.gov.br"
              autoComplete="email" autoFocus
            />
          </Field>

          <Field label="Senha" htmlFor="admin-password" required>
            <div className="input-wrap">
              <input
                id="admin-password" type={show ? "text" : "password"} value={password}
                onChange={e => setPassword(e.target.value)}
                className="input is-mono" placeholder="••••••••••••"
                style={{ paddingRight: 40 }}
                autoComplete="current-password"
              />
              <button type="button" onClick={() => setShow(s => !s)}
                style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: 0, color: "var(--text-3)", cursor: "pointer", padding: 4 }}
                aria-label={show ? "Esconder senha" : "Mostrar senha"}>
                {show ? <Icon.EyeOff /> : <Icon.Eye />}
              </button>
            </div>
          </Field>

          <Button variant="primary" type="submit" block loading={loading} icon={<Icon.Lock />}>
            {loading ? "Validando acesso…" : "Acessar painel"}
          </Button>
        </form>

        <div style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid var(--border-1)", fontSize: 12, color: "var(--text-3)", lineHeight: 1.5, position: "relative", zIndex: 1 }}>
          Esta área é destinada exclusivamente à equipe organizadora. Acessos são registrados em log para auditoria.
        </div>
      </div>
    </div>
  );
}
