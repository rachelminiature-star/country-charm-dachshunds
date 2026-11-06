import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site-layout";
import { SectionHeader } from "@/components/section-header";
import { Reveal } from "@/components/motion";
import { galleryQuery } from "@/lib/queries";
import { resolveImage, aboutImage, breederImage } from "@/lib/images";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Country Charm Dachshunds" },
      { name: "description", content: "Two decades of devotion to the miniature dachshund. Meet the family behind our breeding program." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(galleryQuery()),
  component: AboutPage,
});

function AboutPage() {
  const { data } = useSuspenseQuery(galleryQuery());
  const imgs = (data?.data ?? []) as any[];
  const top = imgs[0]?.url ? resolveImage(imgs[0].url) : aboutImage;
  const mid = imgs[1]?.url ? resolveImage(imgs[1].url) : breederImage;

  return (
    <SiteLayout>
      <div className="pt-32 sm:pt-40">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Our story"
            title="A quiet promise, kept for twenty years."
            description="Country Charm Dachshunds began with one extraordinary little dog and a love for this breed that has never wavered."
          />
          <Reveal className="mt-12 overflow-hidden rounded-3xl shadow-elegant">
            <img src={top} alt="Our miniature dachshunds at home" className="aspect-[16/9] w-full object-cover" />
          </Reveal>
          <article className="prose prose-lg mx-auto mt-12 max-w-none text-foreground">
            <p className="text-lg leading-relaxed text-muted-foreground">
              We're a small, family-run breeding program in the heart of dachshund country. Every puppy we raise is born inside our home — not a kennel — and stays nestled in the heart of our family until the day they go home.
            </p>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Over the past two decades we've been entrusted to send hundreds of puppies into loving homes across the country. We've stayed in touch with most of those families. We've watched their puppies grow into beloved seniors. That continuity is what we're most proud of.
            </p>
            <Reveal className="my-12 overflow-hidden rounded-3xl shadow-soft">
              <img src={mid} alt="A puppy from our home" className="aspect-[4/3] w-full object-cover" />
            </Reveal>
            <h2 className="mt-12 font-display text-3xl">What we believe</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Ethical breeding means breeding less, not more. It means health testing every parent, choosing temperament over trend, and matching puppies to the right families — not the first applicant. It means standing behind every puppy we've ever bred, for the entirety of their life.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              That's the standard we hold ourselves to. It's also the standard miniature dachshunds deserve.
            </p>
          </article>

          {imgs.length > 2 && (
            <div className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
              {imgs.slice(2, 8).map((g, i) => (
                <div key={g.id ?? i} className="overflow-hidden rounded-2xl bg-muted">
                  <img src={resolveImage(g.url)} alt={g.caption ?? ""} loading="lazy" className="aspect-square w-full object-cover transition-transform duration-700 hover:scale-105" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
