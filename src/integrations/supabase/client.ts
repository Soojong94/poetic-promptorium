import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://viomwsfgzvbizwfvpldz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpb213c2ZnenZiaXp3ZnZwbGR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0NDQ2NjAsImV4cCI6MjA1MDAyMDY2MH0.60Lj5N5be769PALzGmoaZ5z0jefzNwPlzlF1rkw4has";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);