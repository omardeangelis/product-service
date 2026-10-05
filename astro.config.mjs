// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import prototipi from './src/prototypes/integration.mjs';

export default defineConfig({
  // Sito statico puro: nessun adapter, output in dist/
  site: 'https://spatalo.tech',
  // Da Astro 7 il default 'jsx' toglie gli spazi tra elementi inline
  // (es. "la mia email: <a>") e attaccherebbe le parole nei template.
  // true mantiene la compressione senza perdere spazi visibili.
  compressHTML: true,
  // React serve solo ai prototipi in /p: le altre pagine restano senza JS framework.
  integrations: [react(), prototipi()],
});
