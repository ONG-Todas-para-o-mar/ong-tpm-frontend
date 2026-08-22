const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export const BRL = (n) =>
  "R$ " +
  num(n).toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

export const BRL2 = (n) =>
  "R$ " +
  num(n).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const NUM = (n) => num(n).toLocaleString("pt-BR");

export const PCT = (n) => `${num(n).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`;

export const dataBR = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("pt-BR");
};

export const dataHoraBR = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
};

export const dataExtensoBR = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
};

export const diasRestantes = (iso) => {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return Math.ceil((d - Date.now()) / (1000 * 60 * 60 * 24));
};

export const iniciais = (nome = "") => {
  const partes = String(nome).trim().split(/\s+/).filter(Boolean);
  if (!partes.length) return "?";
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
};

export const plural = (n, singular, plural) =>
  `${NUM(n)} ${Number(n) === 1 ? singular : plural}`;
