"use client";
import { Alert, Field, TextInput } from "@/components/primitives";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function ErrosPage() {
  const examples = [
    {
      lbl: "CPF inválido",
      el: (
        <Field label="CPF" required error="CPF inválido. Verifique os números informados.">
          <TextInput id="g1" value="123.456.789-00" onChange={() => {}} error mono />
        </Field>
      ),
    },
    {
      lbl: "E-mail inválido",
      el: (
        <Field label="E-mail" required error="Informe um e-mail válido.">
          <TextInput id="g2" value="usuario.com" onChange={() => {}} error />
        </Field>
      ),
    },
    {
      lbl: "Campo obrigatório",
      el: (
        <Field label="Nome completo" required error="Campo obrigatório.">
          <TextInput id="g3" value="" onChange={() => {}} error placeholder="NOME COMPLETO" />
        </Field>
      ),
    },
    {
      lbl: "CPF já cadastrado",
      el: (
        <div>
          <Alert tone="error" title="CPF já cadastrado neste evento.">
            Cada participante pode se inscrever apenas uma vez. Em caso de dúvida, contate a organização.
          </Alert>
          <Field label="CPF" required error="CPF já cadastrado.">
            <TextInput id="g4" value="123.456.789-09" onChange={() => {}} error mono />
          </Field>
        </div>
      ),
    },
    {
      lbl: "E-mail já cadastrado",
      el: (
        <Alert tone="error" title="Este e-mail já possui inscrição registrada.">
          Localizamos uma inscrição com este e-mail. Caso precise alterar dados, entre em contato pelos canais oficiais.
        </Alert>
      ),
    },
    {
      lbl: "Erro geral no envio",
      el: (
        <Alert tone="error" title="Não foi possível enviar sua inscrição.">
          Ocorreu uma falha de comunicação com o servidor. Verifique sua conexão e tente novamente em alguns instantes.
        </Alert>
      ),
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-1)" }}>
      <SiteHeader />
      <div className="page-form-wrap">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p className="eyebrow">Validações e mensagens</p>
          <h1 className="page-title">Estados de erro</h1>
          <p className="page-lede">
            Mensagens amigáveis e contextuais. Cada erro mantém o usuário no fluxo, sem travar a inscrição,
            e oferece um próximo passo claro.
          </p>
          <div className="gallery-grid">
            {examples.map((ex, i) => (
              <div key={i} className="gallery-card">
                <div className="lbl">{String(i + 1).padStart(2, "0")} · {ex.lbl}</div>
                {ex.el}
              </div>
            ))}
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
