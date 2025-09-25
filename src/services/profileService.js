import { supabase } from "../lib/supabaseClient.js";

// Helpers
const apiSuccess = (data) => ({ success: true, data });
const apiError = (error) => ({ success: false, error: error?.message || "Unknown error" });

/** -----------------------------
 * PROFILE FUNCTIONS
 * ----------------------------- */

// Create a new profile for a user (default is_paid = false, start_date = now)
export async function createProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .insert({
      id: userId,
      is_paid: false // default, optional since DB default handles it
    })
    .select()
    .single();

  return error ? apiError(error) : apiSuccess({ profile: data });
}

// Get profile by user ID
export async function getProfileByUserId(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  return error ? apiError(error) : apiSuccess({ profile: data });
}

// Update profile (partial updates supported)
export async function updateProfile(profile) {
  const { id, is_paid, start_date } = profile;
  if (!id) return apiError("Missing profile ID");

  const updateData = {};
  if (is_paid !== undefined) updateData.is_paid = is_paid;
  if (start_date !== undefined) updateData.start_date = start_date;

  const { data, error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  return error ? apiError(error) : apiSuccess({ profile: data });
}

// Delete a profile by ID
export async function deleteProfileById(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .delete()
    .eq("id", userId)
    .select();

  if (error) return apiError(error);
  if (!data?.length) return apiError("Profile not found");

  return apiSuccess({ id: data[0].id });
}
