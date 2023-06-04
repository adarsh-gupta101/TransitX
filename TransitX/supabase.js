import { createClient } from "@supabase/supabase-js";
import 'react-native-url-polyfill/auto'


const supabaseUrl = "https://yrljbdsdwdffgtddieyy.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlybGpiZHNkd2RmZmd0ZGRpZXl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODAxMTA0NTEsImV4cCI6MTk5NTY4NjQ1MX0.sy-cBRj5In39YaNBon4gUfXsplvvovPHoYdjjrh33Bw";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});