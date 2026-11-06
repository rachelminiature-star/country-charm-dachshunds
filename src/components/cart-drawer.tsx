"use client";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { resolveImage } from "@/lib/images";
import { formatPrice, SITE } from "@/lib/site";
import { InquiryModal } from "@/components/inquiry-modal";

export function CartDrawer() {
  const { items, open, setOpen, setQty, remove, subtotal, clear } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);


  const message = encodeURIComponent(
    `Hello Country Charm Dachshunds — I'd like to inquire about:\n\n` +
    items.map((i) => `• ${i.name} (${i.color ?? ""}) — ${formatPrice(i.price_cents)}`).join("\n") +
    `\n\nTotal: ${formatPrice(subtotal)}`
  );
  const mailUrl = `mailto:${SITE.email}?subject=${encodeURIComponent("Cart inquiry")}&body=${message}`;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="flex w-full max-w-md flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-6 py-5">
          <SheetTitle className="font-display text-2xl flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" /> Your selections
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-surface">
              <ShoppingBag className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="mt-5 font-display text-xl text-foreground">Your cart is empty</p>
            <p className="mt-2 text-sm text-muted-foreground">Browse our available puppies and reserve the one meant for your family.</p>
            <Button asChild className="mt-6 rounded-full">
              <Link to="/puppies" onClick={() => setOpen(false)}>Browse puppies</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              {items.map((i) => (
                <div key={i.id} className="flex gap-4 rounded-2xl border border-border bg-card p-3">
                  <img src={resolveImage(i.image)} alt={i.name} className="h-24 w-20 rounded-xl object-cover" />
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link to="/puppies/$slug" params={{ slug: i.slug }} onClick={() => setOpen(false)} className="font-display text-lg leading-tight text-foreground hover:text-sand-dark">{i.name}</Link>
                        <p className="text-xs text-muted-foreground mt-0.5">{i.color}{i.gender ? ` · ${i.gender === "male" ? "Boy" : "Girl"}` : ""}</p>
                      </div>
                      <button onClick={() => remove(i.id)} aria-label="Remove" className="text-muted-foreground hover:text-foreground">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="inline-flex items-center rounded-full border border-border">
                        <button onClick={() => setQty(i.id, i.qty - 1)} className="grid h-7 w-7 place-items-center text-muted-foreground hover:text-foreground"><Minus className="h-3 w-3" /></button>
                        <span className="px-2 text-sm tabular-nums">{i.qty}</span>
                        <button onClick={() => setQty(i.id, i.qty + 1)} className="grid h-7 w-7 place-items-center text-muted-foreground hover:text-foreground"><Plus className="h-3 w-3" /></button>
                      </div>
                      <span className="text-sm font-medium text-foreground tabular-nums">{formatPrice(i.price_cents * i.qty)}</span>
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={clear} className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">Clear cart</button>
            </div>

            <div className="border-t border-border bg-surface px-6 py-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="font-display text-2xl text-foreground tabular-nums">{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground">A reservation deposit secures your puppy. Final balance is settled before pickup.</p>
              <div className="grid gap-2">
                <Button
                  onClick={() => setCheckoutOpen(true)}
                  className="h-12 rounded-full bg-foreground text-background hover:bg-foreground/90"
                >
                  Checkout · {formatPrice(subtotal)}
                </Button>
                <a href={mailUrl} className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-card text-sm font-medium text-foreground hover:bg-accent">
                  Email us instead
                </a>
              </div>
            </div>
          </>
        )}
      </SheetContent>

      <InquiryModal
        items={items.map((i) => ({
          id: i.id, name: i.name, slug: i.slug, color: i.color, gender: i.gender,
          price_cents: i.price_cents, image: i.image, qty: i.qty,
        }))}
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        onSubmitted={() => { clear(); setOpen(false); }}
      />
    </Sheet>
  );
}
