/*
 * Showcase nel browser: filtri per tipo, feed da copiare, date relative, focus visibile. Lo usano /showcase/
 * (initShowcasePage) e la sezione della home (T8, T9), che chiama bindTags, bindFeed, aggiornaDate e
 * tieniVisibile sul proprio contenitore.
 *
 * Contratto del markup (dentro `root`):
 * - controlli che servono solo con JS: classe `solo-js` e attributo `hidden`. Li rivela uno script inline subito
 *   dopo i controlli, prima del primo paint (D11): toglie `hidden` e mette `data-js` sul contenitore.
 *   `rivelaControlli` fa la stessa cosa ed è idempotente, come rete di sicurezza;
 * - chip: `button[data-filter="all|caso-studio|release"][data-total="<totale in build>"][aria-pressed]`.
 *   I totali vengono da `data-total`, non dalle schede nel DOM (D12): in home il markup ne ha solo una parte;
 * - schede: `[data-tag]` (il <li>); mesi: `[data-group]`, nascosti quando restano vuoti;
 * - link verso la pagina: `a[data-cta]` con dentro `[data-cta-label]` (testo e href li scrive bindTags);
 * - conteggio per gli screen reader: `[data-count]` con `role="status"`;
 * - feed: `button[data-copy-feed][data-feed-url]` con `[data-feed-label]` e `[data-feed-label-ok]` impilati,
 *   e `[data-feed-status]` con `role="status"`;
 * - date: `time[datetime][data-rel]` (scheda) e `[data-rel-riga]` (riga della home), vedi aggiornaDate.
 */
import { ctaLabel, countAnnouncement, isTag, oggiLocale, relDay, type TagFilter } from '../data/articoli-testi';

/** Rivela i controlli `.solo-js` dentro `root` e segna il contenitore con `data-js`. */
export function rivelaControlli(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>('.solo-js').forEach((el) => el.removeAttribute('hidden'));
  root.setAttribute('data-js', '');
}

export interface CambioFiltro {
  /** true alla prima applicazione (filtro iniziale): niente annuncio, niente animazione. */
  iniziale: boolean;
  /** Le schede rimaste visibili, nell'ordine del DOM. */
  shown: HTMLElement[];
  /** I gruppi (mesi) rimasti visibili. */
  groups: HTMLElement[];
}

/**
 * Filtro per tipo. Imposta `aria-pressed`, nasconde (`hidden`) le schede che non corrispondono e quelle oltre
 * `limit`, nasconde i mesi rimasti vuoti, aggiorna i link `[data-cta]` e annuncia il conteggio in `[data-count]`.
 * Un clic sul chip già premuto non fa niente. `onChange` arriva dopo ogni applicazione: è l'aggancio per lo
 * swap animato (T13) e, nella pagina, per l'indirizzo.
 */
export function bindTags(
  root: HTMLElement,
  { limit, onChange }: { limit?: number; onChange?: (tag: TagFilter, info: CambioFiltro) => void } = {}
) {
  const items = [...root.querySelectorAll<HTMLElement>('[data-tag]')];
  const groups = [...root.querySelectorAll<HTMLElement>('[data-group]')];
  const chips = [...root.querySelectorAll<HTMLButtonElement>('[data-filter]')];
  const count = root.querySelector<HTMLElement>('[data-count]');
  const totale = (tag: TagFilter) => Number(chips.find((c) => c.dataset.filter === tag)?.dataset.total ?? 0);

  const apply = (richiesto: string, { iniziale = false }: { iniziale?: boolean } = {}) => {
    // un tag sconosciuto, o senza chip perché senza articoli, vale «Tutti»
    const tag: TagFilter = isTag(richiesto) && chips.some((c) => c.dataset.filter === richiesto) ? richiesto : 'all';
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.filter === tag)));
    const shown: HTMLElement[] = [];
    items.forEach((it) => {
      const match = tag === 'all' || it.dataset.tag === tag;
      it.hidden = !(match && (limit === undefined || shown.length < limit));
      if (!it.hidden) shown.push(it);
    });
    groups.forEach((g) => (g.hidden = !g.querySelector('[data-tag]:not([hidden])')));
    const total = totale(tag);
    root.querySelectorAll<HTMLAnchorElement>('a[data-cta]').forEach((a) => {
      a.href = tag === 'all' ? '/showcase/' : `/showcase/?tag=${tag}`;
      const label = a.querySelector<HTMLElement>('[data-cta-label]');
      if (label) label.textContent = ctaLabel(tag, total);
    });
    // al caricamento non si annuncia niente: si annuncia solo un cambio scelto da chi visita
    if (count && !iniziale) count.textContent = countAnnouncement(tag, shown.length, total);
    onChange?.(tag, { iniziale, shown, groups: groups.filter((g) => !g.hidden) });
    return tag;
  };

  const onClick = (e: Event) => {
    const chip = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-filter]');
    if (!chip || !root.contains(chip) || chip.getAttribute('aria-pressed') === 'true') return;
    apply(chip.dataset.filter!);
  };
  root.addEventListener('click', onClick);
  return { apply, off: () => root.removeEventListener('click', onClick) };
}

/**
 * Swap del filtro: fa (ri)partire l'animazione `[data-swap]` (CSS in Filtri.astro) su `els`, anche su quelli
 * che la stanno già facendo. Si chiama dopo tutti i cambi al DOM: toglie l'attributo ovunque dentro `root`,
 * forza un solo reflow e lo rimette. Niente rAF e niente `getAnimations()`.
 */
export function riparti(root: HTMLElement, els: HTMLElement[]) {
  root.querySelectorAll('[data-swap]').forEach((el) => el.removeAttribute('data-swap'));
  void root.offsetWidth;
  els.forEach((el) => el.setAttribute('data-swap', ''));
}

const DURATA_COPIATO = 2400;

/**
 * «Copia il feed RSS». Riuscita: l'etichetta diventa «Link del feed copiato» per 2400 ms (ogni clic fa ripartire
 * il timer) e la regione di stato lo annuncia senza mostrarlo. Fallita: la regione di stato mostra l'indirizzo,
 * selezionabile, fino al clic successivo. Le due etichette sono impilate nel CSS: il bottone non cambia larghezza.
 */
export function bindFeed(root: HTMLElement) {
  const offs: (() => void)[] = [];
  root.querySelectorAll<HTMLButtonElement>('[data-copy-feed]').forEach((btn) => {
    const box = btn.parentElement!;
    const status = box.querySelector<HTMLElement>('[data-feed-status]');
    const url = btn.dataset.feedUrl!;
    let timer: number | undefined;
    let giro = 0;

    const reset = () => {
      btn.removeAttribute('data-copiato');
      if (status) {
        status.textContent = '';
        status.removeAttribute('data-esito');
      }
    };
    const onClick = async () => {
      const mio = ++giro;
      clearTimeout(timer);
      reset();
      try {
        await navigator.clipboard.writeText(url);
        if (mio !== giro) return;
        btn.setAttribute('data-copiato', '');
        if (status) {
          status.setAttribute('data-esito', 'ok');
          status.textContent = 'Link del feed copiato';
        }
        timer = window.setTimeout(reset, DURATA_COPIATO);
      } catch {
        if (mio !== giro || !status) return;
        status.setAttribute('data-esito', 'errore');
        const link = document.createElement('span');
        link.className = 'feed-url';
        link.textContent = url;
        status.replaceChildren('Copia non riuscita: ', link);
      }
    };
    btn.addEventListener('click', onClick);
    offs.push(() => {
      btn.removeEventListener('click', onClick);
      clearTimeout(timer);
    });
  });
  return () => offs.forEach((off) => off());
}

/**
 * Date relative al giorno di calendario di chi visita (D10). L'HTML porta sempre la data assoluta; qui, fra 0 e 6
 * giorni, diventa «oggi», «ieri», «N giorni fa». Più vecchia, o nel futuro, resta il testo dell'HTML.
 * Idempotente: il testo originale si conserva in `data-abs`, così si può richiamare (es. al ritorno da bfcache).
 *
 * - `time[datetime][data-rel]`: la data della scheda, es. «13 nov» → «ieri».
 * - `[data-rel-riga]` (riga della home, T8): un elemento che contiene SOLO la parte «quando» della riga, con la
 *   data in `datetime` (se è un <time>) o in `data-date`, formato "YYYY-MM-DD", e come testo HTML il caso lontano,
 *   preposizione compresa. Esempio:
 *     «16 articoli da maggio 2025 · l'ultimo <time datetime="2026-11-15" data-rel-riga>il 15 nov</time>»
 *   diventa «l'ultimo ieri», «l'ultimo 5 giorni fa», «l'ultimo oggi»; oltre 6 giorni resta «l'ultimo il 15 nov».
 */
export function aggiornaDate(root: ParentNode, oggi: string = oggiLocale()) {
  root.querySelectorAll<HTMLElement>('[data-rel], [data-rel-riga]').forEach((el) => {
    const iso = el.getAttribute('datetime') ?? el.dataset.date;
    if (!iso) return;
    el.dataset.abs ??= el.textContent ?? '';
    el.textContent = relDay(iso, oggi) ?? el.dataset.abs;
  });
}

/** Margine fra l'anello di focus e la nav in alto o la pillola «Prenota» in basso. */
const RESPIRO = 8;

/**
 * Focus da tastiera dentro `root` (AC27, WCAG 2.4.11): l'anello di focus non resta sotto la nav fissa né sotto la
 * pillola fissa in basso (`a.float-cta`). Il browser porta l'elemento «al più vicino», ma una scheda più alta
 * dell'area visibile (telefono in orizzontale) finisce con la cima sotto la nav, e la pillola non la conosce.
 * Al frame dopo il focus si misura l'anello (rettangolo ± outline e offset) e la pagina si sposta, senza
 * animazione: prima fuori dalla pillola, ma la cima vince sempre e non va mai sotto la nav. Solo verticale: lo
 * scorrimento orizzontale della fila in home resta a fila.ts. Solo `:focus-visible`: un clic non sposta la pagina.
 */
export function tieniVisibile(root: HTMLElement) {
  let frame = 0;
  const onFocusin = (e: FocusEvent) => {
    const el = e.target as HTMLElement;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      if (document.activeElement !== el || !el.matches(':focus-visible')) return;
      const cs = getComputedStyle(el);
      const anello = (parseFloat(cs.outlineOffset) || 0) + (parseFloat(cs.outlineWidth) || 0) || 4;
      const r = el.getBoundingClientRect();
      const cima = r.top - anello;
      const fondo = r.bottom + anello;
      const nav = document.querySelector<HTMLElement>('body > nav');
      const sottoNav = nav ? Math.max(0, nav.getBoundingClientRect().bottom) : 0;
      let delta = 0;
      const pill = document.querySelector<HTMLElement>('a.float-cta');
      if (pill?.classList.contains('show') && getComputedStyle(pill).display !== 'none') {
        const p = pill.getBoundingClientRect();
        const siToccano = r.right + anello > p.left && r.left - anello < p.right;
        if (siToccano && fondo > p.top - RESPIRO) delta = fondo - (p.top - RESPIRO);
      }
      // la cima vince: anche con una scheda più alta dell'area visibile
      if (cima - delta < sottoNav + RESPIRO / 2) delta = cima - sottoNav - RESPIRO;
      if (Math.abs(delta) >= 1) window.scrollBy({ top: delta, behavior: 'instant' });
    });
  };
  root.addEventListener('focusin', onFocusin);
  return () => {
    root.removeEventListener('focusin', onFocusin);
    cancelAnimationFrame(frame);
  };
}

/** Scrive il filtro nell'indirizzo senza aggiungere voci alla cronologia; con «Tutti», niente parametro. */
function scriviTag(tag: TagFilter) {
  const url = new URL(location.href);
  if (tag === 'all') url.searchParams.delete('tag');
  else url.searchParams.set('tag', tag);
  if (url.href !== location.href) history.replaceState(history.state, '', url);
}

/**
 * /showcase/. Lo script inline dopo i controlli ha già rivelato i chip e, se `?tag` è valido, messo
 * `data-filtro` sulla pagina (il CSS nasconde schede e mesi). Qui il filtro passa agli attributi `hidden`
 * nello stesso task, poi `data-filtro` si toglie: nessun salto visibile.
 */
export function initShowcasePage(page: HTMLElement) {
  rivelaControlli(page);
  aggiornaDate(page);
  const tags = bindTags(page, {
    onChange: (tag, { iniziale, groups }) => {
      scriviTag(tag);
      // lo swap va sui mesi visibili, così il titolo del mese arriva con le sue schede; al caricamento niente
      if (!iniziale) riparti(page, groups);
    },
  });
  tags.apply(page.dataset.filtro ?? new URLSearchParams(location.search).get('tag') ?? 'all', { iniziale: true });
  page.removeAttribute('data-filtro');
  bindFeed(page);
  tieniVisibile(page);
  // ritorno da bfcache in un altro giorno: le date relative si ricalcolano
  addEventListener('pageshow', (e) => {
    if (e.persisted) aggiornaDate(page);
  });
}
