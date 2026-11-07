import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { getSiteSettings } from "@/lib/site-data.functions";
import { setSiteSetting } from "@/lib/admin.functions";
import { DEFAULT_HERO_IMAGE } from "@/lib/images";
import { Button } from "@/components/ui/button";
import { Upload, RotateCcw, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/homepage")({
  component: HomepageAdmin,
});

function HomepageAdmin() {
  const getFn = useServerFn(getSiteSettings);
  const setFn = useServerFn(setSiteSetting);
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const { data: settings, isLoading } = useQuery({ queryKey: ["site-settings"], queryFn: () => getFn() });
  const current = settings?.hero_image || DEFAULT_HERO_IMAGE;
  const isDefault = !settings?.hero_image;

  const saveMut = useMutation({
    mutationFn: (value: string | null) => setFn({ data: { key: "hero_image", value } }),
    onSuccess: (_, value) => {
      qc.invalidateQueries({ queryKey: ["site-settings"] });
      toast.success(value ? "Homepage image updated" : "Reset to the default image");
    },
    onError: (e: any) => toast.error(e.message),
  });

  async function upload(file: File) {
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file");
    if (file.size > 15 * 1024 * 1024) return toast.error("Image is too large (max 15 MB)");
    setUploading(true);
    try {
      const path = `hero/${Date.now()}-${file.name.replace(/[^a-z0-9.-]/gi, "_")}`;
      const { error } = await supabase.storage.from("puppy-media").upload(path, file, { contentType: file.type });
      if (error) throw error;
      const { data: pub } = supabase.storage.from("puppy-media").getPublicUrl(path);
      await saveMut.mutateAsync(pub.publicUrl);
    } catch (e: any) {
      toast.error(e.message ?? "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const busy = uploading || saveMut.isPending;

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="font-display text-3xl">Homepage</h1>
        <p className="text-muted-foreground mt-1">Change the large background photo at the top of the homepage.</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 space-y-5">
        <div>
          <h2 className="font-medium">Hero background image</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Best results: a landscape photo at least 1920px wide. The puppy should sit toward the top or centre,
            since the headline covers the bottom-left of the image.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-border bg-muted aspect-[16/9]">
          {isLoading ? (
            <div className="absolute inset-0 grid place-items-center text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : (
            <>
              <img src={current} alt="Current homepage hero" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-foreground/30 via-foreground/15 to-foreground/65" />
              <div className="absolute bottom-4 left-4 text-white font-display text-2xl sm:text-3xl">
                Heirloom miniature dachshunds.
              </div>
              <span className="absolute top-3 right-3 rounded-full bg-background/90 px-3 py-1 text-xs font-medium">
                {isDefault ? "Default image" : "Custom image"}
              </span>
            </>
          )}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }}
        />
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => fileRef.current?.click()} disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
            {busy ? "Saving…" : "Upload new image"}
          </Button>
          {!isDefault && (
            <Button
              variant="outline"
              disabled={busy}
              onClick={() => { if (confirm("Go back to the default homepage image?")) saveMut.mutate(null); }}
            >
              <RotateCcw className="h-4 w-4 mr-2" /> Reset to default
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
