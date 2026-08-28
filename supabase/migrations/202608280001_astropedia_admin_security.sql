begin;

create table if not exists public.organization_users (
    user_id uuid primary key references auth.users(id) on delete cascade,
    organization_id uuid references public.organizations(id) on delete cascade,
    role text not null default 'member' check (role in ('member', 'admin')),
    active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint organization_users_role_scope_check check (
        (role = 'admin' and organization_id is null)
        or (role = 'member' and organization_id is not null)
    )
);

create index if not exists organization_users_organization_id_idx
    on public.organization_users (organization_id);

alter table public.organization_users enable row level security;

drop trigger if exists organization_users_set_updated_at on public.organization_users;
create trigger organization_users_set_updated_at
before update on public.organization_users
for each row execute function public.set_updated_at();

drop trigger if exists link_astropedia_account_after_signup on auth.users;
drop function if exists public.link_astropedia_account();

create function public.link_astropedia_account()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
    matched_organization_id uuid;
begin
    delete from public.organization_users where user_id = new.id;

    if lower(coalesce(new.email, '')) = 'admin@redastrum.org' then
        insert into public.organization_users (user_id, organization_id, role, active)
        values (new.id, null, 'admin', true);
        return new;
    end if;

    select organization.id
      into matched_organization_id
      from public.organizations as organization
     where lower(organization.institutional_email) = lower(new.email)
       and organization.active = true
     limit 1;

    if matched_organization_id is not null then
        insert into public.organization_users (user_id, organization_id, role, active)
        values (new.id, matched_organization_id, 'member', true);
    end if;

    return new;
end;
$$;

revoke all on function public.link_astropedia_account() from public, anon, authenticated;

create trigger link_astropedia_account_after_signup
after insert or update of email on auth.users
for each row execute function public.link_astropedia_account();

insert into public.organization_users (user_id, organization_id, role, active)
select auth_user.id, organization.id, 'member', true
  from auth.users as auth_user
  join public.organizations as organization
    on lower(organization.institutional_email) = lower(auth_user.email)
 where organization.active = true
on conflict (user_id) do update
set organization_id = excluded.organization_id,
    role = 'member',
    active = true,
    updated_at = now();

insert into public.organization_users (user_id, organization_id, role, active)
select auth_user.id, null, 'admin', true
  from auth.users as auth_user
 where lower(auth_user.email) = 'admin@redastrum.org'
on conflict (user_id) do update
set organization_id = null,
    role = 'admin',
    active = true,
    updated_at = now();

drop policy if exists "Authenticated users can view organizations" on public.organizations;
drop policy if exists "Organizations can update their own profile" on public.organizations;
drop policy if exists "Astropedia users can view organizations" on public.organizations;
drop policy if exists "Astropedia admins can update organizations" on public.organizations;

create policy "Astropedia users can view organizations"
on public.organizations for select
to authenticated
using (
    active = true
    or lower(coalesce(auth.jwt() ->> 'email', '')) = 'admin@redastrum.org'
);

create policy "Astropedia admins can update organizations"
on public.organizations for update
to authenticated
using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'admin@redastrum.org')
with check (lower(coalesce(auth.jwt() ->> 'email', '')) = 'admin@redastrum.org');

drop policy if exists "Authenticated users can view services" on public.services;
drop policy if exists "Astropedia users can view services" on public.services;
drop policy if exists "Astropedia admins can update services" on public.services;

create policy "Astropedia users can view services"
on public.services for select
to authenticated
using (
    active = true
    or lower(coalesce(auth.jwt() ->> 'email', '')) = 'admin@redastrum.org'
);

create policy "Astropedia admins can update services"
on public.services for update
to authenticated
using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'admin@redastrum.org')
with check (lower(coalesce(auth.jwt() ->> 'email', '')) = 'admin@redastrum.org');

drop policy if exists "Organizations can create requests" on public.service_requests;
drop policy if exists "Organizations can view their requests" on public.service_requests;
drop policy if exists "Members can create service requests" on public.service_requests;
drop policy if exists "Members can view their requests" on public.service_requests;
drop policy if exists "Astropedia admins can view requests" on public.service_requests;
drop policy if exists "Astropedia admins can update requests" on public.service_requests;

create policy "Members can create service requests"
on public.service_requests for insert
to authenticated
with check (
    requested_by = auth.uid()
    and exists (
        select 1
          from public.organization_users as membership
          join public.organizations as organization
            on organization.id = membership.organization_id
          join public.services as service
            on service.id = service_requests.service_id
         where membership.user_id = auth.uid()
           and membership.role = 'member'
           and membership.active = true
           and organization.id = service_requests.organization_id
           and organization.active = true
           and service.active = true
           and organization.participation >= service.minimum_participation
    )
);

create policy "Members can view their requests"
on public.service_requests for select
to authenticated
using (requested_by = auth.uid());

create policy "Astropedia admins can view requests"
on public.service_requests for select
to authenticated
using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'admin@redastrum.org');

create policy "Astropedia admins can update requests"
on public.service_requests for update
to authenticated
using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'admin@redastrum.org')
with check (lower(coalesce(auth.jwt() ->> 'email', '')) = 'admin@redastrum.org');

drop policy if exists "Users can view their Astropedia membership" on public.organization_users;
create policy "Users can view their Astropedia membership"
on public.organization_users for select
to authenticated
using (
    user_id = auth.uid()
    or lower(coalesce(auth.jwt() ->> 'email', '')) = 'admin@redastrum.org'
);

revoke all on table public.organization_users from anon;
grant select on table public.organization_users to authenticated;
revoke select on table public.organizations from authenticated;
grant select (
    id, slug, name, representative_name, representative_role,
    institutional_email, participation, ods, active, created_at, updated_at
) on public.organizations to authenticated;
grant select on table public.services, public.service_requests to authenticated;
grant update on table public.organizations, public.services, public.service_requests to authenticated;
grant insert on table public.service_requests to authenticated;

alter function public.set_updated_at() set search_path = '';
revoke all on function public.rls_auto_enable() from public, anon, authenticated;

comment on table public.organization_users is
    'Secure relationship between Supabase Auth users and Astropedia organizations or administrators.';
comment on column public.organizations.auth_user_id is
    'Deprecated. Account relationships are stored in public.organization_users.';

commit;
