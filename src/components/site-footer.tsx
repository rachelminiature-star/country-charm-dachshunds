import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Mail, MessageCircle } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-foreground text-background">
                <span className="font-display text-lg">C</span>
              </span>
              <span className="font-display text-xl">Country Charm <span className="text-sand">Dachshunds</span></span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground leading-relaxed">
              {SITE.tagline}
            </p>
            <div className="mt-6 flex gap-3">
              <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                <Instagram className="h-4 w-4" />
              </a>
              <a href={SITE.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Explore</h4>
            <ul className="mt-5 space-y-3">
              {NAV_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-foreground hover:text-sand transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Get in touch</h4>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <a href={`mailto:${SITE.email}`} className="flex items-center gap-2 text-foreground hover:text-sand">
                  <Mail className="h-4 w-4" />
                  {SITE.email}
                </a>
              </li>
              <li className="flex items-center gap-2 text-foreground">
                <MessageCircle className="h-4 w-4" />
                Live chat available on every page
              </li>
              <li className="text-muted-foreground">
                Responses within 24 hours, 7 days a week.
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Reserve a puppy</h4>
            <p className="mt-5 text-sm text-muted-foreground">
              Our waitlist is the first step. Submit your family's story and we'll be in touch when we have a litter that fits.
            </p>
            <Link
              to="/contact"
              className="mt-5 inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-transform hover:scale-[1.03]"
            >
              Begin your inquiry
            </Link>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start gap-4 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <p>AKC-registered breeder · Health-guaranteed puppies · {SITE.domain}</p>
        </div>
      </div>
    </footer>
  );
}
