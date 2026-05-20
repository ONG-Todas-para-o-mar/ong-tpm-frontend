export const BRL = (n) =>
  "R$ " +
  n.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

export const BRL2 = (n) =>
  "R$ " +
  n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
