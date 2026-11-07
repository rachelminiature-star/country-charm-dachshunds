import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

function getPublicClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } }
  );
}

export const listPuppies = createServerFn({ method: "GET" }).handler(async () => {
  const sb = getPublicClient();
  const { data, error } = await sb
    .from("puppies" as never)
    .select("*")
    .order("status", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) return { data: [] as any[], error: error.message };
  return { data: (data ?? []) as any[], error: null };
});

export const getPuppyBySlug = createServerFn({ method: "GET" })
  .inputValidator((input) => z.object({ slug: z.string().min(1).max(120) }).parse(input))
  .handler(async ({ data }) => {
    const sb = getPublicClient();
    const { data: row, error } = await sb
      .from("puppies" as never)
      .select("*")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) return { data: null, error: error.message };
    return { data: row as any, error: null };
  });

export const listGallery = createServerFn({ method: "GET" }).handler(async () => {
  const sb = getPublicClient();
  const { data, error } = await sb
    .from("gallery_images" as never)
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) return { data: [] as any[], error: error.message };
  return { data: (data ?? []) as any[], error: null };
});

export const listTestimonials = createServerFn({ method: "GET" }).handler(async () => {
  const sb = getPublicClient();
  const { data, error } = await sb
    .from("testimonials" as never)
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return { data: [] as any[], error: error.message };
  return { data: (data ?? []) as any[], error: null };
});

export const listFaqs = createServerFn({ method: "GET" }).handler(async () => {
  const sb = getPublicClient();
  const { data, error } = await sb
    .from("faqs" as never)
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) return { data: [] as any[], error: error.message };
  return { data: (data ?? []) as any[], error: null };
});

const messageSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional(),
  subject: z.string().trim().max(160).optional(),
  body: z.string().trim().min(10).max(4000),
  puppy_id: z.string().uuid().optional().nullable(),
  honeypot: z.string().max(0).optional(),
});

export const submitMessage = createServerFn({ method: "POST" })
  .inputValidator((input) => messageSchema.parse(input))
  .handler(async ({ data }) => {
    if (data.honeypot) return { ok: true };
    const sb = getPublicClient();
    const { error } = await sb.from("messages" as never).insert({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      subject: data.subject || null,
      body: data.body,
      puppy_id: data.puppy_id || null,
    } as never);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ───── Site settings (e.g. homepage hero image) ─────
export const getSiteSettings = createServerFn({ method: "GET" }).handler(async () => {
  const sb = getPublicClient();
  const { data, error } = await sb.from("site_settings" as never).select("key, value");
  const settings: Record<string, string | null> = {};
  if (!error) for (const row of (data ?? []) as { key: string; value: string | null }[]) settings[row.key] = row.value;
  return settings;
});
