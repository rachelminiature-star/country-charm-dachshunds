import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden");
}

// ───── Dashboard stats ─────
export const getAdminStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const sb = context.supabase;
    const [puppies, messages, unread, gallery, testimonials, faqs] = await Promise.all([
      sb.from("puppies").select("status", { count: "exact", head: false }),
      sb.from("messages").select("id", { count: "exact", head: true }),
      sb.from("messages").select("id", { count: "exact", head: true }).eq("read", false),
      sb.from("gallery_images").select("id", { count: "exact", head: true }),
      sb.from("testimonials").select("id", { count: "exact", head: true }),
      sb.from("faqs").select("id", { count: "exact", head: true }),
    ]);
    const puppyRows = (puppies.data ?? []) as { status: string }[];
    return {
      puppies: {
        total: puppyRows.length,
        available: puppyRows.filter((p) => p.status === "available").length,
        reserved: puppyRows.filter((p) => p.status === "reserved").length,
        sold: puppyRows.filter((p) => p.status === "sold").length,
      },
      messages: { total: messages.count ?? 0, unread: unread.count ?? 0 },
      gallery: gallery.count ?? 0,
      testimonials: testimonials.count ?? 0,
      faqs: faqs.count ?? 0,
    };
  });

// ───── Messages ─────
export const listMessages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const markMessageRead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid(), read: z.boolean() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from("messages")
      .update({ read: data.read })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("messages").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ───── Puppies ─────
const puppySchema = z.object({
  id: z.string().uuid().optional().nullable(),
  name: z.string().trim().min(1).max(80),
  slug: z.string().trim().min(1).max(120).regex(/^[a-z0-9-]+$/, "lowercase letters, numbers, hyphens"),
  gender: z.enum(["male", "female"]),
  color: z.string().trim().min(1).max(80),
  coat: z.string().trim().max(80).optional().nullable(),
  status: z.enum(["available", "reserved", "sold"]).default("available"),
  birth_date: z.string().optional().nullable(),
  price_cents: z.number().int().min(0).max(10_000_000).default(0),
  weight_estimate: z.string().max(40).optional().nullable(),
  parents: z.string().max(160).optional().nullable(),
  description: z.string().max(4000).optional().nullable(),
  cover_image: z.string().max(500).optional().nullable(),
  images: z.array(z.string()).max(40).default([]),
  videos: z.array(z.string()).max(20).default([]),
  featured: z.boolean().default(false),
  characteristics: z.record(z.string(), z.any()).default({}),
});


export const upsertPuppy = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => puppySchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { id, ...row } = data;
    const payload = { ...row, birth_date: row.birth_date || null };
    const sb = context.supabase;
    const res = id
      ? await sb.from("puppies").update(payload).eq("id", id).select().single()
      : await sb.from("puppies").insert(payload).select().single();
    if (res.error) throw new Error(res.error.message);
    return res.data;
  });

export const deletePuppy = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("puppies").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ───── Gallery ─────
const gallerySchema = z.object({
  id: z.string().uuid().optional().nullable(),
  url: z.string().min(1).max(500),
  caption: z.string().max(300).optional().nullable(),
  category: z.string().max(60).default("general"),
  sort_order: z.number().int().default(0),
  width: z.number().int().optional().nullable(),
  height: z.number().int().optional().nullable(),
});

const galleryBatchSchema = z.array(gallerySchema.omit({ id: true })).max(50);

export const upsertGallery = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => gallerySchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { id, ...row } = data;
    const sb = context.supabase;
    const res = id
      ? await sb.from("gallery_images").update(row).eq("id", id).select().single()
      : await sb.from("gallery_images").insert(row).select().single();
    if (res.error) throw new Error(res.error.message);
    return res.data;
  });

export const batchCreateGallery = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => galleryBatchSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("gallery_images").insert(data);
    if (error) throw new Error(error.message);
    return { inserted: data.length };
  });

export const deleteGallery = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("gallery_images").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ───── Testimonials ─────
const testimonialSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  author_name: z.string().trim().min(1).max(80),
  author_location: z.string().max(120).optional().nullable(),
  rating: z.number().int().min(1).max(5).default(5),
  body: z.string().trim().min(1).max(2000),
  image_url: z.string().max(500).optional().nullable(),
  featured: z.boolean().default(false),
});

export const upsertTestimonial = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => testimonialSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { id, ...row } = data;
    const sb = context.supabase;
    const res = id
      ? await sb.from("testimonials").update(row).eq("id", id).select().single()
      : await sb.from("testimonials").insert(row).select().single();
    if (res.error) throw new Error(res.error.message);
    return res.data;
  });

export const deleteTestimonial = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("testimonials").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ───── FAQs ─────
const faqSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  question: z.string().trim().min(1).max(300),
  answer: z.string().trim().min(1).max(4000),
  category: z.string().max(60).default("general"),
  sort_order: z.number().int().default(0),
});

export const upsertFaq = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => faqSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { id, ...row } = data;
    const sb = context.supabase;
    const res = id
      ? await sb.from("faqs").update(row).eq("id", id).select().single()
      : await sb.from("faqs").insert(row).select().single();
    if (res.error) throw new Error(res.error.message);
    return res.data;
  });

export const deleteFaq = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("faqs").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ───── Site settings ─────
const SETTING_KEYS = ["hero_image"] as const;

export const setSiteSetting = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({ key: z.enum(SETTING_KEYS), value: z.string().url().max(2000).nullable() }).parse(d)
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from("site_settings" as never)
      .upsert({ key: data.key, value: data.value, updated_at: new Date().toISOString() } as never);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
