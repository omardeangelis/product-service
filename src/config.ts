// Garanzia del primo mese sul piano Partner. I giorni vivono qui: se cambiano,
// si aggiornano da soli home, pricing, benvenuto, termini e la meta description.
const guaranteeDays = 5;

export const GUARANTEE = {
  days: guaranteeDays,
  // Titolo della promessa, usato come etichetta nei box garanzia.
  label: 'Garanzia primo mese',
  // Formulazione estesa, per i box garanzia di home e pricing.
  claim: `primo deploy in produzione entro ${guaranteeDays} giorni lavorativi dal kickoff, o il primo mese è gratis`,
} as const;

// Dati di contatto e link esterni, in un posto solo.
export const SITE = {
  name: 'Spatalo',
  founder: 'Omar De Angelis',
  role: 'Studio di product engineering',
  title: 'Spatalo — Product engineering in abbonamento',
  description: `Un product engineer senior nel tuo team, a prezzo fisso mensile. Primo deploy in produzione entro ${guaranteeDays} giorni o il primo mese è gratis. Pause libere.`,
  calUrl: 'https://cal.com/omar-de-angelis-n0ghex/just-talk',
  email: 'omardeangelis.business@gmail.com',
  linkedin: 'https://www.linkedin.com/in/omar-de-angelis-879b5614b/',
} as const;

// Capienza del piano Partner. Quando un abbonamento parte o si chiude,
// aggiorna `taken` e pusha: badge e note sul sito si aggiornano da soli.
export const SLOTS = {
  total: 2,
  taken: 1,
};

// Prezzi, in euro interi. Cambia qui: home, pricing (testo e JSON-LD) e /llms.txt si aggiornano
// da soli, compresi risparmi, prezzo a sprint e i "da …" (calcolati sotto).
const partnerMonthly = 2400;
const partnerQuarterlyMonthly = 2200;
const teamSprint = 5000;
const teamQuarter = 28000;
const teamSprintsPerQuarter = 6;

export const PRICES = {
  partner: {
    monthly: partnerMonthly,
    quarterlyMonthly: partnerQuarterlyMonthly,
    quarterSaving: (partnerMonthly - partnerQuarterlyMonthly) * 3,
    from: Math.min(partnerMonthly, partnerQuarterlyMonthly),
  },
  team: {
    sprint: teamSprint,
    quarter: teamQuarter,
    sprintsPerQuarter: teamSprintsPerQuarter,
    quarterPerSprint: Math.round(teamQuarter / teamSprintsPerQuarter),
    quarterSaving: teamSprint * teamSprintsPerQuarter - teamQuarter,
    // Il "da …" del Team resta lo sprint singolo.
    from: teamSprint,
  },
  mvp: {
    monthly: 4500,
  },
} as const;

// Solo il numero con il separatore delle migliaia ("2.400"): il simbolo € lo
// aggiunge chi lo usa. Il formattatore è creato qui dentro perché questo file
// finisce anche nel bundle del client.
export function formatEuro(n: number): string {
  return new Intl.NumberFormat('it-IT', { useGrouping: 'always', maximumFractionDigits: 0 }).format(n);
}

// Prototipi da mandare ai clienti, serviti su /p/<slug>. Il codice di ognuno
// vive in src/prototypes/<slug>/ (lo slug è anche il nome della cartella).
// `visible: false` lo toglie dalla build di produzione, ma in locale
// (npm run dev) resta raggiungibile. Per pubblicarlo: true e push.
// `pages` elenca le pagine interne, una per rotta del router del prototipo:
// '' è la prima pagina, 'dettaglio' diventa /p/<slug>/dettaglio.
type Prototype = {
  slug: string;
  client: string;
  title: string;
  pages: string[];
  visible: boolean;
};

export const PROTOTYPES: Prototype[] = [
  {
    // Modello da copiare per i prototipi veri, mai pubblicato.
    slug: 'esempio-4k9x2',
    client: 'Esempio',
    title: 'Prototipo di esempio',
    pages: ['', 'dettaglio'],
    visible: false,
  },
];
