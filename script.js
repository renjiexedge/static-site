// This file contains the JavaScript code for the static site.
// You can add functions to manipulate the DOM, handle events, or perform other client-side operations.

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://loqujxhskaiqlwurcrdl.supabase.co';
const supabaseKey = 'sb_publishable_PvUfGDzNIwSwF21GeRVhPw_FxAxy2fC';
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('Supabase client initialized:', supabase);

