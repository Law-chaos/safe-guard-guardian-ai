// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zjanmlzibgowgxrjzbxc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqYW5tbHppYmdvd2d4cmp6YnhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NDAzNDEsImV4cCI6MjA2MzIxNjM0MX0.3EFHkWeIqxLI9eT0nZdyIAbeROGWfdibUG6AGkNFq4I";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);