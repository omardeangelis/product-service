// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Sito statico puro: nessun adapter, output in dist/
  // URL Vercel temporaneo: da sostituire col dominio custom quando deciso
  site: 'https://product-service-zeta.vercel.app',
});
