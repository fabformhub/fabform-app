import { supabase } from "../lib/supabaseClient.js";

// Helpers
const apiSuccess = (data) => ({ success: true, data });
const apiError = (error) => ({ success: false, error: error?.message || "Unknown error" });

/** -----------------------------
 * BLOCK FUNCTIONS
 * ----------------------------- */

// Create a block for a form (everything stored in meta)
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

// Get all blocks for a specific form, ordered by position
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
