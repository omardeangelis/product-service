import ypMask from './assets/young-platform-mask.png';
import ypColor from './assets/young-platform-color.png';
import vzMask from './assets/valueize-mask.png';
import vzColor from './assets/valueize-color.png';
import dpMask from './assets/devpunks-mask.png';
import dpColor from './assets/devpunks-color.png';
import sfMask from './assets/start-franchising-mask.png';
import sfColor from './assets/start-franchising-color.png';
import ypHome from './assets/young-platform-home.jpg';
import vzHome from './assets/valueize-home.jpg';
import dpHome from './assets/devpunks-home.jpg';
import sfHome from './assets/start-franchising-home.jpg';
import ypPage from './assets/young-platform-page.jpg';
import vzPage from './assets/valueize-page.jpg';
import dpPage from './assets/devpunks-page.jpg';
import sfPage from './assets/start-franchising-page.jpg';

// Cinque schermate per cliente (720×450): home, pagine interne e, per Valueize, l'app del caso studio.
const SHOTS = import.meta.glob<{ default: ImageMetadata }>('./assets/screens/*.jpg', { eager: true });
const shot = (file: string) => SHOTS[`./assets/screens/${file}.jpg`].default.src;

/*
 * Dati dei loghi per il lab "Hanno lavorato con me" (solo dev, /lab/loghi).
 * `mask` è la sagoma monocromatica (alpha = copertura): si colora con un token via CSS mask.
 * `color` è l'originale, per gli stati a colori. Valueize è bianco nell'originale,
 * quindi sulle superfici chiare la versione "a colori" resta la sagoma in inchiostro.
 * Settori da confermare con Omar.
 */
export type Screen = {
  src: string;
  /** cosa mostra la barra del browser: l'indirizzo della pagina, o l'app per le schermate di prodotto */
  label: string;
};

export type Logo = {
  slug: string;
  name: string;
  sector: string;
  mask: string;
  color: string | null;
  /** larghezza in px a parità di area ottica (k = 1) */
  w: number;
  h: number;
  /** misure dell'originale a colori alla stessa scala della sagoma (SF ha il riquadro verde attorno) */
  cw: number;
  ch: number;
  href?: string;
  /** home del cliente: URL, schermata 1280×800 (ridotta a 720×450, banner cookie nascosti) */
  site: string;
  home: string;
  /** i primi tre schermi della home (1280×2400 ridotti a 720×1350), per lo scorrimento */
  page: string;
  /** colore di marca, campionato dal sito */
  tint: string;
  screens: Screen[];
};

// Bilanciamento ottico: stessa area per tutti, corretta a occhio per peso del segno.
const AREA = 2600;
type Meta = { width: number; height: number };
function size(mask: Meta, color: Meta, weight = 1) {
  const r = mask.width / mask.height;
  const a = AREA * weight;
  const w = Math.sqrt(a * r);
  const s = w / mask.width;
  return {
    w: Math.round(w),
    h: Math.round(Math.sqrt(a / r)),
    cw: Math.round(color.width * s),
    ch: Math.round(color.height * s),
  };
}

export const LOGOS: Logo[] = [
  {
    slug: 'young-platform',
    name: 'Young Platform',
    sector: 'Fintech · Exchange crypto',
    mask: ypMask.src,
    color: ypColor.src,
    ...size(ypMask, ypColor, 1.5),
    site: 'https://youngplatform.com/',
    home: ypHome.src,
    page: ypPage.src,
    tint: '#12d47a',
    screens: [
      { src: shot('young-platform-1-home'), label: 'youngplatform.com' },
      { src: shot('young-platform-2-mercati'), label: 'youngplatform.com/exchange' },
      { src: shot('young-platform-3-bitcoin'), label: 'youngplatform.com/exchange/btc' },
      { src: shot('young-platform-4-business'), label: 'youngplatform.com/business' },
      { src: shot('young-platform-5-conto'), label: 'youngplatform.com' },
    ],
  },
  {
    slug: 'valueize',
    name: 'Valueize',
    sector: 'SaaS · Financial modeling',
    mask: vzMask.src,
    color: null,
    ...size(vzMask, vzColor, 0.85),
    href: '/case-study/dati-da-excel',
    site: 'https://www.valueize.com/',
    home: vzHome.src,
    page: vzPage.src,
    tint: '#c4a97a',
    screens: [
      { src: shot('valueize-1-home'), label: 'valueize.com' },
      { src: shot('valueize-2-griglia'), label: 'App Valueize · Personnel' },
      { src: shot('valueize-3-anteprima'), label: 'App Valueize · incolla da Excel' },
      { src: shot('valueize-4-limite'), label: 'App Valueize · limite di riga' },
      { src: shot('valueize-5-undo'), label: 'App Valueize · annulla' },
    ],
  },
  {
    slug: 'devpunks',
    name: 'Devpunks',
    sector: 'Software house',
    mask: dpMask.src,
    color: dpColor.src,
    ...size(dpMask, dpColor, 1.1),
    site: 'https://www.devpunks.com/',
    home: dpHome.src,
    page: dpPage.src,
    tint: '#2b14ff',
    screens: [
      { src: shot('devpunks-1-home'), label: 'devpunks.com' },
      { src: shot('devpunks-2-about'), label: 'devpunks.com/about' },
      { src: shot('devpunks-3-ai'), label: 'devpunks.com/ai-transformation-partner' },
      { src: shot('devpunks-4-selezione'), label: 'devpunks.com/developer-as-a-service' },
      { src: shot('devpunks-5-developer'), label: 'devpunks.com/developers' },
    ],
  },
  {
    slug: 'start-franchising',
    name: 'Start Franchising',
    sector: 'Franchising',
    mask: sfMask.src,
    color: sfColor.src,
    ...size(sfMask, sfColor, 1.1),
    site: 'https://www.start-franchising.com/',
    home: sfHome.src,
    page: sfPage.src,
    tint: '#9dc13c',
    screens: [
      { src: shot('start-franchising-1-home'), label: 'start-franchising.com' },
      { src: shot('start-franchising-2-reti'), label: 'start-franchising.com/franchising' },
      { src: shot('start-franchising-3-scheda'), label: 'start-franchising.com/franchising/mail-boxes-etc-franchising' },
      { src: shot('start-franchising-4-locali'), label: 'start-franchising.com/locali-commerciali' },
      { src: shot('start-franchising-5-notizie'), label: 'start-franchising.com' },
    ],
  },
];

/** Stile inline per uno <span class="lm"> che disegna la sagoma con CSS mask. */
export const maskStyle = (l: Logo) => `--src:url(${l.mask});--w:${l.w}px;--h:${l.h}px;--cw:${l.cw}px;--ch:${l.ch}px`;

/** Dominio da mostrare nella barra del browser, senza www. */
export const host = (url: string) => new URL(url).hostname.replace(/^www\./, '');
