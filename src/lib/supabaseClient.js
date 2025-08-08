import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://vfovxtxnruxfafqyvsxj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmb3Z4dHhucnV4ZmFmcXl2c3hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0ODgzMDMsImV4cCI6MjA1NDA2NDMwM30.77ym74HzMU8d2eZt8AiPpzYzetHSsPZJMlxSks-IQnk' 

export const supabase = createClient(supabaseUrl, supabaseKey)


