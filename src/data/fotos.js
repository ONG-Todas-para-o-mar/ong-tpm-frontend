const FOTO = (n) => `/assets/photos/DSC_0${n}.webp`;

export const FOTO_SOBRE = FOTO("387");
export const FOTO_CAPA = FOTO("266");

const GALERIA = [
  "266", "267", "268", "269", "270", "271", "272", "273", "274", "275",
  "276", "277", "278", "279", "280", "281", "282", "283", "284", "285",
  "286", "287", "387", "389", "391",
].map(FOTO);

export const FOTO_POR_PROJETO = {
  "Surf na Baía": FOTO("266"),
  "Mulheres do Mar": FOTO("270"),
  "Onda Antirracista": FOTO("274"),
  "Mães da Maré": FOTO("278"),
  "Pequenas Surfistas": FOTO("282"),
  "Bem-Viver Costeiro": FOTO("286"),
};

function indiceEstavel(chave) {
  const texto = String(chave || "");
  let hash = 0;
  for (let i = 0; i < texto.length; i += 1) {
    hash = (hash * 31 + texto.charCodeAt(i)) % 100000;
  }
  return hash % GALERIA.length;
}

export function imagemDe({ imagem, titulo }) {
  if (imagem) return imagem;
  if (FOTO_POR_PROJETO[titulo]) return FOTO_POR_PROJETO[titulo];
  return GALERIA[indiceEstavel(titulo)];
}

export const REGIAO_PADRAO = "Ipojuca · PE";
