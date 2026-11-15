import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { GUARANTEE, SITE, SLOTS } from '../config';

/*
 * /llms.txt (https://llmstxt.org): chi è Spatalo e cosa vende, per i motori AI.
 * Generato in build: i casi studio pubblicati e i dati di src/config.ts entrano da soli.
 * I prezzi invece sono scritti a mano come in src/pages/pricing.astro e in home:
 * se cambiano lì, vanno cambiati anche qui.
 */
export const GET: APIRoute = async ({ site }) => {
  const url = (path: string) => new URL(path, site).href;
  const caseStudies = (await getCollection('case-studies', ({ data }) => !data.draft)).sort(
    (a, b) => a.data.order - b.data.order
  );

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

- Partner: un product engineer senior dedicato, in abbonamento, con accesso diretto al founder. 2.400 € al mese (mensile) o 2.200 € al mese (trimestrale, pagato mese per mese). Al massimo ${SLOTS.total} clienti attivi.
- Team: ${SITE.founder} come product lead, più un product engineer e un product designer senior. 5.000 € a sprint di 2 settimane o 28.000 € a trimestre (6 sprint). Si rinnova sprint per sprint.
- MVP in 6 settimane: dalla discovery al primo rilascio in produzione, 4.500 € al mese.
- A progetto: scope chiuso, prezzo fisso concordato prima di iniziare, preventivo in 48 ore.

## Pagine

- [Home](${url('/')}): il modello in abbonamento, il confronto con le alternative e i casi studio
- [Prezzi](${url('/pricing/')}): piani Partner e Team, MVP, lavoro a progetto e domande frequenti su prezzi, pause e garanzia

## Casi studio

${caseStudies.map((cs) => `- [${cs.data.title}](${url(`/case-study/${cs.id}/`)}): ${cs.data.excerpt}`).join('\n')}

## Contatti

- [Prenota una call di 30 minuti](${SITE.calUrl})
- [${SITE.founder} su LinkedIn](${SITE.linkedin})

## Optional

- [Termini di servizio](${url('/termini/')}): attivazione, pagamenti, pause, garanzia e proprietà del codice
`;

  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
