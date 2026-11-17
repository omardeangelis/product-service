/*
 * Video dell'articolo: parte (muto) quando è in vista e si ferma quando esce. Con prefers-reduced-motion: reduce
 * non parte da solo: resta fermo sulla locandina e i controlli restano suoi. Vale per la copertina e per i <video> del corpo.
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
