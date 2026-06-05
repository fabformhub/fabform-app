create table public.forms (
  id uuid not null default gen_random_uuid (),
  user_id uuid null,
  name text null,
  slug text null,
  meta jsonb null default '{}'::jsonb,
  views integer null default 0,
  created_at timestamp with time zone null default now(),
  constraint forms_pkey primary key (id),
  constraint forms_slug_key unique (slug)
) TABLESPACE pg_default;

create table public.blocks (
  id uuid not null default gen_random_uuid (),
  form_id uuid not null,
  position integer null default 0,
  meta jsonb null default '{}'::jsonb,
  created_at timestamp with time zone null default now(),
  constraint blocks_pkey primary key (id),
  constraint blocks_form_id_fkey foreign KEY (form_id) references forms (id) on delete CASCADE
) TABLESPACE pg_default;

create table public.responses (
  id text not null default gen_uid (12),
  form_id text not null,
  created_at timestamp with time zone null default now(),
  meta jsonb null,
  constraint responses_pkey primary key (id)
) TABLESPACE pg_default;

create index IF not exists idx_responses_form_id on public.responses using btree (form_id) TABLESPACE pg_default;

create table public.subscribers (
  id uuid not null default gen_random_uuid (),
  email text not null,
  created_at timestamp with time zone not null default now(),
  constraint subscribers_pkey primary key (id),
  constraint subscribers_email_key unique (email)
) TABLESPACE pg_default;


