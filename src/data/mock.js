export const TPM_STATS = {
  raised: 0,
  donors: 0,
  womenImpacted: 0,
  kidsInSurf: 0,
  classes: 0,
  projects: 6,
};

const PHOTO = (n) => `/assets/photos/DSC_0${n}.webp`;

export const TPM_ABOUT_IMAGE = PHOTO("387");

export const PHOTO_BY_ID = {
  "Surf na Baía": PHOTO("266"),
  "Mulheres do Mar": PHOTO("270"),
  "Onda Antirracista": PHOTO("274"),
  "Mães da Maré": PHOTO("278"),
  "Pequenas Surfistas": PHOTO("282"),
  "Bem-Viver Costeiro": PHOTO("286"),
};

export const PROJECT_REGION = {
  "Surf na Baía": "Maracaípe · PE",
  "Mulheres do Mar": "Porto de Galinhas · PE",
  "Onda Antirracista": "Maracaípe · PE",
  "Mães da Maré": "Ipojuca · PE",
  "Pequenas Surfistas": "Maracaípe · PE",
  "Bem-Viver Costeiro": "Litoral Sul · PE",
};

export const TPM_PROJECTS = [
  {
    id: "p1",
    title: "Surf na Baía",
    region: "Maracaípe · PE",
    goal: 0,
    raised: 0,
    women: 0,
    focus: "Aulas gratuitas de surf para crianças e adolescentes da comunidade",
    image: PHOTO("266"),
  },
  {
    id: "p2",
    title: "Mulheres do Mar",
    region: "Porto de Galinhas · PE",
    goal: 0,
    raised: 0,
    women: 0,
    focus: "Empreendedorismo e geração de renda para mulheres negras",
    image: PHOTO("270"),
  },
  {
    id: "p3",
    title: "Onda Antirracista",
    region: "Maracaípe · PE",
    goal: 0,
    raised: 0,
    women: 0,
    focus: "Formação cultural e socioeducativa com viés antirracista",
    image: PHOTO("274"),
  },
  {
    id: "p4",
    title: "Mães da Maré",
    region: "Ipojuca · PE",
    goal: 0,
    raised: 0,
    women: 0,
    focus: "Apoio integral a mães chefes de família",
    image: PHOTO("278"),
  },
  {
    id: "p5",
    title: "Pequenas Surfistas",
    region: "Maracaípe · PE",
    status: "Em breve",
    goal: 0,
    raised: 0,
    women: 0,
    focus: "Núcleo dedicado a meninas iniciantes no surf",
    image: PHOTO("282"),
  },
  {
    id: "p6",
    title: "Bem-Viver Costeiro",
    region: "Litoral Sul · PE",
    goal: 0,
    raised: 0,
    women: 0,
    focus: "Saúde, bem-estar e educação ambiental para a comunidade",
    image: PHOTO("286"),
  },
];

export const TPM_POSTS = [
  {
    id: "n1",
    date: "—",
    category: "Transparência",
    title: "Relatório financeiro do 1º quadrimestre",
    excerpt:
      "Detalhamento da aplicação dos recursos captados, com auditoria independente.",
    image: PHOTO("389"),
  },
  {
    id: "n2",
    date: "—",
    category: "Projeto",
    title: "Surf na Baía em andamento",
    excerpt:
      "Programa de Maracaípe atende crianças e adolescentes em aulas gratuitas semanais.",
    image: PHOTO("267"),
  },
  {
    id: "n3",
    date: "—",
    category: "Formação",
    title: "Turma de empreendedorismo certifica mulheres em Porto de Galinhas",
    excerpt:
      "Formação capacita marisqueiras e artesãs com gestão financeira e marketing digital.",
    image: PHOTO("271"),
  },
  {
    id: "n4",
    date: "—",
    category: "Parceria",
    title: "Nova parceria amplia rede de cuidados no Litoral Sul",
    excerpt:
      "Aliança garante atendimento psicossocial e jurídico para mulheres da Baía de Maracaípe.",
    image: PHOTO("391"),
  },
];

export const TPM_RANKING = [];

export const TPM_RECENT_DONATIONS = [];

export const TPM_CHART = [];
export const TPM_CHART_LABELS = [];

export const TPM_GOALS = [
  { name: "Costeira (anual)", raised: 0, goal: 0, deadline: "—" },
  { name: "Núcleo Pequenas Surfistas", raised: 0, goal: 0, deadline: "—" },
  { name: "Formação em empreendedorismo", raised: 0, goal: 0, deadline: "—" },
];
