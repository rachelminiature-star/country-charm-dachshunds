export const SITE = {
  name: "Country Charm Dachshunds",
  shortName: "Country Charm Dachshunds",
  domain: "countrycharmdachshunds.com",
  email: "info@countrycharmdachshunds.com",
  tagline: "Heirloom miniature dachshunds, raised in our home.",
  description:
    "AKC-registered miniature dachshund puppies raised with love, health-tested, and matched to families who'll love them forever. Long-haired, short-haired, English cream, red, and rare coats.",
  social: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
  },
  formSubmitUrl: "https://formsubmit.co/ajax/info@countrycharmdachshunds.com",
};

export const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/puppies", label: "Puppies" },
  { to: "/about", label: "About" },
  { to: "/gallery", label: "Gallery" },
  { to: "/reviews", label: "Reviews" },
  { to: "/adoption-process", label: "Process" },
  { to: "/health-guarantee", label: "Health" },
  { to: "/contract", label: "Contract" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
] as const;

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function puppyAge(birthDate: string | null | undefined): string {
  if (!birthDate) return "—";
  const birth = new Date(birthDate);
  const now = new Date();
  const weeks = Math.max(0, Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 7)));
  if (weeks < 12) return `${weeks} ${weeks === 1 ? "week" : "weeks"} old`;
  const months = Math.floor(weeks / 4.345);
  return `${months} ${months === 1 ? "month" : "months"} old`;
}
