---
domain: _unscoped
type: review
scope: standalone
spec: null
review_target: working tree non committato sul branch claude/unruffled-curran-5a2b8d (src/pages/case-study/[slug].astro, src/content.config.ts)
base_ref: 8b28ed1
head_ref: working tree (non committato)
verdict: do-not-ship
review_impact: critical
human_in_loop: true
links:
  - "[[review/2026-11-15-count-up-fix/RUBRIC]]"
  - "[[review/2026-11-15-seo-geo-basi/REPORT]]"
ingested: false
last_ingested: null
created: 2026-11-15
updated: 2026-11-15
---

# Review Report: correzioni del count-up dei casi studio

## Verdict

**DO NOT SHIP** · impact: critical

Obiezione bloccante più forte (v4, schema delle date): una data impossibile scritta senza virgolette nel frontmatter (`published: 2026-02-30`, `2026-13-01`) viene già convertita dal parser YAML in un'altra data valida a mezzanotte UTC. `isoDay` la accetta, la build passa e il JSON-LD pubblica `"datePublished":"2026-03-02"` / `"2027-01-01"`. Scritta tra virgolette, la stessa data fa fallire la build come previsto. Oggi nessun caso studio imposta date, quindi l'effetto è nullo in produzione; il difetto è nel contratto del campo nuovo.

Il count-up passa tutti e tre i suoi passaggi (logica, motion, UI): il blocker e i due major della review precedente risultano chiusi, misurati nel browser.

## Coverage

- Rubric passes run: 4/4 (v1 strongest, Opus-class ereditato; v2–v4 balanced, Sonnet-class)
- Passes skipped or failed: nessuno. v2 non ha fatto il passaggio nel browser con reduced motion (giudicato dal codice); v1 lo ha fatto su `/case-study/offerte-ai/`. v1 non ha rilanciato `npm run build` nel repo per non toccare la `dist/` servita; v4 ha buildato in una copia temporanea (exit 0).
- UI pass: ran on http://localhost:4322/case-study/{onboarding-saas,offerte-ai,dati-da-excel,motion-design}/ (build di produzione servita da `astro preview`), Chromium, da 280 a 1200 px, albero di accessibilità letto via CDP. Nessun test con uno screen reader reale.

## Findings

| Severity | Concern (verifier) | Location | Problem | Required fix / evidence | Durable? |
|----------|--------------------|----------|---------|-------------------------|----------|
| MAJOR | v4 — schema delle date e JSON-LD | `src/content.config.ts` (`isoDay`, righe ~10-15) | Lo YAML trasforma una data impossibile non quotata in un'altra data valida a mezzanotte UTC; il controllo `% 86_400_000` passa e `z.iso.date()` vede una stringa valida. Build con exit 0: `2026-02-30` → `2026-03-02`, `2026-02-29` → `2026-03-01`, `2026-13-01` → `2027-01-01`. Tra virgolette fallisce correttamente. | Togliere il ramo `Date` e accettare solo stringhe `YYYY-MM-DD` tra virgolette (documentandolo nel README), oppure un loader/schema YAML che lasci le date come stringhe. | no |
| MINOR | v1 — logica del count-up | `src/pages/case-study/[slug].astro:618-624` (`tick`) | Il `try/catch` di `run()` copre solo la creazione dell'orologio; un'eccezione dentro `tick` (frame successivi) lascerebbe il numero a metà, e la rete del `load` non scatta perché `data-cu-ready` è già impostato. Solo un motore con WAAPI parziale lancerebbe lì. | `try/catch` attorno al corpo di `tick` con `settle(el)`. | no |
| MINOR | v1 — logica del count-up | `src/pages/case-study/[slug].astro:148-158` | Un crawler che esegue JS (es. Googlebot) vede nel DOM renderizzato sia il valore di partenza (span `aria-hidden`) sia la copia `.sr-only` finale, se il suo orologio non porta a fine il conteggio. I crawler senza JS leggono solo il valore finale. Nessuna prova sul render di Googlebot. | Controllare l'HTML renderizzato con URL Inspection di Search Console; se serve, armare solo quando la card è vicina al viewport. | no |
| MINOR | v4 — schema delle date | `src/content.config.ts` | Anche `2026-03-05 00:00:00` (con spazio, mezzanotte) passa ed esce come `2026-03-05`: innocuo ma un'altra forma accettata non documentata. | Si chiude con la stessa correzione del MAJOR. | no |
| MINOR | v3 — UI statica | `src/pages/case-study/[slug].astro` (`.metric-card b`) | "12,5% → 80%" ha poco margine: 151,3 px su 158 a 280 px, 155,5 su 164 a 803–804 px. Non si taglia (36 px di padding visibili); con un font di ripiego più largo (Verdana, 184,9 px) sborderebbe nel padding. | Nessuna correzione richiesta; se lo stack di font cambia, `clamp(1.4rem, 14cqi, 2.6rem)`. | no |
| MINOR | v2 — motion-craft | count-up, `--dur-data` + `--ease-out-expo` | La curva expo arriva al ~90% in 350–400 ms; la coda da ~78 a 80 è lunga e quasi ferma. È l'abbinamento documentato in `brain/chore/motion.md`, non una violazione. | Controllo a occhio di Omar: la coda deve sembrare voluta, non lenta. | no |
| NIT | v1 — logica del count-up | `[slug].astro:633-645` | Una card che non riceve mai `.in` resta sul valore di partenza: è invisibile (opacità 0) e `beforeprint` la sistema, quindi nessun numero sbagliato visibile. | Facoltativo: flag per elemento quando `run` parte davvero. | no |
| NIT | v1 — logica del count-up | `[slug].astro:129` | Più `.cu` nello stesso `<b>` anniderebbero un secondo wrapper; oggi il template ne emette al massimo uno. | Nessuna. | no |
| NIT | v2 — motion-craft | `onboarding-saas.md:64` | Il conteggio parte da 12 e non da 12,5: per un attimo si legge "12,5% → 12%". | Contenuto, accettabile. | no |

## What passed

| Concern (verifier) | Evidence |
|--------------------|----------|
| v1 — logica del count-up | JS spento: valore finale nell'HTML di tutti i casi studio. Script inline emesso come `<script>` normale subito dopo la griglia. Modulo sostituito da un `throw`: `data-cu-ready` assente e valori 80/84/38 grazie al ripiego sul `load`. `beforeprint` prima e durante il conteggio: valori finali subito, e restano. Token rotti (`abc`, vuoto, `-5ms`, `0ms`, curva `nonsense`): fine sempre su 80/84/38. Progress null a fine corsa: il valore viene da `data-to`. Reduced motion: niente armato, nessun wrapper. |
| v2 — motion-craft | Durata e curva solo da `--dur-data` / `--ease-out-expo`, nessun valore scritto a mano. Misurato: il conteggio di ogni card parte con la sua opacità (card 2 e 3 a 0 finché non entrano), quindi segue lo stagger d1/d2. Reduced motion: nessun conteggio, valore finale, solo la dissolvenza. Decisione della barra: Approve. |
| v3 — UI statica | "12,5% → 80%" su una riga da 280 a 1200 px, anche a 801–804 px e attorno al breakpoint di 800 px; `scrollWidth` = `clientWidth` per ogni `b`. `tabular-nums` attivo: larghezza costante (151,28 px) per ogni cifra, contro 137–146 px senza. Albero di accessibilità (CDP): una sola copia letta, col valore finale, numero e poi etichetta. `.sr-only` limitato a `.metric-card`, nessun overflow. Nessun layout shift all'armamento (altezza griglia costante, zero `layout-shift` al caricamento). |
| v4 — schema e JSON-LD | Date valide (quotate e non), `T00:00:00Z` → giorno giusto; orario non a mezzanotte, offset `+02:00`, stringhe non ISO e `"2026-02-30"` quotata fanno fallire la build. Campi facoltativi: i casi studio attuali buildano e l'Article non ha date. `@id`, `url`, `mainEntityOfPage` coerenti col canonical; author/publisher puntano a `#founder` / `#org`. Headline toglie un solo punto finale. Serializzazione con `<` escapato. |

## Per-concern verdicts

| Pass | Charter | Verdict | Key reason |
|------|---------|---------|------------|
| v1 | Logica del count-up | SHIP | Ogni percorso del charter termina sul valore vero o non lo cambia; restano un'eccezione improbabile in `tick` e il caso dei crawler con JS. |
| v2 | Motion-craft del count-up | SHIP | Solo token, conteggio allineato allo stagger misurato, reduced motion corretto. |
| v3 | UI statica della griglia | SHIP | Nessun a capo né taglio da 280 a 1200 px, una sola copia accessibile col valore finale, nessun layout shift. |
| v4 | Schema delle date e JSON-LD | DO NOT SHIP | Una data impossibile non quotata viene spostata in silenzio invece di far fallire la build. |

## Human Review Checklist

Impatto `critical`: questi passi vanno seguiti da una persona prima del commit.

1. Correggi `isoDay` (MAJOR di v4) e rilancia `npm run build`: deve passare.
2. Prova la correzione: aggiungi in un caso studio `published: 2026-02-30` senza virgolette e verifica che la build fallisca; poi `published: "2026-03-05"` e verifica `"datePublished":"2026-03-05"` nell'HTML; poi togli la riga.
3. Apri un caso studio (es. `/case-study/onboarding-saas/`) con JS attivo: i numeri contano entrando con le card, la terza per ultima, e finiscono sui valori giusti. Guarda se la coda del conteggio ti sembra voluta.
4. Riapri la stessa pagina con JS spento e con reduced motion attivo: valori finali, nessun conteggio.
5. Controlla le larghezze 280, 375, 804 e 1060 px: "12,5% → 80%" su una riga.
6. Con VoiceOver, leggi la griglia dei risultati prima di scorrere fino a lì: deve dire "12,5% → 80%", "−84%", "+38%" una volta sola.
7. Passa una pagina di caso studio nel Rich Results Test di Google e, dopo il deploy, controlla l'HTML renderizzato in URL Inspection (MINOR di v1 sui crawler con JS).

## Feature-improvement candidates

| Candidate (verifier) | Evidence | Who gains | Size | Outcome |
|----------------------|----------|-----------|------|---------|
| — | Nessun verifier ha proposto migliorie di prodotto; i suggerimenti di v1 (try/catch in `tick`, flag per elemento) sono correzioni di robustezza, già in Findings. | — | — | — |

## Notes for docs-maintenance

- Nessun finding marcato durable: il MAJOR di v4 e i MINOR di v1 vanno corretti nel codice prima del commit, non registrati come debito.
- Se le date restano solo stringhe quotate, aggiornare il passo 4 di "Aggiungere un caso studio" nel README con le virgolette obbligatorie.
- La review precedente [[review/2026-11-15-seo-geo-basi/REPORT]] ha il blocker v8 e i major v6/v7 chiusi da questo change set, misurati da v1, v2 e v3.

## Follow-up (2026-11-15, dopo la review)

Correzioni applicate su richiesta di Omar, verificate a mano e non da una nuova review:
- **MAJOR v4 (date):** `isoDay` accetta solo la stringa `z.iso.date()`, senza il ramo `Date`. Build: `"2026-03-05"` → `"datePublished":"2026-03-05"`; falliscono `2026-03-05` e `2026-02-30` non quotate, `"2026-02-30"`, `"2026-03-05T00:00:00Z"` e `"5 marzo 2026"`, con il messaggio `data tra virgolette nel formato "YYYY-MM-DD"`. README aggiornato (virgolette obbligatorie). Chiude anche il MINOR sul formato con spazio.
- **MINOR v1 (`tick`):** `try/catch` dentro `tick` con `settle`. Prova: `getComputedTiming` forzato a lanciare dopo tre frame → numeri finali 80/84/38, nessuno resta armato.
- Restano aperti, come controlli umani della checklist: il render dei crawler con JS (URL Inspection) e la sensazione della coda del conteggio.
