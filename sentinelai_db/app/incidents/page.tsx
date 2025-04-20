'use client'

import { createClient } from '@/app/utils/supabase/server';

export default async function Incidents() {
  const supabase = await createClient();
  const { data: incidents } = await supabase.from("incidents").select();

  return <pre>{JSON.stringify(incidents, null, 2)}</pre>
}