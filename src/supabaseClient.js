import { createClient } from '@supabase/supabase-js'
const SUPABASE_URL = 'https://qvnackuutskgkqmctwst.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2bmFja3V1dHNrZ2txbWN0d3N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyOTExMDAsImV4cCI6MjA3ODg2NzEwMH0.v4I7bqXoPRUlj7YOPkbYT3uSy5N84rUd2vQSiBkERdw'
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
