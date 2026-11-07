import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import {
  ArrowRight,
  ShieldCheck,
  Heart,
  HomeIcon,
  Stethoscope,
  Star,
  Award,
  Sparkles,
  ShoppingBag,
} from "lucide-react";

import { SiteLayout } from "@/components/site-layout";
import { InquiryModal } from "@/components/inquiry-modal";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion";
import { SectionHeader, Eyebrow } from "@/components/section-header";
import { puppiesQuery, testimonialsQuery, faqsQuery, galleryQuery, siteSettingsQuery } from "@/lib/queries";
import { resolveImage, aboutImage, breederImage, DEFAULT_HERO_IMAGE } from "@/lib/images";
import { formatPrice, puppyAge, SITE } from "@/lib/site";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Country Charm Dachshunds — Health-Tested AKC Puppies" },
      { name: "description", content: SITE.description },
      { property: "og:title", content: "Country Charm Dachshunds" },
      { property: "og:description", content: SITE.description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: SITE.name,
          description: SITE.description,
          email: SITE.email,
          url: `https://${SITE.domain}`,
        }),
      },
    ],
  }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(puppiesQuery()),
      context.queryClient.ensureQueryData(testimonialsQuery()),
      context.queryClient.ensureQueryData(faqsQuery()),
      context.queryClient.ensureQueryData(galleryQuery()),
      context.queryClient.ensureQueryData(siteSettingsQuery()),
    ]);
  },
  component: HomePage,
});

function HomePage() {
  return (
    <SiteLayout transparentNav>
      <Hero />
      <TrustStrip />
      <FeaturedPuppies />
      <WhyChooseUs />
      <BreederStory />
      <ProcessSection />
      <HealthSection />
      <TestimonialsSection />
      <GalleryPreview />
      <FAQPreview />
      <ContactCTA />
    </SiteLayout>
  );
}

/* ---------------------------- HERO ---------------------------- */

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["0%", "18%"]);
  const scale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [1, 1.08]);

  const { data: settings } = useSuspenseQuery(siteSettingsQuery());
  const heroSrc = settings.hero_image || DEFAULT_HERO_IMAGE;

  const headline = ["Heirloom", "miniature", "dachshunds."];

  return (
    <section ref={ref} className="relative isolate min-h-dvh w-full overflow-hidden bg-foreground">
      <motion.div className="absolute inset-0 -z-10" style={{ y, scale }}>
        <img
          src={heroSrc}
          alt="A red long-haired miniature dachshund puppy in warm golden light"
          className="h-full w-full object-cover"
          width={1920}
          height={1280}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/30 via-foreground/15 to-foreground/65" />

      </motion.div>

      <div className="relative z-10 mx-auto flex min-h-dvh max-w-7xl flex-col justify-end px-4 pb-16 pt-32 sm:px-6 sm:pb-24 sm:pt-40 lg:px-8 lg:pb-32">
        <div className="max-w-3xl text-white">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white">
              <Sparkles className="h-3 w-3 text-sand" />
              AKC Registered · Health Guaranteed
            </span>
          </motion.div>

          <h1 className="mt-6 font-display text-5xl leading-[0.95] sm:text-6xl md:text-7xl lg:text-[5.5rem]">
            {headline.map((word, i) => (
              <motion.span
                key={word}
                className="inline-block mr-3"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                {i === 2 ? <span className="italic text-sand">{word}</span> : word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg"
          >
            Raised in our home — never in kennels. Health-tested, lovingly socialized, and matched with families
            who will adore them for a lifetime.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <Link
              to="/puppies"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-foreground shadow-elegant transition-transform hover:scale-[1.03]"
            >
              View Available Puppies
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 rounded-full glass px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-white/15"
            >
              Our Story
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-white/70 sm:block"
        >
          Scroll to meet our puppies
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------- TRUST STRIP ------------------------ */

function TrustStrip() {
  const items = [
    { icon: ShieldCheck, label: "2-Year Health Guarantee" },
    { icon: Award, label: "AKC Registered" },
    { icon: HomeIcon, label: "Home-raised, never kennel" },
    { icon: Stethoscope, label: "Vet-checked & vaccinated" },
  ];
  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 md:grid-cols-4 lg:px-8">
        {items.map((it) => (
          <div key={it.label} className="flex items-center gap-3 text-sm text-foreground">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-background text-sand-dark">
              <it.icon className="h-4 w-4" />
            </span>
            <span className="font-medium">{it.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------------- FEATURED PUPPIES ---------------------- */

function FeaturedPuppies() {
  const { data } = useSuspenseQuery(puppiesQuery());
  const puppies = (data?.data ?? []).filter((p: any) => p.status !== "sold");


  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-28 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <div className="max-w-xl">
          <Eyebrow>Available now</Eyebrow>
          <h2 className="mt-4 font-display text-3xl text-foreground sm:text-4xl md:text-5xl">
            Meet our current litter
          </h2>
        </div>
        <Link to="/puppies" className="group inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-sand">
          View all puppies
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <StaggerGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {puppies.map((p: any) => (
          <StaggerItem key={p.id}>
            <PuppyCard puppy={p} />
          </StaggerItem>
        ))}
        {puppies.length === 0 && (
          <p className="col-span-full text-muted-foreground">No puppies available right now — join the waitlist.</p>
        )}
      </StaggerGroup>
    </section>
  );
}

export function PuppyCard({ puppy }: { puppy: any }) {
  const cart = useCart();
  const statusStyles: Record<string, string> = {
    available: "bg-sage/15 text-[oklch(0.42_0.06_145)]",
    reserved: "bg-sand/20 text-sand-dark",
    sold: "bg-muted text-muted-foreground",
  };
  const sold = puppy.status === "sold";
  const [purchaseOpen, setPurchaseOpen] = useState(false);

  return (
    <div className="group relative overflow-hidden rounded-3xl bg-card shadow-soft ring-1 ring-border transition-all duration-300 hover:-translate-y-1 hover:shadow-elegant">
      <Link to="/puppies/$slug" params={{ slug: puppy.slug }} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-muted">
          <img
            src={resolveImage(puppy.cover_image)}
            alt={`${puppy.name} the ${puppy.color} miniature dachshund`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
          <span className={cn("absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]", statusStyles[puppy.status])}>
            {puppy.status}
          </span>
        </div>
        <div className="space-y-3 p-6 pb-4">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-display text-2xl text-foreground">{puppy.name}</h3>
            <span className="text-sm font-medium text-sand-dark">{formatPrice(puppy.price_cents)}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {puppy.gender === "male" ? "Boy" : "Girl"} · {puppy.color} · {puppyAge(puppy.birth_date)}
          </p>
        </div>
      </Link>
      <div className="flex gap-2 px-6 pb-6">
        <Link
          to="/puppies/$slug"
          params={{ slug: puppy.slug }}
          className="inline-flex min-w-0 flex-1 items-center justify-center rounded-full border border-border bg-card px-3 py-2.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
        >
          View details
        </Link>
        <button
          onClick={() => setPurchaseOpen(true)}
          disabled={sold}
          className="inline-flex min-w-0 flex-1 items-center justify-center truncate rounded-full bg-foreground px-3 py-2.5 text-xs font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-40"
        >
          Purchase {puppy.name}
        </button>
        <button
          onClick={() => {
            if (sold) return;
            cart.add({ id: puppy.id, slug: puppy.slug, name: puppy.name, price_cents: puppy.price_cents, image: puppy.cover_image, color: puppy.color, gender: puppy.gender });
            cart.setOpen(true);
          }}
          disabled={sold}
          aria-label="Add to cart"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-accent disabled:opacity-40"
        >
          <ShoppingBag className="h-4 w-4" />
        </button>
      </div>

      <InquiryModal
        puppy={{
          id: puppy.id, name: puppy.name, slug: puppy.slug, color: puppy.color,
          gender: puppy.gender, price_cents: puppy.price_cents, cover_image: puppy.cover_image,
        }}
        open={purchaseOpen}
        onOpenChange={setPurchaseOpen}
      />
    </div>
  );
}


/* -------------------------- WHY US --------------------------- */

function WhyChooseUs() {
  const features = [
    { icon: Heart, title: "Raised inside our home", body: "Every puppy is born and raised in the heart of our family — exposed daily to children, household sounds, and routines." },
    { icon: ShieldCheck, title: "Health you can trust", body: "Parents are health-tested for breed-specific conditions. Every puppy comes with a comprehensive 2-year guarantee." },
    { icon: Award, title: "Pedigree of champions", body: "Our breeding program traces back to championship lines selected for temperament, structure, and longevity." },
    { icon: Sparkles, title: "Lifetime breeder support", body: "We stay in your puppy's life forever. Questions, training, returns — you'll never be alone." },
  ];
  return (
    <section className="bg-surface py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Why families choose us"
          title="A standard of care you can feel"
          description="We breed fewer puppies than most — because every litter deserves the time, attention, and care we can only give a few families a year."
        />
        <StaggerGroup className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <StaggerItem key={f.title}>
              <div className="h-full rounded-3xl border border-border bg-card p-7 shadow-soft transition-shadow hover:shadow-elegant">
                <span className="grid h-12 w-12 place-items-center rounded-2xl gradient-sand text-white">
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-6 font-display text-xl text-foreground">{f.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

/* ----------------------- BREEDER STORY ----------------------- */

function BreederStory() {
  const { data: gallery } = useSuspenseQuery(galleryQuery());
  const imgs = (gallery?.data ?? []) as any[];
  const main = imgs[0]?.url ?? aboutImage;
  const inset = imgs[1]?.url ?? breederImage;
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-28 lg:px-8">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal className="relative">
          <div className="overflow-hidden rounded-3xl shadow-elegant">
            <img
              src={resolveImage(main)}
              alt="Our miniature dachshunds at home"
              width={1280}
              height={1280}
              loading="lazy"
              className="aspect-square w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-8 -right-4 hidden h-40 w-32 overflow-hidden rounded-2xl shadow-elegant lg:block">
            <img src={resolveImage(inset)} alt="A puppy from our home" className="h-full w-full object-cover" />
          </div>
        </Reveal>
        <Reveal>
          <Eyebrow>Our story</Eyebrow>
          <h2 className="mt-4 font-display text-3xl text-foreground text-balance sm:text-4xl md:text-5xl">
            Twenty years of devotion to one extraordinary breed.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Country Charm Dachshunds started the way every great breeder begins — with a single soul-companion of a dog
            and a quiet promise to protect what makes this breed wonderful. Two decades later we're still keeping that promise:
            small, thoughtful litters, health-tested parents, and families chosen with the same care we choose our breeding lines.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            We don't ship to wholesalers. We don't take shortcuts. We just raise beautiful, healthy, well-tempered miniature
            dachshunds — the way they deserve to be raised.
          </p>
          <div className="mt-8 flex gap-3">
            <Link to="/about" className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform hover:scale-[1.03]">
              Read our full story <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------- PROCESS --------------------------- */

function ProcessSection() {
  const steps = [
    { n: "01", t: "Submit an application", d: "Tell us about your family, home, and the puppy you're hoping to find. We read every word." },
    { n: "02", t: "Get to know each other", d: "We chat by email or live chat to make sure it's the right fit — both ways." },
    { n: "03", t: "Reserve your puppy", d: "A $1,000 deposit secures your puppy. We send weekly photos and updates until pickup." },
    { n: "04", t: "Bring them home", d: "At 8-10 weeks your puppy goes home with a complete starter pack and lifetime support." },
  ];
  return (
    <section className="bg-foreground py-24 text-white sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-sand">
            <span className="h-px w-8 bg-sand" /> The process
          </span>
          <h2 className="mt-4 font-display text-3xl text-balance text-white sm:text-4xl md:text-5xl">
            A thoughtful path from first inquiry to going home
          </h2>
        </div>
        <StaggerGroup className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <StaggerItem key={s.n}>
              <div className="relative rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur">
                <span className="font-display text-4xl text-sand">{s.n}</span>
                <h3 className="mt-3 font-display text-xl text-white">{s.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{s.d}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

/* -------------------------- HEALTH --------------------------- */

function HealthSection() {
  const { data: gallery } = useSuspenseQuery(galleryQuery());
  const imgs = (gallery?.data ?? []) as any[];
  const healthImg = imgs[2]?.url ?? "/src/assets/gallery-2.jpg";
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-28 lg:px-8">
      <div className="rounded-3xl gradient-warm p-8 sm:p-14">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <Eyebrow>Health standards</Eyebrow>
            <h2 className="mt-4 font-display text-3xl text-foreground sm:text-4xl md:text-5xl">
              A two-year guarantee. <span className="italic text-sand-dark">A lifetime of integrity.</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Every puppy leaves our home vet-checked, vaccinated, dewormed, microchipped, and protected by our written
              two-year health guarantee against hereditary and congenital conditions. Our breeding dogs are health-tested
              for the conditions that matter to this breed.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-foreground">
              {["Genetic testing on all breeding pairs", "Veterinary examination before going home", "Initial vaccinations & deworming", "Microchip registered to you", "Written 2-year health guarantee"].map((i) => (
                <li key={i} className="flex items-center gap-3">
                  <ShieldCheck className="h-4 w-4 text-sand-dark" />
                  {i}
                </li>
              ))}
            </ul>
            <Link to="/health-guarantee" className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform hover:scale-[1.03]">
              Read the full guarantee <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-3xl shadow-elegant">
              <img src={resolveImage(healthImg)} alt="One of our healthy miniature dachshund puppies" loading="lazy" className="aspect-[4/3] w-full object-cover" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ----------------------- TESTIMONIALS ------------------------ */

function TestimonialsSection() {
  const { data } = useSuspenseQuery(testimonialsQuery());
  const items = (data?.data ?? []).slice(0, 6);
  return (
    <section className="bg-surface py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Loved by families" title="A decade of happy homes" description="A few words from the families our puppies have joined." />
        <StaggerGroup className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((t: any) => (
            <StaggerItem key={t.id}>
              <figure className="flex h-full flex-col rounded-3xl border border-border bg-card p-7 shadow-soft">
                <div className="flex gap-0.5 text-sand">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground">"{t.body}"</blockquote>
                <figcaption className="mt-6 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  <span className="text-foreground">{t.author_name}</span>
                  {t.author_location && <span className="ml-2 text-muted-foreground">· {t.author_location}</span>}
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </StaggerGroup>
        <div className="mt-12 text-center">
          <Link to="/testimonials" className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-sand">
            Read more stories <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------- GALLERY --------------------------- */

function GalleryPreview() {
  const { data } = useSuspenseQuery(galleryQuery());
  const all = (data?.data ?? []) as any[];
  const fallback = ["/src/assets/puppy-1.jpg", "/src/assets/puppy-3.jpg", "/src/assets/puppy-5.jpg", "/src/assets/gallery-3.jpg", "/src/assets/puppy-4.jpg", "/src/assets/puppy-6.jpg"];
  const imgs = (all.length > 0 ? all.slice(0, 6).map((g) => g.url) : fallback);
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-28 lg:px-8">
      <SectionHeader eyebrow="Gallery" title="Moments from our home" />
      <StaggerGroup className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
        {imgs.map((url, i) => (
          <StaggerItem key={`${url}-${i}`}>
            <div className={cn("group overflow-hidden rounded-2xl bg-muted", i % 3 === 0 ? "aspect-square" : "aspect-[3/4]")}>
              <img src={resolveImage(url)} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>
      <div className="mt-10 text-center">
        <Link to="/gallery" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent">
          Explore full gallery <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

/* --------------------------- FAQ ----------------------------- */

function FAQPreview() {
  const { data } = useSuspenseQuery(faqsQuery());
  const items = (data?.data ?? []).slice(0, 5);
  return (
    <section className="bg-surface py-24 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_2fr] lg:gap-20 lg:px-8">
        <Reveal>
          <Eyebrow>Common questions</Eyebrow>
          <h2 className="mt-4 font-display text-3xl text-foreground sm:text-4xl md:text-5xl text-balance">
            Everything you'd want to ask a breeder.
          </h2>
          <p className="mt-5 text-base text-muted-foreground">Don't see your question? <Link to="/contact" className="text-sand-dark underline underline-offset-4">Ask us directly</Link>.</p>
        </Reveal>
        <div className="space-y-3">
          {items.map((q: any) => (
            <details key={q.id} className="group rounded-2xl border border-border bg-card p-6 shadow-soft transition-colors open:bg-background">
              <summary className="flex cursor-pointer items-start justify-between gap-6 list-none">
                <span className="font-display text-lg text-foreground">{q.question}</span>
                <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-border text-foreground transition-transform group-open:rotate-45">
                  <span className="text-lg leading-none">+</span>
                </span>
              </summary>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{q.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------ CONTACT CTA ------------------------ */

function ContactCTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="relative overflow-hidden rounded-[2rem] bg-foreground p-10 text-white shadow-elegant sm:p-16">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-sand/20 blur-3xl" aria-hidden />
        <div className="relative mx-auto max-w-3xl text-center">
          <Eyebrow className="text-sand">Begin your story</Eyebrow>
          <h2 className="mt-4 font-display text-3xl text-white sm:text-4xl md:text-5xl text-balance">
            Your forever puppy is closer than you think.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-white/80 sm:text-lg">
            Whether you're ready to apply or just have questions, we'd love to hear about your family.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-foreground transition-transform hover:scale-[1.03]">
              Begin your inquiry <ArrowRight className="h-4 w-4" />
            </Link>
            <a href={`mailto:${SITE.email}`} className="inline-flex items-center gap-2 rounded-full glass px-7 py-3.5 text-sm font-medium text-white hover:bg-white/15">
              Email {SITE.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
