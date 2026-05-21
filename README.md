# I Simpósio CBMAP · 2026 — Site oficial

Site institucional e plataforma de inscrição do **I Simpósio Estadual de Combate a Incêndio Urbano** do Corpo de Bombeiros Militar do Amapá. Substitui o Google Forms com:

- Site público (Início · Sobre · Programação · Palestrantes · Local · FAQ)
- Formulário de inscrição em 4 etapas, com validações de CPF, e-mail, data e telefone
- Persistência em **Supabase (Postgres)** com unicidade de CPF e e-mail e mensagens amigáveis
- Painel administrativo com listagem, busca, filtros, paginação e **exportação CSV**
- Login restrito via **Supabase Auth** (e-mail/senha)
- Deploy pronto para **Vercel** (domínio gratuito `*.vercel.app`)

Stack: **Next.js 14 (App Router) + TypeScript**, **Supabase**, **Vercel**.

---

## 1. Pré-requisitos

- Node.js 18.17+ (recomendado 20.x)
- Conta no [Supabase](https://supabase.com)
- Conta no [Vercel](https://vercel.com) (Hobby/Free funciona)
- Git

## 2. Instalação local

```bash
git clone <este-repo>
cd Simposio_CIU
npm install
cp .env.example .env.local
# preencha .env.local com as credenciais do Supabase (passo 3)
npm run dev
# abre http://localhost:3000
```

## 3. Configurar o Supabase

1. Crie um projeto novo em https://supabase.com (Free tier basta).
2. Abra **SQL Editor** → cole o conteúdo de [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) e execute. Isso cria a tabela `inscricoes`, índices únicos para CPF e e-mail, trigger de `updated_at`, e a tabela auxiliar `admins`.
3. Em **Settings → API**, copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (segredo! nunca prefixe `NEXT_PUBLIC_`)
4. Em **Authentication → Providers**, deixe `Email` habilitado. Desabilite "Enable email signups" se quiser bloquear cadastros públicos (recomendado).
5. Crie o primeiro administrador em **Authentication → Users → Add user** (com a opção "Auto Confirm User"). Use um e-mail real do CBMAP.

### Tabela `inscricoes` — campos

| Coluna | Tipo | Observação |
|---|---|---|
| `id` | uuid pk | gerado automaticamente |
| `protocolo` | text único | ex. `2026.123.4567` |
| `email` | text | armazenado em minúsculas; índice único |
| `nome` | text | armazenado em caixa alta |
| `cpf` | text | apenas dígitos (11); índice único |
| `data_nascimento` | date | |
| `uf`, `municipio`, `telefone` | text | |
| `publico` | `Militar` \| `Civil` | |
| `posto` | text | preenchido só se Militar |
| `instituicao`, `area_atuacao` | text | |
| `necessita_certificado`, `necessita_acessibilidade`, `autoriza_imagem`, `consentimento_lgpd` | boolean | |
| `acessibilidade_desc` | text | preenchido só se acessibilidade = Sim |
| `como_soube` | text | |
| `status` | `confirmada` \| `cancelada` \| `pendente` | default `confirmada` |
| `created_at`, `updated_at` | timestamptz | trigger automático |

RLS está habilitado e **sem policies abertas** — toda escrita/leitura passa pelo backend (`service_role` key), nunca direto do navegador.

## 4. Variáveis de ambiente

Crie `.env.local` (não comitar) com:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...           # SEGREDO
ADMIN_TOKEN=                                      # opcional, para CSV via header
```

Regras de segurança aplicadas:
- `SUPABASE_SERVICE_ROLE_KEY` é usada **apenas** em rotas server-side (Server Action `submitInscricao` e API `/api/admin/export`). Nunca chega ao browser.
- Logs do servidor não imprimem dados pessoais ou chaves.
- O painel admin exige sessão Supabase válida (middleware em [`middleware.ts`](middleware.ts)).

## 5. Deploy na Vercel (domínio `*.vercel.app`)

1. Faça push do projeto para um repositório (GitHub/GitLab/Bitbucket).
2. Em https://vercel.com/new, importe o repositório.
3. Em **Environment Variables**, adicione exatamente as três variáveis do Supabase (mesmos valores do `.env.local`). Marque-as para **Production** e **Preview**.
4. (Opcional) `ADMIN_TOKEN` para permitir export via header.
5. **Deploy**. A Vercel atribui automaticamente um subdomínio gratuito `seu-projeto.vercel.app`.
6. (Opcional) Em **Settings → Domains** você pode adicionar domínio próprio depois.

> ✅ Não há configuração extra — Next.js 14 App Router é nativo na Vercel. As Server Actions e API routes rodam como funções serverless.

## 6. Acesso ao painel administrativo

- URL: `https://SEU-DOMINIO.vercel.app/admin/login`
- Use o e-mail/senha do administrador criado no Supabase (passo 3.5)
- O painel oferece:
  - Cards de resumo (total, militares, civis, certificado, acessibilidade)
  - Busca por nome, e-mail, CPF (mascarado) ou instituição
  - Filtros por público, área de atuação e certificado
  - Paginação (25 por página)
  - Botão **Exportar CSV** (UTF-8 com BOM, abre direto no Excel)
- CPF é exibido sempre **mascarado** na tela (`123.***.***-09`).

## 7. Comandos úteis

```bash
npm run dev         # desenvolvimento local
npm run build       # build de produção
npm run start       # roda o build
npm run typecheck   # checagem TypeScript
npm run lint        # ESLint
```

## 8. Estrutura

```
app/
  (site)/              # site público (compartilha SiteHeader + SiteFooter)
    page.tsx           # /
    sobre/             # /sobre
    programa/          # /programa
    palestrantes/      # /palestrantes
    local/             # /local
    faq/               # /faq
    inscricao/         # /inscricao
  admin/
    login/             # /admin/login (Supabase Auth)
    inscricoes/        # /admin/inscricoes (dashboard)
  api/
    admin/export/      # GET /api/admin/export — CSV
  erros/               # /erros (galeria visual de validações)
  layout.tsx           # layout raiz
  globals.css          # design system completo
components/            # primitives, ícones, header, footer, form-flow, etc.
lib/
  data.ts              # constantes (UFs, áreas, programação, palestrantes)
  validation.ts        # máscaras, validador de CPF, helpers de data
  inscricao-action.ts  # Server Action — INSERT na tabela `inscricoes`
  types.ts
  supabase/
    server.ts          # clientes server-side (cookie-aware + service-role)
    client.ts          # browser client
middleware.ts          # protege /admin
supabase/
  migrations/0001_init.sql
public/assets/         # brasão oficial e arte do palestrante destaque
```

## 9. Notas operacionais

- **Duplicidade**: o backend checa CPF e e-mail antes do INSERT e, mesmo assim, confia no índice único do Postgres. Em qualquer um dos casos, retorna `{ field: "cpf" | "email" }` para a UI exibir mensagem específica no campo certo, na etapa 1.
- **Protocolo**: gerado server-side (`2026.XXX.XXXX`). Em caso (raríssimo) de colisão, regenera até 3×.
- **CSV**: gerado on-the-fly via service role. Sempre usa a sessão admin do usuário; com `ADMIN_TOKEN` configurado, também aceita header `X-Admin-Token: <valor>` para scripts.
- **LGPD**: o consentimento é validado server-side (`consentimento_lgpd = true`) e gravado junto à inscrição. A coluna `autoriza_imagem` é independente.

## 10. Próximos passos sugeridos

- Confirmação de inscrição por e-mail (Supabase Edge Function ou Resend).
- Tela pública de validação de presença/QR code para o credenciamento.
- Auditoria de acessos admin em tabela própria.
