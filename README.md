# 🌊 TPM — Todas Para o Mar · Frontend

Interface web da plataforma da ONG **Todas Para o Mar (TPM)** — uma organização feminista e antirracista que empodera mulheres negras e seus filhos no Litoral Sul de Pernambuco por meio da democratização do surf e de práticas socioeducativas.

---

## ✨ Sobre o projeto

Este repositório contém o **frontend** da plataforma digital da TPM, desenvolvido em React com Vite. A aplicação oferece:

- **Área pública** — apresentação da ONG, projetos, notícias, ranking de doadores e formulário de doação
- **Área de autenticação** — cadastro e login de usuários/doadores
- **Painel administrativo** — dashboard com métricas, gerenciamento de metas de arrecadação e campanhas (acesso restrito a administradores)

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
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── Layout.jsx
│   ├── AuthFrame.jsx
│   ├── RankingTable.jsx
│   ├── Charts.jsx
│   ├── Icon.jsx
│   ├── SEO.jsx
│   ├── Shared.jsx
│   └── ErrorBoundary.jsx
├── hooks/            # Hooks customizados
│   ├── useAuth.jsx   # Context de autenticação
│   ├── useQueries.js # Queries e mutations (TanStack Query)
│   └── useTheme.jsx  # Context de tema
├── lib/
│   ├── api.js        # Instância Axios + interceptors de auth
│   └── format.js     # Utilitários de formatação
├── pages/
│   ├── public/       # Páginas acessíveis sem login
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Projects.jsx
│   │   ├── Blog.jsx
│   │   ├── Donate.jsx
│   │   ├── Contact.jsx
│   │   └── Ranking.jsx
│   ├── auth/         # Login e cadastro
│   │   ├── Login.jsx
│   │   └── Signup.jsx
│   └── admin/        # Painel restrito a admins
│       ├── Dashboard.jsx
│       ├── AdminRanking.jsx
│       └── AdminCampaigns.jsx
├── styles/
│   └── theme.css     # Design system (tokens, utilitários, componentes)
├── data/             # Dados mock para desenvolvimento
├── App.jsx           # Definição de rotas
└── main.jsx          # Entry point
```

---

## 🚀 Como rodar localmente

### Pré-requisitos

- Node.js ≥ 18
- Backend da TPM rodando localmente

### Instalação

```bash
# Clone o repositório
git clone https://github.com/ONG-Todas-para-o-mar/ong-tpm-frontend.git
cd ong-tpm-frontend

# Instale as dependências
npm install
```

### Variáveis de ambiente

Copie o arquivo de exemplo e ajuste conforme necessário:

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

A aplicação estará disponível em `http://localhost:5173` e abrirá automaticamente no navegador.

---

## 📜 Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o bundle de produção em `/dist` |
| `npm run preview` | Serve o build de produção localmente |
| `npm run lint` | Analisa o código com ESLint |

---

## 🔒 Autenticação

A autenticação é baseada em **JWT (Bearer Token)**:

- O token de acesso é persistido no `localStorage` sob a chave `tpm.auth`
- O `AuthProvider` expõe `isAuthed`, `isAdmin`, `user`, `login()` e `logout()` via Context API
- O interceptor do Axios injeta automaticamente o token em todas as requisições autenticadas
- Respostas `401` limpam o estado de autenticação e redirecionam para o login

### Rotas protegidas

Rotas sob `/admin/*` são protegidas pelo componente `<RequireAdmin>`, que redireciona para `/login` caso o usuário não seja administrador.

---

## 🗺️ Rotas da aplicação

| Rota | Descrição | Acesso |
|---|---|---|
| `/` | Página inicial | Público |
| `/sobre` | Sobre a ONG | Público |
| `/projetos` | Projetos ativos | Público |
| `/noticias` | Blog / Notícias | Público |
| `/doar` | Formulário de doação | Público |
| `/contato` | Contato | Público |
| `/ranking` | Ranking de doadores | Público |
| `/login` | Login | Público |
| `/cadastro` | Cadastro de doadores | Público |
| `/admin` | Dashboard administrativo | Admin |
| `/admin/ranking` | Gerenciar ranking | Admin |
| `/admin/campanhas` | Gerenciar campanhas/metas | Admin |

---

## 🌐 Endpoints da API consumidos

| Hook | Método | Endpoint |
|---|---|---|
| `useMetas` | GET | `/metas/` |
| `useBadges` | GET | `/badges/` |
| `useRanking` | GET | `/ranking/` |
| `useDashboardPublico` | GET | `/dashboard/publico/` |
| `useMe` | GET | `/me/` |
| `useCreateDoacao` | POST | `/doacoes/` |
| `useLogin` | POST | `/auth/login/` |
| `useRegister` | POST | `/auth/register/` |
| `useCategorias` | GET | `/categorias/` |
| `useCreateMeta` | POST | `/metas/` |
| `useUpdateMeta` | PATCH | `/metas/:id/` |
| `useDeleteMeta` | DELETE | `/metas/:id/` |

---

## 🎨 Design system

Os estilos estão centralizados em `src/styles/theme.css`, com um sistema de design baseado em **CSS Custom Properties (variáveis)**. O arquivo define:

- **Tokens de cor** — paleta com suporte a tema claro/escuro
- **Tipografia** — escala de tamanhos e pesos
- **Componentes utilitários** — `.btn`, `.card`, `.tag`, `.eyebrow`, `.display`, `.wrap`, `.row`, etc.
- **Animações** — transições e micro-animações como `fade-up`

---

## 🤝 Contribuindo

1. Crie uma branch a partir de `main`: `git checkout -b feat/minha-feature`
2. Faça suas alterações seguindo os padrões do projeto
3. Rode o lint: `npm run lint`
4. Abra um Pull Request descrevendo as mudanças

---

## 📄 Licença

Este projeto é de uso interno da ONG **Todas Para o Mar**. Para mais informações, entre em contato com a equipe de desenvolvimento.
