import { Helmet } from "react-helmet-async";

const SITE = "TPM · Todas Para o Mar";
const DEFAULT_DESC =
  "ONG feminista e antirracista que democratiza o surf e promove transformação social com mulheres negras e seus filhos na Baía de Maracaípe, Ipojuca · PE.";

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
