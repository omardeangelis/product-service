/*
 * Video dell'articolo: parte (muto) quando è in vista e si ferma quando esce. Con prefers-reduced-motion: reduce
 * non parte da solo: resta fermo sulla locandina e i controlli restano suoi. Vale per la copertina e per i <video> del corpo.
 * Aggiunge data-in a banner e Firma quando entrano in vista (la pagina è armata da data-armed su <main>).
 */
const video = [...document.querySelectorAll<HTMLVideoElement>('[data-articolo] video')];
if (video.length && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const io = new IntersectionObserver(
    (voci) =>
      voci.forEach((v) => {
        const el = v.target as HTMLVideoElement;
        if (v.isIntersecting) {
          el.muted = true;
          el.play().catch(() => {});
        } else el.pause();
      }),
    { threshold: 0.5 }
  );
  video.forEach((v) => io.observe(v));
}

// Entrate di banner e Firma: data-in una volta sola, al 15% in vista; solo se la pagina è armata.
const entrate = [...document.querySelectorAll<HTMLElement>('[data-articolo][data-armed] :is(.cta-strip, .firma-sign)')];
if (entrate.length) {
  let viste = 0;
  const ioEntrate = new IntersectionObserver(
    (voci) =>
      voci.forEach((v) => {
        if (!v.isIntersecting) return;
        v.target.setAttribute('data-in', '');
        ioEntrate.unobserve(v.target);
        if (++viste === entrate.length) ioEntrate.disconnect();
      }),
    { threshold: 0.15 }
  );
  entrate.forEach((el) => ioEntrate.observe(el));
}
