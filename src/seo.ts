import { PRICES, SITE } from './config';

/*
 * Dati strutturati (JSON-LD) per motori di ricerca e motori AI.
 * Base.astro mette in ogni pagina il grafo condiviso (studio, fondatore, sito);
 * le pagine aggiungono i propri nodi (es. Article, i piani di /pricing) e citano quelli condivisi per @id.
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

/** Un'offerta in euro, IVA esclusa. `unit` dice a cosa si riferisce il prezzo (mese, sprint, trimestre). */
function offerta(name: string, price: number, unit: LdNode): LdNode {
  return {
    '@type': 'Offer',
    name,
    price,
    priceCurrency: 'EUR',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price,
      priceCurrency: 'EUR',
      valueAddedTaxIncluded: false,
      ...unit,
    },
  };
}

const alMese: LdNode = { unitCode: 'MON', unitText: 'mese' };

/**
 * I piani della pagina /pricing come servizi dello studio, con le loro offerte.
 * I prezzi arrivano da PRICES (src/config.ts), come in home, /pricing e /llms.txt.
 */
export function pricingGraph(site: URL): LdNode[] {
  const pricing = new URL('/pricing/', site).href;
  const servizio = (slug: string, name: string, description: string, offers: LdNode[]): LdNode => ({
    '@type': 'Service',
    '@id': `${pricing}#${slug}`,
    name,
    description,
    provider: { '@id': ldId(site, 'org') },
    url: pricing,
    offers: offers.map((o) => ({ ...o, url: pricing })),
  });

  return [
    servizio('partner', 'Partner', 'Un product engineer senior dedicato, nel team del cliente, in abbonamento.', [
      offerta('Partner mensile', PRICES.partner.monthly, alMese),
      offerta('Partner trimestrale', PRICES.partner.quarterlyMonthly, {
        ...alMese,
        // Impegno di 3 mesi, pagato mese per mese.
        billingDuration: { '@type': 'QuantitativeValue', value: 3, unitCode: 'MON' },
      }),
    ]),
    servizio(
      'team',
      'Team',
      `${SITE.founder} come product lead, più un product engineer e un product designer senior. Si rinnova sprint per sprint.`,
      [
        offerta('Team a sprint', PRICES.team.sprint, { unitText: 'sprint di 2 settimane' }),
        offerta('Team a trimestre', PRICES.team.quarter, {
          unitCode: 'QAN',
          unitText: `trimestre (${PRICES.team.sprintsPerQuarter} sprint)`,
        }),
      ],
    ),
    servizio('mvp', 'MVP in 6 settimane', 'Dalla discovery al primo rilascio in produzione, con metriche dal giorno uno.', [
      offerta('MVP in 6 settimane', PRICES.mvp.monthly, alMese),
    ]),
  ];
}

/** Serializza il grafo per un <script type="application/ld+json">, senza poterne chiudere il tag. */
export const ldJson = (nodes: LdNode[]) =>
  JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes }).replace(/</g, '\\u003c');
