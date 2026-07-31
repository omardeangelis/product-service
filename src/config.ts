// Garanzia del primo mese sul piano Partner. I giorni vivono qui: se cambiano,
// si aggiornano da soli home, pricing, benvenuto, termini e la meta description.
const guaranteeDays = 5;

export const GUARANTEE = {
  days: guaranteeDays,
  // Titolo della promessa, usato come etichetta nei box e nella tabella confronto.
  label: 'Garanzia primo mese',
  // Formulazione estesa, per i box garanzia di home e pricing.
  claim: `primo deploy in produzione entro ${guaranteeDays} giorni lavorativi dal kickoff, o il primo mese è gratis`,
  // Versione corta, per la cella della tabella confronto.
  short: `Deploy in ${guaranteeDays} giorni o mese gratis`,
} as const;

// Dati di contatto e link esterni, in un posto solo.
export const SITE = {
  name: 'Spatalo',
  founder: 'Omar De Angelis',
  role: 'Studio di product engineering',
  title: 'Spatalo — Product engineering in abbonamento',
  description: `Un product engineer senior nel tuo team, a prezzo fisso mensile. Primo deploy in produzione entro ${guaranteeDays} giorni o il primo mese è gratis. Pause libere.`,
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
