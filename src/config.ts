// Dati di contatto e link esterni, in un posto solo.
export const SITE = {
  name: 'Spatalo',
  founder: 'Omar De Angelis',
  role: 'Studio di product engineering',
  title: 'Spatalo — Product engineering in abbonamento',
  description:
    'Un product engineer senior nel tuo team, a prezzo fisso mensile. Primo deploy in produzione entro 5 giorni o il primo mese è gratis. Pause libere.',
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
