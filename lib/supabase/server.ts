import { createClient } from "@supabase/supabase-js";

export function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
  }
  
  if (!serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }
  
  // Validate that the service key looks like a JWT (starts with eyJ)
  if (!serviceKey.startsWith("eyJ")) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY appears to be invalid (should be a JWT token starting with 'eyJ')");
  }
  
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}


