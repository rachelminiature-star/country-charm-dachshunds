import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { SectionHeader } from "@/components/section-header";

export const Route = createFileRoute("/health-guarantee")({
  head: () => ({
    meta: [
      { title: "Health Guarantee — Country Charm Dachshunds" },
      { name: "description", content: "Our comprehensive 2-year health guarantee for every Country Charm Dachshunds puppy." },
      { property: "og:url", content: "/health-guarantee" },
    ],
    links: [{ rel: "canonical", href: "/health-guarantee" }],
  }),
  component: () => (
    <SiteLayout>
      <div className="pt-32 sm:pt-40">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Health Guarantee" title="Our two-year promise" description="Every puppy we raise is protected by a comprehensive health guarantee — because peace of mind is part of what you're paying for." />
          <div className="mt-12 space-y-5">
            {[
              { t: "Genetic & hereditary coverage", d: "We guarantee against hereditary and congenital conditions that would substantially affect the dog's quality of life for 24 months from date of birth." },
              { t: "Health-tested parents", d: "Every breeding dog in our program is genetically tested for IVDD predisposition, PRA, and other breed-specific conditions." },
              { t: "Vet examination before going home", d: "A licensed veterinarian examines each puppy within 72 hours before the puppy goes home with you." },
              { t: "Vaccinations & deworming", d: "Age-appropriate vaccinations and a complete deworming protocol are administered before pickup, with full records provided." },
              { t: "Microchip identification", d: "Every puppy is microchipped and registered in your name before they leave our home." },
              { t: "Return policy", d: "If at any point in the dog's life you cannot keep them, we require they come back to us. No Country Charm puppy ever ends up in a shelter." },
            ].map((i) => (
              <div key={i.t} className="flex gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surface text-sand-dark"><ShieldCheck className="h-5 w-5" /></span>
                <div>
                  <h3 className="font-display text-xl text-foreground">{i.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{i.d}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-10 rounded-2xl bg-surface p-6 text-sm text-muted-foreground">
            The full written guarantee is included with every puppy contract and reviewed with you in detail before adoption.
          </p>
        </div>
      </div>
    </SiteLayout>
  ),
});
