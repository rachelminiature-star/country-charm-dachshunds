import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { SiteLayout } from "@/components/site-layout";
import { SectionHeader } from "@/components/section-header";
import { StaggerGroup, StaggerItem } from "@/components/motion";
import { PuppyCard } from "./index";
import { puppiesQuery } from "@/lib/queries";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/puppies/")({
  head: () => ({
    meta: [
      { title: "Available Puppies — Country Charm Dachshunds" },
      { name: "description", content: "Browse our available AKC-registered miniature dachshund puppies. Long-haired, short-haired, English cream, red, black & tan, dapple — all health-tested and home-raised." },
      { property: "og:title", content: "Available Puppies — Country Charm Dachshunds" },
      { property: "og:url", content: "/puppies" },
    ],
    links: [{ rel: "canonical", href: "/puppies" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(puppiesQuery()),
  component: PuppiesPage,
});

function PuppiesPage() {
  const { data } = useSuspenseQuery(puppiesQuery());
  const all = data?.data ?? [];
  const [status, setStatus] = useState<string>("all");
  const [gender, setGender] = useState<string>("all");
  const [q, setQ] = useState("");

  const filtered = all.filter((p: any) => {
    if (status !== "all" && p.status !== status) return false;
    if (gender !== "all" && p.gender !== gender) return false;
    if (q && !(`${p.name} ${p.color}`.toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  });

  return (
    <SiteLayout>
      <div className="pt-32 sm:pt-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Available now" title="Our current puppies" description="Every puppy below is raised in our home, health-checked, and ready to meet your family." />

          <div className="mt-12 flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:p-5">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or color…" className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm">
              <option value="all">All statuses</option>
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="sold">Sold</option>
            </select>
            <select value={gender} onChange={(e) => setGender(e.target.value)} className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm">
              <option value="all">All genders</option>
              <option value="female">Girls</option>
              <option value="male">Boys</option>
            </select>
          </div>

          <StaggerGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p: any) => (
              <StaggerItem key={p.id}><PuppyCard puppy={p} /></StaggerItem>
            ))}
          </StaggerGroup>

          {filtered.length === 0 && (
            <div className="mt-12 rounded-3xl border border-border bg-surface p-12 text-center">
              <p className="font-display text-2xl text-foreground">No puppies match your filters.</p>
              <p className="mt-2 text-muted-foreground">Try clearing the filters or <Link to="/contact" className="text-sand-dark underline">join the waitlist</Link>.</p>
            </div>
          )}

          <div className="my-24 text-center">
            <p className="font-display text-2xl text-foreground">Looking for something specific?</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <a href={`mailto:${SITE.email}`} className="inline-flex rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background">Email {SITE.email}</a>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
