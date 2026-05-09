import { useEffect } from "react";

interface DocumentMetaOptions {
  readonly title: string;
  readonly description?: string;
  readonly canonical?: string;
  readonly keywords?: string;
  readonly ogTitle?: string;
  readonly ogDescription?: string;
  readonly ogImage?: string;
  readonly structuredData?: ReadonlyArray<Record<string, unknown>>;
}

/* Helper: update or temporarily set a meta tag's content. */
function applyMetaContent(
  selector: string,
  content: string
): { restore: () => void } {
  const el = document.querySelector(selector) as HTMLMetaElement | null;
  if (!el) return { restore: () => undefined };
  const previous = el.getAttribute("content");
  el.setAttribute("content", content);
  return {
    restore: () => {
      if (previous !== null) el.setAttribute("content", previous);
    },
  };
}

/**
 * Sets document.title, meta description, canonical URL, OG/Twitter tags,
 * and (optionally) injects per-route JSON-LD structured data scripts.
 *
 * Static fallbacks in index.html still serve social-media crawlers that
 * don't execute JS — so always keep index.html sensible. This hook gives
 * client-side route navigations richer per-page metadata for users and
 * JS-aware crawlers (Googlebot, Bingbot).
 */
export function useDocumentMeta({
  title,
  description,
  canonical,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  structuredData,
}: DocumentMetaOptions): void {
  useEffect(() => {
    const restorers: Array<() => void> = [];

    // Title
    const previousTitle = document.title;
    document.title = title;
    restorers.push(() => {
      document.title = previousTitle;
    });

    // Description
    if (description) {
      const r = applyMetaContent('meta[name="description"]', description);
      restorers.push(r.restore);
    }

    // Keywords
    if (keywords) {
      const r = applyMetaContent('meta[name="keywords"]', keywords);
      restorers.push(r.restore);
    }

    // Canonical
    if (canonical) {
      const link = document.querySelector(
        'link[rel="canonical"]'
      ) as HTMLLinkElement | null;
      if (link) {
        const previousHref = link.getAttribute("href");
        link.setAttribute("href", canonical);
        restorers.push(() => {
          if (previousHref !== null) link.setAttribute("href", previousHref);
        });
      }
      // Also keep og:url + twitter:url in sync
      const r1 = applyMetaContent('meta[property="og:url"]', canonical);
      const r2 = applyMetaContent('meta[name="twitter:url"]', canonical);
      restorers.push(r1.restore, r2.restore);
    }

    // OG title / description / image
    const effectiveOgTitle = ogTitle ?? title;
    const effectiveOgDescription = ogDescription ?? description;
    const ogTitleR = applyMetaContent('meta[property="og:title"]', effectiveOgTitle);
    const twTitleR = applyMetaContent('meta[name="twitter:title"]', effectiveOgTitle);
    restorers.push(ogTitleR.restore, twTitleR.restore);
    if (effectiveOgDescription) {
      const a = applyMetaContent(
        'meta[property="og:description"]',
        effectiveOgDescription
      );
      const b = applyMetaContent(
        'meta[name="twitter:description"]',
        effectiveOgDescription
      );
      restorers.push(a.restore, b.restore);
    }
    if (ogImage) {
      const a = applyMetaContent('meta[property="og:image"]', ogImage);
      const b = applyMetaContent('meta[property="og:image:secure_url"]', ogImage);
      const c = applyMetaContent('meta[name="twitter:image"]', ogImage);
      restorers.push(a.restore, b.restore, c.restore);
    }

    // Per-route structured data (JSON-LD) — injected then removed on unmount
    const injectedScripts: HTMLScriptElement[] = [];
    if (structuredData && structuredData.length > 0) {
      structuredData.forEach((data) => {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.dataset.dynamic = "true";
        script.textContent = JSON.stringify(data);
        document.head.appendChild(script);
        injectedScripts.push(script);
      });
    }
    restorers.push(() => {
      injectedScripts.forEach((s) => s.remove());
    });

    return () => {
      restorers.forEach((restore) => restore());
    };
  }, [
    title,
    description,
    canonical,
    keywords,
    ogTitle,
    ogDescription,
    ogImage,
    structuredData,
  ]);
}
