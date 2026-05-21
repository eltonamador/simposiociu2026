"use client";
import * as React from "react";
import { Icon } from "./icons";

export function BrandMark({ size = 44 }: { size?: number }) {
  return (
    <div className="brand-mark" style={{ width: size, height: size }} aria-label="Brasão CBMAP">
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M16 4 L26 7 V15 C26 21 21 25 16 27 C11 25 6 21 6 15 V7 Z" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.9)" strokeWidth="1.2" />
        <path d="M17.5 9c.2 2.6-3 3-3 6.5 0 2 1.5 3.7 3 4.5-1.8 0-4-1.4-4-4 0-1 .5-1.8.8-2.4-1 .5-2 1.7-2 3.5 0 3 2.5 5 5 5s5-2 5-5c0-4-4.8-5.6-4.8-8.1z" fill="white" />
      </svg>
    </div>
  );
}

export function Wizard({
  step,
  total = 4,
  labels = ["Dados pessoais", "Profissional", "Participação", "Autorizações"],
}: {
  step: number;
  total?: number;
  labels?: string[];
}) {
  return (
    <div className="wizard" aria-label={`Etapa ${step} de ${total}`}>
      <div className="wizard-meta">
        <span>
          Página <strong>{step}</strong> de {total}
        </span>
        <span>{Math.round(((step - 1) / total) * 100)}% concluído</span>
      </div>
      <div className="wizard-bar" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={total}>
        {Array.from({ length: total }).map((_, i) => {
          const n = i + 1;
          const cls = n < step ? "is-done" : n === step ? "is-current" : "";
          return <span key={i} className={cls}></span>;
        })}
      </div>
      <div className="wizard-steps">
        {labels.map((l, i) => {
          const n = i + 1;
          const cls = n < step ? "is-done" : n === step ? "is-current" : "";
          return (
            <div key={i} className={`wizard-step ${cls}`}>
              {String(n).padStart(2, "0")}. {l}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Field({
  label, htmlFor, hint, required, error, children,
}: {
  label: string; htmlFor?: string; hint?: string; required?: boolean; error?: string | null;
  children: React.ReactNode;
}) {
  return (
    <div className="field">
      <label className="field-label" htmlFor={htmlFor}>
        <span>
          {label}
          {required && <span className="req" aria-hidden="true"> *</span>}
        </span>
        {hint && <span className="field-hint">{hint}</span>}
      </label>
      {children}
      {error && (
        <div className="field-error" role="alert">
          <Icon.Alert />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

export function TextInput({
  id, value, onChange, placeholder, error, valid, mono, type = "text",
  inputMode, maxLength, autoComplete,
}: {
  id?: string; value: string; onChange: (v: string) => void; placeholder?: string;
  error?: boolean; valid?: boolean; mono?: boolean; type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number; autoComplete?: string;
}) {
  const cls = ["input"];
  if (error) cls.push("is-error");
  else if (valid) cls.push("is-valid");
  if (mono) cls.push("is-mono");
  return (
    <div className="input-wrap">
      <input
        id={id} type={type} value={value || ""}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={cls.join(" ")}
        inputMode={inputMode}
        maxLength={maxLength}
        autoComplete={autoComplete}
        aria-invalid={!!error}
      />
      {(error || valid) && (
        <span className={`input-icon ${error ? "is-error" : "is-valid"}`}>
          {error ? <Icon.Alert /> : <Icon.Check />}
        </span>
      )}
    </div>
  );
}

export function SelectInput({
  id, value, onChange, options, placeholder, error, disabled,
}: {
  id?: string; value: string; onChange: (v: string) => void;
  options: ReadonlyArray<string | readonly [string, string]>;
  placeholder?: string; error?: boolean; disabled?: boolean;
}) {
  const cls = ["input"];
  if (error) cls.push("is-error");
  return (
    <select id={id} value={value || ""} onChange={e => onChange(e.target.value)}
      className={cls.join(" ")} disabled={disabled} aria-invalid={!!error}>
      <option value="" disabled>{placeholder || "Selecione…"}</option>
      {options.map(opt => {
        if (Array.isArray(opt)) return <option key={opt[0]} value={opt[0]}>{opt[1]}</option>;
        return <option key={opt as string} value={opt as string}>{opt as string}</option>;
      })}
    </select>
  );
}

export function RadioGroup({
  name, value, onChange, options, columns,
}: {
  name: string; value: string; onChange: (v: string) => void;
  options: ReadonlyArray<string>; columns?: 2 | "cols";
}) {
  const cls = `radio-grid ${columns === 2 ? "radio-grid--2" : "radio-grid--cols"}`;
  return (
    <div className={cls} role="radiogroup">
      {options.map(opt => {
        const checked = value === opt;
        return (
          <label key={opt} className={`radio-card ${checked ? "is-checked" : ""}`}>
            <input type="radio" name={name} value={opt} checked={checked} onChange={() => onChange(opt)} />
            <span className="dot" aria-hidden="true"></span>
            <span>{opt}</span>
          </label>
        );
      })}
    </div>
  );
}

export function Checkbox({
  checked, onChange, children,
}: {
  checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode;
}) {
  return (
    <label className={`check ${checked ? "is-checked" : ""}`}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className="box" aria-hidden="true"><Icon.Check /></span>
      <span>{children}</span>
    </label>
  );
}

export function Button({
  children, variant = "primary", onClick, disabled, type, loading, icon, iconRight, block,
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  block?: boolean;
}) {
  const cls = ["btn", `btn--${variant}`];
  if (block) cls.push("btn--block");
  return (
    <button type={type || "button"} className={cls.join(" ")} onClick={onClick} disabled={disabled || loading}>
      {loading && <span className="spinner"></span>}
      {!loading && icon}
      <span>{children}</span>
      {!loading && iconRight}
    </button>
  );
}

export function Alert({
  tone = "error", title, children, onClose,
}: {
  tone?: "error" | "success" | "info";
  title?: string;
  children?: React.ReactNode;
  onClose?: () => void;
}) {
  const IconMap = { error: Icon.Alert, success: Icon.Check, info: Icon.Info } as const;
  const Cmp = IconMap[tone] || Icon.Info;
  return (
    <div className={`alert alert--${tone}`} role="alert">
      <Cmp />
      <div>
        {title && <b>{title}</b>}
        {title && children && <br />}
        {children}
      </div>
      {onClose && (
        <button onClick={onClose} style={{ background: "none", border: 0, color: "inherit", cursor: "pointer", opacity: 0.7 }} aria-label="Fechar">
          <Icon.X />
        </button>
      )}
    </div>
  );
}

export function NoticeList({ items }: { items: string[] }) {
  return (
    <div className="notice-grid">
      {items.map((t, i) => (
        <div key={i} className="notice">
          <Icon.Info />
          <span>{t}</span>
        </div>
      ))}
    </div>
  );
}
