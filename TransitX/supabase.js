import { createClient } from "@supabase/supabase-js";
import 'react-native-url-polyfill/auto'

import Constants from 'expo-constants';


const supabaseUrl = Constants.manifest.extra.Supabase;
const supabaseKey =Constants.manifest.extra.supabaseKey
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});