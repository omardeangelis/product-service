import type { APIRoute } from 'astro';
import { SITE } from '../config';
import { getArticles } from '../data/articoli';
import { testoPiano } from '../data/articoli-testi';

/*
 * /rss.xml (RSS 2.0): casi studio e release, dal più recente.
 * Scritto a mano, senza dipendenze (niente @astrojs/rss): il feed è poche righe di XML e
 * così resta sotto controllo l'escape, che è l'unico punto delicato.
 * pubDate usa le 12:00 UTC: la data è un giorno di calendario ("YYYY-MM-DD"), e a mezzogiorno
 * UTC il giorno non cambia in nessun fuso orario, così il feed non slitta al giorno prima.
 * Niente lastBuildDate: cambierebbe a ogni build, anche senza articoli nuovi.
 */

// Ordine dell'escape: prima la &, altrimenti si riscriverebbero le entità appena create.
const escapeXml = (s: string): string =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const CATEGORIA = { 'caso-studio': 'Caso studio', release: 'Release' } as const;

export const GET: APIRoute = async ({ site }) => {
  const url = (path: string) => new URL(path, site).href;
  const articoli = await getArticles();
  const titolo = escapeXml(`${SITE.name} — Showcase`);
  const descrizione = escapeXml(
    `Casi studio e release di ${SITE.founder}: cosa è andato in produzione, dal più recente.`
  );

  const items = articoli
    .map((a) => {
      const link = escapeXml(url(a.href));
      const pubDate = new Date(`${a.date}T12:00:00Z`).toUTCString();
      return `<item>
<title>${escapeXml(a.title)}</title>
<link>${link}</link>
<guid isPermaLink="true">${link}</guid>
<pubDate>${pubDate}</pubDate>
<category>${CATEGORIA[a.tag]}</category>
<description>${escapeXml(testoPiano(a.excerpt))}</description>
</item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${titolo}</title>
<link>${escapeXml(url('/showcase/'))}</link>
<description>${descrizione}</description>
<language>it-IT</language>
<atom:link href="${escapeXml(url('/rss.xml'))}" rel="self" type="application/rss+xml"/>
${items}
</channel>
</rss>
`;

  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
