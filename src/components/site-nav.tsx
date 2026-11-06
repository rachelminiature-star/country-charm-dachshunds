"use client";

import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, ShoppingBag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart";
import { CartDrawer } from "./cart-drawer";

export function SiteNav({ transparentOnTop = false }: { transparentOnTop?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const cart = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const solid = scrolled || !transparentOnTop;

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          solid ? "bg-background/95 backdrop-blur-md shadow-soft border-b border-border" : "bg-transparent"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-20 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 group" aria-label={SITE.name}>
            <span className={cn(
              "grid h-9 w-9 place-items-center rounded-full transition-colors",
              solid ? "bg-foreground text-background" : "bg-white/90 text-foreground"
            )}>
              <span className="font-display text-lg font-semibold">C</span>
            </span>
            <span className={cn(
              "hidden font-display text-lg font-medium tracking-tight transition-colors sm:block",
              solid ? "text-foreground" : "text-white drop-shadow"
            )}>
              Country Charm <span className="text-sand">Dachshunds</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                activeProps={{ className: "text-sand" }}
                inactiveProps={{
                  className: cn(
                    "transition-colors",
                    solid ? "text-muted-foreground hover:text-foreground" : "text-white/85 hover:text-white"
                  ),
                }}
                activeOptions={{ exact: link.to === "/" }}
                className="px-3 py-2 text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => cart.setOpen(true)}
              aria-label={`Open cart, ${cart.count} items`}
              className={cn(
                "relative grid h-11 w-11 place-items-center rounded-full transition-colors",
                solid ? "text-foreground hover:bg-accent" : "text-white hover:bg-white/10"
              )}
            >
              <ShoppingBag className="h-5 w-5" />
              {cart.count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-sand-dark px-1 text-[10px] font-semibold text-background">
                  {cart.count}
                </span>
              )}
            </button>

            <Link
              to="/contact"
              className="ml-1 hidden items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background shadow-soft transition-transform hover:scale-[1.03] lg:inline-flex"
            >
              Inquire
            </Link>

            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className={cn(
                "lg:hidden grid h-11 w-11 place-items-center rounded-full transition-colors",
                solid ? "text-foreground hover:bg-accent" : "text-white hover:bg-white/10"
              )}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile fullscreen overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden fixed inset-0 z-[60] bg-background"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-2">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-foreground text-background">
                    <span className="font-display text-lg font-semibold">C</span>
                  </span>
                  <span className="font-display text-lg text-foreground">
                    Country Charm <span className="text-sand-dark">Dachshunds</span>
                  </span>
                </Link>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="grid h-11 w-11 place-items-center rounded-full bg-surface text-foreground hover:bg-accent"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <motion.nav
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
                }}
                className="flex-1 overflow-y-auto px-6 py-8"
              >
                <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">Menu</p>
                <ul className="mt-4 divide-y divide-border/60">
                  {NAV_LINKS.map((link) => (
                    <motion.li
                      key={link.to}
                      variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0 } }}
                    >
                      <Link
                        to={link.to}
                        onClick={() => setOpen(false)}
                        activeOptions={{ exact: link.to === "/" }}
                        activeProps={{ className: "text-sand-dark" }}
                        className="group flex items-center justify-between py-5 font-display text-3xl text-foreground hover:text-sand-dark"
                      >
                        <span>{link.label}</span>
                        <ArrowRight className="h-5 w-5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.nav>

              <div className="border-t border-border bg-surface px-6 py-6 space-y-3">
                <Link
                  to="/contact"
                  onClick={() => setOpen(false)}
                  className="flex h-12 w-full items-center justify-center rounded-full bg-foreground text-sm font-medium text-background"
                >
                  Inquire about a puppy
                </Link>
                <a
                  href={`mailto:${SITE.email}`}
                  className="flex h-12 w-full items-center justify-center rounded-full border border-border bg-card text-sm font-medium text-foreground"
                >
                  Email us
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer />
    </>
  );
}
