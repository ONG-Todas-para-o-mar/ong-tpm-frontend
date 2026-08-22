# 🌊 TPM — Todas Para o Mar · Frontend

Interface web da plataforma da ONG **Todas Para o Mar (TPM)** — organização feminista e antirracista que empodera mulheres negras e seus filhos no Litoral Sul de Pernambuco por meio da democratização do surf e de práticas socioeducativas.

---

## ✨ Sobre o projeto

Este repositório contém o **frontend** da plataforma digital da TPM, em React com Vite. A aplicação oferece:

- **Área pública** — apresentação da ONG, vitrine de projetos com página de detalhe, painel de notícias, **TPM na Mídia**, **Fique por dentro**, prestação de contas, ranking de doadores, página de selos de sócio e registro de doação
- **Área de autenticação** — cadastro, login, recuperação e redefinição de senha
- **Painel do doador** — histórico de doações, selos conquistados, posição no ranking, privacidade e dados cadastrais
- **Painel administrativo** — dashboard com métricas reais, campanhas, notícias, doações, selos, mensagens e ranking

Tudo consome a API do backend em [`ong-tpm-backend`](https://github.com/ONG-Todas-para-o-mar/ong-tpm-backend) — não há mais dados mockados na aplicação.

---

## 🛠️ Tecnologias

| Camada | Tecnologia |
|---|---|
| Framework | [React 18](https://react.dev/) |
| Build tool | [Vite 5](https://vitejs.dev/) |
| Roteamento | [React Router DOM v6](https://reactrouter.com/) |
| Data fetching | [TanStack Query v5](https://tanstack.com/query) |
| HTTP client | [Axios](https://axios-http.com/) |
| Formulários | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| SEO | [React Helmet Async](https://github.com/staylor/react-helmet-async) |
| Estilos | Vanilla CSS (design system próprio em `theme.css`) |

---

## 📁 Estrutura de pastas

```
src/
├── components/       # Componentes reutilizáveis
│   ├── Header.jsx        # Nav pública/admin, menu mobile, alternador de tema
│   ├── Footer.jsx
│   ├── Layout.jsx
│   ├── AuthFrame.jsx     # Moldura das telas de autenticação
│   ├── RankingTable.jsx  # Ranking conectado à API
│   ├── Charts.jsx        # Sparkline, BarChart e AdminLayout
│   ├── Icon.jsx          # Biblioteca de ícones SVG
│   ├── SEO.jsx
│   ├── Shared.jsx        # PH, Progress, Notice, Modal, Avatar, EmptyState…
│   └── ErrorBoundary.jsx
├── hooks/
│   ├── useAuth.jsx   # Context de autenticação (JWT + refresh)
│   ├── useQueries.js # Todas as queries e mutations (TanStack Query)
│   └── useTheme.jsx  # Tema claro/escuro persistido
├── lib/
│   ├── api.js        # Axios + interceptors, refresh de token, download de CSV
│   └── format.js     # BRL, datas, plural, iniciais
├── pages/
│   ├── public/
│   │   ├── Home.jsx           ├── ProjectDetail.jsx   ├── Socios.jsx
│   │   ├── Media.jsx          ├── Feed.jsx            ├── Transparency.jsx
│   │   ├── About.jsx          ├── Blog.jsx            ├── Transparency.jsx
│   │   ├── Projects.jsx       ├── PostDetail.jsx      ├── NotFound.jsx
│   │   ├── Donate.jsx         ├── Contact.jsx         └── Ranking.jsx
│   ├── auth/
│   │   ├── Login.jsx          ├── ForgotPassword.jsx
│   │   └── Signup.jsx         └── ResetPassword.jsx
│   ├── member/
│   │   └── Account.jsx        # Painel do doador / sócio
│   └── admin/
│       ├── Dashboard.jsx      ├── AdminNews.jsx       ├── AdminMessages.jsx
│       ├── AdminCampaigns.jsx ├── AdminDonations.jsx  └── AdminRanking.jsx
│       └── AdminBadges.jsx
├── styles/
│   └── theme.css     # Design system (tokens, utilitários, responsivo)
├── data/
│   └── fotos.js      # Mapa de fotos locais usadas como fallback de capa
├── App.jsx           # Rotas + guardas de acesso
└── main.jsx          # Entry point
```

---

## 🚀 Como rodar localmente

### Pré-requisitos

- Node.js ≥ 18
- Backend da TPM rodando localmente

### Instalação

```bash
git clone https://github.com/ONG-Todas-para-o-mar/ong-tpm-frontend.git
cd ong-tpm-frontend
npm install
```

### Variáveis de ambiente

```bash
cp .env.example .env
```

| Variável | Descrição | Padrão |
|---|---|---|
| `VITE_API_URL` | URL base da API backend | `http://localhost:8000/api` |

### Rodando o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

---

## 📜 Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o bundle de produção em `/dist` |
| `npm run preview` | Serve o build de produção localmente |
| `npm run lint` | Analisa o código com ESLint |

O build usa `manualChunks` (react / data / forms) e carrega as páginas de admin e do doador
com `React.lazy`, então o bundle inicial fica leve para quem só visita o site público.

---

## 🔒 Autenticação

Autenticação baseada em **JWT (Bearer Token)**:

- Access e refresh token são persistidos no `localStorage` sob a chave `tpm.auth`
- O `AuthProvider` expõe `isAuthed`, `isAdmin`, `user`, `login()`, `logout()` e `updateUser()`
- O interceptor do Axios injeta o token em todas as requisições
- Em `401`, o interceptor tenta **renovar o access token** com o refresh antes de deslogar; só desloga se a renovação também falhar
- `403` (falta de permissão) não derruba a sessão

### Rotas protegidas

- `<RequireAuth>` — exige login; guarda a rota de origem e volta para ela depois de entrar
- `<RequireAdmin>` — exige `is_admin_ong`; usuário logado sem permissão vai para `/minha-conta`

---

## 🗺️ Rotas da aplicação

| Rota | Descrição | Acesso |
|---|---|---|
| `/` | Página inicial com números reais | Público |
| `/sobre` | Sobre a ONG | Público |
| `/projetos` | Vitrine de projetos com filtros e busca | Público |
| `/projetos/:id` | Detalhe do projeto, impacto e notícias ligadas | Público |
| `/noticias` | Painel de notícias | Público |
| `/noticias/:slug` | Matéria completa | Público |
| `/tpm-na-midia` | Reportagens em vídeo, com filtro por veículo | Público |
| `/fique-por-dentro` | Últimos posts do Instagram da ONG | Público |
| `/socios` | Selos de sócio e quem os conquistou | Público |
| `/transparencia` | Prestação de contas e registros de impacto | Público |
| `/ranking` | Ranking de doadores | Público |
| `/doar` | Registro de doação | Público (conclui logado) |
| `/contato` | Formulário de contato | Público |
| `/login` · `/cadastro` | Autenticação | Público |
| `/recuperar-senha` · `/redefinir-senha` | Recuperação de senha | Público |
| `/minha-conta` | Painel do doador / sócio | 🔒 Logado |
| `/admin` | Dashboard administrativo | 🔑 Admin |
| `/admin/campanhas` | Campanhas + registros de impacto | 🔑 Admin |
| `/admin/noticias` | Notícias (rascunho, publicar, destaque) | 🔑 Admin |
| `/admin/midia` | Vídeos do YouTube e posts do Instagram | 🔑 Admin |
| `/admin/doacoes` | Conciliação de doações + CSV | 🔑 Admin |
| `/admin/selos` | Selos de sócio e atribuição manual | 🔑 Admin |
| `/admin/mensagens` | Caixa de entrada do contato | 🔑 Admin |
| `/admin/ranking` | Ranking na visão da equipe | 🔑 Admin |
| `*` | Página 404 | Público |

---

## 🏅 Selos de sócio

O reconhecimento dos apoiadores tem três formatos, todos configuráveis em `/admin/selos`:

| Tipo | Como é concedido |
|---|---|
| **Por valor** | Automático, quando o total doado confirmado atinge o critério (ex.: Maré, Coral, Albatroz) |
| **Por recorrência** | Automático, ao completar N meses distintos com doação recorrente confirmada (ex.: Sócio Maracaípe, Sócio Fundador) |
| **Manual** | A equipe atribui pelo painel — usado para parceiras institucionais |

Quem doa de forma recorrente vira **sócio** e ganha a marcação no ranking e na página `/socios`.
A exibição pública é opt-in: em `/minha-conta` o doador sai das listas públicas sem perder os selos.

---

## 🎨 Design system

Os estilos ficam em `src/styles/theme.css`, com **CSS Custom Properties**:

- **Tokens de cor** — paleta com tema claro/escuro (alternável pelo cabeçalho e persistido)
- **Tipografia** — escala de tamanhos e pesos, com três variações de estilo (`editorial`, `bold`, `report`)
- **Utilitários** — `.btn`, `.card`, `.tag`, `.eyebrow`, `.display`, `.wrap`, `.row`, `.g2/.g3/.g4`, `.split*`
- **Tabelas** — `.table-scroll` + `.tbl` mantêm a rolagem horizontal dentro do container
- **Responsivo** — menu mobile a partir de 960px, grids que empilham e telas de auth em coluna única
- **Acessibilidade** — foco visível, `prefers-reduced-motion` e rótulos ARIA nos controles

---

## ☁️ Deploy

O build é estático (`npm run build` → `/dist`) e pode ir para qualquer host de arquivos.
Como a aplicação usa rotas do lado do cliente, o host precisa devolver `index.html`
para qualquer caminho — os dois arquivos de configuração já vêm prontos:

| Arquivo | Host |
|---|---|
| `public/_redirects` | Netlify · Cloudflare Pages |
| `vercel.json` | Vercel (rewrites + cache longo em `/assets`) |

### Mesmo domínio que a API (arranjo em produção)

Em produção o Nginx serve este build e faz proxy de `/api` para o Django no **mesmo
domínio**, então o `.env.production` do repositório já traz:

```
VITE_API_URL=/api
```

Com isso não existe CORS entre front e API, e `npm run build` no servidor sai pronto.
O passo a passo completo está em
[`DEPLOY.md`](https://github.com/ONG-Todas-para-o-mar/ong-tpm-backend/blob/main/DEPLOY.md)
no repositório do backend.

### Domínios separados

Se um dia o frontend for para outro host (Cloudflare Pages, Vercel), troque
`VITE_API_URL` pela URL pública da API — a variável é lida em tempo de build — e
inclua o domínio do site em `CORS_ALLOWED_ORIGINS` no backend.

---

## ⚠️ Fora do escopo desta entrega

- **Gateway de pagamento**: `/doar` registra a intenção de doação como `pendente`; a equipe combina o pagamento por e-mail e confirma em `/admin/doacoes`. Nenhum dado financeiro é coletado na plataforma.
- **Loja / venda de produtos**.

---

## 🤝 Contribuindo

1. Crie uma branch a partir de `main`: `git checkout -b feat/minha-feature`
2. Faça suas alterações seguindo os padrões do projeto
3. Rode o lint: `npm run lint`
4. Abra um Pull Request descrevendo as mudanças

---

## 📄 Licença

Este projeto é de uso interno da ONG **Todas Para o Mar**. Para mais informações, entre em contato com a equipe de desenvolvimento.
