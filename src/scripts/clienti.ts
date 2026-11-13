/*
 * Sezione clienti: entrata, scatti delle file e cliente acceso.
 * - Entrata: `data-armed` lo mette lo script inline dopo la <section>; qui si aggiunge `data-in` una volta
 *   sola, al 15% di visibilità. Il resto è CSS nel componente.
 * - Scatti: ogni nastro contiene tre copie della sua sequenza ed è centrato (k = 0); finito un giro
 *   (|k| = lunghezza della sequenza) torna a k = 0 senza transizione, dove l'immagine è identica.
 *   Il ciclo requestAnimationFrame gira solo con la parete visibile al 25%, la tab visibile, il mouse
 *   fuori dalla parete e senza reduced motion; negli altri casi è fermo davvero e riparte dagli eventi.
 * - Cliente acceso: `data-hot` sulla sezione e `data-on` sul <li>; il resto è CSS.
 */
export function initClienti(root: HTMLElement) {
  const stage = root.querySelector<HTMLElement>('.clienti-stage');
  const list = root.querySelector<HTMLElement>('.clienti-names');
  const names = list ? [...list.querySelectorAll<HTMLElement>('li[data-index]')] : [];

  // ---------- entrata ----------
  const entrata = new IntersectionObserver(
    (entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      root.setAttribute('data-in', '');
      entrata.disconnect();
    },
    { threshold: 0.15 },
  );
  entrata.observe(root);

  // ---------- cliente acceso ----------
  let hot = -1;
  let byFocus = false;
  const setHot = (i: number) => {
    hot = i;
    if (i >= 0) root.dataset.hot = String(i);
    else delete root.dataset.hot;
    names.forEach((n) => n.toggleAttribute('data-on', Number(n.dataset.index) === i));
  };
  const indexOf = (e: Event) => {
    const el = (e.target as Element).closest<HTMLElement>('[data-index]');
    return el && root.contains(el) ? Number(el.dataset.index) : -1;
  };

  // ---------- scatti ----------
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const narrow = matchMedia('(max-width: 760px)');
  let visible = false;
  let hovered = false;
  let raf = 0;
  let last = 0;

  const rows = stage
    ? [...stage.querySelectorAll<HTMLElement>('.clienti-row')].map((row, r) => ({
        track: row.querySelector<HTMLElement>('.clienti-track')!,
        dir: row.dataset.dir === 'right' ? -1 : 1,
        period: Number(row.dataset.period) || 3000,
        n: Number(row.dataset.n) || 1,
        // primo scatto sfalsato per fila
        elapsed: -400 * r,
        k: 0,
      }))
    : [];
  type Row = (typeof rows)[number];

  const apply = (row: Row, animate = true) => {
    if (!animate) row.track.style.transition = 'none';
    row.track.style.setProperty('--k', String(row.k));
    if (!animate) {
      // forza il calcolo dello stile senza transizione, poi la ripristina
      void row.track.offsetWidth;
      row.track.style.transition = '';
    }
  };

  const canRun = () => visible && !hovered && !document.hidden && !reduce.matches;

  const tick = (t: number) => {
    raf = 0;
    if (!canRun()) return;
    // last = 0 dopo una ripresa: il tempo in pausa non conta
    const dt = last ? Math.min(t - last, 64) : 0;
    last = t;
    for (const row of rows) {
      row.elapsed += dt;
      if (row.elapsed >= row.period) {
        row.elapsed = 0;
        row.k += row.dir;
        apply(row);
      }
    }
    raf = requestAnimationFrame(tick);
  };

  // avvia o ferma il ciclo secondo lo stato corrente; lo scatto già partito lo finisce la transizione CSS
  const sync = () => {
    if (canRun()) {
      if (!raf) {
        last = 0;
        raf = requestAnimationFrame(tick);
      }
    } else if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };

  if (stage && rows.length) {
    new IntersectionObserver(
      ([en]) => {
        visible = en.isIntersecting;
        sync();
      },
      { threshold: 0.25 },
    ).observe(stage);

    stage.addEventListener('transitionend', (e) => {
      const row = rows.find((r) => r.track === e.target);
      if (!row || e.propertyName !== 'transform') return;
      if (Math.abs(row.k) >= row.n) {
        row.k = 0;
        apply(row, false);
      }
    });

    document.addEventListener('visibilitychange', sync);
    reduce.addEventListener('change', sync);
    // oltre i 760 px cambia --w: il nastro si riposiziona senza animare
    narrow.addEventListener('change', () => rows.forEach((row) => apply(row, false)));
  }

  // mouse sulla parete: le file si fermano e la schermata sotto il cursore accende il suo cliente;
  // tra una finestra e l'altra resta acceso l'ultimo (niente sfarfallio negli spazi)
  stage?.addEventListener('pointerover', (e) => {
    if (e.pointerType !== 'mouse') return;
    if (!hovered) {
      hovered = true;
      sync();
    }
    const i = indexOf(e);
    if (i >= 0) setHot(i);
  });
  stage?.addEventListener('pointerleave', (e) => {
    if (e.pointerType !== 'mouse') return;
    hovered = false;
    setHot(-1);
    sync();
  });

  // mouse sui nomi: le file continuano, le schermate del cliente restano accese
  list?.addEventListener('pointerover', (e) => {
    const i = indexOf(e);
    if (e.pointerType === 'mouse' && i >= 0) setHot(i);
  });
  list?.addEventListener('pointerleave', (e) => {
    if (e.pointerType === 'mouse') setHot(-1);
  });

  // touch: si accende solo con un tap fermo (click), mai al pointerdown, così uno scroll non accende niente.
  // Un nome con link apre la pagina al primo tap e non accende niente. Un tap fuori dalla sezione spegne.
  let lastPointer = 'mouse';
  document.addEventListener('pointerdown', (e) => (lastPointer = e.pointerType), { capture: true });
  document.addEventListener('click', (e) => {
    // mouse: ci pensa il hover (e una schermata cliccata non fa niente); detail 0: Invio da tastiera
    if (lastPointer === 'mouse' || e.detail === 0) return;
    const target = e.target as Element;
    if (!root.contains(target)) {
      if (hot >= 0) setHot(-1);
      return;
    }
    if (target.closest('a')) return;
    const i = indexOf(e);
    if (i >= 0) setHot(i === hot ? -1 : i);
  });

  // tastiera: accende solo il focus visibile (il tap su un link lo mette a fuoco, ma non deve contare)
  list?.addEventListener('focusin', (e) => {
    if (!(e.target as Element).matches(':focus-visible')) return;
    const i = indexOf(e);
    if (i < 0) return;
    byFocus = true;
    setHot(i);
  });
  list?.addEventListener('focusout', () => {
    if (!byFocus) return;
    byFocus = false;
    setHot(-1);
  });

  // tornando indietro dalla bfcache la sezione è a riposo
  addEventListener('pageshow', (e) => {
    if (!e.persisted) return;
    byFocus = false;
    hovered = false;
    setHot(-1);
    sync();
  });
}
