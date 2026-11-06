import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, CheckCircle2, ShieldCheck, FileText } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { SectionHeader } from "@/components/section-header";
import { SITE } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { submitMessage } from "@/lib/site-data.functions";
import { forwardEmail } from "@/lib/email";

export const Route = createFileRoute("/contract")({
  head: () => ({
    meta: [
      { title: "Buyer's Contract & Health Guarantee — Country Charm Dachshunds" },
      { name: "description", content: "Our buyer's contract and 1-year health guarantee for every miniature dachshund puppy. Review the terms and sign electronically." },
      { property: "og:title", content: "Buyer's Contract & Health Guarantee — Country Charm Dachshunds" },
      { property: "og:description", content: "Health guarantee, replacement policy, and signed buyer's contract for every puppy." },
      { property: "og:url", content: "/contract" },
    ],
    links: [{ rel: "canonical", href: "/contract" }],
  }),
  component: ContractPage,
});

function ContractPage() {
  return (
    <SiteLayout>
      <div className="pt-32 sm:pt-40">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Buyer's Contract"
            title="Contract & Health Guarantee"
            description="Every Country Charm Dachshund puppy goes home with a signed buyer's contract and a one-year health guarantee. Please review carefully, then sign below."
          />

          <ContractTerms />
          <ContractForm />
        </div>
      </div>
    </SiteLayout>
  );
}

function ContractTerms() {
  return (
    <article className="mt-12 space-y-10 rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-10">
      <header className="flex items-start gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-surface text-sand-dark">
          <FileText className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Country Charm Dachshund Puppies</p>
          <h2 className="mt-1 font-display text-2xl text-foreground">Buyer's Contract and Health Guarantee</h2>
        </div>
      </header>

      <section className="space-y-4 text-sm leading-relaxed text-foreground">
        <p>
          We guarantee that you will be provided with a healthy Dachshund puppy, free of any serious congenital diseases,
          for up to <strong>1 year</strong> after the time of sale. In order to ensure this guarantee, the buyer must
          have the puppy examined by a licensed veterinarian within 48 hours of pickup or delivery.
        </p>
        <p className="font-medium text-foreground">This guarantee does NOT include:</p>
        <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
          <li>Common health conditions that can afflict all dogs — demodex mange, coccidiosis, parvo, giardia, inguinal or umbilical hernias, hypoglycemia, ear mites, fleas, or ticks.</li>
          <li>Conditions considered normal for the Dachshund breed — cherry eye, entropion, skin allergies, elongated soft palate, stenotic nares (pinched nostrils), uneven bites, or "loose hips."</li>
          <li>Matters of size, weight, structure, coat quality, or temperament.</li>
        </ul>
        <p className="text-muted-foreground">
          If the buyer refuses the required examination or does not have it performed within the 48-hour time limit, the
          buyer assumes complete responsibility for the puppy's health, and this contract is considered void.
        </p>
      </section>

      <section className="space-y-4 border-t border-border pt-8 text-sm leading-relaxed">
        <h3 className="font-display text-xl text-foreground">Replacement Policy</h3>
        <p>
          If the puppy does not pass the required examination, develops any genetic or hereditary disorder, or has
          undescended testicles within one year of purchase, it will be eligible for a replacement.
        </p>
        <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
          <li>The buyer must provide documentation from at least two licensed veterinarians including written diagnosis, test results, and any other information requested by the seller. The buyer remains financially responsible for all veterinary expenses.</li>
          <li>Upon replacement, the puppy must be returned with all registration documents to transfer full ownership back to the seller.</li>
        </ul>
        <p>
          If a genetic condition causes the puppy to die within one year of purchase, it will be eligible for replacement.
          A necropsy must be performed and a formal report issued by a licensed veterinarian. Once the seller receives
          and reviews the report, a final decision will be made. The buyer is financially responsible for all veterinary
          expenses during this time.
        </p>
        <p>
          The replacement puppy will be taken from a future litter and will be of the same sex and value as the original
          puppy. <strong>Cash refunds, in part or full, will not be given under any circumstances.</strong>
        </p>
        <p>
          The buyer must pay the balance and pick up the puppy within 10 days of the arranged pick-up date unless special
          arrangements have been made. If the buyer fails to pick up the puppy within this period, the puppy will be
          resold and the buyer's deposit will be forfeited.
        </p>
      </section>

      <div className="flex items-start gap-3 rounded-2xl bg-surface p-4 text-xs text-muted-foreground">
        <ShieldCheck className="h-4 w-4 shrink-0 text-sand-dark" />
        <p>
          This contract is between Country Charm Dachshunds (seller) and the buyer named below. By signing, both
          parties agree to the terms above.
        </p>
      </div>
    </article>
  );
}

function ContractForm() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [agreed, setAgreed] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!agreed) {
      toast.error("Please confirm you've read and agree to the terms.");
      return;
    }
    const fd = new FormData(e.currentTarget);
    const payload: Record<string, string> = {
      _subject: `Signed buyer's contract — ${fd.get("buyer_name") || "Unknown"}`,
      _template: "table",
      _captcha: "false",
    };
    fd.forEach((v, k) => { payload[k] = String(v); });
    payload.agreed = agreed ? "Yes" : "No";

    setSubmitting(true);
    try {
      const body = Object.entries(payload)
        .filter(([k]) => !k.startsWith("_"))
        .map(([k, v]) => `${k.replace(/_/g, " ")}: ${v || "—"}`)
        .join("\n");

      // Record the signed contract in the database first.
      await submitMessage({
        data: {
          name: String(payload.buyer_name || "Unknown"),
          email: String(payload.buyer_email || ""),
          phone: String(payload.buyer_phone || ""),
          subject: String(payload._subject),
          body,
        },
      });

      // Best-effort email copy.
      try {
        await forwardEmail({ data: { payload } });
      } catch {
        /* email relay is optional */
      }

      setDone(true);
      toast.success("Contract submitted — we'll countersign and email you a copy.");
    } catch (err: any) {
      toast.error(err?.message || "Could not submit contract. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="my-16 rounded-3xl border border-border bg-card p-10 text-center shadow-soft">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-sage/20 text-sand-dark">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h3 className="mt-6 font-display text-2xl text-foreground">Contract received</h3>
        <p className="mt-2 text-muted-foreground">
          Thank you. We'll countersign and email you a copy at the address you provided within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="my-16 space-y-10 rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-10"
    >
      <section className="space-y-5">
        <h3 className="font-display text-xl text-foreground">Puppy details</h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Puppy name" name="puppy_name" required />
          <FormField label="Color" name="puppy_color" placeholder="e.g. black and brown" />
          <FormField label="Sex" name="puppy_sex" placeholder="Male / Female" />
          <FormField label="Pick up / delivery date" name="pickup_date" type="date" />
          <FormField label="Total price (USD)" name="total_price" type="text" placeholder="$" />
          <FormField label="Shipping arrangement" name="shipping" placeholder="Buyer is responsible for shipping fee" />
        </div>
      </section>

      <section className="space-y-5 border-t border-border pt-8">
        <h3 className="font-display text-xl text-foreground">Buyer's details</h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2"><FormField label="Full name" name="buyer_name" required /></div>
          <FormField label="Email" name="buyer_email" type="email" required />
          <FormField label="Phone number" name="buyer_phone" type="tel" required />
          <div className="sm:col-span-2"><FormField label="Street address" name="buyer_address" required /></div>
          <FormField label="City" name="buyer_city" required />
          <FormField label="State" name="buyer_state" required />
          <FormField label="Zip code" name="buyer_zip" required />
          <FormField label="Country" name="buyer_country" placeholder="United States" />
        </div>
      </section>

      <section className="space-y-5 border-t border-border pt-8">
        <h3 className="font-display text-xl text-foreground">Signature</h3>
        <p className="text-sm text-muted-foreground">
          By typing your full legal name below and checking the box, you agree this electronic signature is the legal
          equivalent of your handwritten signature on this contract.
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Buyer's signature (type full name)" name="buyer_signature" required />
          <FormField label="Date" name="signed_date" type="date" required />
        </div>
        <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-surface p-4 text-sm text-foreground">
          <Checkbox
            checked={agreed}
            onCheckedChange={(v) => setAgreed(v === true)}
            className="mt-0.5"
          />
          <span>
            I have read, understood, and agree to the terms of this Buyer's Contract and Health Guarantee.
          </span>
        </label>
      </section>

      <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          A signed PDF copy will be emailed to {SITE.email}.
        </p>
        <Button
          type="submit"
          disabled={submitting}
          className="h-12 rounded-full bg-foreground px-8 text-background hover:bg-foreground/90"
        >
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign & submit contract
        </Button>
      </div>
    </form>
  );
}

function FormField({
  label, name, type = "text", placeholder, required,
}: { label: string; name: string; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
        {label}{required && " *"}
      </Label>
      <Input name={name} type={type} placeholder={placeholder} required={required} />
    </div>
  );
}
