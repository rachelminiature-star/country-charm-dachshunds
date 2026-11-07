import hero from "@/assets/hero-puppy.jpg";
import aboutStory from "@/assets/about-story.jpg";
import breeder from "@/assets/breeder-portrait.jpg";
import p1 from "@/assets/puppy-1.jpg";
import p2 from "@/assets/puppy-2.jpg";
import p3 from "@/assets/puppy-3.jpg";
import p4 from "@/assets/puppy-4.jpg";
import p5 from "@/assets/puppy-5.jpg";
import p6 from "@/assets/puppy-6.jpg";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";

const MAP: Record<string, string> = {
  "/src/assets/hero-puppy.jpg": hero,
  "/src/assets/about-story.jpg": aboutStory,
  "/src/assets/breeder-portrait.jpg": breeder,
  "/src/assets/puppy-1.jpg": p1,
  "/src/assets/puppy-2.jpg": p2,
  "/src/assets/puppy-3.jpg": p3,
  "/src/assets/puppy-4.jpg": p4,
  "/src/assets/puppy-5.jpg": p5,
  "/src/assets/puppy-6.jpg": p6,
  "/src/assets/gallery-1.jpg": g1,
  "/src/assets/gallery-2.jpg": g2,
  "/src/assets/gallery-3.jpg": g3,
};

/**
 * Resolve an image URL stored in the DB. If it's a known bundled asset path,
 * return the imported asset URL. Otherwise return the URL as-is (uploaded /
 * remote images go through unchanged).
 */
export function resolveImage(url: string | null | undefined, fallback: string = hero): string {
  if (!url) return fallback;
  return MAP[url] ?? url;
}

export const FALLBACK_IMAGE = hero;
export { hero as heroImage, aboutStory as aboutImage, breeder as breederImage };

/** Homepage hero image used when the admin has not uploaded a custom one. */
export const DEFAULT_HERO_IMAGE = "/images/hero.jpg";
