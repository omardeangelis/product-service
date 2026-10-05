// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // Sito statico puro: nessun adapter, output in dist/
  site: 'https://spatalo.tech',
  // Da Astro 7 il default 'jsx' toglie gli spazi tra elementi inline
  // (es. "la mia email: <a>") e attaccherebbe le parole nei template.
  // true mantiene la compressione senza perdere spazi visibili.
  compressHTML: true,
});
