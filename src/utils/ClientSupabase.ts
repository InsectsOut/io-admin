import { createClient } from "@supabase/supabase-js";
import { Database } from "../database-types";

const { IO_SUPABASE_KEY, IO_SUPABASE_URL } = import.meta.env;
export const supabase = createClient<Database>(IO_SUPABASE_URL, IO_SUPABASE_KEY);