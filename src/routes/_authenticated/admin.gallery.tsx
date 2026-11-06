import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listGallery } from "@/lib/site-data.functions";
import { upsertGallery, batchCreateGallery, deleteGallery } from "@/lib/admin.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Upload, Images, X } from "lucide-react";
import { toast } from "sonner";
import { resolveImage } from "@/lib/images";

export const Route = createFileRoute("/_authenticated/admin/gallery")({
  component: GalleryAdmin,
});

const EMPTY = { id: null as string | null, url: "", caption: "", category: "general", sort_order: 0, width: null as number | null, height: null as number | null };

function GalleryAdmin() {
  const listFn = useServerFn(listGallery);
  const upsertFn = useServerFn(upsertGallery);
  const batchCreateFn = useServerFn(batchCreateGallery);
  const delFn = useServerFn(deleteGallery);
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["gallery"], queryFn: () => listFn() });
  const items = data?.data ?? [];
  const [editing, setEditing] = useState<typeof EMPTY | null>(null);
  const [bulkOpen, setBulkOpen] = useState(false);

  const saveMut = useMutation({
    mutationFn: (v: typeof EMPTY) => upsertFn({ data: v as any }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["gallery"] }); qc.invalidateQueries({ queryKey: ["admin"] }); toast.success("Saved"); setEditing(null); },
    onError: (e: any) => toast.error(e.message),
  });
  const delMut = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["gallery"] }); toast.success("Deleted"); },
  });

  async function upload(file: File) {
    const path = `gallery/${Date.now()}-${file.name.replace(/[^a-z0-9.-]/gi, "_")}`;
    const { error } = await supabase.storage.from("puppy-media").upload(path, file);
    if (error) return toast.error(error.message);
    const { data: pub } = supabase.storage.from("puppy-media").getPublicUrl(path);
    setEditing((e) => e ? { ...e, url: pub.publicUrl } : e);
  }

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Gallery</h1>
          <p className="text-muted-foreground mt-1">Photos featured across the site.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setBulkOpen(true)}><Images className="h-4 w-4 mr-2" /> Upload many</Button>
          <Button onClick={() => setEditing({ ...EMPTY })}><Plus className="h-4 w-4 mr-2" /> Add image</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((g: any) => (
          <div key={g.id} className="group relative overflow-hidden rounded-xl border border-border bg-card">
            <img src={resolveImage(g.url)} alt={g.caption ?? ""} className="aspect-square w-full object-cover" />
            <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
              <Button size="sm" variant="secondary" onClick={() => setEditing({ ...EMPTY, ...g })}><Pencil className="h-3.5 w-3.5" /></Button>
              <Button size="sm" variant="destructive" onClick={() => { if (confirm("Delete?")) delMut.mutate(g.id); }}><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing?.id ? "Edit image" : "Add image"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              {editing.url && <img src={resolveImage(editing.url)} alt="" className="w-full aspect-video object-cover rounded-lg" />}
              <div className="space-y-1.5">
                <Label>Image URL</Label>
                <div className="flex gap-2">
                  <Input value={editing.url} onChange={(e) => setEditing({ ...editing, url: e.target.value })} placeholder="URL or upload" />
                  <label className="cursor-pointer">
                    <input type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm hover:bg-accent"><Upload className="h-3.5 w-3.5" />Upload</span>
                  </label>
                </div>
              </div>
              <div className="space-y-1.5"><Label>Caption</Label><Input value={editing.caption ?? ""} onChange={(e) => setEditing({ ...editing, caption: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label>Category</Label><Input value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>Sort order</Label><Input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} /></div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={() => editing && saveMut.mutate(editing)} disabled={saveMut.isPending}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BulkUploadDialog
        open={bulkOpen}
        onOpenChange={setBulkOpen}
        existingCount={items.length}
        batchCreateFn={batchCreateFn}
        onSuccess={() => { qc.invalidateQueries({ queryKey: ["gallery"] }); qc.invalidateQueries({ queryKey: ["admin"] }); }}
      />
    </div>
  );
}

interface BulkUploadDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  existingCount: number;
  batchCreateFn: (args: { data: any[] }) => Promise<{ inserted: number }>;
  onSuccess: () => void;
}

function BulkUploadDialog({ open, onOpenChange, existingCount, batchCreateFn, onSuccess }: BulkUploadDialogProps) {
  const [files, setFiles] = useState<{ file: File; preview: string; caption: string; status: "pending" | "uploading" | "done" | "error"; error?: string }[]>([]);
  const [category, setCategory] = useState("general");
  const [overall, setOverall] = useState<{ done: number; total: number; phase: "idle" | "uploading" | "creating" }>({ done: 0, total: 0, phase: "idle" });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const filesRef = useRef(files);
  filesRef.current = files;

  useEffect(() => {
    return () => {
      filesRef.current.forEach((f) => URL.revokeObjectURL(f.preview));
    };
  }, []);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;
    const newFiles = selected.map((file) => ({ file, preview: URL.createObjectURL(file), caption: "", status: "pending" as const }));
    setFiles((prev) => [...prev, ...newFiles]);
  }

  function removeFile(index: number) {
    setFiles((prev) => {
      const item = prev[index];
      if (item) URL.revokeObjectURL(item.preview);
      return prev.filter((_, i) => i !== index);
    });
  }

  function updateFile(index: number, patch: Partial<typeof files[number]>) {
    setFiles((prev) => prev.map((f, i) => i === index ? { ...f, ...patch } : f));
  }

  async function uploadAll() {
    const pending = files.filter((f) => f.status === "pending");
    if (!pending.length) return toast.error("No images to upload");
    if (files.length > 50) return toast.error("Maximum 50 images per batch");

    setOverall({ done: 0, total: files.length, phase: "uploading" });
    let uploadedCount = 0;
    const galleryRows: { url: string; caption: string; category: string; sort_order: number; width: null; height: null }[] = [];

    for (let i = 0; i < files.length; i++) {
      const item = files[i];
      if (item.status !== "pending") {
        if (item.status === "done") uploadedCount++;
        continue;
      }
      updateFile(i, { status: "uploading" });
      try {
        const path = `gallery/${Date.now()}-${item.file.name.replace(/[^a-z0-9.-]/gi, "_")}`;
        const { error: upError } = await supabase.storage.from("puppy-media").upload(path, item.file);
        if (upError) throw upError;
        const { data: pub } = supabase.storage.from("puppy-media").getPublicUrl(path);
        galleryRows.push({ url: pub.publicUrl, caption: item.caption.trim(), category, sort_order: existingCount + i, width: null, height: null });
        updateFile(i, { status: "done" });
        uploadedCount++;
        setOverall((o) => ({ ...o, done: uploadedCount }));
      } catch (err: any) {
        updateFile(i, { status: "error", error: err.message || "Upload failed" });
        setOverall((o) => ({ ...o, done: uploadedCount }));
      }
    }

    if (!galleryRows.length) {
      setOverall((o) => ({ ...o, phase: "idle" }));
      return toast.error("No images uploaded successfully");
    }

    setOverall((o) => ({ ...o, phase: "creating" }));
    try {
      await batchCreateFn({ data: galleryRows });
      toast.success(`Uploaded ${galleryRows.length} image${galleryRows.length === 1 ? "" : "s"}`);
      onSuccess();
      setFiles([]);
      setOverall({ done: 0, total: 0, phase: "idle" });
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save gallery entries");
      setOverall((o) => ({ ...o, phase: "idle" }));
    }
  }

  const isBusy = overall.phase !== "idle";

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!isBusy) onOpenChange(o); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload many images</DialogTitle>
          <DialogDescription>Select up to 50 images, add captions, and upload them all at once.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Shared category</Label>
            <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="general" disabled={isBusy} />
          </div>

          <div>
            <input ref={fileInputRef} type="file" accept="image/*" multiple hidden onChange={handleFileSelect} />
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isBusy} className="w-full">
              <Images className="h-4 w-4 mr-2" /> Choose images
            </Button>
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              {isBusy && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{overall.phase === "uploading" ? "Uploading to storage" : "Creating gallery entries"}</span>
                    <span>{overall.done} / {overall.total}</span>
                  </div>
                  <Progress value={overall.total ? (overall.done / overall.total) * 100 : 0} />
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {files.map((item, idx) => (
                  <div key={idx} className="relative rounded-lg border border-border overflow-hidden bg-card">
                    <img src={item.preview} alt="" className="aspect-square w-full object-cover" />
                    {!isBusy && (
                      <button onClick={() => removeFile(idx)} className="absolute top-1 right-1 rounded-full bg-background/90 p-1 hover:bg-background">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <div className="p-2 space-y-1.5">
                      <Input
                        size={1}
                        value={item.caption}
                        onChange={(e) => updateFile(idx, { caption: e.target.value })}
                        placeholder="Caption"
                        disabled={isBusy}
                        className="h-8 text-xs"
                      />
                      {item.status === "error" && <p className="text-[10px] text-destructive">{item.error}</p>}
                      {item.status === "done" && <p className="text-[10px] text-green-600">Uploaded</p>}
                      {item.status === "uploading" && <p className="text-[10px] text-muted-foreground">Uploading...</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isBusy}>Cancel</Button>
          <Button onClick={uploadAll} disabled={isBusy || files.length === 0}>
            <Upload className="h-4 w-4 mr-2" /> Upload {files.length > 0 ? files.length : ""} image{files.length === 1 ? "" : "s"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
