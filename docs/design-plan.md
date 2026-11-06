# Country Charm Dachshunds — Build Plan

A luxury, light-mode breeder website with a full admin dashboard. Direction: **Minimal Sand & Slate** — bright white canvas, warm sand `#B8A082`, slate ink `#1C1B19`, subtle bronze, generous whitespace, refined serif display + clean sans body.

## Design System

- **Palette**: bg `#FFFFFF`, surface `#FBF8F4`, ink `#1C1B19`, muted `#4A4744`, sand/accent `#B8A082`, bronze hover `#8E7556`, success/sage `#7A8B7A`.
- **Type**: Cormorant Garamond (display serif) + Inter (body sans) via `@fontsource`.
- **Tokens**: define in `src/styles.css` via `@theme` (Tailwind v4). Soft shadows (`shadow-elegant`), large radii (`rounded-2xl`/`3xl`), glassmorphism utility, gradient utilities.
- **Components**: shadcn primitives restyled — Button (default/outline/ghost/premium), Card, Badge (status: available/reserved/sold), Input, Textarea, Dialog, Sheet, Accordion, Tabs, Carousel, Skeleton, Sonner toasts.
- **Motion**: Framer Motion — fade-up on scroll, staggered grids, hover lift, image zoom, hero parallax. Respect `prefers-reduced-motion`.

## Routes (TanStack Start, file-based)

Public:
- `/` Home (hero, trust strip, featured puppies, why-us, story, process, health, testimonials, gallery preview, FAQ preview, CTA, footer)
- `/puppies` Available Puppies (filters: gender/color/status, search, sort)
- `/puppies/$slug` Puppy Detail (gallery, traits, price, inquire CTA)
- `/about`, `/gallery`, `/testimonials`, `/faq`, `/contact`
- `/health-guarantee`, `/adoption-process`
- `/auth` admin sign-in

Protected (`/_authenticated/admin/*`):
- `/admin` dashboard (stats + recent activity + charts via Recharts)
- `/admin/puppies` list + create/edit drawer
- `/admin/gallery`, `/admin/testimonials`, `/admin/faqs`, `/admin/messages`

Each route has unique `head()` meta (title/description/og). Root has sitewide defaults + JSON-LD Organization. Add `public/robots.txt` and `public/sitemap.xml`.

## Layout & Global UI

- Sticky nav: transparent over hero → solid glass on scroll, mobile sheet menu, active indicators.
- Floating WhatsApp button (pulse, `https://wa.me/100000000`).
- Floating back-to-top (glass, appears after 400px).
- Footer with brand, nav, contact, social, legal.

## Backend (Lovable Cloud)

Enable Cloud. Email/password auth for admin (no public signup). Roles via `user_roles` table + `has_role()` security-definer; only `admin` can write.

### Tables (all in `public`, with grants + RLS)

- `puppies` — id, slug, name, gender, color, birth_date, price_cents, status enum (`available|reserved|sold`), description, characteristics jsonb, cover_image, images text[], featured bool, created_at.
- `gallery_images` — id, url, caption, category, sort_order.
- `testimonials` — id, author_name, author_location, rating (1-5), body, image_url, featured, created_at.
- `faqs` — id, question, answer, category, sort_order.
- `messages` — id, name, email, phone, subject, body, puppy_id?, read bool, created_at.

RLS:
- `puppies`, `gallery_images`, `testimonials`, `faqs`: SELECT to anon/authenticated; writes only `has_role(auth.uid(),'admin')`.
- `messages`: INSERT to anon; SELECT/UPDATE/DELETE only admin.
- `user_roles`: read only via `has_role`; no public access.

Storage bucket `puppy-media` (public) for puppy/gallery images, admin-only writes via RLS on `storage.objects`.

### Server functions (`src/lib/*.functions.ts`)

- Public reads (publishable client): `listPuppies`, `getPuppyBySlug`, `listGallery`, `listTestimonials`, `listFaqs`, `getHomeData`.
- Public write: `submitMessage` (Zod validation, length caps, honeypot).
- Admin (`requireSupabaseAuth` + role check): puppies/gallery/testimonials/faqs CRUD, `listMessages`, `markMessageRead`, `deleteMessage`, `getDashboardStats`.

Loaders use `queryClient.ensureQueryData` + `useSuspenseQuery`. Mutations via `useServerFn` + `useMutation` with invalidations and Sonner toasts.

## Contact Form

Two paths: writes a row to `messages` (admin inbox) AND posts to `https://formsubmit.co/info@countrycharmdachshunds.com` (email). Zod validation, honeypot `_honey`, loading/success/error states.

## Admin Dashboard

- SaaS-style shell: sidebar + topbar, breadcrumbs.
- Stats cards: total/available/reserved/sold puppies, total + unread inquiries.
- Recharts: inquiries last 30 days, status breakdown.
- Recent activity feed (latest messages + puppy changes).
- Tables with inline status updates, image uploader (multi, drag-drop, preview), confirm-delete dialogs.

## Content seeding

Seed migration inserts: ~8 puppies (mix of statuses), ~20 gallery images (placeholders via generated assets), ~12 testimonials, ~14 FAQs. Hero/about imagery generated with imagegen (premium for hero, fast for gallery placeholders) — warm, editorial, dachshund-focused, no text on images.

## Animations inventory

Hero: serif headline staggered words + soft parallax cover. Section reveals (fade-up 24px, 0.6s ease-out, stagger 0.08). Card hover: lift -4px + shadow grow + image scale 1.04. Puppy gallery: lightbox with Framer `AnimatePresence` + zoom. Testimonials: autoplay carousel with crossfade.

## Accessibility & Performance

Semantic landmarks (single `<main>` per route), labeled icon buttons, focus-visible rings, 44px tap targets, AA contrast (sand only on dark or as accent — never body text on white), `h-dvh` for hero, lazy-loaded images with width/height, `loading="lazy"`, `aspect-*` wrappers, prefers-reduced-motion gates Framer animations.

## SEO

- Per-route `head()` with title/desc/og/twitter, JSON-LD: Organization (root), Product/Pet on puppy details, FAQPage on `/faq`, BreadcrumbList on deep routes.
- Relative canonicals + og:url.
- `robots.txt` (allow all), `sitemap.xml` with placeholder base.

## Technical notes

- Tailwind v4 tokens in `src/styles.css` (`@theme`, `@theme inline` for shadcn mappings, `@utility` for custom helpers like `.glass`, `.shadow-elegant`).
- Fonts: `bun add @fontsource/cormorant-garamond @fontsource/inter framer-motion recharts react-dropzone`.
- Image uploads via `supabase.storage` from admin browser client.
- One `onAuthStateChange` in `__root.tsx`; admin gate via integration-managed `_authenticated/route.tsx`.
- `defaultPreloadStaleTime: 0`, per-request `QueryClient` in `getRouter`.

## Build order

1. Enable Lovable Cloud + migrations (tables, RLS, roles, storage, seed).
2. Design tokens + fonts + shadcn restyle + layout primitives (nav, footer, floating buttons).
3. Generate hero/about/gallery imagery.
4. Public routes (Home → Puppies → Detail → About → Gallery → Testimonials → FAQ → Contact → Health → Adoption Process).
5. Auth page + admin shell + dashboard + CRUD screens + uploader.
6. SEO files, sitemap, robots, JSON-LD.
7. Polish: motion pass, a11y pass, responsive pass.

## Out of scope (ask before adding)

- Real WhatsApp number (using placeholder `+100000000` per your note).
- Real photos (using generated imagery until you upload via admin).
- Payment/deposit collection.
- Email notifications to admin on new inquiry (FormSubmit handles email; we can add Resend later).
