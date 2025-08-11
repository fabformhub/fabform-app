import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://lbwtzoxtlssyjeututrs.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxid3R6b3h0bHNzeWpldXR1dHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4OTg2OTksImV4cCI6MjA3MDQ3NDY5OX0.GdbcTzNRo5dcuBSCr9_e_HWiXXBJWNm_IYkdwxfbDgI'
export const supabase = createClient(supabaseUrl, supabaseKey)


