import { SITE } from './config';

/*
 * Dati strutturati (JSON-LD) per motori di ricerca e motori AI.
 * Base.astro mette in ogni pagina il grafo condiviso (studio, fondatore, sito);
 * le pagine aggiungono i propri nodi (es. Article) e citano quelli condivisi per @id.
 */

export type LdNode = Record<string, unknown>;

/** @id stabile di un nodo condiviso, es. `https://spatalo.tech/#founder`. */
export const ldId = (site: URL, node: 'org' | 'founder' | 'website') => new URL(`/#${node}`, site).href;

/** Lo studio, il suo fondatore e il sito: uguali su ogni pagina. */
export function sharedGraph(site: URL): LdNode[] {
  const home = new URL('/', site).href;
  return [
    {
      '@type': 'Organization',
      '@id': ldId(site, 'org'),
      name: SITE.name,
      url: home,
      description: SITE.description,
      founder: { '@id': ldId(site, 'founder') },
    },
    {
      '@type': 'Person',
      '@id': ldId(site, 'founder'),
      name: SITE.founder,
      jobTitle: 'Product Engineer',
      worksFor: { '@id': ldId(site, 'org') },
      // Il profilo LinkedIn è personale: identifica il fondatore, non lo studio.
      sameAs: [SITE.linkedin],
    },
    {
      '@type': 'WebSite',
      '@id': ldId(site, 'website'),
      name: SITE.name,
      url: home,
      inLanguage: 'it-IT',
      publisher: { '@id': ldId(site, 'org') },
    },
  ];
}

/** Serializza il grafo per un <script type="application/ld+json">, senza poterne chiudere il tag. */
export const ldJson = (nodes: LdNode[]) =>
  JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes }).replace(/</g, '\\u003c');
