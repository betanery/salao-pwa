-- Gestão de Salão — schema inicial do Supabase
-- Cole este arquivo inteiro no SQL Editor do seu projeto Supabase e rode.

create extension if not exists pgcrypto;

create table if not exists profissionais (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  telefone text not null default '',
  email text not null default '',
  comissao_padrao numeric not null default 0,
  comissoes_servicos jsonb not null default '[]'::jsonb,
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

create table if not exists clientes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  telefone text not null default '',
  email text not null default '',
  criado_em timestamptz not null default now()
);

create table if not exists servicos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  categoria text not null default '',
  duracao_min integer not null default 30,
  preco numeric not null default 0,
  ativo boolean not null default true
);

create table if not exists pacote_modelos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  itens jsonb not null default '[]'::jsonb, -- [{ servicoId, quantidade }]
  preco numeric not null default 0,
  ativo boolean not null default true
);

create table if not exists pacotes_cliente (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references clientes(id) on delete cascade,
  pacote_modelo_id uuid references pacote_modelos(id) on delete set null,
  nome text not null,
  itens jsonb not null default '[]'::jsonb, -- [{ servicoId, quantidade, utilizado }]
  preco_pago numeric not null default 0,
  data_venda date not null default current_date,
  status text not null default 'ativo' check (status in ('ativo', 'finalizado'))
);

create table if not exists agendamentos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references clientes(id) on delete cascade,
  profissional_id uuid not null references profissionais(id) on delete cascade,
  servico_id uuid not null references servicos(id) on delete cascade,
  data date not null,
  horario text not null, -- 'HH:MM'
  duracao_min integer not null default 30,
  status text not null default 'agendado' check (status in ('agendado', 'concluido', 'cancelado')),
  observacao text
);

create table if not exists atendimentos (
  id uuid primary key default gen_random_uuid(),
  data date not null,
  cliente_id uuid not null references clientes(id) on delete cascade,
  profissional_id uuid not null references profissionais(id) on delete cascade,
  servico_id uuid not null references servicos(id) on delete cascade,
  tipo text not null check (tipo in ('avulso', 'pacote')),
  pacote_cliente_id uuid references pacotes_cliente(id) on delete set null,
  valor numeric not null default 0,
  comissao_tipo text not null check (comissao_tipo in ('percentual', 'fixo')),
  comissao_valor numeric not null default 0,
  valor_repasse numeric not null default 0,
  status_repasse text not null default 'a_pagar' check (status_repasse in ('a_pagar', 'pago')),
  fechamento_id uuid,
  agendamento_id uuid references agendamentos(id) on delete set null,
  criado_em timestamptz not null default now()
);

create table if not exists fechamentos (
  id uuid primary key default gen_random_uuid(),
  profissional_id uuid not null references profissionais(id) on delete cascade,
  periodo_inicio date not null,
  periodo_fim date not null,
  atendimento_ids uuid[] not null default '{}',
  pagamentos jsonb not null default '[]'::jsonb, -- [{ id, data, valor, forma, observacao }]
  criado_em timestamptz not null default now()
);

alter table atendimentos
  add constraint atendimentos_fechamento_id_fkey
  foreign key (fechamento_id) references fechamentos(id) on delete set null;

-- Perfis de usuário (vinculados ao login do Supabase Auth)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  papel text not null default 'admin' check (papel in ('admin', 'profissional')),
  profissional_id uuid references profissionais(id) on delete set null
);

-- RLS: qualquer usuário autenticado (admin ou profissional) pode ler e escrever tudo.
-- Simples e adequado para um salão único de uso interno.
alter table profissionais enable row level security;
alter table clientes enable row level security;
alter table servicos enable row level security;
alter table pacote_modelos enable row level security;
alter table pacotes_cliente enable row level security;
alter table agendamentos enable row level security;
alter table atendimentos enable row level security;
alter table fechamentos enable row level security;
alter table profiles enable row level security;

create policy "authenticated read/write" on profissionais for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated read/write" on clientes for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated read/write" on servicos for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated read/write" on pacote_modelos for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated read/write" on pacotes_cliente for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated read/write" on agendamentos for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated read/write" on atendimentos for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated read/write" on fechamentos for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "user reads own profile" on profiles for select using (auth.uid() = id);
create policy "user updates own profile" on profiles for update using (auth.uid() = id);

-- Cria automaticamente um profile (papel admin por padrão) sempre que alguém
-- é criado em auth.users — assim toda conta nova já consegue logar no app.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nome, papel)
  values (new.id, coalesce(new.raw_user_meta_data->>'nome', new.email), 'admin');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Dados iniciais de exemplo (opcional — pode apagar este bloco se preferir começar vazio)
insert into servicos (nome, categoria, duracao_min, preco) values
  ('Corte Feminino', 'Cabelo', 60, 90),
  ('Escova', 'Cabelo', 45, 60),
  ('Manicure', 'Unhas', 40, 45),
  ('Pedicure', 'Unhas', 40, 50),
  ('Design de Sobrancelha', 'Estética', 20, 35)
on conflict do nothing;
