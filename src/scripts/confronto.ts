/*
 * Confronto: simulazione della board "Ticket" (giorno 0 → 30).
 * - L'HTML è lo stato finale (funziona senza JS). Lo script inline dopo `.board-card` lo riporta al giorno 0
 *   prima del primo paint e mette `data-armed`; con reduced motion non tocca niente e la board resta finale.
 * - Qui: riserva delle altezze delle corsie (prova a vuoto), partenza al 35% di visibilità, orologio a passi
 *   di frame, eventi nel loro giorno, replay. Ogni animazione è WAAPI con i token di global.css.
 */
import { EVENTS, LANES, SPRINTS, SPRINT_DAYS, MS_PER_DAY, laneOf, type Ev } from '../data/confronto';

const DAYS = SPRINTS * SPRINT_DAYS;

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Legge un token di global.css (`--ease-out`, `--dur-ui`…): niente curve scritte a mano. */
const token = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
/** Durata in ms: il CSS minificato scrive `250ms` come `.25s`, quindi conta l'unità. */
const ms = (name: string) => {
  const v = token(name);
  return parseFloat(v) * (v.endsWith('ms') ? 1 : v.endsWith('s') ? 1000 : 1);
};

/** Scambio di contenuto in un contenitore piccolo: opacità + 8px + blur leggero. */
function swapIn(el: Element) {
  if (reduced()) {
    el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: ms('--dur-press'), easing: 'linear' });
    return;
  }
  el.animate(
    [
      { opacity: 0, transform: 'translateY(8px)', filter: 'blur(2px)' },
      { opacity: 1, transform: 'none', filter: 'blur(0)' },
    ],
    { duration: ms('--dur-ui'), easing: token('--ease-out') },
  );
}

export function initConfronto(root: HTMLElement): () => void {
  const card = root.querySelector<HTMLElement>('.board-card');
  const seed = root.querySelector<HTMLTemplateElement>('template[data-seed]');
  const sprintEl = root.querySelector<HTMLElement>('[data-sprint]');
  const replay = root.querySelector<HTMLButtonElement>('[data-replay]');
  if (!card || !seed || !sprintEl || !replay) return () => {};
  const fills = [...root.querySelectorAll<HTMLElement>('.seg-fill[data-seg]')];
  const keys = LANES.map((l) => l.key as string);
  const lane = (k: string) => root.querySelector<HTMLElement>(`.lane[data-lane="${k}"]`)!;
  const cell = (k: string, col: number) => lane(k).querySelector<HTMLElement>(`[data-col="${col}"]`)!;
  const ticket = (id: string) => root.querySelector<HTMLElement>(`.tk[data-ticket="${id}"]`);

  let raf = 0;
  let timers: number[] = [];
  let next = 0; // primo evento non ancora applicato
  let io: IntersectionObserver | null = null;
  let running = false; // vero dall'avvio del giro finché l'orologio non arriva al giorno 30
  let started = false; // c'è già stato almeno un giro (o lo stato finale è già mostrato)
  let showingFinal = false; // la board mostra lo stato finale (giro chiuso o completato)

  /** `d` in giorni lavorativi (0 → 30). Con `animate` il cambio di sprint usa lo scambio piccolo. */
  const setDay = (d: number, animate = false) => {
    // il giorno 10 è l'ultimo dello sprint 1, non il primo del 2
    const label = `Sprint ${Math.min(SPRINTS, Math.max(1, Math.ceil(d / SPRINT_DAYS)))}`;
    if (sprintEl.textContent !== label) {
      sprintEl.textContent = label;
      if (animate) swapIn(sprintEl);
    }
    fills.forEach((fill, i) => {
      const f = Math.min(1, Math.max(0, (d - i * SPRINT_DAYS) / SPRINT_DAYS));
      fill.style.transform = `scaleX(${f})`;
      fill.parentElement!.toggleAttribute('data-on', d > i * SPRINT_DAYS || i === 0);
    });
  };

  const countShipped = (k: string) => {
    const n = lane(k).querySelectorAll('.tk[data-shipped]').length;
    const el = lane(k).querySelector<HTMLElement>('[data-count]')!;
    el.textContent = `${n} in produzione`;
    el.toggleAttribute('data-some', n > 0);
  };

  /** Unica fonte del giorno 0: ferma tutto, rimette i ticket iniziali, contatori a zero. */
  const reset = () => {
    cancelAnimationFrame(raf);
    timers.forEach(clearTimeout);
    timers = [];
    next = 0;
    running = false;
    showingFinal = false;
    card.getAnimations({ subtree: true }).forEach((a) => a.cancel());
    root.querySelectorAll('.tk').forEach((t) => t.remove());
    const frag = seed.content.cloneNode(true) as DocumentFragment;
    frag.querySelectorAll<HTMLElement>('.tk').forEach((t) => cell(t.dataset.lane!, 0).append(t));
    keys.forEach(countShipped);
    setDay(0);
  };

  /**
   * Sposta un ticket di colonna. Con `animate` FLIP interrompibile: parte da dove si vede adesso.
   * 400ms (`--dur-swap`): la board è grande. Due spostamenti dello stesso ticket a 2 giorni (300ms) si sovrappongono,
   * e il secondo riparte dalla posizione visibile del primo.
   */
  const move = (el: HTMLElement, to: HTMLElement, animate: boolean) => {
    if (!animate) return void to.append(el);
    const a = el.getBoundingClientRect();
    // solo le animazioni del ticket stesso, non la spunta (::before)
    el.getAnimations().forEach((x) => {
      if (!(x.effect as KeyframeEffect | null)?.pseudoElement) x.cancel();
    });
    to.append(el);
    const b = el.getBoundingClientRect();
    el.animate([{ transform: `translate(${a.left - b.left}px, ${a.top - b.top}px)` }, { transform: 'none' }], {
      duration: ms('--dur-swap'),
      easing: token('--ease-in-out'),
    });
  };

  const apply = (ev: Ev, animate: boolean) => {
    const k = laneOf(ev.id);
    let el = ticket(ev.id);
    if (ev.add) {
      el = seed.content.querySelector<HTMLElement>('.tk')!.cloneNode(true) as HTMLElement;
      el.dataset.ticket = ev.id;
      el.dataset.lane = k;
      el.querySelector('.tk-id')!.textContent = ev.add.code;
      el.querySelector('.tk-title')!.textContent = ev.add.title;
      el.querySelector('.tk-st')!.textContent = ev.st ?? '';
      cell(k, 0).append(el);
      if (animate)
        el.animate(
          [
            { opacity: 0, transform: 'scale(0.96)' },
            { opacity: 1, transform: 'none' },
          ],
          { duration: ms('--dur-ui'), easing: token('--ease-out') },
        );
    }
    if (!el) return;
    if (ev.st !== undefined && !ev.add) {
      const st = el.querySelector('.tk-st')!;
      st.textContent = ev.st;
      if (animate) swapIn(st);
    }
    if (ev.warn !== undefined) el.toggleAttribute('data-warn', ev.warn);
    // si compatta prima di partire: atterra già con l'altezza finale
    if (ev.ship) el.setAttribute('data-shipped', '');
    if (ev.col !== undefined) move(el, cell(k, ev.col), animate);
    if (!ev.ship) return;
    if (!animate) return countShipped(k);
    // il contatore cambia quando il ticket è atterrato
    timers.push(window.setTimeout(() => countShipped(k), ms('--dur-swap')));
    // la spunta compare all'atterraggio; il primo deploy usa l'overshoot di brand, una volta sola
    const first = ev.id === 'pe-1';
    el.animate(
      [
        { opacity: 0, transform: 'scale(0.5)' },
        { opacity: 1, transform: 'none' },
      ],
      {
        pseudoElement: '::before',
        delay: 0.6 * ms('--dur-swap'),
        duration: ms(first ? '--dur-swap' : '--dur-ui'),
        easing: token(first ? '--ease-pop' : '--ease-out'),
        fill: 'backwards',
      },
    );
  };

  /** Salta allo stato finale senza animazioni: applica gli eventi rimasti, ricalcola i contatori. */
  const finish = () => {
    cancelAnimationFrame(raf);
    timers.forEach(clearTimeout);
    timers = [];
    running = false;
    showingFinal = true;
    card.getAnimations({ subtree: true }).forEach((a) => a.finish());
    while (next < EVENTS.length) apply(EVENTS[next++], false);
    keys.forEach(countShipped);
    setDay(DAYS);
  };

  /**
   * Riserva a ogni corsia l'altezza massima del mese: prova a vuoto tutti gli eventi, misura dopo ognuno
   * e blocca il min-height. Poi torna al giorno 0: così le corsie non crescono quando parte il giro.
   */
  const reserve = () => {
    const lanes = keys.map(lane);
    lanes.forEach((l) => (l.style.minHeight = ''));
    reset();
    // altezza frazionaria: offsetHeight arrotonda e lascia crescere la corsia di qualche decimo di pixel
    const h = (l: HTMLElement) => l.getBoundingClientRect().height;
    const max = lanes.map(h);
    EVENTS.forEach((e) => {
      apply(e, false);
      lanes.forEach((l, i) => (max[i] = Math.max(max[i], h(l))));
    });
    lanes.forEach((l, i) => (l.style.minHeight = `${max[i]}px`));
    reset();
  };

  /** Chiude il giro in corso (reduced motion o cambio di larghezza): stato finale, contatori ricalcolati. */
  const closeRun = () => {
    io?.disconnect();
    io = null;
    finish();
  };

  const run = () => {
    // il primo giro, da qualunque parte arrivi, spegne la partenza automatica
    io?.disconnect();
    io = null;
    reset();
    started = true;
    if (reduced()) return finish();
    running = true;
    // orologio a passi di frame: con la tab nascosta il tempo si ferma e al ritorno non salta
    let elapsed = 0;
    let last = performance.now();
    const frame = (now: number) => {
      elapsed += Math.max(0, Math.min(now - last, 100));
      last = now;
      const d = Math.min(elapsed / MS_PER_DAY, DAYS);
      setDay(d, true);
      while (next < EVENTS.length && EVENTS[next].d <= d) apply(EVENTS[next++], true);
      if (d < DAYS) raf = requestAnimationFrame(frame);
      else {
        setDay(DAYS);
        running = false;
        showingFinal = true;
      }
    };
    raf = requestAnimationFrame(frame);
  };

  replay.addEventListener('click', run);

  // con reduced motion la board resta nello stato finale e non parte da sola
  if (reduced()) started = showingFinal = true;
  else {
    // fino a 760px la board è nascosta (vista statica, AC18): non parte e la riserva la fa il ResizeObserver quando compare
    if (card.offsetWidth) reserve();
    io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io?.disconnect();
        // un frame dopo: il giorno 0 è già stato disegnato
        raf = requestAnimationFrame(run);
      },
      { threshold: 0.35 },
    );
    io.observe(card);
  }

  // reduced motion acceso a metà giro, o prima del primo: stato finale subito
  const mq = matchMedia('(prefers-reduced-motion: reduce)');
  const onMotion = () => {
    if (!mq.matches) return;
    if (running) return closeRun();
    if (!started) {
      io?.disconnect();
      io = null;
      started = true;
      reset();
      finish();
    }
  };
  mq.addEventListener('change', onMotion);

  // solo i cambi di larghezza contano: la barra di Safari cambia solo l'altezza
  let width = -1;
  let settle = 0;
  const ro = new ResizeObserver((entries) => {
    const w = entries[entries.length - 1].contentRect.width;
    if (width < 0) return void (width = w);
    if (Math.abs(w - width) < 0.5) return;
    width = w;
    if (running) closeRun();
    cancelAnimationFrame(settle);
    settle = requestAnimationFrame(() => {
      if (running) return;
      const wasFinal = showingFinal;
      reserve();
      if (wasFinal) finish();
    });
  });
  ro.observe(card);

  return () => {
    mq.removeEventListener('change', onMotion);
    ro.disconnect();
    cancelAnimationFrame(settle);
    io?.disconnect();
    replay.removeEventListener('click', run);
    cancelAnimationFrame(raf);
    timers.forEach(clearTimeout);
    timers = [];
  };
}
