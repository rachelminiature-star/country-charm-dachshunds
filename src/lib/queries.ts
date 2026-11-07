import { queryOptions } from "@tanstack/react-query";
import { listPuppies, getPuppyBySlug, listGallery, listTestimonials, listFaqs, getSiteSettings } from "./site-data.functions";

export const puppiesQuery = () =>
  queryOptions({
    queryKey: ["puppies"],
    queryFn: () => listPuppies(),
    staleTime: 60_000,
  });

export const puppyQuery = (slug: string) =>
  queryOptions({
    queryKey: ["puppies", slug],
    queryFn: () => getPuppyBySlug({ data: { slug } }),
    staleTime: 60_000,
  });

export const galleryQuery = () =>
  queryOptions({
    queryKey: ["gallery"],
    queryFn: () => listGallery(),
    staleTime: 60_000,
  });

export const testimonialsQuery = () =>
  queryOptions({
    queryKey: ["testimonials"],
    queryFn: () => listTestimonials(),
    staleTime: 60_000,
  });

export const faqsQuery = () =>
  queryOptions({
    queryKey: ["faqs"],
    queryFn: () => listFaqs(),
    staleTime: 60_000,
  });

export const siteSettingsQuery = () =>
  queryOptions({
    queryKey: ["site-settings"],
    queryFn: () => getSiteSettings(),
    staleTime: 60_000,
  });
