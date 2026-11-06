import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { SectionHeader } from "@/components/section-header";
import { StaggerGroup, StaggerItem } from "@/components/motion";

export const Route = createFileRoute("/adoption-process")({
  head: () => ({
    meta: [
      { title: "Adoption Process — Country Charm Dachshunds" },
      { name: "description", content: "Step-by-step guide to adopting one of our miniature dachshund puppies — from inquiry to bringing your puppy home." },
      { property: "og:url", content: "/adoption-process" },
    ],
    links: [{ rel: "canonical", href: "/adoption-process" }],
  }),
  component: () => {
    const steps = [
      { n: "01", t: "Submit an application", d: "Share your family, home, and the puppy you're looking for. We read every application personally." },
      { n: "02", t: "Get to know each other", d: "A short email or live chat conversation so we can both make sure it's a wonderful fit." },
      { n: "03", t: "Reserve your puppy", d: "A $1,000 deposit secures your puppy and applies to the final adoption fee." },
      { n: "04", t: "Weekly updates", d: "You'll receive weekly photos and milestones until your puppy is ready to come home." },
      { n: "05", t: "Pickup day", d: "Visit our home at 8-10 weeks. Your puppy goes home with a starter pack and full breeder support." },
      { n: "06", t: "Lifetime support", d: "We're a text away — for questions, training, or just to share how your dog is doing." },
    ];
    return (
      <SiteLayout>
        <div className="pt-32 sm:pt-40">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <SectionHeader eyebrow="Process" title="From first inquiry to going home" description="An honest, considered process designed to set every puppy up for a wonderful life." />
            <StaggerGroup className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {steps.map((s) => (
                <StaggerItem key={s.n}>
                  <div className="rounded-3xl border border-border bg-card p-7 shadow-soft">
                    <span className="font-display text-4xl text-sand-dark">{s.n}</span>
                    <h3 className="mt-3 font-display text-xl text-foreground">{s.t}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
            <div className="my-20 text-center">
              <Link to="/contact" className="inline-flex rounded-full bg-foreground px-8 py-4 text-sm font-medium text-background">Start your application</Link>
            </div>
          </div>
        </div>
      </SiteLayout>
    );
  },
});
