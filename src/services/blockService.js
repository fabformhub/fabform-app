import { supabase } from "../lib/supabaseClient.js";

// Helpers
const apiSuccess = (data) => ({ success: true, data });
const apiError = (error) => ({ success: false, error: error?.message || "Unknown error" });

// Delete block by ID
export async function deleteBlockById(blockId) {
  const { data, error } = await supabase
    .from("blocks")
    .delete()
    .eq("id", blockId)
    .select();

  return error ? apiError(error) : apiSuccess({ id: data[0]?.id });
}

// Create block (everything stored in meta)
export async function createBlock(formId, template) {
  // Everything from the template will be stored in the meta field
  const { ...meta } = template;

  // Get the current number of blocks for this form to determine position
  const { count, error: countError } = await supabase
    .from("blocks")
    .select("*", { count: "exact", head: true })
    .eq("form_id", formId);

  if (countError) {
    return apiError(countError);
  }

  const nextPosition = count ?? 0; // If count is null, fall back to 0

  const { data, error } = await supabase
    .from("blocks")
    .insert({
      form_id: formId,
      position: nextPosition, // Assign position here
      meta, // Store all properties inside the meta field
    })
    .select()
    .single();

  return error ? apiError(error) : apiSuccess({ blockId: data.id });
}

// Get all blocks by form ID, ordered by position
export async function getBlocksByFormId(formId) {
  const { data, error } = await supabase
    .from("blocks")
    .select("*")
    .eq("form_id", formId)
    .order("position", { ascending: true });

  return error ? apiError(error) : apiSuccess({ blocks: data });
}

// Update block by ID
export async function updateBlock(block) {

  const { id, meta, position } = block;

  if (!id) return apiError("Missing block ID");

  const { data, error } = await supabase
    .from("blocks")
    .update({ meta, position })
    .eq("id", id)
    .select()
    .single();

  return error ? apiError(error) : apiSuccess({ block: data });
}
