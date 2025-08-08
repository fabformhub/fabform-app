import { supabase } from "../lib/supabaseClient.js";

const apiSuccess = (data) => ({ success: true, data });
const apiError = (error) => ({ success: false, error: error?.message || "Unknown error" });

/**
 * Create a new response record for a given form.
 * @param {string|number} formId - The ID of the form.
 * @param {object} responseData - The filled-out form data (stored in meta).
 */
export async function createResponse(formId, responseData) {
  const { data, error } = await supabase
    .from("responses")
    .insert({
      form_id: formId,
      meta: responseData,
    })
    .select(); // Return inserted rows

  if (error) {
    return apiError(error);
  }

  return apiSuccess({ responseIds: data.map(item => item.id) });
}

/**
 * Get all responses for a specific form.
 * @param {string|number} formId - The ID of the form.
 */
export async function getResponsesByFormId(formId) {
  const { data, error } = await supabase
    .from("responses")
    .select("id, meta, created_at")
    .eq("form_id", formId)
    .order("created_at", { ascending: false });

  return error ? apiError(error) : apiSuccess({ responses: data });
}

/**
 * Count the number of responses for a specific form.
 * @param {string|number} formId - The ID of the form.
 */
export async function countResponsesByFormId(formId) {
  const { count, error } = await supabase
    .from("responses")
    .select("*", { count: "exact", head: true })
    .eq("form_id", formId);

  return error ? apiError(error) : apiSuccess({ count });
}

/**
 * Delete a response by its ID.
 * @param {string|number} responseId - The ID of the response to delete.
 */
export async function deleteResponseById(responseId) {
  const { error } = await supabase
    .from("responses")
    .delete()
    .eq("id", responseId);

  return error ? apiError(error) : apiSuccess({ deletedId: responseId });
}

/**
 * Delete multiple responses by their IDs.
 * @param {Array<string|number>} ids - Array of response IDs to delete.
 */
export async function deleteResponsesByIds(ids) {
  const { error } = await supabase
    .from("responses")
    .delete()
    .in("id", ids);

  return error ? apiError(error) : apiSuccess({ deletedIds: ids });
}
