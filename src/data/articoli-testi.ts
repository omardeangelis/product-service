/*
 * Testi e date condivisi tra pagine (build) e script del browser. Modulo puro: nessun import, solo sintassi TS
 * cancellabile, così Node lo esegue direttamente. Le date sono giorni di calendario "YYYY-MM-DD".
 */

export type Tag = 'caso-studio' | 'release';
export type TagFilter = 'all' | Tag;

/** I filtri, nell'ordine in cui compaiono. */
export const TAGS: { id: TagFilter; label: string }[] = [
  { id: 'all', label: 'Tutti' },
  { id: 'caso-studio', label: 'Casi studio' },
  { id: 'release', label: 'Release' },
];

export const isTag = (x: string): x is TagFilter => TAGS.some((t) => t.id === x);

/** Testo del link verso la pagina con quel filtro: il numero in fondo. */
export function ctaLabel(tag: string, n: number): string {
  if (tag === 'caso-studio') return `Tutti i casi studio · ${n}`;
  if (tag === 'release') return `Tutte le release · ${n}`;
  return `Tutti gli articoli · ${n}`;
}

/** Conteggio annunciato: nomina il tipo, e dice "ultimi N di M" quando ne mostra solo una parte. */
export function countAnnouncement(tag: string, shown: number, total: number): string {
  const parziale = shown < total;
  if (tag === 'caso-studio') return parziale ? `Gli ultimi ${shown} di ${total} casi studio` : total === 1 ? '1 caso studio' : `${total} casi studio`;
  if (tag === 'release') return parziale ? `Le ultime ${shown} di ${total} release` : `${total} release`;
  return parziale ? `Gli ultimi ${shown} di ${total} articoli` : total === 1 ? '1 articolo' : `${total} articoli`;
}

const MESI = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
const MESI_BREVI = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];

// Mezzogiorno UTC + getter UTC: il risultato non dipende dal fuso della macchina.
const parse = (iso: string) => new Date(`${iso}T12:00:00Z`);

/** "13 nov", con l'anno ("21 mag 2025") quando è diverso da `annoRif`. */
export function dayMonth(iso: string, annoRif: number): string {
  const d = parse(iso);
  const anno = d.getUTCFullYear();
  return `${d.getUTCDate()} ${MESI_BREVI[d.getUTCMonth()]}${anno === annoRif ? '' : ` ${anno}`}`;
}

/** "13 novembre 2026" */
export function longDate(iso: string): string {
  const d = parse(iso);
  return `${d.getUTCDate()} ${MESI[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** "novembre 2026" */
export function monthOf(iso: string): string {
  const d = parse(iso);
  return `${MESI[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** "oggi", "ieri", "N giorni fa" (fino a 6); altrimenti null (più vecchio, o nel futuro). */
export function relDay(iso: string, oggi: string): string | null {
  const n = Math.round((parse(oggi).getTime() - parse(iso).getTime()) / 864e5);
  if (n === 0) return 'oggi';
  if (n === 1) return 'ieri';
  if (n >= 2 && n <= 6) return `${n} giorni fa`;
  return null;
}

/** Il giorno di calendario locale di una Date, come "YYYY-MM-DD": per gli script del browser. */
export function oggiLocale(d: Date = new Date()): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const g = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${g}`;
}

/** Escape di tutto, poi ripristina solo <strong> e <em> (apertura e chiusura). */
export function inlineHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/&lt;(\/?)(strong|em)&gt;/g, '<$1$2>');
}

/** Toglie solo <strong> e <em>: per attributi e testo semplice. */
export function testoPiano(text: string): string {
  return text.replace(/<\/?(strong|em)>/g, '');
}
