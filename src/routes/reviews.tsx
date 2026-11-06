import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Star, Quote } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { SectionHeader } from "@/components/section-header";
import { StaggerGroup, StaggerItem } from "@/components/motion";
import { testimonialsQuery } from "@/lib/queries";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Reviews — Country Charm Dachshunds" },
      { name: "description", content: "Read what families say about their Country Charm Dachshund puppies — honest reviews from homes across the country." },
      { property: "og:title", content: "Reviews — Country Charm Dachshunds" },
      { property: "og:description", content: "Honest reviews from families who welcomed home one of our miniature dachshund puppies." },
      { property: "og:url", content: "/reviews" },
    ],
    links: [{ rel: "canonical", href: "/reviews" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(testimonialsQuery()),
  component: ReviewsPage,
});

function ReviewsPage() {
  const { data } = useSuspenseQuery(testimonialsQuery());
  const items = (data?.data ?? []) as any[];
  const avg = items.length ? items.reduce((s, t) => s + (t.rating ?? 5), 0) / items.length : 5;

  return (
    <SiteLayout>
      <div className="pt-32 sm:pt-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Reviews"
            title="A decade of happy homes"
            description="Honest words from the families who welcomed home one of our puppies."
          />

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 rounded-3xl border border-border bg-card px-8 py-6 shadow-soft">
            <div className="flex items-center gap-3">
              <span className="font-display text-5xl text-foreground tabular-nums">{avg.toFixed(1)}</span>
              <div>
                <div className="flex gap-0.5 text-sand">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {items.length} verified family {items.length === 1 ? "review" : "reviews"}
                </p>
              </div>
            </div>
          </div>

          <StaggerGroup className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((t) => (
              <StaggerItem key={t.id}>
                <figure className="relative flex h-full flex-col rounded-3xl border border-border bg-card p-7 shadow-soft transition-shadow hover:shadow-elegant">
                  <Quote className="absolute right-6 top-6 h-7 w-7 text-sand/30" />
                  <div className="flex gap-0.5 text-sand">
                    {Array.from({ length: t.rating ?? 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground">
                    "{t.body}"
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                    {t.image_url ? (
                      <img
                        src={t.image_url}
                        alt={t.author_name}
                        loading="lazy"
                        className="h-11 w-11 rounded-full object-cover ring-2 ring-background"
                      />
                    ) : (
                      <span className="grid h-11 w-11 place-items-center rounded-full bg-surface font-display text-base text-foreground">
                        {t.author_name?.[0] ?? "?"}
                      </span>
                    )}
                    <div>
                      <div className="text-sm font-medium text-foreground">{t.author_name}</div>
                      {t.author_location && (
                        <div className="text-xs text-muted-foreground">{t.author_location}</div>
                      )}
                    </div>
                  </figcaption>
                </figure>
              </StaggerItem>
            ))}
          </StaggerGroup>

          {items.length === 0 && (
            <p className="mt-16 text-center text-muted-foreground">No reviews yet. Check back soon.</p>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
