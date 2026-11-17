/*
 * La fila degli ultimi articoli in home (sezione 04): frecce e ritorno all'inizio al cambio di filtro.
 *
 * Contratto del markup (dentro `root`):
 * - la fila: `ol.sc-strip`, schede `li` (quelle filtrate via sono `hidden`) separate da 16 px di gap e con il
 *   gutter sinistro come padding-left;
 * - le frecce: dentro `[data-arrows]`, `button[data-fila-prev]` («Articoli più recenti») e
 *   `button[data-fila-next]` («Articoli meno recenti»). Le mostra solo il CSS con un puntatore fine;
 *   quando la fila non scorre lo slot prende `data-ferma` e il CSS le rende invisibili senza togliere spazio.
 *
 * Modello: un indice `i` di destinazione (la scheda allineata a sinistra). Ogni clic sposta `i` di tante schede
 * quante ne stanno intere; alle estremità la freccia ha `aria-disabled="true"` (mai `disabled`: resta
 * raggiungibile con Tab e il focus non cade sulla pagina) e il clic non fa niente. Se chi visita scorre la fila
 * a mano, a fine scorrimento `i` si riallinea alla scheda più vicina.
 * Focus da tastiera su una scheda tagliata dal bordo della fila: la fila scorre finché la scheda, anello di focus
 * compreso, sta tutta nell'area visibile (AC26), come uno scorrimento delle frecce.
 *
 * Opzioni: `onFermo(left)` arriva a ogni fine scorrimento (frecce, mano, focus), con lo `scrollLeft` finale.
 */

const GAP = 16;
/** Senza `scrollend`: lo scorrimento è finito dopo 150 ms senza eventi `scroll`. */
const QUIETE = 150;
/** Rete di sicurezza: uno scorrimento delle frecce che non manda `scrollend` non resta «in corso» per sempre. */
const MAX_CORSA = 1500;
/** Spazio dell'anello di focus intorno alla scheda: outline 2 px + offset 2 px. */
const ANELLO = 4;

export function bindFila(root: HTMLElement, { onFermo }: { onFermo?: (left: number) => void } = {}) {
  const strip = root.querySelector<HTMLElement>('.sc-strip');
  const slot = root.querySelector<HTMLElement>('[data-arrows]');
  const prev = root.querySelector<HTMLButtonElement>('[data-fila-prev]');
  const next = root.querySelector<HTMLButtonElement>('[data-fila-next]');
  const nulla = { reset() {}, aggiorna() {}, ripristina(_left: number) {}, off() {} };
  if (!strip || !slot || !prev || !next) return nulla;

  const conScrollend = 'onscrollend' in window;
  let i = 0;
  let inCorsa = false;
  let timerCorsa: number | undefined;
  let timerQuiete: number | undefined;

  /** Passo (scheda + gap), schede intere visibili, scorrimento massimo e indice massimo. */
  const misure = () => {
    const prima = strip.querySelector<HTMLElement>(':scope > li:not([hidden])');
    const passo = (prima?.getBoundingClientRect().width ?? 0) + GAP;
    const gutter = parseFloat(getComputedStyle(strip).paddingLeft) || 0;
    const fit = passo > GAP ? Math.max(1, Math.floor((strip.clientWidth - gutter + GAP) / passo)) : 1;
    const maxLeft = Math.max(0, strip.scrollWidth - strip.clientWidth);
    const max = passo > GAP ? Math.ceil((maxLeft - 1) / passo) : 0;
    return { passo, fit, maxLeft, max: Math.max(0, max) };
  };

  const stato = () => {
    const { passo, maxLeft } = misure();
    slot.toggleAttribute('data-ferma', strip.scrollWidth <= strip.clientWidth + 1);
    prev.setAttribute('aria-disabled', String(i <= 0));
    next.setAttribute('aria-disabled', String(i * passo >= maxLeft - 1));
  };

  const fineCorsa = () => {
    inCorsa = false;
    clearTimeout(timerCorsa);
  };

  /** Dopo uno scorrimento a mano: `i` diventa la scheda più vicina al bordo sinistro. */
  const riallinea = () => {
    const { passo, maxLeft, max } = misure();
    if (passo <= GAP) i = 0;
    else if (strip.scrollLeft >= maxLeft - 1) i = max;
    else i = Math.min(max, Math.max(0, Math.round(strip.scrollLeft / passo)));
    stato();
  };

  /** Scorre fino a `left` come «corsa» delle frecce: a fine corsa niente riallineamento che la contraddica. */
  const corri = (left: number) => {
    stato();
    if (Math.abs(strip.scrollLeft - left) < 1) return;
    // letta a ogni corsa: se la preferenza cambia a pagina aperta, vale subito
    const ridotto = matchMedia('(prefers-reduced-motion: reduce)').matches;
    inCorsa = true;
    clearTimeout(timerCorsa);
    timerCorsa = window.setTimeout(fineCorsa, MAX_CORSA);
    strip.scrollTo({ left, behavior: ridotto ? 'instant' : 'smooth' });
  };

  const vai = (dir: 1 | -1, btn: HTMLButtonElement) => {
    if (btn.getAttribute('aria-disabled') === 'true') return;
    const { passo, fit, maxLeft, max } = misure();
    i = dir > 0 ? Math.min(i + fit, max) : Math.max(i - fit, 0);
    corri(Math.min(i * passo, maxLeft));
  };

  /** Focus dentro la fila: se la scheda (con l'anello) non sta tutta nell'area visibile, la fila la porta dentro. */
  const onFocusin = (e: FocusEvent) => {
    const li = (e.target as HTMLElement).closest<HTMLElement>('.sc-strip > li');
    if (!li || li.hidden) return;
    const visibili = [...strip.querySelectorAll<HTMLElement>(':scope > li:not([hidden])')];
    const k = visibili.indexOf(li);
    if (k < 0) return;
    const box = strip.getBoundingClientRect();
    const sinistra = box.left + (parseFloat(getComputedStyle(strip).paddingLeft) || 0);
    const r = li.getBoundingClientRect();
    // a sinistra basta che la scheda parta dal gutter (l'anello cade nel padding, visibile); a destra conta l'anello
    if (r.left >= sinistra - 1 && r.right + ANELLO <= box.right + 0.5) return;
    const { passo, maxLeft, max } = misure();
    i = Math.min(k, max);
    corri(Math.min(k * passo, maxLeft));
  };

  const onPrev = () => vai(-1, prev);
  const onNext = () => vai(1, next);

  const onScrollend = () => {
    if (inCorsa) {
      fineCorsa();
      stato();
    } else riallinea();
    onFermo?.(strip.scrollLeft);
  };
  const onScroll = () => {
    clearTimeout(timerQuiete);
    timerQuiete = window.setTimeout(onScrollend, QUIETE);
  };

  /** Cambio filtro (AC7): la fila riparte dall'inizio, anche a metà di uno scorrimento delle frecce. */
  const reset = () => {
    fineCorsa();
    i = 0;
    // `instant` interrompe anche uno scorrimento smooth in corso
    strip.scrollTo({ left: 0, behavior: 'instant' });
    stato();
    requestAnimationFrame(() => {
      if (strip.scrollLeft !== 0) strip.scrollTo({ left: 0, behavior: 'instant' });
      stato();
    });
  };

  const aggiorna = () => {
    if (inCorsa) stato();
    else riallinea();
  };

  /** Ritorno con Indietro senza bfcache: la fila torna a `left` senza animazione e le frecce si riallineano. */
  const ripristina = (left: number) => {
    fineCorsa();
    strip.scrollTo({ left, behavior: 'instant' });
    riallinea();
  };

  prev.addEventListener('click', onPrev);
  next.addEventListener('click', onNext);
  strip.addEventListener('focusin', onFocusin);
  if (conScrollend) strip.addEventListener('scrollend', onScrollend);
  else strip.addEventListener('scroll', onScroll, { passive: true });
  const ro = new ResizeObserver(aggiorna);
  // border-box: col gutter in padding, il content-box può restare uguale mentre la fila si allarga
  ro.observe(strip, { box: 'border-box' });
  stato();

  return {
    reset,
    aggiorna,
    ripristina,
    off: () => {
      strip.removeEventListener('focusin', onFocusin);
      prev.removeEventListener('click', onPrev);
      next.removeEventListener('click', onNext);
      strip.removeEventListener('scrollend', onScrollend);
      strip.removeEventListener('scroll', onScroll);
      ro.disconnect();
      clearTimeout(timerCorsa);
      clearTimeout(timerQuiete);
    },
  };
}
