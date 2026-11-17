import { defineCollection, reference } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { PROJECTS } from './config';

/*
 * Casi studio: contenuto strutturato in frontmatter, renderizzato da
 * src/pages/case-study/[slug].astro e dalla vetrina in homepage.
 * I campi di testo ammettono <strong>/<em> inline (renderizzati con set:html).
 */
// Giorno di calendario "YYYY-MM-DD", tra virgolette, emesso così com'è nel JSON-LD. Senza virgolette lo YAML ne
// fa una Date e corregge da solo le date impossibili (2026-02-30 diventa il 2 marzo): per questo si accetta solo la
// stringa, e una data non quotata, con orario o inesistente fa fallire la build invece di spostare il giorno.
const isoDay = z.iso.date({ error: 'data tra virgolette nel formato "YYYY-MM-DD", es. published: "2026-03-05"' });

// Elemento visivo di un articolo (caso studio o release): schermata, video o curva di easing.
// `alt` è obbligatorio per tutti; il video vuole sempre un `poster`.
const media = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('img'),
    src: z.string(),
    alt: z.string(),
    width: z.number().optional(),
    height: z.number().optional(),
  }),
  z.object({
    kind: z.literal('video'),
    src: z.string(),
    poster: z.string(),
    alt: z.string(),
  }),
  z.object({
    kind: z.literal('curve'),
    value: z.string().regex(/^cubic-bezier\(/, { error: 'la curva deve iniziare con "cubic-bezier("' }),
    alt: z.string(),
  }),
]);

// Video dimostrativo (file in public/), con didascalia sotto il player.
const video = z.object({
  src: z.string(),
  caption: z.string(),
});

// Striscia orizzontale di screenshot con didascalia.
const gallery = z.object({
  caption: z.string(),
  shots: z.array(z.object({ src: z.string(), alt: z.string() })),
});

// Accordion con snippet di codice (chiuso di default). Ogni blocco ha un
// titolo opzionale e viene evidenziato con Shiki in base a `lang`.
const deepDive = z.object({
  label: z.string().default('DeepDive'),
  blocks: z
    .array(
      z.object({
        title: z.string().optional(),
        lang: z.string().default('ts'),
        code: z.string(),
      })
    )
    .min(1),
});

// Sezione "prova tu stesso": confronti prima/dopo sul motion con demo live
// cliccabili, renderizzate da src/components/MotionDemos.astro. `demo` sceglie
// quale demo interattiva accompagna l'item; senza, resta il solo confronto.
const motion = z.object({
  heading: z.string(),
  intro: z.string(),
  // Curva di easing "filo conduttore", disegnata con un punto che la percorre
  curve: z.object({ value: z.string(), caption: z.string() }).optional(),
  items: z
    .array(
      z.object({
        eyebrow: z.string(),
        title: z.string(),
        before: z.string(),
        after: z.string(),
        demo: z.enum(['press', 'origin', 'easing', 'exit', 'sidebar']).optional(),
        demoLabel: z.string().optional(),
        demoNote: z.string().optional(),
      })
    )
    .min(1),
  outro: z.string().optional(),
});

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/case-studies' }),
  schema: z
    .object({
    title: z.string(),
    excerpt: z.string(),
    tags: z.array(z.string()),
    order: z.number(),
    draft: z.boolean().default(false),
    // Obbligatoria per un caso studio pubblicato (vedi il refine in fondo): ordina il log e alimenta l'Article in JSON-LD.
    published: isoDay.optional(),
    updated: isoDay.optional(),
    // Schermata, video o curva mostrata nella scheda del log
    cover: media.optional(),

    // Card nella vetrina "Real shipped code" in homepage
    home: z.object({
      tag: z.string(),
      title: z.string(),
      problem: z.string(),
      solution: z.string(),
      metrics: z.array(z.object({ value: z.string(), label: z.string() })).max(2),
    }),

    meta: z.object({
      cliente: z.string(),
      ruolo: z.string(),
      durata: z.string(),
      stack: z.string(),
    }),

    contesto: z.object({
      heading: z.string(),
      paragraphs: z.array(z.string()),
    }),

    problema: z.object({
      heading: z.string(),
      intro: z.string(),
      items: z.array(z.object({ title: z.string(), text: z.string() })),
      funnel: z
        .object({
          title: z.string(),
          rows: z.array(
            z.object({
              label: z.string(),
              width: z.string(), // es. "74%" — larghezza barra
              value: z.string(), // etichetta mostrata
              drop: z.boolean().default(false),
            })
          ),
          note: z.string(),
        })
        .optional(),
      // Striscia orizzontale di screenshot (es. gli step del vecchio flusso)
      gallery: gallery.optional(),
    }),

    risultati: z.object({
      heading: z.string(),
      // pre/post incorniciano il numero animato (count-up da `from` a `to`);
      // senza `to` la card mostra solo `pre`+`post` statici.
      cards: z.array(
        z.object({
          pre: z.string().default(''),
          from: z.number().default(0),
          to: z.number().optional(),
          post: z.string().default(''),
          label: z.string(),
        })
      ),
      chart: z
        .object({
          title: z.string(),
          rows: z.array(
            z.object({
              label: z.string(),
              width: z.string(),
              value: z.string(),
              after: z.boolean().default(false),
              gap: z.boolean().default(false),
            })
          ),
        })
        .optional(),
      // Paragrafo di chiusura sotto il grafico (es. per raccontare un dato inatteso)
      note: z.string().optional(),
    }),

    soluzione: z.object({
      heading: z.string(),
      intro: z.string(),
      items: z.array(z.object({ title: z.string(), text: z.string() })),
      figure: z.string().optional(),
      gallery: gallery.optional(),
      video: video.optional(),
    }),

    // Sezione opzionale con demo di motion interattive (stile "clicca e senti")
    motion: motion.optional(),

    // Sezione opzionale di approfondimento tecnico (es. architettura dell'integrazione)
    tech: z
      .object({
        heading: z.string(),
        intro: z.string(),
        items: z.array(
          z.object({ title: z.string(), text: z.string(), deepDive: deepDive.optional() })
        ),
      })
      .optional(),

    // Sezione opzionale per un dettaglio di prodotto extra (es. re-sync del profilo)
    chicca: z
      .object({
        heading: z.string(),
        intro: z.string(),
        deepDive: deepDive.optional(),
        video: video.optional(),
      })
      .optional(),

    sfide: z.object({
      heading: z.string(),
      paragraphs: z.array(z.string()),
    }),

    primaDopo: z.object({
      statLabel: z.string(),
      before: z.object({
        stat: z.string(),
        width: z.string(),
        items: z.array(z.string()),
      }),
      after: z.object({
        stat: z.string(),
        width: z.string(),
        items: z.array(z.string()),
      }),
    }),

    quote: z
      .object({
        text: z.string(),
        initials: z.string(),
        name: z.string(),
        role: z.string(),
      })
      .optional(),

    cta: z.object({
      heading: z.string(),
      text: z.string(),
    }),
    })
    .refine((d) => d.draft || d.published, {
      error: 'published è obbligatorio per un caso studio pubblicato: aggiungi published: "YYYY-MM-DD"',
      path: ['published'],
    }),
});

/*
 * Release: voce del log, con il corpo scritto in markdown nel file.
 * Il progetto è un nome della lista PROJECTS (src/config.ts); in white label non compare il cliente.
 */
const releases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/releases' }),
  schema: z
    .object({
      title: z.string().check((ctx) => {
        if (ctx.value.length > 70) {
          ctx.issues.push({
            code: 'custom',
            message: `il titolo di una release ha al massimo 70 caratteri: questo ne ha ${ctx.value.length}`,
            input: ctx.value,
          });
        }
      }),
      // Testo breve della scheda: ammette <strong>/<em> inline
      excerpt: z.string().min(1),
      published: isoDay,
      project: z.enum(PROJECTS),
      cover: media.optional(),
      metric: z.object({ value: z.string(), label: z.string() }).optional(),
      caseStudy: reference('case-studies').optional(),
      draft: z.boolean().default(false),
      // Lingua del testo (titolo, testo breve, corpo): il resto del sito è in italiano
      lang: z.enum(['it', 'en']).default('it'),
    })
    .refine((d) => !(d.project === 'Cliente in white label' && d.caseStudy), {
      error:
        'una release in white label non può avere caseStudy: il caso studio nomina il progetto, quindi il cliente sarebbe a un clic',
      path: ['caseStudy'],
    }),
});

export const collections = { 'case-studies': caseStudies, releases };
