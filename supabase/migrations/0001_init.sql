-- Schema inicial — I Simpósio CBMAP 2026
-- Aplique este arquivo no SQL Editor do Supabase ou via `supabase db push`.

create extension if not exists "pgcrypto";

create table if not exists public.inscricoes (
  id              uuid          primary key default gen_random_uuid(),
  protocolo       text          unique not null,

  -- Dados pessoais
  email           text          not null,
  nome            text          not null,
  cpf             text          not null,
  data_nascimento date          not null,
  uf              text          not null,
  municipio       text          not null,
  telefone        text          not null,

  -- Profissional
  publico         text          not null check (publico in ('Militar', 'Civil')),
  posto           text,
  instituicao     text          not null,
  area_atuacao    text          not null,

  -- Participação
  necessita_certificado boolean not null,
  necessita_acessibilidade boolean not null,
  acessibilidade_desc   text,
  como_soube           text     not null,

  -- Autorizações
  autoriza_imagem  boolean      not null,
  consentimento_lgpd boolean    not null check (consentimento_lgpd = true),

  -- Status operacional
  status          text          not null default 'confirmada'
                                check (status in ('confirmada', 'cancelada', 'pendente')),

  created_at      timestamptz   not null default now(),
  updated_at      timestamptz   not null default now()
);

create unique index if not exists inscricoes_cpf_uniq    on public.inscricoes (cpf);
create unique index if not exists inscricoes_email_uniq  on public.inscricoes (lower(email));
create index        if not exists inscricoes_created_idx on public.inscricoes (created_at desc);
create index        if not exists inscricoes_publico_idx on public.inscricoes (publico);
create index        if not exists inscricoes_area_idx    on public.inscricoes (area_atuacao);

-- Trigger para manter updated_at
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_inscricoes_updated_at on public.inscricoes;
create trigger trg_inscricoes_updated_at
  before update on public.inscricoes
  for each row execute function public.touch_updated_at();

-- RLS: bloquear acesso direto. Inserções e leituras passam pelo backend
-- com a service_role key (server actions / API routes).
alter table public.inscricoes enable row level security;

-- Nenhuma policy => apenas service_role lê/escreve. Anon não tem acesso.

-- Tabela auxiliar de administradores (associada a auth.users por id).
-- Quem estiver aqui pode acessar o painel administrativo.
create table if not exists public.admins (
  user_id   uuid primary key references auth.users(id) on delete cascade,
  nome      text,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;
create policy "admins_self_read" on public.admins
  for select using (auth.uid() = user_id);
