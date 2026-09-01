begin;

alter table public.organizations
    add column if not exists representative_email text,
    add column if not exists representative_phone text,
    add column if not exists account_group smallint
        check (account_group is null or account_group in (1, 2));

create table if not exists public.organization_accounts (
    id uuid primary key default gen_random_uuid(),
    organization_id uuid not null references public.organizations(id) on delete cascade,
    account_type text not null check (account_type in ('zoom', 'google_ai_pro', 'organization_email', 'representative_email')),
    title text not null,
    login_email text not null,
    login_url text,
    active boolean not null default true,
    sort_order integer not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (organization_id, account_type)
);

create table if not exists public.service_actions (
    service_id text primary key references public.services(id) on delete cascade,
    action_type text not null check (action_type in ('form', 'whatsapp', 'whatsapp_group', 'external', 'request')),
    action_url text,
    whatsapp_number text,
    detail text,
    message_template text,
    button_label text not null default 'Continuar',
    active boolean not null default true,
    updated_at timestamptz not null default now()
);

create index if not exists organization_accounts_organization_id_idx
    on public.organization_accounts (organization_id);
create index if not exists service_requests_service_id_idx
    on public.service_requests (service_id);

alter table public.organization_accounts enable row level security;
alter table public.service_actions enable row level security;

revoke all privileges on public.organization_accounts, public.service_actions from anon, authenticated;
grant select, insert, update, delete on public.organization_accounts to authenticated;
grant select, insert, update, delete on public.service_actions to authenticated;

drop policy if exists "Members can view their organization accounts" on public.organization_accounts;
create policy "Members can view their organization accounts"
on public.organization_accounts for select to authenticated
using (
    exists (
        select 1 from public.organization_users membership
        where membership.user_id = (select auth.uid())
          and membership.active = true
          and (membership.role = 'admin' or membership.organization_id = organization_accounts.organization_id)
    )
);

drop policy if exists "Astropedia admins can insert organization accounts" on public.organization_accounts;
create policy "Astropedia admins can insert organization accounts"
on public.organization_accounts for insert to authenticated
with check (exists (select 1 from public.organization_users membership where membership.user_id = (select auth.uid()) and membership.active = true and membership.role = 'admin'));

drop policy if exists "Astropedia admins can update organization accounts" on public.organization_accounts;
create policy "Astropedia admins can update organization accounts"
on public.organization_accounts for update to authenticated
using (exists (select 1 from public.organization_users membership where membership.user_id = (select auth.uid()) and membership.active = true and membership.role = 'admin'))
with check (exists (select 1 from public.organization_users membership where membership.user_id = (select auth.uid()) and membership.active = true and membership.role = 'admin'));

drop policy if exists "Astropedia admins can delete organization accounts" on public.organization_accounts;
create policy "Astropedia admins can delete organization accounts"
on public.organization_accounts for delete to authenticated
using (exists (select 1 from public.organization_users membership where membership.user_id = (select auth.uid()) and membership.active = true and membership.role = 'admin'));

drop policy if exists "Astropedia members can view service actions" on public.service_actions;
create policy "Astropedia members can view service actions"
on public.service_actions for select to authenticated
using (
    exists (
        select 1 from public.organization_users membership
        where membership.user_id = (select auth.uid())
          and membership.active = true
          and (service_actions.active = true or membership.role = 'admin')
    )
);

drop policy if exists "Astropedia admins can insert service actions" on public.service_actions;
create policy "Astropedia admins can insert service actions"
on public.service_actions for insert to authenticated
with check (exists (select 1 from public.organization_users membership where membership.user_id = (select auth.uid()) and membership.active = true and membership.role = 'admin'));

drop policy if exists "Astropedia admins can update service actions" on public.service_actions;
create policy "Astropedia admins can update service actions"
on public.service_actions for update to authenticated
using (exists (select 1 from public.organization_users membership where membership.user_id = (select auth.uid()) and membership.active = true and membership.role = 'admin'))
with check (exists (select 1 from public.organization_users membership where membership.user_id = (select auth.uid()) and membership.active = true and membership.role = 'admin'));

drop policy if exists "Astropedia admins can delete service actions" on public.service_actions;
create policy "Astropedia admins can delete service actions"
on public.service_actions for delete to authenticated
using (exists (select 1 from public.organization_users membership where membership.user_id = (select auth.uid()) and membership.active = true and membership.role = 'admin'));

-- Los datos operativos se cargan directamente en Supabase desde las fuentes
-- privadas autorizadas. No deben versionarse correos, teléfonos ni credenciales.

commit;
