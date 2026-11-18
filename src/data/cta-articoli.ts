/*
 * Logica del banner CTA a metà articolo delle release. Modulo puro: nessun import, solo sintassi TS
 * cancellabile, così Node lo esegue direttamente. Decide due cose: dove sta il banner nel corpo HTML
 * (prima del titolo di sezione di mezzo) e quale testo prende ogni release (Partner o Team).
 *
 * Il turno dei piani si conta dalla release più vecchia: così pubblicare una release più recente non
 * cambia il testo di quelle esistenti.
 * Limite: due release con la stessa data si ordinano per id, quindi una nuova release pubblicata lo
 * stesso giorno di altre può spostare il turno di quelle dello stesso giorno (le date oggi sono tutte diverse).
 *
 * Titoli di sezione (D17, rivisto dopo la review del 2026-11-18): contano solo gli `<h2` a inizio riga e
 * fuori da ogni contenitore (citazioni, `<details>`, `<div>`, elenchi, tabelle). Un `<h2` dentro un
 * contenitore o in un attributo (es. un testo alternativo) non conta: titoliAnnidati lo segnala e la
 * pagina fa fallire la build, così il banner non finisce mai dentro un tag senza che nessuno se ne accorga.
 */

export type Piano = 'partner' | 'team';

const CONTENITORI = ['blockquote', 'details', 'div', 'section', 'aside', 'ul', 'ol', 'table', 'figure'];

const conta = (html: string, re: RegExp): number => (html.match(re) ?? []).length;

/** true se nell'HTML che precede ogni contenitore aperto è anche chiuso. */
function aLivelloZero(prima: string): boolean {
  return CONTENITORI.every(
    (t) => conta(prima, new RegExp(`<${t}(?=[\\s>])`, 'g')) === conta(prima, new RegExp(`</${t}>`, 'g')),
  );
}

/** Indici dei titoli di sezione: `<h2` a inizio riga e fuori da ogni contenitore. */
function posizioniTitoli(html: string): number[] {
  const out: number[] = [];
  for (const m of html.matchAll(/<h2(?=[\s>])/g)) {
    const i = m.index;
    if ((i === 0 || html[i - 1] === '\n') && aLivelloZero(html.slice(0, i))) out.push(i);
  }
  return out;
}

/** Quanti titoli di sezione (`<h2>` di primo livello del corpo) contiene l'HTML. */
export function contaTitoli(html: string): number {
  return posizioniTitoli(html).length;
}

/** Quanti `<h2` dell'HTML non sono titoli di sezione (annidati o dentro un attributo). */
export function titoliAnnidati(html: string): number {
  return conta(html, /<h2(?=[\s>])/g) - contaTitoli(html);
}

/** Divide l'HTML subito prima del titolo di mezzo (indice ⌊N/2⌋); null se i titoli sono meno di 2. */
export function dividiAlCentro(html: string): { prima: string; dopo: string } | null {
  const pos = posizioniTitoli(html);
  if (pos.length < 2) return null;
  const idx = pos[Math.floor(pos.length / 2)];
  return { prima: html.slice(0, idx), dopo: html.slice(idx) };
}

/**
 * Assegna il piano a ogni release, da quella più vecchia alla più recente (input non mutato).
 * Senza banner (meno di 2 titoli) la release è null e non consuma il turno; senza slot Partner liberi
 * tutte le release con banner prendono Team; con slot liberi si alternano Partner e Team a partire da Partner.
 */
export function assegnaPiani(
  release: { id: string; titoli: number }[],
  partnerLiberi: boolean,
): Record<string, 'partner' | 'team' | null> {
  const out: Record<string, 'partner' | 'team' | null> = {};
  let prossimo: Piano = 'partner';
  for (const r of release) {
    if (r.titoli < 2) {
      out[r.id] = null;
      continue;
    }
    if (!partnerLiberi) {
      out[r.id] = 'team';
      continue;
    }
    out[r.id] = prossimo;
    prossimo = prossimo === 'partner' ? 'team' : 'partner';
  }
  return out;
}
