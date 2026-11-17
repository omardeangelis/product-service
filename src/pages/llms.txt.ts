import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { GUARANTEE, PRICES, SITE, SLOTS, formatEuro } from '../config';
import { getArticles } from '../data/articoli';
import { testoPiano } from '../data/articoli-testi';

/*
 * /llms.txt (https://llmstxt.org): chi è Spatalo e cosa vende, per i motori AI.
 * Generato in build: i casi studio pubblicati, le release dello showcase e i dati di src/config.ts entrano da soli.
 * Anche i prezzi arrivano da src/config.ts (PRICES).
 */
export const GET: APIRoute = async ({ site }) => {
  const url = (path: string) => new URL(path, site).href;
  const caseStudies = (await getCollection('case-studies', ({ data }) => !data.draft)).sort(
    (a, b) => a.data.order - b.data.order
  );
  const releases = (await getArticles()).filter((a) => a.tag === 'release');

  const text = `# ${SITE.name}

> ${SITE.name} è lo studio di product engineering in abbonamento fondato da ${SITE.founder}. ${SITE.description}

Vende product engineering in abbonamento: un senior che pensa al prodotto, non solo al codice, e porta in produzione ogni settimana, nel team del cliente o sotto il suo marchio in white label. È pensato per CTO di startup e scale-up, agenzie di design e software house. ${SITE.founder} ha 10 anni di prodotti in produzione.

Come funziona:

- Si parte da una call conoscitiva di 30 minuti, gratuita e senza vincoli.
- Nessun conteggio a ore e nessun timesheet: si misura il codice in produzione, con una review settimanale e un canale Slack condiviso.
- Pausa e disdetta libere, nessun vincolo a lungo termine.
- Codice e design sono del cliente dal primo giorno, nel suo repository e nel suo workspace.
- ${GUARANTEE.label}: ${GUARANTEE.claim} (nuovi clienti, piano Partner).

## Offerta

Prezzi IVA esclusa, fattura a inizio periodo, nessun costo di setup.

- Partner: un product engineer senior dedicato, in abbonamento, con accesso diretto al founder. ${formatEuro(PRICES.partner.monthly)} € al mese (mensile) o ${formatEuro(PRICES.partner.quarterlyMonthly)} € al mese (trimestrale, pagato mese per mese). Al massimo ${SLOTS.total} clienti attivi.
- Team: ${SITE.founder} come product lead, più un product engineer e un product designer senior. ${formatEuro(PRICES.team.sprint)} € a sprint di 2 settimane o ${formatEuro(PRICES.team.quarter)} € a trimestre (${PRICES.team.sprintsPerQuarter} sprint). Si rinnova sprint per sprint.
- MVP in 6 settimane: dalla discovery al primo rilascio in produzione, ${formatEuro(PRICES.mvp.monthly)} € al mese.
- A progetto: scope chiuso, prezzo fisso concordato prima di iniziare, preventivo in 48 ore.

## Pagine

- [Home](${url('/')}): il modello in abbonamento, il confronto con le alternative e gli articoli: casi studio e release
- [Prezzi](${url('/pricing/')}): piani Partner e Team, MVP, lavoro a progetto e domande frequenti su prezzi, pause e garanzia

## Casi studio

${caseStudies.map((cs) => `- [${cs.data.title}](${url(`/case-study/${cs.id}/`)}): ${cs.data.excerpt}`).join('\n')}

## Showcase

- [Showcase](${url('/showcase/')}): tutti gli articoli di ${SITE.founder}, dal più recente: release brevi e casi studio completi
- [Feed RSS](${url('/rss.xml')}): gli stessi articoli in RSS 2.0
${releases.map((r) => `- [${r.title}](${url(r.href)}): ${testoPiano(r.excerpt)}`).join('\n')}

## Contatti

- [Prenota una call di 30 minuti](${SITE.calUrl})
- [${SITE.founder} su LinkedIn](${SITE.linkedin})

## Optional

- [Termini di servizio](${url('/termini/')}): attivazione, pagamenti, pause, garanzia e proprietà del codice
`;

  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
