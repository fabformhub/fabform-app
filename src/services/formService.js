import { supabase } from "../lib/supabaseClient.js";

// Get a form by ID or slug
export async function getForm(identifier) {
  if (!identifier) return apiError("Form identifier is required");

  // First try fetching by ID
  let { data, error } = await supabase
    .from("forms")
    .select("*")
    .eq("id", identifier)
    .maybeSingle();  // <-- changed here

  if (data) {
    return apiSuccess({ form: data });
  }

  // If not found by ID, try fetching by slug
  ({ data, error } = await supabase
    .from("forms")
    .select("*")
    .eq("slug", identifier)
    .maybeSingle());  // <-- changed here

  if (!data) {
    return apiError(error || "Form not found");
  }

  return apiSuccess({ form: data });
}




// Get all forms by user ID
export async function getFormsByUserId(userId) {
  const { data, error } = await supabase
    .from("forms")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return error ? apiError(error) : apiSuccess({ forms: data });
}

// Helpers
const apiSuccess = (data) => ({ success: true, data });
const apiError = (error) => ({ success: false, error: error?.message || error || "Unknown error" });

/** -----------------------------
 * FORM FUNCTIONS
 * ----------------------------- */
 
// Create a new form
export async function createForm(form) {
  const { data, error } = await supabase
    .from("forms")
    .insert(form)
    .select()
    .single();

  return error ? apiError(error) : apiSuccess({ id: data.id });
}

// Update a form (supports name, meta, slug, etc.)
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

// Delete a form by ID
export async function deleteFormById(formId) {
  const { data, error } = await supabase
    .from("forms")
    .delete()
    .eq("id", formId)
    .select();

  if (error) return apiError(error);
  if (!data?.length) return apiError("Form not found");

  return apiSuccess({ id: data[0].id });
}

// Duplicate a form by ID
export async function duplicateFormById(formId) {
  const { data: form, error: fetchError } = await supabase
    .from("forms")
    .select("*")
    .eq("id", formId)
    .single();

  if (fetchError) return apiError(fetchError);

  const { id, created_at, ...formDataToDuplicate } = form;

  const { data, error: insertError } = await supabase
    .from("forms")
    .insert([{ ...formDataToDuplicate, created_at: new Date() }])
    .select()
    .single();

  return insertError ? apiError(insertError) : apiSuccess({ form: data });
}


/** -----------------------------
 * BLOCK FUNCTIONS
 * ----------------------------- */

// Create a block for a form
export async function createBlock(formId, template) {
  const meta = { ...template };

  // Get the current max position
  const { data: lastBlock, error: maxError } = await supabase
    .from("blocks")
    .select("position")
    .eq("form_id", formId)
    .order("position", { ascending: false })
    .limit(1)
    .single();

  if (maxError && maxError.code !== "PGRST116") return apiError(maxError);

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

// Get all blocks for a form
export async function getBlocksByFormId(formId) {
  const { data, error } = await supabase
    .from("blocks")
    .select("*")
    .eq("form_id", formId)
    .order("position", { ascending: true });

  return error ? apiError(error) : apiSuccess({ blocks: data });
}

// Update a block (partial updates supported)
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

// Delete a block by ID
export async function deleteBlockById(blockId) {
  const { data, error } = await supabase
    .from("blocks")
    .delete()
    .eq("id", blockId)
    .select();

  if (error) return apiError(error);
  if (!data?.length) return apiError("Block not found");

  return apiSuccess({ id: data[0].id });
}


export async function updateFormSlug(formId, newSlug) {
  if (!formId) return { success: false, error: "Form ID is required" };
  if (!newSlug) return { success: false, error: "New slug is required" };

  console.log("Updating slug:", formId, newSlug);

  const { data, error } = await supabase
    .from("forms")
    .update({ slug: newSlug })
    .eq("id", formId)
    .select()
    .single();

  if (error) {
    console.error("Supabase error:", error);
    if (error.code === "23505") return { success: false, error: "Slug already exists" };
    return { success: false, error: error.message || error };
  }

  console.log("Updated data:", data);
  return { success: true, form: data };
}

