export const Mask = {
  cpf(v: string): string {
    const d = (v || "").replace(/\D/g, "").slice(0, 11);
    return d
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  },
  phone(v: string): string {
    const d = (v || "").replace(/\D/g, "").slice(0, 11);
    if (d.length <= 10) return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
    return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
  },
  date(v: string): string {
    const d = (v || "").replace(/\D/g, "").slice(0, 8);
    return d.replace(/(\d{2})(\d)/, "$1/$2").replace(/(\d{2})(\d)/, "$1/$2");
  },
};

function cpfDigitsValid(digits: string): boolean {
  if (digits.length !== 11) return false;
  if (/^(\d)\1+$/.test(digits)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(digits[i], 10) * (10 - i);
  let d1 = (sum * 10) % 11;
  if (d1 === 10) d1 = 0;
  if (d1 !== parseInt(digits[9], 10)) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(digits[i], 10) * (11 - i);
  let d2 = (sum * 10) % 11;
  if (d2 === 10) d2 = 0;
  return d2 === parseInt(digits[10], 10);
}

export const Validate = {
  required(v: unknown): string | null {
    return v && String(v).trim().length > 0 ? null : "Campo obrigatório.";
  },
  email(v: string): string | null {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || "") ? null : "Informe um e-mail válido.";
  },
  cpf(v: string): string | null {
    const d = (v || "").replace(/\D/g, "");
    if (d.length !== 11) return "CPF inválido. Digite os 11 dígitos.";
    if (!cpfDigitsValid(d)) return "CPF inválido.";
    return null;
  },
  date(v: string): string | null {
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(v || "")) return "Data inválida. Use DD/MM/AAAA.";
    const [dd, mm, yyyy] = v.split("/").map(n => parseInt(n, 10));
    if (mm < 1 || mm > 12) return "Mês inválido.";
    const d = new Date(yyyy, mm - 1, dd);
    if (d.getFullYear() !== yyyy || d.getMonth() !== mm - 1 || d.getDate() !== dd)
      return "Data inválida.";
    if (yyyy < 1900 || d > new Date()) return "Data inválida.";
    return null;
  },
  phone(v: string): string | null {
    const d = (v || "").replace(/\D/g, "");
    if (d.length < 10) return "Telefone inválido.";
    return null;
  },
};

/** Converte "DD/MM/YYYY" para "YYYY-MM-DD" (formato date do Postgres). */
export function dateBrToIso(v: string): string {
  const [dd, mm, yyyy] = v.split("/");
  return `${yyyy}-${mm}-${dd}`;
}

/** Mascarara CPF para exibição: 123.***.***-09 */
export function maskCpf(cpf: string): string {
  const d = (cpf || "").replace(/\D/g, "");
  if (d.length !== 11) return cpf;
  return `${d.slice(0, 3)}.***.***-${d.slice(9, 11)}`;
}

/** Apenas dígitos do CPF (chave de unicidade). */
export function cpfDigits(cpf: string): string {
  return (cpf || "").replace(/\D/g, "");
}
