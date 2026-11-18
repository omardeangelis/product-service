/*
 * Logica del banner CTA a metà articolo delle release. Modulo puro: nessun import, solo sintassi TS
 * cancellabile, così Node lo esegue direttamente. Decide due cose: dove sta il banner nel corpo HTML
 * (prima del titolo di sezione di mezzo) e quale testo prende ogni release (Partner o Team).
 *
 * Il turno dei piani si conta dalla release più vecchia: così pubblicare una release più recente non
 * cambia il testo di quelle esistenti.
 *
 * Limite noto (D17): contaTitoli conta ogni `<h2` presente nell'HTML, anche quello annidato dentro un
 * contenitore come `<details>`. Oggi nessuna release ne ha uno; se capitasse, il banner finirebbe
 * dentro quel contenitore.
 */

export type Piano = 'partner' | 'team';

/** Quanti titoli di secondo livello (`<h2>` o `<h2 ...>`) contiene l'HTML. */
export function contaTitoli(html: string): number {
  return (html.match(/<h2(?=[\s>])/g) ?? []).length;
}

/** Divide l'HTML subito prima del titolo di mezzo (indice ⌊N/2⌋); null se i titoli sono meno di 2. */
export function dividiAlCentro(html: string): { prima: string; dopo: string } | null {
  const n = contaTitoli(html);
  if (n < 2) return null;
  const k = Math.floor(n / 2);
  const re = /<h2(?=[\s>])/g;
  let idx = -1;
  for (let i = 0; i <= k; i++) {
    const m = re.exec(html);
    if (m === null) return null;
    idx = m.index;
  }
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
