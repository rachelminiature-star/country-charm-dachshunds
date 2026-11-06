import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { SectionHeader } from "@/components/section-header";
import { StaggerGroup, StaggerItem } from "@/components/motion";
import { testimonialsQuery } from "@/lib/queries";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title: "Testimonials — Country Charm Dachshunds" },
      { name: "description", content: "Stories from the families our miniature dachshund puppies have joined." },
      { property: "og:url", content: "/testimonials" },
    ],
    links: [{ rel: "canonical", href: "/testimonials" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(testimonialsQuery()),
  component: () => {
    const { data } = useSuspenseQuery(testimonialsQuery());
    const items = data?.data ?? [];
    return (
      <SiteLayout>
        <div className="pt-32 sm:pt-40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader eyebrow="Testimonials" title="A decade of happy homes" description="A few of the families our puppies have joined over the years." />
            <StaggerGroup className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.map((t: any) => (
                <StaggerItem key={t.id}>
                  <figure className="flex h-full flex-col rounded-3xl border border-border bg-card p-7 shadow-soft">
                    <div className="flex gap-0.5 text-sand">
                      {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                    </div>
                    <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground">"{t.body}"</blockquote>
                    <figcaption className="mt-6 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      <span className="text-foreground">{t.author_name}</span>
                      {t.author_location && <span className="ml-2">· {t.author_location}</span>}
                    </figcaption>
                  </figure>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </div>
      </SiteLayout>
    );
  },
});
