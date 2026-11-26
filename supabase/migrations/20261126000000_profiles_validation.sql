alter table public.profiles
  add column if not exists full_name text,
  add column if not exists phone text,
  add column if not exists avatar_url text,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table public.profiles enable row level security;

drop policy if exists "Users can view their own profile" on public.profiles;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

update public.profiles
set full_name = nullif(btrim(full_name), '')
where full_name is not null
  and full_name is distinct from nullif(btrim(full_name), '');

update public.profiles
set full_name = null
where full_name is not null
  and (
    char_length(full_name) < 2
    or char_length(full_name) > 100
    or full_name ~ '[[:cntrl:]]'
  );

update public.profiles
set avatar_url = null
where avatar_url is not null
  and (
    char_length(avatar_url) > 2048
    or avatar_url !~* '^https://[^[:space:]]+$'
    or avatar_url ~* '^https://[^/?#]*@'
  );

update public.profiles
set phone = null
where phone is not null
  and phone !~ '^\+234[789][01][0-9]{8}$';

create or replace function public.normalize_phone(raw text)
returns text
language plpgsql
immutable
as $$
declare
  digits text;
begin
  if raw is null then
    return null;
  end if;

  digits := regexp_replace(raw, '[^0-9]', '', 'g');

  if digits ~ '^0[789][01][0-9]{8}$' then
    return '+234' || substr(digits, 2);
  elsif digits ~ '^234[789][01][0-9]{8}$' then
    return '+' || digits;
  elsif digits ~ '^[789][01][0-9]{8}$' then
    return '+234' || digits;
  end if;

  return null;
end;
$$;

alter table public.profiles
  add constraint profiles_full_name_valid
    check (
      full_name is null
      or (
        full_name = btrim(full_name)
        and char_length(full_name) between 2 and 100
        and full_name !~ '[[:cntrl:]]'
      )
    ),
  add constraint profiles_phone_valid
    check (
      phone is null
      or phone ~ '^\+234[789][01][0-9]{8}$'
    ),
  add constraint profiles_avatar_url_valid
    check (
      avatar_url is null
      or (
        char_length(avatar_url) <= 2048
        and avatar_url ~* '^https://[^[:space:]]+$'
        and avatar_url !~* '^https://[^/?#]*@'
      )
    );

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_full_name text;
  v_phone text;
  v_avatar_url text;
begin
  v_full_name := nullif(btrim(new.raw_user_meta_data ->> 'full_name'), '');
  v_phone := public.normalize_phone(new.raw_user_meta_data ->> 'phone');
  v_avatar_url := nullif(btrim(new.raw_user_meta_data ->> 'avatar_url'), '');

  if v_full_name is not null
     and (
       char_length(v_full_name) < 2
       or char_length(v_full_name) > 100
       or v_full_name ~ '[[:cntrl:]]'
     ) then
    v_full_name := null;
  end if;

  if v_avatar_url is not null
     and (
       char_length(v_avatar_url) > 2048
       or v_avatar_url !~* '^https://[^[:space:]]+$'
       or v_avatar_url ~* '^https://[^/?#]*@'
     ) then
    v_avatar_url := null;
  end if;

  insert into public.profiles (id, full_name, phone, avatar_url)
  values (new.id, v_full_name, v_phone, v_avatar_url);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
