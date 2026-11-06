import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Mail, MapPin, MessageCircle, CheckCircle2 } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { SectionHeader } from "@/components/section-header";
import { SITE } from "@/lib/site";
import { submitMessage } from "@/lib/site-data.functions";
import { forwardEmail } from "@/lib/email";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Country Charm Dachshunds" },
      { name: "description", content: "Inquire about an available miniature dachshund puppy, ask a question, or join our waitlist. Replies within 24 hours." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      subject: String(fd.get("subject") ?? ""),
      body: String(fd.get("body") ?? ""),
      honeypot: String(fd.get("_honey") ?? ""),
    };
    try {
      await submitMessage({ data: payload });
      // Best-effort email notification; never blocks the visitor.
      try {
        await forwardEmail({
          data: {
            payload: {
              _subject: payload.subject || `New message from ${payload.name}`,
              name: payload.name,
              email: payload.email,
              phone: payload.phone,
              message: payload.body,
            },
          },
        });
      } catch {}
      setStatus("ok");
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setStatus("error");
      setError(err?.message ?? "Something went wrong");
    }
  }

  return (
    <SiteLayout>
      <div className="pt-32 sm:pt-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Contact" title="Tell us about your family" description="Every inquiry begins a conversation. Share a little about your home and what you're hoping to find — we read every message ourselves." />

          <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
            <aside className="space-y-5">
              <ContactItem icon={Mail} label="Email" value={SITE.email} href={`mailto:${SITE.email}`} />
              <ContactItem icon={MessageCircle} label="Live chat" value="Open the chat bubble on any page" />
              <ContactItem icon={MapPin} label="Visits" value="By appointment after application approval" />
              <div className="rounded-3xl bg-surface p-6 text-sm text-muted-foreground">
                <p className="font-display text-xl text-foreground">Response time</p>
                <p className="mt-2">We reply to every inquiry within 24 hours, seven days a week.</p>
              </div>
            </aside>

            <form onSubmit={onSubmit} className="rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-10">
              {status === "ok" ? (
                <div className="flex flex-col items-center py-10 text-center">
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-sage/15 text-[oklch(0.42_0.06_145)]">
                    <CheckCircle2 className="h-8 w-8" />
                  </span>
                  <h3 className="mt-6 font-display text-2xl text-foreground">Thank you.</h3>
                  <p className="mt-2 max-w-sm text-muted-foreground">Your message is on its way. We'll be in touch within 24 hours.</p>
                  <button type="button" onClick={() => setStatus("idle")} className="mt-6 text-sm text-sand-dark underline">Send another message</button>
                </div>
              ) : (
                <div className="grid gap-5">
                  <input type="text" name="_honey" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Your name" name="name" required />
                    <Field label="Email" name="email" type="email" required />
                    <Field label="Phone number" name="phone" type="tel" required />
                    <Field label="Subject (optional)" name="subject" />
                  </div>
                  <Field label="Tell us about your family & what you're looking for" name="body" textarea required />
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-8 py-4 text-sm font-medium text-background transition-transform hover:scale-[1.02] disabled:opacity-60"
                  >
                    {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    {status === "loading" ? "Sending…" : "Send your inquiry"}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}

function Field({ label, name, type = "text", textarea, required }: { label: string; name: string; type?: string; textarea?: boolean; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{label}{required && " *"}</span>
      {textarea ? (
        <textarea name={name} required={required} rows={6} className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/40" />
      ) : (
        <input name={name} type={type} required={required} className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/40" />
      )}
    </label>
  );
}

function ContactItem({ icon: Icon, label, value, href, external }: { icon: any; label: string; value: string; href?: string; external?: boolean }) {
  const Inner = (
    <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:bg-accent">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-surface text-sand-dark"><Icon className="h-4 w-4" /></span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
        <p className="mt-1 text-sm text-foreground">{value}</p>
      </div>
    </div>
  );
  if (!href) return Inner;
  return external ? <a href={href} target="_blank" rel="noopener noreferrer">{Inner}</a> : <a href={href}>{Inner}</a>;
}
