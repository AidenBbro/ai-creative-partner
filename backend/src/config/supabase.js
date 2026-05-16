const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase configuration. Please set SUPABASE_URL and SUPABASE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

const initTables = async () => {
  console.log('Supabase client initialized successfully');
  console.log(`Connected to: ${supabaseUrl}`);
};

module.exports = { supabase, initTables };
