// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Sito statico puro: nessun adapter, output in dist/
  // Quando il dominio è deciso: site: 'https://esempio.it' (abilita canonical/sitemap)
});
