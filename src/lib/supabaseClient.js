import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://vjsujzvltwhmbjrbeciz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqc3VqenZsdHdobWJqcmJlY2l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzOTYxMDMsImV4cCI6MjA5NTk3MjEwM30.5BZ3h0uEa-eWL_-TEEi301mAlSpwDuffRJG5J_Dh-Hc'
export const supabase = createClient(supabaseUrl, supabaseKey)


