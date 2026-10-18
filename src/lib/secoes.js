// Seções do site público que podem sair do ar sem mexer no código. A lista vem do
// build, em VITE_SECOES_OCULTAS, separada por vírgula:
//
//   VITE_SECOES_OCULTAS=projetos,socios,transparencia
//
// Serve para esconder o que a ONG ainda não pode oferecer — por exemplo, enquanto
// não há conta bancária para receber doações. Sem a variável, tudo aparece.
// Só some o atalho (menu, rodapé, página inicial); a rota continua respondendo.
const ocultas = new Set(
  (import.meta.env.VITE_SECOES_OCULTAS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
);

export const secaoVisivel = (secao) => !ocultas.has(secao);
