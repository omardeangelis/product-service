// @ts-check
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import prototipi from './src/prototypes/integration.mjs';

// Una sola fonte di verità: engines.node in package.json. .nvmrc deve concordare.
// Il controllo gira a ogni build, dev e preview, perché tutti caricano questa config.
const major = (s) => Number(/\d+/.exec(s)?.[0]);
const richiesta = major(JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')).engines.node);
if (major(process.versions.node) !== richiesta) {
  throw new Error(
    `Questo sito richiede Node ${richiesta} (engines.node in package.json): stai usando Node ${process.versions.node}. Esegui \`nvm use\` nella cartella del repo.`,
  );
}
const nvmrcUrl = new URL('./.nvmrc', import.meta.url);
if (!existsSync(nvmrcUrl)) {
  throw new Error(`Manca .nvmrc: deve indicare la stessa major di engines.node (${richiesta}).`);
}
const nvmrc = major(readFileSync(nvmrcUrl, 'utf8'));
if (nvmrc !== richiesta) {
  throw new Error(`\`.nvmrc\` chiede Node ${nvmrc} ma engines.node in package.json chiede ${richiesta}: allineali.`);
}

// Guardia segnaposto: un contenuto con la riga `# SEGNAPOSTO` è una bozza di testo finto e non deve mai arrivare
// in produzione. Blocca solo la build di produzione su Vercel; locale e preview passano.
if (process.env.VERCEL_ENV === 'production') {
  const contentDir = fileURLToPath(new URL('./src/content/', import.meta.url));
  const trovati = readdirSync(contentDir, { recursive: true })
    .map(String)
    .filter((f) => f.endsWith('.md'))
    .filter((f) => /^\s*# SEGNAPOSTO\b/m.test(readFileSync(contentDir + f, 'utf8')))
    .map((f) => `src/content/${f}`);
  if (trovati.length) {
    throw new Error(`Segnaposto in produzione: rimuovi \`# SEGNAPOSTO\` da\n${trovati.join('\n')}`);
  }
  console.log('Segnaposto: guardia attiva');
} else {
  console.log(`Segnaposto: guardia spenta (VERCEL_ENV=${process.env.VERCEL_ENV ?? ''})`);
}

const outDirUrl = new URL('./dist/', import.meta.url);

// L'unico segnale per l'esclusione dalla sitemap è il robots `noindex` della pagina
// (prop `noindex` di Base.astro; Prototype.astro lo emette sempre): una pagina privata
// nuova resta fuori senza toccare questo file. Il filtro legge l'HTML già scritto in dist/.
const indicizzabile = (page) => {
  const file = new URL('.' + new URL(page).pathname + 'index.html', outDirUrl);
  if (!existsSync(file)) {
    throw new Error(
      `Sitemap: non trovo l'HTML di ${page} in ${fileURLToPath(file)}. Il filtro presume build.format 'directory'.`,
    );
  }
  const metaRobots = readFileSync(file, 'utf8').match(/<meta\b[^>]*>/gi) ?? [];
  return !metaRobots.some((tag) => /\bname=["']?robots\b/i.test(tag) && /\bcontent=["']?[^"'>]*noindex/i.test(tag));
};

export default defineConfig({
  // Sito statico puro: nessun adapter, output in dist/
  site: 'https://spatalo.tech',
  outDir: fileURLToPath(outDirUrl),
  // Da Astro 7 il default 'jsx' toglie gli spazi tra elementi inline
  // (es. "la mia email: <a>") e attaccherebbe le parole nei template.
  // true mantiene la compressione senza perdere spazi visibili.
  compressHTML: true,
  // React serve solo ai prototipi in /p: le altre pagine restano senza JS framework.
  integrations: [react(), prototipi(), sitemap({ filter: indicizzabile })],
});
