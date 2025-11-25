import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://prnsqlfmijxclrslvhxg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBybnNxbGZtaWp4Y2xyc2x2aHhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5MzExMDEsImV4cCI6MjA3ODUwNzEwMX0.HFPHnOLKFGoMjfPoSxcJzFdsc39LXQx6TChdr5LRVQQ';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL o ANON key mancante!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
