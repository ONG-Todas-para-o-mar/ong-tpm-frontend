import { Helmet } from "react-helmet-async";

const SITE = "TPM · Todas Para o Mar";
const DEFAULT_DESC =
  "Plataforma de doação direta para projetos de empoderamento feminino e preservação marinha no litoral brasileiro.";

export default function SEO({ title, description = DEFAULT_DESC, image }) {
  const fullTitle = title ? `${title} — ${SITE}` : SITE;
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content={image ? "summary_large_image" : "summary"} />
    </Helmet>
  );
}
