import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL??"";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY??"";


 const client = createClient(supabaseUrl, supabaseAnonKey)
 const supabase = () => client;

 export default supabase;
 