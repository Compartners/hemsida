import { useEffect } from "react";

type SeoProps = {
  title: string;
  description: string;
  canonical: string;
};

export default function Seo({
  title,
  description,
  canonical,
}: SeoProps) {
  useEffect(() => {
    document.title = title;

    const setMeta = (
      selector: string,
      attribute: "name" | "property",
      key: string,
      content: string
    ) => {
      let element = document.querySelector<HTMLMetaElement>(selector);

      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }

      element.setAttribute("content", content);
    };

    setMeta(
      'meta[name="description"]',
      "name",
      "description",
      description
    );

    setMeta(
      'meta[property="og:title"]',
      "property",
      "og:title",
      title
    );

    setMeta(
      'meta[property="og:description"]',
      "property",
      "og:description",
      description
    );

    setMeta(
      'meta[property="og:url"]',
      "property",
      "og:url",
      canonical
    );

    setMeta(
      'meta[name="twitter:title"]',
      "name",
      "twitter:title",
      title
    );

    setMeta(
      'meta[name="twitter:description"]',
      "name",
      "twitter:description",
      description
    );

    let canonicalLink =
      document.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.rel = "canonical";
      document.head.appendChild(canonicalLink);
    }

    canonicalLink.href = canonical;
  }, [title, description, canonical]);

  return null;
}