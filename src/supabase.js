import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL = "https://nukycdwifjkvmgioxqzf.supabase.co";
export const SUPABASE_ID = "nukycdwifjkvmgioxqzf";
export const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51a3ljZHdpZmprdm1naW94cXpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTM2MDY5NjQsImV4cCI6MTk2OTE4Mjk2NH0.W12czzSKPJiP86d7gXqVHNX6wEIWH5zfs5a74_a_UzU";
export const SUPABASE_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51a3ljZHdpZmprdm1naW94cXpmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY1MzYwNjk2NCwiZXhwIjoxOTY5MTgyOTY0fQ.JCek76FBezjTGdJBC-srgrayxlHwHMjYRPgatQys-ro";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase;
