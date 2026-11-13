import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { PROTOTYPES } from '../config.ts';

/*
 * Genera una rotta /p/<slug>/[...path] per ogni prototipo ammesso:
 * in locale (astro dev) tutti, in build solo quelli con `visible: true`.
 * Ogni pagina importa solo il proprio prototipo, quindi il codice e il CSS
 * di un prototipo non finiscono mai nelle pagine degli altri, e quelli
 * spenti non finiscono proprio in dist/.
 */
export default function prototipi() {
  /** @type {import('astro').AstroIntegration} */
  const integration = {
    name: 'prototipi',
    hooks: {
      'astro:config:setup': ({ command, config, addWatchFile, createCodegenDir, injectRoute }) => {
        // config.ts decide quali rotte esistono: se cambia, il dev server si riavvia.
        addWatchFile(new URL('src/config.ts', config.root));

        // Una cartella per comando: una build lanciata col dev server acceso
        // non tocca i file che il dev server sta usando.
        const dir = new URL(`${command}/`, createCodegenDir());
        mkdirSync(dir, { recursive: true });
        const src = (path) => JSON.stringify(fileURLToPath(new URL(path, config.root)));

        for (const { slug } of PROTOTYPES.filter((p) => p.visible || command === 'dev')) {
          const entry = new URL(`${slug}.astro`, dir);
          writeFileSync(
            entry,
            `---
import Prototype from ${src('src/layouts/Prototype.astro')};
import App from ${src(`src/prototypes/${slug}/index.tsx`)};
import { PROTOTYPES } from ${src('src/config.ts')};

export function getStaticPaths() {
  const proto = PROTOTYPES.find((p) => p.slug === ${JSON.stringify(slug)});
  return proto.pages.map((page) => ({ params: { path: page || undefined }, props: { proto } }));
}

const { proto } = Astro.props;
---

<Prototype title={proto.title} unpublished={!proto.visible}>
  <App client:only="react" base=${JSON.stringify(`/p/${slug}`)} />
</Prototype>
`
          );
          injectRoute({ pattern: `/p/${slug}/[...path]`, entrypoint: entry });
        }

        // Elenco di tutti i prototipi su /p, solo in locale.
        if (command === 'dev') {
          injectRoute({ pattern: '/p', entrypoint: new URL('src/prototypes/Elenco.astro', config.root) });
        }
      },
    },
  };
  return integration;
}
