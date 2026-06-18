import { supabase } from "../lib/supabaseClient.js";
import { nanoid } from "nanoid";

/* ---------------------------------------------
   Shared Helpers
--------------------------------------------- */
const apiSuccess = (data) => ({ success: true, data });
const apiError = (error) => ({
  success: false,
  error: error?.message || error || "Unknown error",
});

/* ---------------------------------------------
   FORM FUNCTIONS
--------------------------------------------- */

// Generate a unique slug (collision‑safe)
async function generateUniqueSlug() {
  let slug;
  let exists = true;

  while (exists) {
    slug = nanoid(6); // short, URL‑friendly ID
    const { data } = await supabase
      .from("forms")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    exists = !!data;
  }

  return slug;
}

export async function getForm(identifier) {
  if (!identifier) return apiError("Form identifier is required");

  const isUuid =
    typeof identifier === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      .test(identifier);

  let query;

  if (isUuid) {
    // Safe UUID lookup
    query = supabase
      .from("forms")
      .select("*")
      .eq("id", identifier)
      .maybeSingle();
  } else {
    // Safe slug lookup
    query = supabase
      .from("forms")
      .select("*")
      .eq("slug", identifier)
      .maybeSingle();
  }

  const { data, error } = await query;

  if (error) return apiError(error);
  if (!data) return apiError("Form not found");

  return apiSuccess({ form: data });
}
// Get all forms for a user
export async function getFormsByUserId(userId) {
  const { data, error } = await supabase
    .from("forms")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return error ? apiError(error) : apiSuccess({ forms: data });
}

// Create a new form (with auto slug)
export async function createForm(form) {
  const slug = await generateUniqueSlug();

  const { data, error } = await supabase
    .from("forms")
    .insert({ ...form, slug })
    .select()
    .single();

  return error
    ? apiError(error)
    : apiSuccess({ id: data.id, slug: data.slug });
}

// Update a form
export async function updateForm(form) {
  if (!form?.id) return apiError("Form ID is required");

  const { data, error } = await supabase
    .from("forms")
    .update(form)
    .eq("id", form.id)
    .select()
    .single();

  return error ? apiError(error) : apiSuccess({ form: data });
}


export async function deleteFormById(formId) {
  console.log("Deleting form:", formId);

  const { data, error } = await supabase
    .from("forms")
    .delete()
    .eq("id", formId)
    .select();

  console.log({ data, error });

  if (error) return apiError(error);
  if (!data?.length) return apiError("Form not found");

  return apiSuccess({ id: data[0].id });
}


// Duplicate a form
export async function duplicateFormById(formId) {
  const { data: form, error: fetchError } = await supabase
    .from("forms")
    .select("*")
    .eq("id", formId)
    .single();

  if (fetchError) return apiError(fetchError);

  const { id, created_at, slug, ...copy } = form;

  const newSlug = await generateUniqueSlug();

  const { data, error: insertError } = await supabase
    .from("forms")
    .insert([{ ...copy, slug: newSlug, created_at: new Date() }])
    .select()
    .single();

  return insertError ? apiError(insertError) : apiSuccess({ form: data });
}

// Update slug manually
export async function updateFormSlug(formId, newSlug) {
  if (!formId) return apiError("Form ID is required");
  if (!newSlug) return apiError("New slug is required");

  const { data, error } = await supabase
    .from("forms")
    .update({ slug: newSlug })
    .eq("id", formId)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") return apiError("Slug already exists");
    return apiError(error);
  }

  return apiSuccess({ form: data });
}

// Increment views
export async function incrementFormViews(formId) {
  if (!formId) return apiError("Form ID is required");

  const { data: current, error: fetchError } = await supabase
    .from("forms")
    .select("views")
    .eq("id", formId)
    .single();

  if (fetchError) return apiError(fetchError);

  const { data, error } = await supabase
    .from("forms")
    .update({ views: current.views + 1 })
    .eq("id", formId)
    .select("views")
    .single();

  return error ? apiError(error) : apiSuccess({ views: data.views });
}

// Get view count
export async function getFormViews(formId) {
  if (!formId) return apiError("Form ID is required");

  const { data, error } = await supabase
    .from("forms")
    .select("views")
    .eq("id", formId)
    .single();

  return error ? apiError(error) : apiSuccess({ views: data.views });
}

/* ---------------------------------------------
   BLOCK FUNCTIONS 
--------------------------------------------- */

// Create a block
export async function createBlock(formId, template) {
  const meta = { ...template };

  const { data: lastBlock } = await supabase
    .from("blocks")
    .select("position")
    .eq("form_id", formId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextPosition = lastBlock ? lastBlock.position + 1 : 0;

  const { data, error } = await supabase
    .from("blocks")
    .insert({
      form_id: formId,
      position: nextPosition,
      meta,
    })
    .select()
    .single();

  return error ? apiError(error) : apiSuccess({ blockId: data.id });
}

// Get blocks for a form
export async function getBlocksByFormId(formId) {
  const { data, error } = await supabase
    .from("blocks")
    .select("*")
    .eq("form_id", formId)
    .order("position", { ascending: true });

  return error ? apiError(error) : apiSuccess({ blocks: data });
}

// Update a block
export async function updateBlock(block) {
  const { id, meta, position } = block;
  if (!id) return apiError("Missing block ID");

  const updateData = {};
  if (meta !== undefined) updateData.meta = meta;
  if (position !== undefined) updateData.position = position;

  const { data, error } = await supabase
    .from("blocks")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  return error ? apiError(error) : apiSuccess({ block: data });
}

export async function deleteBlockById(blockId) {
  console.log("Deleting block:", blockId);

  const { data, error } = await supabase
    .from("blocks")
    .delete()
    .eq("id", blockId)
    .select();

  console.log("Delete result:", { data, error });

  if (error) return apiError(error);
  if (!data?.length) return apiError("Block not found");

  return apiSuccess({ id: data[0].id });
}
