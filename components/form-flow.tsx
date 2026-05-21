"use client";
import * as React from "react";
import { Alert, Button, Checkbox, Field, NoticeList, RadioGroup, SelectInput, TextInput, Wizard } from "./primitives";
import { Icon } from "./icons";
import { Mask, Validate } from "@/lib/validation";
import { AREAS, POSTOS, SOURCES, UF_LIST, getCities } from "@/lib/data";
import type { InscricaoForm, SubmitResult } from "@/lib/types";
import { submitInscricao } from "@/lib/inscricao-action";

function emptyForm(): InscricaoForm {
  return {
    email: "", name: "", cpf: "", dob: "", uf: "", city: "", phone: "",
    publico: "", posto: "", inst: "", area: "",
    cert: "", acess: "", acessDesc: "", source: "",
    imgUse: "", lgpd: false,
  };
}

type Errors = Partial<Record<keyof InscricaoForm, string>>;

function validateStep(step: number, form: InscricaoForm): Errors {
  const e: Errors = {};
  if (step === 1) {
    const er = Validate.required(form.email); if (er) e.email = er; else {
      const ev = Validate.email(form.email); if (ev) e.email = ev;
    }
    const nr = Validate.required(form.name); if (nr) e.name = nr;
    const cr = Validate.required(form.cpf); if (cr) e.cpf = cr; else {
      const cv = Validate.cpf(form.cpf); if (cv) e.cpf = cv;
    }
    const dr = Validate.required(form.dob); if (dr) e.dob = dr; else {
      const dv = Validate.date(form.dob); if (dv) e.dob = dv;
    }
    if (!form.uf) e.uf = "Selecione o estado.";
    if (!form.city) e.city = "Selecione o município.";
    const pr = Validate.required(form.phone); if (pr) e.phone = pr; else {
      const pv = Validate.phone(form.phone); if (pv) e.phone = pv;
    }
  } else if (step === 2) {
    if (!form.publico) e.publico = "Selecione o público.";
    if (!form.inst) e.inst = "Informe a instituição.";
    if (!form.area) e.area = "Selecione a área.";
  } else if (step === 3) {
    if (!form.cert) e.cert = "Selecione uma opção.";
    if (!form.acess) e.acess = "Selecione uma opção.";
    if (!form.source) e.source = "Selecione uma opção.";
  } else if (step === 4) {
    if (!form.imgUse) e.imgUse = "Selecione uma opção.";
    if (!form.lgpd) e.lgpd = "É necessário aceitar o consentimento LGPD.";
  }
  return e;
}

export function FormFlow() {
  const [step, setStep] = React.useState(1);
  const [form, setForm] = React.useState<InscricaoForm>(emptyForm);
  const [errors, setErrors] = React.useState<Errors>({});
  const [phase, setPhase] = React.useState<"form" | "sending" | "success">("form");
  const [submitError, setSubmitError] = React.useState<string>("");
  const [duplicateField, setDuplicateField] = React.useState<"" | "cpf" | "email">("");
  const [protocol, setProtocol] = React.useState<string>("");

  const set = React.useCallback(<K extends keyof InscricaoForm>(k: K, v: InscricaoForm[K]) => {
    setForm(s => ({ ...s, [k]: v }));
  }, []);

  function advance() {
    const e = validateStep(step, form);
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setStep(s => Math.min(4, s + 1));
    setErrors({});
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function back() {
    setStep(s => Math.max(1, s - 1));
    setErrors({});
  }

  async function handleSubmit() {
    const e = validateStep(4, form);
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setPhase("sending");
    setSubmitError("");
    setDuplicateField("");

    let result: SubmitResult;
    try {
      result = await submitInscricao(form);
    } catch {
      setPhase("form");
      setSubmitError("Falha de comunicação. Tente novamente em alguns instantes.");
      return;
    }

    if (result.ok) {
      setProtocol(result.protocolo);
      setPhase("success");
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (result.field === "cpf") {
      setDuplicateField("cpf");
      setStep(1);
      setPhase("form");
      setSubmitError("");
    } else if (result.field === "email") {
      setDuplicateField("email");
      setStep(1);
      setPhase("form");
      setSubmitError("");
    } else {
      setPhase("form");
      setSubmitError(result.error);
    }
  }

  function restart() {
    setForm(emptyForm());
    setStep(1);
    setPhase("form");
    setErrors({});
    setSubmitError("");
    setDuplicateField("");
    setProtocol("");
  }

  if (phase === "sending") {
    return (
      <div className="page-form-wrap">
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <div className="sending">
            <div className="sending-ring"></div>
            <div className="sending-label">Enviando inscrição…</div>
            <div className="sending-sub">Aguarde, estamos registrando seus dados com segurança.</div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "success") {
    return (
      <div className="page-form-wrap">
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <div className="success-screen">
            <div className="success-seal"><Icon.Check /></div>
            <h1 className="success-title">Inscrição realizada com sucesso.</h1>
            <p className="success-body">
              A organização do evento agradece sua participação. Informações complementares sobre
              programação, credenciamento e horários serão encaminhadas posteriormente pelos canais
              oficiais do CBMAP.
            </p>
            <div className="success-protocol">
              <span className="lbl">Protocolo de inscrição</span>
              <span className="val">{protocol}</span>
            </div>
            <div className="event-meta-strip">
              <div><div className="lbl">Data</div><div className="val">24, 25 e 26 de junho · 2026</div></div>
              <div><div className="lbl">Local</div><div className="val">Anfiteatro da UNIFAP · Macapá/AP</div></div>
              <div><div className="lbl">Confirmação</div><div className="val">Guarde seu protocolo</div></div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 28, flexWrap: "wrap", justifyContent: "center" }}>
              <Button variant="secondary" onClick={restart} icon={<Icon.Arrow dir="left" />}>Nova inscrição</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-form-wrap">
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        {step === 1 && (
          <Step1 form={form} set={set} errors={errors} duplicateField={duplicateField} onAdvance={advance} submitError={submitError} />
        )}
        {step === 2 && <Step2 form={form} set={set} errors={errors} onBack={back} onAdvance={advance} />}
        {step === 3 && <Step3 form={form} set={set} errors={errors} onBack={back} onAdvance={advance} />}
        {step === 4 && (
          <Step4 form={form} set={set} errors={errors} onBack={back} onSubmit={handleSubmit} submitError={submitError} />
        )}
      </div>
    </div>
  );
}

type StepProps = {
  form: InscricaoForm;
  set: <K extends keyof InscricaoForm>(k: K, v: InscricaoForm[K]) => void;
  errors: Errors;
};

function Step1({
  form, set, errors, duplicateField, onAdvance, submitError,
}: StepProps & { duplicateField: "" | "cpf" | "email"; onAdvance: () => void; submitError: string }) {
  const [touched, setTouched] = React.useState<Partial<Record<keyof InscricaoForm, boolean>>>({});
  const t = (k: keyof InscricaoForm) => () => setTouched(s => ({ ...s, [k]: true }));

  const errEmail =
    duplicateField === "email" ? "Este e-mail já possui inscrição registrada." :
    errors.email || (touched.email ? Validate.email(form.email) || undefined : undefined);
  const errCpf =
    duplicateField === "cpf" ? "CPF já cadastrado neste evento." :
    errors.cpf || (touched.cpf ? Validate.cpf(form.cpf) || undefined : undefined);
  const errName = errors.name || (touched.name ? Validate.required(form.name) || undefined : undefined);
  const errDob = errors.dob || (touched.dob ? Validate.date(form.dob) || undefined : undefined);
  const errPhone = errors.phone || (touched.phone ? Validate.phone(form.phone) || undefined : undefined);

  return (
    <>
      <Wizard step={1} />
      <p className="eyebrow">Etapa 01 · Dados pessoais</p>
      <h1 className="page-title">Faça sua inscrição</h1>
      <p className="page-lede">
        As informações coletadas serão usadas exclusivamente para inscrição, controle de presença e
        emissão de certificados.
      </p>

      <NoticeList items={[
        "O preenchimento correto dos dados é de responsabilidade do participante.",
        "O nome informado será usado na emissão do certificado.",
        "As vagas são limitadas.",
      ]} />

      {duplicateField === "email" && (
        <Alert tone="error" title="Este e-mail já possui inscrição registrada.">
          Localizamos uma inscrição com este e-mail. Caso precise alterar dados, entre em contato pelos canais oficiais do CBMAP.
        </Alert>
      )}
      {duplicateField === "cpf" && (
        <Alert tone="error" title="CPF já cadastrado neste evento.">
          O CPF informado já possui uma inscrição confirmada. Cada participante pode se inscrever apenas uma vez.
        </Alert>
      )}
      {submitError && !duplicateField && (
        <Alert tone="error" title="Não foi possível enviar sua inscrição.">{submitError}</Alert>
      )}

      <div className="card">
        <h2 className="section-title"><span className="section-title-index">01</span>Dados pessoais</h2>

        <Field label="E-mail" htmlFor="f-email" required error={errEmail}>
          <span onBlur={t("email")}>
            <TextInput id="f-email" type="email" value={form.email}
              onChange={v => set("email", v)} placeholder="seu@email.com"
              error={!!errEmail} valid={!errEmail && !!touched.email && !!form.email}
              autoComplete="email" inputMode="email" />
          </span>
        </Field>

        <Field label="Nome completo" htmlFor="f-name" hint="Será utilizado no certificado" required error={errName}>
          <span onBlur={t("name")}>
            <TextInput id="f-name" value={form.name}
              onChange={v => set("name", v.toUpperCase())} placeholder="NOME COMPLETO"
              error={!!errName} valid={!errName && !!touched.name && !!form.name}
              autoComplete="name" />
          </span>
        </Field>

        <div className="field-row">
          <Field label="CPF" htmlFor="f-cpf" hint="000.000.000-00" required error={errCpf}>
            <span onBlur={t("cpf")}>
              <TextInput id="f-cpf" value={form.cpf}
                onChange={v => set("cpf", Mask.cpf(v))} placeholder="000.000.000-00"
                error={!!errCpf} valid={!errCpf && !!touched.cpf && form.cpf.length === 14}
                mono inputMode="numeric" maxLength={14} />
            </span>
          </Field>

          <Field label="Data de nascimento" htmlFor="f-dob" hint="DD/MM/AAAA" required error={errDob}>
            <span onBlur={t("dob")}>
              <TextInput id="f-dob" value={form.dob}
                onChange={v => set("dob", Mask.date(v))} placeholder="01/10/2000"
                error={!!errDob} mono inputMode="numeric" maxLength={10} />
            </span>
          </Field>
        </div>

        <div className="field-row">
          <Field label="Estado (UF)" htmlFor="f-uf" required error={errors.uf}>
            <SelectInput id="f-uf" value={form.uf}
              onChange={v => { set("uf", v); set("city", ""); }}
              options={UF_LIST.map(([k, label]) => [k, `${k} — ${label}`])}
              placeholder="Selecione o estado" error={!!errors.uf} />
          </Field>

          <Field label="Município" htmlFor="f-city" required error={errors.city}>
            <SelectInput id="f-city" value={form.city}
              onChange={v => set("city", v)}
              options={form.uf ? getCities(form.uf) : []}
              placeholder={form.uf ? "Selecione o município" : "Escolha o estado primeiro"}
              disabled={!form.uf} error={!!errors.city} />
          </Field>
        </div>

        <Field label="Telefone / WhatsApp" htmlFor="f-phone" hint="(00) 00000-0000" required error={errPhone}>
          <span onBlur={t("phone")}>
            <TextInput id="f-phone" value={form.phone}
              onChange={v => set("phone", Mask.phone(v))} placeholder="(96) 00000-0000"
              error={!!errPhone} mono inputMode="tel" maxLength={16} autoComplete="tel" />
          </span>
        </Field>

        <div className="btn-row">
          <span className="spacer"></span>
          <Button variant="primary" onClick={onAdvance} iconRight={<Icon.Arrow />}>Avançar</Button>
        </div>
      </div>
    </>
  );
}

function Step2({ form, set, errors, onBack, onAdvance }: StepProps & { onBack: () => void; onAdvance: () => void }) {
  return (
    <>
      <Wizard step={2} />
      <p className="eyebrow">Etapa 02 · Profissional</p>
      <h1 className="page-title">Dados profissionais</h1>
      <p className="page-lede">
        Informe seu vínculo profissional e área de atuação. Esses dados ajudam a organização a preparar
        conteúdo e materiais adequados ao público presente.
      </p>

      <div className="card">
        <h2 className="section-title"><span className="section-title-index">02</span>Dados profissionais</h2>

        <Field label="Público" required error={errors.publico}>
          <RadioGroup name="publico" value={form.publico} onChange={v => set("publico", v as InscricaoForm["publico"])} options={["Militar", "Civil"]} columns={2} />
        </Field>

        {form.publico === "Militar" && (
          <Field label="Se militar, qual sua função?" htmlFor="f-posto" hint="Posto / Graduação">
            <SelectInput id="f-posto" value={form.posto} onChange={v => set("posto", v)} options={POSTOS as unknown as string[]} placeholder="Selecione o posto/graduação" />
          </Field>
        )}

        <Field label="Instituição, corporação ou empresa" htmlFor="f-inst" required error={errors.inst}>
          <TextInput id="f-inst" value={form.inst} onChange={v => set("inst", v)}
            placeholder="Ex: Corpo de Bombeiros Militar do Amapá" error={!!errors.inst} />
        </Field>

        <Field label="Área de atuação" required error={errors.area}>
          <RadioGroup name="area" value={form.area} onChange={v => set("area", v)} options={AREAS as unknown as string[]} columns="cols" />
        </Field>

        <div className="btn-row">
          <Button variant="ghost" onClick={onBack} icon={<Icon.Arrow dir="left" />}>Voltar</Button>
          <Button variant="primary" onClick={onAdvance} iconRight={<Icon.Arrow />}>Avançar</Button>
        </div>
      </div>
    </>
  );
}

function Step3({ form, set, errors, onBack, onAdvance }: StepProps & { onBack: () => void; onAdvance: () => void }) {
  return (
    <>
      <Wizard step={3} />
      <p className="eyebrow">Etapa 03 · Participação</p>
      <h1 className="page-title">Participação no evento</h1>
      <p className="page-lede">
        Algumas informações sobre sua participação, acessibilidade e canal pelo qual você ficou sabendo
        do simpósio.
      </p>

      <div className="card">
        <h2 className="section-title"><span className="section-title-index">03</span>Participação no evento</h2>

        <Field label="Necessita de certificado?" required error={errors.cert}>
          <p className="field-help">
            Condicionado à participação presencial integral e com registro de presença diário no local do evento.
          </p>
          <RadioGroup name="cert" value={form.cert} onChange={v => set("cert", v as InscricaoForm["cert"])} options={["Sim", "Não"]} columns={2} />
        </Field>

        <Field label="Possui necessidade especial ou acessibilidade?" required error={errors.acess}>
          <RadioGroup name="acess" value={form.acess} onChange={v => set("acess", v as InscricaoForm["acess"])} options={["Sim", "Não"]} columns={2} />
        </Field>

        {form.acess === "Sim" && (
          <Field label="Descreva brevemente sua necessidade" htmlFor="f-acess-desc" hint="Para podermos preparar o local">
            <TextInput id="f-acess-desc" value={form.acessDesc} onChange={v => set("acessDesc", v)}
              placeholder="Ex: cadeirante, intérprete de Libras, …" />
          </Field>
        )}

        <Field label="Como soube do evento?" required error={errors.source}>
          <RadioGroup name="source" value={form.source} onChange={v => set("source", v)} options={SOURCES as unknown as string[]} columns="cols" />
        </Field>

        <div className="btn-row">
          <Button variant="ghost" onClick={onBack} icon={<Icon.Arrow dir="left" />}>Voltar</Button>
          <Button variant="primary" onClick={onAdvance} iconRight={<Icon.Arrow />}>Avançar</Button>
        </div>
      </div>
    </>
  );
}

function Step4({
  form, set, errors, onBack, onSubmit, submitError,
}: StepProps & { onBack: () => void; onSubmit: () => void; submitError: string }) {
  const canSubmit = !!form.imgUse && form.lgpd;
  return (
    <>
      <Wizard step={4} />
      <p className="eyebrow">Etapa 04 · Autorizações</p>
      <h1 className="page-title">Autorizações e consentimento</h1>
      <p className="page-lede">
        Para concluir sua inscrição, revise as autorizações abaixo. Ambas são necessárias para finalizar
        o registro.
      </p>

      {submitError && (
        <Alert tone="error" title="Não foi possível enviar sua inscrição.">{submitError}</Alert>
      )}

      <div className="card">
        <h2 className="section-title"><span className="section-title-index">04</span>Autorizações</h2>

        <Field label="Autorização de uso de imagem" required error={errors.imgUse}>
          <p className="field-help" style={{ marginBottom: 12 }}>
            Autorizo o uso de minha imagem em fotografias e registros audiovisuais realizados durante o
            evento para fins institucionais e de divulgação do CBMAP.
          </p>
          <RadioGroup name="imgUse" value={form.imgUse} onChange={v => set("imgUse", v as InscricaoForm["imgUse"])}
            options={["Sim, autorizo", "Não autorizo"]} columns={2} />
        </Field>

        <Field label="Consentimento LGPD" required error={errors.lgpd}>
          <div style={{ marginTop: 6 }}>
            <Checkbox checked={form.lgpd} onChange={v => set("lgpd", v)}>
              Declaro estar ciente de que os dados fornecidos serão utilizados <b>exclusivamente para fins administrativos</b> relacionados ao Simpósio de Combate a Incêndio do CBMAP, incluindo controle de presença e emissão de certificados.
            </Checkbox>
          </div>
        </Field>

        <div className="btn-row">
          <Button variant="ghost" onClick={onBack} icon={<Icon.Arrow dir="left" />}>Voltar</Button>
          <Button variant="primary" onClick={onSubmit} disabled={!canSubmit}>Enviar inscrição</Button>
        </div>
      </div>

      <p style={{ textAlign: "center", marginTop: 18, fontSize: 12, color: "var(--text-3)", fontFamily: "var(--font-mono)", letterSpacing: ".08em", textTransform: "uppercase" }}>
        Protegido por LGPD · Dados criptografados em trânsito
      </p>
    </>
  );
}
