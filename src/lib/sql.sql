CREATE TABLE public.forms (
  id TEXT PRIMARY KEY DEFAULT gen_uid(12),  -- generates a 12-character ID by default
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT forms_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE INDEX idx_forms_user_id ON public.forms (user_id);

CREATE TABLE public.blocks (
  id TEXT PRIMARY KEY DEFAULT gen_uid(12),
  form_id TEXT NOT NULL,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT blocks_form_id_fkey FOREIGN KEY (form_id)
    REFERENCES forms(id) ON DELETE CASCADE
);

CREATE TABLE public.responses (
  id TEXT PRIMARY KEY DEFAULT gen_uid(12),
  form_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  meta JSONB,
  CONSTRAINT responses_form_id_fkey FOREIGN KEY (form_id)
    REFERENCES forms(id) ON DELETE CASCADE
);

CREATE INDEX idx_forms_user_id ON public.forms (user_id);
CREATE INDEX idx_blocks_form_id ON public.blocks (form_id);
CREATE INDEX idx_responses_form_id ON public.responses (form_id);
