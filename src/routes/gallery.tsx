import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { X } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { SectionHeader } from "@/components/section-header";
import { StaggerGroup, StaggerItem } from "@/components/motion";
import { galleryQuery } from "@/lib/queries";
import { resolveImage } from "@/lib/images";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Country Charm Dachshunds" },
      { name: "description", content: "A look inside our home — puppies, parents, and the quiet moments that make our program what it is." },
      { property: "og:url", content: "/gallery" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(galleryQuery()),
  component: GalleryPage,
});

function GalleryPage() {
  const { data } = useSuspenseQuery(galleryQuery());
  const imgs = data?.data ?? [];
  const [active, setActive] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const categories = Array.from(new Set(imgs.map((i: any) => i.category))) as string[];
  const filtered = filter === "all" ? imgs : imgs.filter((i: any) => i.category === filter);

  return (
    <SiteLayout>
      <div className="pt-32 sm:pt-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Gallery" title="Moments from our home" />
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {["all", ...categories].map((c) => (
              <button key={c} onClick={() => setFilter(c)} className={`rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] transition ${filter === c ? "border-foreground bg-foreground text-background" : "border-border bg-card text-muted-foreground hover:bg-accent"}`}>{c}</button>
            ))}
          </div>

          <StaggerGroup className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3 [column-fill:_balance]">
            {filtered.map((img: any) => (
              <StaggerItem key={img.id} className="mb-4 break-inside-avoid">
                <button onClick={() => setActive(resolveImage(img.url))} className="group block w-full overflow-hidden rounded-2xl bg-muted">
                  <img src={resolveImage(img.url)} alt={img.caption ?? ""} loading="lazy" className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                </button>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </div>

      {active && (
        <div onClick={() => setActive(null)} className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/90 p-6 backdrop-blur" role="dialog" aria-modal="true">
          <button onClick={() => setActive(null)} aria-label="Close" className="absolute right-6 top-6 grid h-12 w-12 place-items-center rounded-full glass text-white"><X /></button>
          <img src={active} alt="" className="max-h-full max-w-full rounded-2xl object-contain shadow-elegant" />
        </div>
      )}
    </SiteLayout>
  );
}
