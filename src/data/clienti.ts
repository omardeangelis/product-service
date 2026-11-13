/*
 * Clienti mostrati nella sezione "Hanno lavorato con me" della home.
 * Righe di rapporto confermate da Omar il 2026-11-13: un cliente non confermato non compare mai
 * sul sito (AC6). Le schermate sono tutte lavoro di Omar.
 */

export type Screen = {
  file: string;
  image: ImageMetadata;
  /** cosa mostra la barra del browser: l'indirizzo della pagina o l'app */
  label: string;
};

export type Cliente = {
  name: string;
  tint: string;
  /** colore del nome: come `tint`, schiarito dove il colore di marca non regge sullo sfondo scuro */
  nameTint: string;
  line: string;
  confirmed: boolean;
  screens: Screen[];
};

export type ClienteVisibile = Cliente & {
  /** posizione tra i clienti visibili, da 0 */
  index: number;
  href?: string;
  caseLabel?: string;
};

const IMMAGINI = import.meta.glob<{ default: ImageMetadata }>('../assets/clienti/*.jpg', { eager: true });

// Tutte le schermate sono lavoro di Omar (confermato il 2026-11-13).
const screen = (file: string, label: string): Screen => {
  const image = IMMAGINI[`../assets/clienti/${file}.jpg`]?.default;
  if (!image) throw new Error(`Schermata mancante: src/assets/clienti/${file}.jpg`);
  return { file, image, label };
};

// Ordine = ordine di visualizzazione. `line` vuota o `confirmed: false` = il cliente non esce (AC6).
export const CLIENTI: Cliente[] = [
  {
    name: 'Young Platform',
    tint: '#12d47a',
    nameTint: '#12d47a',
    line: 'Product Engineer',
    confirmed: true,
    screens: [
      screen('young-platform-1-home', 'youngplatform.com'),
      screen('young-platform-2-mercati', 'youngplatform.com/exchange'),
      screen('young-platform-3-bitcoin', 'youngplatform.com/exchange/btc'),
      screen('young-platform-4-business', 'youngplatform.com/business'),
      screen('young-platform-5-conto', 'youngplatform.com'),
    ],
  },
  {
    name: 'Valueize',
    tint: '#c4a97a',
    nameTint: '#c4a97a',
    line: 'Con il mio team · 9 settimane',
    confirmed: true,
    screens: [
      screen('valueize-1-home', 'valueize.com'),
      screen('valueize-2-griglia', 'App Valueize · Personnel'),
      screen('valueize-3-anteprima', 'App Valueize · incolla da Excel'),
      screen('valueize-4-limite', 'App Valueize · limite di riga'),
      screen('valueize-5-undo', 'App Valueize · annulla'),
    ],
  },
  {
    name: 'Devpunks',
    tint: '#2b14ff',
    nameTint: '#5543ff',
    line: 'Product Engineer',
    confirmed: true,
    screens: [
      screen('devpunks-1-home', 'devpunks.com'),
      screen('devpunks-2-about', 'devpunks.com/about'),
      screen('devpunks-3-ai', 'devpunks.com/ai-transformation-partner'),
      screen('devpunks-4-selezione', 'devpunks.com/developer-as-a-service'),
      screen('devpunks-5-developer', 'devpunks.com/developers'),
    ],
  },
  {
    name: 'Start Franchising',
    tint: '#9dc13c',
    nameTint: '#9dc13c',
    line: 'Product Engineer',
    confirmed: true,
    screens: [
      screen('start-franchising-1-home', 'start-franchising.com'),
      screen('start-franchising-2-reti', 'start-franchising.com/franchising'),
      screen('start-franchising-3-scheda', 'start-franchising.com/franchising/mail-boxes-etc-franchising'),
      screen('start-franchising-4-locali', 'start-franchising.com/locali-commerciali'),
      screen('start-franchising-5-notizie', 'start-franchising.com'),
    ],
  },
  // SeVedemo è un prodotto di Omar, non un cliente: non compare nella sezione (decisione del 2026-11-13,
  // il tema prodotti si affronta più avanti). Resta qui solo perché i suoi casi studio passino il controllo D19.
  {
    name: 'SeVedemo',
    tint: '#9aa3b5',
    nameTint: '#9aa3b5',
    line: '',
    confirmed: false,
    screens: [],
  },
];

type CasoStudio = { id: string; data: { meta: { cliente: string } } };

/** Nome cliente di un caso studio: la parte di `meta.cliente` prima di " · ". */
const nomeCliente = (cs: CasoStudio) => cs.data.meta.cliente.split(' · ')[0].trim();

/**
 * Clienti da mostrare, con link derivati dai casi studio pubblicati (D9).
 * Se un caso studio pubblicato ha un cliente non presente in CLIENTI la build fallisce (D19).
 */
export function clientiVisibili(caseStudies: CasoStudio[]): ClienteVisibile[] {
  const noti = new Set(CLIENTI.map((c) => c.name));
  const mancanti = [...new Set(caseStudies.map(nomeCliente))].filter((n) => !noti.has(n));
  if (mancanti.length) {
    throw new Error(
      `Cliente senza scheda in CLIENTI: ${mancanti.join(', ')}. Aggiungilo in src/data/clienti.ts (nome identico a meta.cliente del caso studio).`,
    );
  }

  return CLIENTI.filter((c) => c.confirmed && c.line.trim() !== '').map((c, index) => {
    const casi = caseStudies.filter((cs) => nomeCliente(cs) === c.name);
    const visibile: ClienteVisibile = { ...c, index };
    if (casi.length === 1) {
      visibile.href = `/case-study/${casi[0].id}`;
      visibile.caseLabel = 'caso studio →';
    } else if (casi.length > 1) {
      visibile.href = '/#shipped';
      visibile.caseLabel = `${casi.length} casi studio ↓`;
    }
    return visibile;
  });
}
