// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://gzkidnfaggjdzqypnehh.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6a2lkbmZhZ2dqZHpxeXBuZWhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4OTMxNTgsImV4cCI6MjA1NzQ2OTE1OH0.BKlNWj0PVtYpuHzxqPO0zN2cVskBTuddKI7456N9G5I";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);