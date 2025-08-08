import { supabase } from "../lib/supabaseClient.js";

// Helpers
const apiSuccess = (data) => ({ success: true, data });
const apiError = (error) => ({ success: false, error: error?.message || "Unknown error" });

// Create a new form
export async function createForm(form) {
  const { data, error } = await supabase
    .from("forms")
    .insert(form)
    .select()
    .single();

  return error ? apiError(error) : apiSuccess({ id: data.id });
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

// Delete a form by ID
export async function deleteFormById(formId) {
  const { data, error } = await supabase
    .from("forms")
    .delete()
    .eq("id", formId)
    .select();

  return error ? apiError(error) : apiSuccess({ id: data[0]?.id });
}

// Duplicate a form by ID
export async function duplicateFormById(formId) {
  // Fetch the form data to duplicate
  const { data: form, error: fetchError } = await supabase
    .from("forms")
    .select("*")
    .eq("id", formId)
    .single();

  if (fetchError) return apiError(fetchError);

  // Remove the id and created_at fields
  const { id, created_at, ...formDataToDuplicate } = form;

  // Insert the duplicated form
  const { data, error: insertError } = await supabase
    .from("forms")
    .insert([{ ...formDataToDuplicate, created_at: new Date() }])
    .select()
    .single();

  return insertError ? apiError(insertError) : apiSuccess({ form: data });
}

// Get a form by ID
export async function getFormById(formId) {
  if (!formId) return apiError("Form ID is required");

  const { data, error } = await supabase
    .from("forms")
    .select("*")
    .eq("id", formId)
    .single();

  return error ? apiError(error) : apiSuccess({ form: data });
}
