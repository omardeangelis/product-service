import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/*
 * Casi studio: contenuto strutturato in frontmatter, renderizzato da
 * src/pages/case-study/[slug].astro e dalla vetrina in homepage.
 * I campi di testo ammettono <strong>/<em> inline (renderizzati con set:html).
 */
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

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/case-studies' }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    tags: z.array(z.string()),
    order: z.number(),
    draft: z.boolean().default(false),

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
  }),
});

export const collections = { 'case-studies': caseStudies };
