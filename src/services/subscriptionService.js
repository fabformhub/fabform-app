import { supabase } from "../lib/supabaseClient.js";

const apiSuccess = (data) => ({ success: true, data });
const apiError = (error) => ({
  success: false,
  error: error?.message || error || "Unknown error",
});

/**
 * Check if a user is subscribed by email
 */
export async function checkUserSubscribed(email) {
  if (!email) return apiError("Email is required");

  const { data, error } = await supabase
    .from("subscribers")
    .select("id, email, created_at")
    .eq("email", email)
    .maybeSingle();

  if (error) return apiError(error);

  return apiSuccess({
    subscribed: !!data,
    subscriber: data || null,
  });
}
