
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const supabaseUrl = 'https://lxlaikphdjcjjtyxfvpz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4bGFpa3BoZGpjamp0eXhmdnB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0NDg4MTgsImV4cCI6MjA1NzAyNDgxOH0.CBwaRYwvcwIizUmZG2ExY7Q1OPtMSwy1xFFBhGyqTYI';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
