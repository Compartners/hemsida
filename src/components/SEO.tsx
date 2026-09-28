import { useEffect } from "react";

type SeoProps = {
  title: string;
  description: string;
  canonical: string;
  noindex?: boolean;
};

const DEFAULT_ROBOTS = "index, follow, max-image-preview:large";

export default function Seo({
  title,
  description,
  canonical,
  noindex = false,
}: SeoProps) {
  useEffect(() => {
    document.title = title;

    const setMeta = (
      attribute: "name" | "property",
      key: string,
      content: string
    ) => {
      let element = document.querySelector<HTMLMetaElement>(
        `meta[${attribute}="${key}"]`
      );

      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }

      element.setAttribute("content", content);
    };

    setMeta("name", "description", description);
    setMeta("name", "robots", noindex ? "noindex, nofollow" : DEFAULT_ROBOTS);

    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", canonical);

    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);

    let canonicalLink =
      document.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.rel = "canonical";
      document.head.appendChild(canonicalLink);
    }

    canonicalLink.href = canonical;
  }, [title, description, canonical, noindex]);

  return null;
}