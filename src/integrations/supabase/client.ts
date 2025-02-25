
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://ceptvxbkyatsyrpttwbj.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlcHR2eGJreWF0c3lycHR0d2JqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4NjExNDUsImV4cCI6MjA1MDQzNzE0NX0.mB8Gzd-K7pwv7mE_16NMTFoiLF58-dDPU1OJcp10iuk";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});
