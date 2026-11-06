import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { SectionHeader } from "@/components/section-header";
import { faqsQuery } from "@/lib/queries";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Country Charm Dachshunds" },
      { name: "description", content: "Answers to common questions about our miniature dachshund puppies, our process, health guarantee, and pricing." },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(faqsQuery()),
  component: FaqPage,
});

function FaqPage() {
  const { data } = useSuspenseQuery(faqsQuery());
  const all = data?.data ?? [];
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () => all.filter((i: any) => `${i.question} ${i.answer}`.toLowerCase().includes(q.toLowerCase())),
    [all, q]
  );

  return (
    <SiteLayout>
      <div className="pt-32 sm:pt-40">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="FAQ" title="Frequently asked questions" />
          <div className="mt-10 flex items-center gap-3 rounded-2xl border border-border bg-card p-2 shadow-soft">
            <Search className="ml-3 h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search questions…" className="w-full bg-transparent px-2 py-2 text-sm focus:outline-none" />
          </div>
          <div className="mt-8 space-y-3">
            {filtered.map((f: any) => (
              <details key={f.id} className="group rounded-2xl border border-border bg-card p-6 shadow-soft open:bg-background">
                <summary className="flex cursor-pointer items-start justify-between gap-6 list-none">
                  <span className="font-display text-lg text-foreground">{f.question}</span>
                  <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-border transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{f.answer}</p>
              </details>
            ))}
            {filtered.length === 0 && <p className="text-center text-muted-foreground">No matches. Try different keywords.</p>}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
