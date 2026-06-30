import React from "react";
import { Helmet } from "react-helmet-async";

const SITE = "Qadam";
const DEFAULT_DESC =
  "Qadam — handcrafted leather shoes for men, women and kids. Shop sneakers, formal shoes, heels, chappals and more, with cash on delivery across Pakistan.";

// Canonical/OG URLs resolve against the live origin, so they're correct in
// every environment (localhost in dev, the real domain in production).
const origin =
  typeof window !== "undefined" && window.location?.origin
    ? window.location.origin
    : "https://qadam.pk";

const Seo = ({
  title,
  description = DEFAULT_DESC,
  path = "",
  image,
  type = "website",
  noIndex = false,
  jsonLd,
}) => {
  const fullTitle = title
    ? `${title} · ${SITE}`
    : `${SITE} — Handcrafted leather shoes`;
  const url = `${origin}${path}`;
  const ogImage = image || `${origin}/logo512.png`;
  const ld = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {ld.map((obj, i) => (
        <script type="application/ld+json" key={i}>
          {JSON.stringify(obj)}
        </script>
      ))}
    </Helmet>
  );
};

export default Seo;
