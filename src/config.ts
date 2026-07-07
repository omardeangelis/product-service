// Dati di contatto e link esterni, in un posto solo.
export const SITE = {
  name: 'Omar De Angelis',
  role: 'Freelance Product Engineer',
  title: 'Omar De Angelis — Freelance Product Engineer',
  description:
    'Product Engineer freelance in abbonamento: un senior nel team che pensa al prodotto, non solo al codice. Prezzo fisso mensile, pause libere, codice in produzione.',
  calUrl: 'https://cal.eu/omar-de-angelis-vqhwjv/30min',
  email: 'omardeangelis.business@gmail.com',
  linkedin: 'https://www.linkedin.com/in/omar-de-angelis-879b5614b/',
} as const;

// Capienza del piano Partner. Quando un abbonamento parte o si chiude,
// aggiorna `taken` e pusha: badge e note sul sito si aggiornano da soli.
export const SLOTS = {
  total: 2,
  taken: 0,
};
