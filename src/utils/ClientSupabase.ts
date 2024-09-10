
import { createClient } from "@supabase/supabase-js";
import { Database, Tables } from "../database-types";
import { useNavigate } from "react-router-dom";

const supabaseUrl = 'https://stnrrgqnedpadgelrkbx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0bnJyZ3FuZWRwYWRnZWxya2J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTUzNDQxNDIsImV4cCI6MjAxMDkyMDE0Mn0.NIEDU3CpqCTJQfGmJInrQc_wYITz2BGSMEF08RL4s6I';
export const  supabase = createClient<Database>(supabaseUrl, supabaseKey)


