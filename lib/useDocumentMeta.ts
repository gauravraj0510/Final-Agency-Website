import { useEffect } from "react";

interface DocumentMetaOptions {
  readonly title: string;
  readonly description?: string;
  readonly canonical?: string;
}

/**
 * Sets document.title and (optionally) the meta[name="description"] tag.
 * Useful for client-side SPA route changes — updates the browser tab title
 * and ensures the description meta is current for users who view source.
 *
 * NOTE: For social sharing previews (LinkedIn, FB, WhatsApp, X), the static
 * tags in index.html are still what crawlers use, since this site is not SSR.
 */
export function useDocumentMeta({
  title,
  description,
  canonical,
}: DocumentMetaOptions): void {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    let descriptionMeta: HTMLMetaElement | null = null;
    let previousDescription: string | null = null;
    if (description) {
      descriptionMeta = document.querySelector(
        'meta[name="description"]'
      );
      if (descriptionMeta) {
        previousDescription = descriptionMeta.getAttribute("content");
        descriptionMeta.setAttribute("content", description);
      }
    }

    let canonicalLink: HTMLLinkElement | null = null;
    let previousCanonical: string | null = null;
    if (canonical) {
      canonicalLink = document.querySelector('link[rel="canonical"]');
      if (canonicalLink) {
        previousCanonical = canonicalLink.getAttribute("href");
        canonicalLink.setAttribute("href", canonical);
      }
    }

    return () => {
      document.title = previousTitle;
      if (descriptionMeta && previousDescription !== null) {
        descriptionMeta.setAttribute("content", previousDescription);
      }
      if (canonicalLink && previousCanonical !== null) {
        canonicalLink.setAttribute("href", previousCanonical);
      }
    };
  }, [title, description, canonical]);
}
