/*
 * Elenco unico degli articoli (casi studio + release), ordinato per data: lo leggono tutte le pagine.
 * Solo lato server (build). I testi e le date condivise col browser stanno in articoli-testi.ts.
 */
import { getCollection } from 'astro:content';
import type { Tag } from './articoli-testi';

export type ArticoloCover =
  | { kind: 'img'; src: string; alt: string; width?: number; height?: number }
  | { kind: 'video'; src: string; poster: string; alt: string }
  | { kind: 'curve'; value: string; alt: string };

export type Articolo = {
  id: string;
  tag: Tag;
  title: string;
  date: string;
  project: string;
  excerpt: string;
  metric?: { value: string; label: string };
  cover?: ArticoloCover;
  href: string;
  caseStudy?: { href: string; title: string };
  /** Lingua del testo dell'articolo; la pagina intorno resta in italiano */
  lang: 'it' | 'en';
};

/** Valore dell'attributo lang per il testo di un articolo: solo quando non è l'italiano della pagina. */
export const langAttr = (a: Pick<Articolo, 'lang'>) => (a.lang === 'it' ? undefined : a.lang);

/** Anno dell'articolo più recente: riferimento per mostrare l'anno nelle date che non lo condividono. */
export const annoRif = (articoli: Articolo[]): number => Number(articoli[0].date.slice(0, 4));

export async function getArticles(): Promise<Articolo[]> {
  const tuttiICasi = await getCollection('case-studies');
  const releases = await getCollection('releases');
  const casiPubblicati = new Map(tuttiICasi.filter((c) => !c.data.draft).map((c) => [c.id, c]));

  const casi: Articolo[] = [...casiPubblicati.values()].map((c) => ({
    id: c.id,
    tag: 'caso-studio',
    title: c.data.home.title,
    date: c.data.published!,
    project: c.data.meta.cliente.split(' · ')[0].trim(),
    excerpt: c.data.excerpt,
    metric: c.data.home.metrics[0],
    cover: c.data.cover,
    href: `/case-study/${c.id}/`,
    lang: 'it',
  }));

  const uscite: Articolo[] = releases
    .filter((r) => !r.data.draft)
    .map((r) => {
      if (!r.body || !r.body.trim()) {
        throw new Error(`src/content/releases/${r.id}.md: il corpo dell'articolo è obbligatorio, ma è vuoto`);
      }
      const art: Articolo = {
        id: r.id,
        tag: 'release',
        title: r.data.title,
        date: r.data.published,
        project: r.data.project,
        excerpt: r.data.excerpt,
        metric: r.data.metric,
        cover: r.data.cover,
        href: `/showcase/${r.id}/`,
        lang: r.data.lang,
      };
      const rif = r.data.caseStudy;
      if (rif) {
        const slug = typeof rif === 'string' ? rif : rif.id;
        // Astro non fa fallire la build su un riferimento sbagliato (lo logga soltanto): il controllo vero è qui.
        const caso = tuttiICasi.find((c) => c.id === slug);
        if (!caso) {
          throw new Error(`src/content/releases/${r.id}.md: caseStudy "${slug}" non esiste tra i casi studio`);
        }
        if (!caso.data.draft) art.caseStudy = { href: `/case-study/${slug}/`, title: caso.data.title };
      }
      return art;
    });

  return [...casi, ...uscite].sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id));
}
