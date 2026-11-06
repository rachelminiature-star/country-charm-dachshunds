"use client";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, ShieldCheck, ShoppingBag, MessageCircle, Play } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { Button } from "@/components/ui/button";
import { InquiryModal } from "@/components/inquiry-modal";
import { puppyQuery } from "@/lib/queries";
import { resolveImage } from "@/lib/images";
import { formatPrice, puppyAge, SITE } from "@/lib/site";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/puppies/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(puppyQuery(params.slug));
    if (!data?.data) throw notFound();
  },
  head: ({ params }) => ({
    meta: [
      { title: `Meet a Puppy — Country Charm Dachshunds` },
      { name: "description", content: `A health-tested AKC miniature dachshund puppy from Country Charm Dachshunds.` },
      { property: "og:url", content: `/puppies/${params.slug}` },
      { property: "og:type", content: "product" },
    ],
    links: [{ rel: "canonical", href: `/puppies/${params.slug}` }],
  }),
  component: PuppyDetail,
  errorComponent: ({ error }: { error: unknown }) => (
    <SiteLayout>
      <div className="mx-auto max-w-2xl px-6 py-40 text-center">
        <h1 className="font-display text-3xl">Something went wrong</h1>
        <p className="mt-3 text-muted-foreground">{error instanceof Error ? error.message : String(error)}</p>
        <Link to="/puppies" className="mt-6 inline-flex rounded-full bg-foreground px-6 py-3 text-sm text-background">Back to puppies</Link>
      </div>
    </SiteLayout>
  ),
  notFoundComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-2xl px-6 py-40 text-center">
        <h1 className="font-display text-4xl">Puppy not found</h1>
        <Link to="/puppies" className="mt-6 inline-flex rounded-full bg-foreground px-6 py-3 text-sm text-background">Back to puppies</Link>
      </div>
    </SiteLayout>
  ),
});

type Media = { kind: "image" | "video"; url: string };

function PuppyDetail() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(puppyQuery(slug));
  const p = data?.data;
  const cart = useCart();
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [active, setActive] = useState(0);

  if (!p) return null;

  const characteristics: string[] = Array.isArray(p.characteristics) ? p.characteristics : [];
  const imageList: string[] = (p.images && p.images.length > 0) ? p.images : (p.cover_image ? [p.cover_image] : []);
  const videoList: string[] = Array.isArray(p.videos) ? p.videos : [];
  const media: Media[] = [
    ...imageList.map((url) => ({ kind: "image" as const, url })),
    ...videoList.map((url) => ({ kind: "video" as const, url })),
  ];
  const current = media[active] ?? { kind: "image" as const, url: p.cover_image ?? "" };
  const sold = p.status === "sold";

  function addToCart() {
    cart.add({
      id: p.id,
      slug: p.slug,
      name: p.name,
      price_cents: p.price_cents,
      image: p.cover_image ?? imageList[0] ?? "",
      color: p.color,
      gender: p.gender,
    });
    cart.setOpen(true);
    toast.success(`${p.name} added to your cart`);
  }

  return (
    <SiteLayout>
      <article className="pt-28 pb-24 sm:pt-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link to="/puppies" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to all puppies
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
            {/* MEDIA */}
            <div className="space-y-4">
              <motion.div
                key={current.url + active}
                initial={{ opacity: 0.4, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                className="overflow-hidden rounded-3xl bg-muted shadow-elegant"
              >
                {current.kind === "video" ? (
                  <video src={current.url} controls playsInline className="aspect-[4/5] w-full bg-black object-cover" />
                ) : (
                  <img src={resolveImage(current.url)} alt={p.name} className="aspect-[4/5] w-full object-cover" />
                )}
              </motion.div>
              {media.length > 1 && (
                <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
                  {media.map((m, i) => (
                    <button
                      key={`${m.url}-${i}`}
                      onClick={() => setActive(i)}
                      className={cn(
                        "group relative aspect-square overflow-hidden rounded-2xl bg-muted ring-2 transition-all",
                        active === i ? "ring-foreground" : "ring-transparent hover:ring-border"
                      )}
                      aria-label={`View ${m.kind} ${i + 1}`}
                    >
                      {m.kind === "video" ? (
                        <>
                          <video src={m.url} muted className="h-full w-full object-cover" />
                          <span className="absolute inset-0 grid place-items-center bg-black/30">
                            <Play className="h-5 w-5 fill-white text-white" />
                          </span>
                        </>
                      ) : (
                        <img src={resolveImage(m.url)} alt="" loading="lazy" className="h-full w-full object-cover" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* DETAILS */}
            <div>
              <span className={cn(
                "inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]",
                p.status === "available" && "bg-sage/15 text-[oklch(0.42_0.06_145)]",
                p.status === "reserved" && "bg-sand/20 text-sand-dark",
                p.status === "sold" && "bg-muted text-muted-foreground"
              )}>{p.status}</span>
              <h1 className="mt-4 font-display text-5xl text-foreground sm:text-6xl">{p.name}</h1>
              <p className="mt-3 text-lg text-muted-foreground">
                {p.gender === "male" ? "Boy" : "Girl"} · {p.color}{p.coat ? ` · ${p.coat}` : ""} · {puppyAge(p.birth_date)}
              </p>

              <p className="mt-4 font-display text-4xl text-sand-dark">{formatPrice(p.price_cents)}</p>

              {p.description && (
                <p className="mt-8 text-base leading-relaxed text-foreground">{p.description}</p>
              )}

              {characteristics.length > 0 && (
                <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {characteristics.map((c) => (
                    <li key={c} className="flex items-center gap-3 text-sm text-foreground">
                      <Check className="h-4 w-4 text-sand-dark" /> {c}
                    </li>
                  ))}
                </ul>
              )}

              {p.parents && (
                <p className="mt-8 rounded-2xl bg-surface p-5 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Pedigree:</span> {p.parents}
                </p>
              )}

              <div className="mt-10 flex flex-wrap gap-3">
                <Button
                  size="lg"
                  onClick={() => setInquiryOpen(true)}
                  disabled={sold}
                  className="h-12 rounded-full bg-foreground px-7 text-sm font-medium text-background hover:bg-foreground/90"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  {sold ? "Sold" : `Purchase ${p.name}`}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={addToCart}
                  disabled={sold}
                  className="h-12 rounded-full border-border px-7 text-sm font-medium"
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Add to cart
                </Button>
                <a
                  href={`mailto:${SITE.email}?subject=${encodeURIComponent(`Inquiry: ${p.name}`)}&body=${encodeURIComponent(`Hi, I'm interested in ${p.name} (${p.color}) — ${formatPrice(p.price_cents)}.`)}`}
                  className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-card px-7 text-sm font-medium text-foreground hover:bg-accent"
                >
                  Email us
                </a>
              </div>

              <div className="mt-8 flex items-center gap-3 rounded-2xl bg-surface p-4 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-sand-dark" />
                Comes with our 2-year health guarantee, AKC registration, and lifetime breeder support.
              </div>
            </div>
          </div>
        </div>
      </article>

      <InquiryModal
        puppy={{
          id: p.id, name: p.name, slug: p.slug, color: p.color,
          gender: p.gender, price_cents: p.price_cents, cover_image: p.cover_image,
        }}
        open={inquiryOpen}
        onOpenChange={setInquiryOpen}
      />
    </SiteLayout>
  );
}
