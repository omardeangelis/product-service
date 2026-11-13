/*
 * Variante · Muro: le file avanzano a scatti di una finestra. Ogni nastro contiene tre copie della
 * sua sequenza ed è centrato (k = 0); finito un giro (|k| = lunghezza della sequenza) torna a k = 0
 * senza transizione, dove l'immagine è identica. Il tempo avanza solo con la sezione a schermo,
 * la tab visibile e il mouse fuori dal muro. Con reduced motion il muro resta fermo.
 * Cliente acceso: hover (o tap) su un nome o su una schermata → data-hot sulla sezione; il resto è CSS.
 */
export function initMuro(root: HTMLElement) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const stage = root.querySelector<HTMLElement>('.v7-stage');
  const list = root.querySelector<HTMLElement>('.v7-names');
  if (!stage || !list) return;
  // i nomi: le voci della griglia sotto il muro
  const names = [...list.querySelectorAll<HTMLElement>('[data-index]')];

  const rows = [...stage.querySelectorAll<HTMLElement>('.v7-row')].map((row, r) => ({
    track: row.querySelector<HTMLElement>('.v7-track')!,
    dir: row.dataset.dir === 'right' ? -1 : 1,
    period: Number(row.dataset.period) || 3000,
    n: Number(row.dataset.n) || 4,
    // primo scatto sfalsato per fila
    elapsed: -400 * r,
    k: 0,
  }));

  const apply = (row: (typeof rows)[number], animate = true) => {
    if (!animate) row.track.style.transition = 'none';
    row.track.style.setProperty('--k', String(row.k));
    if (!animate) {
      void row.track.offsetWidth;
      row.track.style.transition = '';
    }
  };

  const onEnd = (e: TransitionEvent) => {
    const row = rows.find((r) => r.track === e.target);
    if (!row || e.propertyName !== 'transform') return;
    if (Math.abs(row.k) >= row.n) {
      row.k = 0;
      apply(row, false);
    }
  };

  let visible = false;
  let hovered = false;
  let raf = 0;
  let last = 0;
  const tick = (t: number) => {
    const dt = last ? Math.min(t - last, 64) : 0;
    last = t;
    if (visible && !hovered && !document.hidden && !reduce.matches) {
      for (const row of rows) {
        row.elapsed += dt;
        if (row.elapsed >= row.period) {
          row.elapsed = 0;
          row.k += row.dir;
          apply(row);
        }
      }
    }
    raf = requestAnimationFrame(tick);
  };

  // ---------- cliente acceso ----------
  let hot = -1;
  const setHot = (i: number) => {
    hot = i;
    if (i >= 0) root.dataset.hot = String(i);
    else delete root.dataset.hot;
    names.forEach((n, j) => n.toggleAttribute('data-on', j === i));
  };
  const indexOf = (e: Event) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>('[data-index]');
    return el ? Number(el.dataset.index) : -1;
  };

  // mouse: sul muro le file si fermano e la schermata sotto il cursore accende il suo cliente
  const onStageOver = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    hovered = true;
    // tra una finestra e l'altra resta acceso l'ultimo cliente: niente sfarfallio negli spazi
    const i = indexOf(e);
    if (i >= 0) setHot(i);
  };
  const onStageLeave = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    hovered = false;
    setHot(-1);
  };
  // mouse sui nomi: il muro continua a scorrere, le schermate del cliente restano accese
  const onNameOver = (e: PointerEvent) => {
    const i = indexOf(e);
    if (e.pointerType === 'mouse' && i >= 0) setHot(i);
  };
  const onNameLeave = (e: PointerEvent) => {
    if (e.pointerType === 'mouse') setHot(-1);
  };
  // touch: accende (o spegne) il cliente solo un tap fermo, cioè un click, non l'inizio del tocco:
  // uno scroll che parte sul muro non accende niente. Un nome con link (caso studio) apre la pagina
  // al primo tap e non accende niente.
  let lastPointer = 'mouse';
  const onDown = (e: PointerEvent) => {
    lastPointer = e.pointerType;
  };
  const onClick = (e: MouseEvent) => {
    // mouse: ci pensa il hover; detail 0: click da tastiera (Invio sul link)
    if (lastPointer === 'mouse' || e.detail === 0) return;
    if ((e.target as HTMLElement).closest('a')) return;
    const i = indexOf(e);
    if (i >= 0) setHot(i === hot ? -1 : i);
  };
  const onOutside = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' && hot >= 0 && !root.contains(e.target as Node)) setHot(-1);
  };
  // tastiera: accende solo il focus visibile (il tap su un link lo mette a fuoco, ma non deve contare)
  let byFocus = false;
  const onFocus = (e: FocusEvent) => {
    if (!(e.target as HTMLElement).matches(':focus-visible')) return;
    byFocus = true;
    setHot(indexOf(e));
  };
  const onBlur = () => {
    if (!byFocus) return;
    byFocus = false;
    setHot(-1);
  };

  const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting), { threshold: 0.25 });
  io.observe(stage);
  stage.addEventListener('transitionend', onEnd);
  stage.addEventListener('pointerover', onStageOver);
  stage.addEventListener('pointerleave', onStageLeave);
  list.addEventListener('pointerover', onNameOver);
  list.addEventListener('pointerleave', onNameLeave);
  list.addEventListener('focusin', onFocus);
  list.addEventListener('focusout', onBlur);
  root.addEventListener('pointerdown', onDown);
  root.addEventListener('click', onClick);
  document.addEventListener('pointerdown', onOutside);
  raf = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    stage.removeEventListener('transitionend', onEnd);
    stage.removeEventListener('pointerover', onStageOver);
    stage.removeEventListener('pointerleave', onStageLeave);
    list.removeEventListener('pointerover', onNameOver);
    list.removeEventListener('pointerleave', onNameLeave);
    list.removeEventListener('focusin', onFocus);
    list.removeEventListener('focusout', onBlur);
    root.removeEventListener('pointerdown', onDown);
    root.removeEventListener('click', onClick);
    document.removeEventListener('pointerdown', onOutside);
  };
}
