---
title: "Ripensare l'inserimento dei dati di un'intera app"
excerpt: "Le tabelle di un financial model si compilavano a mano, cella per cella, mentre i numeri erano già in un foglio Excel. Abbiamo reso possibile copiare una riga da Excel, Google Sheets o un CSV e incollarla direttamente in tabella: un solo parser per qualunque foglio, numeri normalizzati in ogni lingua e valuta, e un motore riusato in 31 tabelle senza codice dedicato."
tags: ["Real shipped code", "Financial modeling · SaaS", "Reusable architecture"]
order: 3
draft: false

home:
  tag: "Financial modeling · SaaS"
  title: "Copiare e incollare direttamente da Excel, Sheets e CSV i dati finanziari"
  problem: "Le tabelle di un financial model si compilavano cella per cella, mentre i numeri erano già pronti in un foglio Excel con formati, valute e separatori diversi ad ogni cliente."
  solution: "Copi una riga da Excel, Sheets o CSV e la incolli in tabella. Un solo parser normalizza i numeri in ogni lingua e valuta; un provider generico porta il paste in 31 tabelle senza codice dedicato."
  metrics:
    - value: "~30s"
      label: "per riempire una tabella (prima ~15 min a mano)"
    - value: "31"
      label: "tabelle, un solo motore di paste"

meta:
  cliente: "Valueize · Piattaforma di financial modeling"
  ruolo: "Team"
  durata: "9 settimane"
  stack: "React 19 · TanStack Table · TanStack Query · Zod · Vitest"

contesto:
  heading: "Le tabelle rendono il prodotto ordinato. Ma poi bisogna riempirle."
  paragraphs:
    - "Valueize è una piattaforma di financial modeling: personale, ricavi, COGS, opex, capitale circolante, struttura finanziaria. Ognuno di questi moduli è una o più tabelle a griglia — righe di voci, colonne di periodi — che l'utente deve compilare per costruire il modello. Un modello copre in genere 3-4 anni per volta, e ogni anno si può dettagliare mese per mese: le celle da riempire si moltiplicano in fretta."
    - "Il punto è che quei numeri quasi sempre <strong>esistono già</strong>: sono in un foglio Excel, in un Google Sheet condiviso, in un CSV esportato dal gestionale. Un import da file c'era, ma dava per scontato un foglio pulito e completo — e i piani reali sono fatti a mano, parziali e tutti diversi tra loro. Così, nella pratica, restava l'input manuale: leggere un valore dal proprio foglio e ridigitarlo nella griglia, cella per cella, per ogni tabella. Il lavoro non era 'modellare': era ricopiare."

problema:
  heading: "Input manuale cella per cella, con i dati già pronti dall'altra parte dello schermo."
  intro: "Il flusso era tecnicamente corretto e praticamente lentissimo. Ogni cella era un input validato, ma la validazione proteggeva il dato singolo, non il tempo dell'utente né la varietà dei fogli da cui i dati arrivavano."
  items:
    - title: "Una griglia = decine di celle da ridigitare."
      text: "Una tabella si compila di solito 3-4 anni alla volta: in vista annuale sono una decina di celle per riga, in vista mensile diventano 12 periodi per anno. Da ripetere su tutte le voci porta la complessità a centinaia di input manuali e ore a riempire tabelle."
    - title: "Ogni foglio parla una lingua diversa."
      text: "Un Excel italiano scrive <em>1.234,56</em>, uno americano <em>1,234.56</em>; un export CSV ci attacca il simbolo di valuta, un altro mette i separatori delle migliaia, un altro ancora le parentesi per i negativi. Anche volendo incollare, l'input avrebbe rifiutato quasi tutto: ogni formato è un caso diverso da gestire."
    - title: "Niente via di mezzo tra 'a mano' e 'reimport totale'."
      text: "Se dopo un import ti accorgi che quattro celle in mezzo a una tabella enorme sono sbagliate, le opzioni erano due: ridigitarle a mano, oppure rifare l'import di tutta la tabella. Nessuna delle due è una correzione, sono entrambe un ricominciare."

risultati:
  heading: "Il data entry ha smesso di essere il collo di bottiglia."
  cards:
    - { pre: "~", from: 0, to: 30, post: "s", label: "per riempire una tabella, da una media di ~15 minuti battuti a mano (3-4 anni di dati alla volta)" }
    - { pre: "", from: 0, to: 31, post: "", label: "tabelle dell'app servite dallo stesso motore di paste, senza codice ad-hoc" }
    - { pre: "", from: 0, to: 100, post: "%", label: "dei paste reversibili con un undo che tocca solo le celle coinvolte" }
  chart:
    title: "Prima / dopo l'intervento"
    rows:
      - { label: "Tempo per riempire una tabella · prima", width: "100%", value: "~15 min" }
      - { label: "Tempo per riempire una tabella · dopo", width: "6%", value: "~30s", after: true }
      - { label: "Formati di foglio accettati · prima", width: "16%", value: "solo input a mano", gap: true }
      - { label: "Formati di foglio accettati · dopo", width: "100%", value: "Excel · Sheets · CSV", after: true }
      - { label: "Tabelle con copia-incolla · prima", width: "3%", value: "0", gap: true }
      - { label: "Tabelle con copia-incolla · dopo", width: "100%", value: "31", after: true }
  note: "Il numero che conta non è '30 secondi', è <strong>'31 tabelle'</strong>. La feature è arrivata dappertutto perché il parser e la tabella non sanno niente l'uno dell'altra: due contratti piccoli e generici, agganciati con poche righe di configurazione per ogni tabella."

soluzione:
  heading: "Copi la riga da Excel. La incolli. Fatto."
  intro: "Un import da file c'era già, ma dava per scontato un foglio pulito e completo. L'utente tipico invece arriva con un piano fatto a mano: parziale, disordinato, diverso da ogni altro — un import perfetto spesso non era nemmeno possibile. <strong>Excel, Google Sheets e i CSV però mettono tutti nella clipboard lo stesso formato:</strong> righe separate da a-capo, celle separate da tab. Basta un parser per quel formato condiviso, non uno per ogni strumento, e la riga si incolla così com'è, senza riordinare niente prima. Diventa un gesto, non una procedura."
  items:
    - title: "Un gesto solo: tasto destro, Paste."
      text: "L'utente copia una riga dal suo foglio, fa tasto destro su una cella e sceglie <em>Paste</em>. Prima di scrivere niente, un'anteprima dice quante celle sta per incollare e mostra il contenuto grezzo della clipboard: nessuna sorpresa, si vede cosa sta per succedere."
    - title: "I numeri li normalizza da solo."
      text: "<em>1.234,56 €</em> e <em>€1,234.56</em> sono lo stesso valore scritto in due lingue: entrambi diventano <em>1234.56</em>. Simboli di valuta, separatori delle migliaia, parentesi per i negativi, spazi: il parser li interpreta e li riduce a un numero pulito, qualunque foglio li abbia prodotti."
    - title: "Guardrail espliciti, non troncamenti silenziosi."
      text: "Se incolli più celle di quante ne ha la riga, l'app te lo dice e ti lascia scegliere invece di tagliare in silenzio. Se nella selezione ci sono celle vuote, ti offre tre comportamenti chiari: riempirle con zero, preservare il valore attuale, oppure saltarle."
    - title: "Ogni paste è reversibile."
      text: "Subito dopo aver incollato, dal menu è disponibile un <em>Undo</em> che ripristina soltanto le celle toccate — non l'intera riga, non tutta la tabella. È la fine del dilemma 'ridigito o reimporto': si correggono quattro celle in mezzo a una griglia enorme senza ripartire da capo."
  gallery:
    caption: "Il nuovo flusso: dalla griglia da compilare all'anteprima del paste, i guardrail su limite di riga e celle vuote, fino all'undo mirato."
    shots:
      - { src: "/case-studies/dati-da-excel/1-griglia.png", alt: "La griglia mensile del personale: prima si compilava una cella alla volta" }
      - { src: "/case-studies/dati-da-excel/2-anteprima.png", alt: "Anteprima del paste: 'Paste 16 Cells' con il contenuto grezzo della clipboard" }
      - { src: "/case-studies/dati-da-excel/3-celle-vuote.png", alt: "Tre modalità per le celle vuote: riempi, preserva il valore attuale, scarta" }
      - { src: "/case-studies/dati-da-excel/4-limite-riga.png", alt: "Guardrail sul limite: incolli 16 celle ma la riga ne supporta 12, l'app chiede conferma" }
      - { src: "/case-studies/dati-da-excel/5-undo.png", alt: "Undo mirato: 'Undo 12 Cells' ripristina solo le celle appena incollate" }

tech:
  heading: "Astrazione, non duplicazione: due contratti generici."
  intro: "Sotto ci sono due cose, tenute apposta separate. Un <strong>parser puro</strong> che non sa niente delle tabelle: prende del testo dalla clipboard e restituisce numeri validati. E un <strong>provider generico</strong> che non sa niente dei numeri: prende una lista di dati e una chiave, e sa incollare, validare, mutare e annullare. Si incastrano con una config minima — ed è per questo che la stessa feature è finita in 31 tabelle diverse senza una riga di codice dedicata."
  items:
    - title: "Un parser, qualunque foglio."
      text: "Il paste di Excel/Sheets/CSV è testo tab-separato: si spezza per a-capo e per tab, e ogni cella passa in un validatore intercambiabile. I validatori sono schemi Zod (numerico, percentuale, numerico-positivo) e la tabella sceglie quale usare passando una stringa. Aggiungerne uno nuovo non tocca il parser."
      deepDive:
        label: "DeepDive · il parser della clipboard"
        blocks:
          - title: "Spezza righe e celle, valida una a una"
            code: |
              export function parseExcelData(
                pastedData: string,
                options: ClipboardParseOptions
              ): ClipboardParseResult {
                const rows = pastedData.split(/\r\n|\r|\n/) // Windows, Mac, Unix
                if (rows.length > 0 && rows[rows.length - 1] === ``) rows.pop()

                const cells = (rows[0] ?? ``).split(`\t`) // Excel/Sheets/CSV → tab-separated
                const parsedData: ClipboardParsedItem[] = []

                cells.forEach((cell, index) => {
                  const trimmed = cell.trim()
                  const { success, value, error } =
                    typeof options.validate === `function`
                      ? options.validate(trimmed)
                      : VALIDATE_FNS[options.validate](trimmed) // validatore scelto dalla tabella
                  parsedData.push({ id: index, originalValue: trimmed, validatedValue: value, error })
                })

                return { clipboardContent: pastedData, data: parsedData, /* ...errors */ }
              }
          - title: "Validatori intercambiabili, sono schemi Zod"
            code: |
              const VALIDATE_FNS = {
                numeric: (input: string) => run(z.string().transform(parseInputValue)
                  .refine((v) => !Number.isNaN(Number(v)), `invalid_numeric`), input),

                percentage: (input: string) => run(z.string().transform(parseInputValue)
                  .refine((v) => !Number.isNaN(Number(v)), `invalid_numeric`)
                  .refine((v) => Number(v) >= 0 && Number(v) <= 100, `invalid_percentage`), input),

                positiveNumeric: (input: string) => run(z.string().transform(parseInputValue)
                  .refine((v) => !Number.isNaN(Number(v)), `invalid_numeric`)
                  .refine((v) => Number(v) >= 0, `invalid_positive`), input),
              }
              // la tabella sceglie con una stringa: dataValidationType="percentage"
    - title: "I numeri, in qualunque lingua e valuta."
      text: "Il cuore è <code>parseInputValue</code>. Prima ripulisce: via simboli di valuta, lettere, spazi e percentuali; le parentesi diventano segno meno. Poi disambigua la parte più insidiosa — separatore delle migliaia contro separatore decimale — con una regola precisa invece di indovinare a caso."
      deepDive:
        label: "DeepDive · il parsing dei decimali"
        blocks:
          - title: "Pulizia: valuta, lettere, spazi, parentesi = negativo"
            code: |
              const cleanInput = (value: string) => {
                const parsed = value
                  .replace(currencySymbolsPattern, ``) // €, $, £, ...
                  .replace(/[a-zA-Z]/g, ``)
                  .replace(/[%]/, ``)
                  .replace(/[" "]/g, ``)
                  .trim()

                // notazione contabile: (342) → -342
                const hasParentheses = parsed.startsWith(`(`) && parsed.endsWith(`)`)
                return hasParentheses ? `-${parsed.slice(1, -1)}` : parsed
              }
          - title: "Migliaia o decimali? Una regola, non un indovinello"
            code: |
              const processDecimalPart = (value: string) => {
                let processedValue = value
                if (value.includes(`,`)) {
                  const parts = value.split(`,`)
                  // 2 cifre dopo la virgola → è un decimale (1234,56 → 1234.56)
                  if (parts[1]?.length <= 2) processedValue = value.replace(`,`, `.`)
                  // altrimenti è un separatore delle migliaia (1,234 → 1234)
                  else processedValue = value.replace(/,/g, ``)
                }
                // più punti: l'ultimo è il decimale, gli altri sono migliaia
                const split = processedValue.split(`.`)
                if (split.length > 1) {
                  const decimalPart = split.pop()
                  return `${split.join(``)}.${decimalPart}`
                }
                return processedValue
              }
          - title: "Separatori misti: entrambi presenti"
            code: |
              // "1.234,56" e "1,234.56" convivono: l'ultimo separatore è il decimale
              const handleMixedSeparators = (value: string) => {
                const parts = value.split(/[,.]/)
                if (parts.length >= 2) {
                  const decimalPart = parts.pop()
                  return `${parts.join(``)}.${decimalPart}`
                }
                return parts.join(``)
              }

              export const parseInputValue = (value: string) => {
                const parsed = cleanInput(value)
                if (INVALID_NUMERIC_INPUTS.includes(parsed)) return ``      // ".", ",", "..." → scartati
                if (parsed.includes(`,`) && parsed.includes(`.`)) return handleMixedSeparators(parsed)
                return processDecimalPart(parsed)
              }
    - title: "Una funzione, decine di tabelle."
      text: "Il provider è generico sul tipo di riga: <code>TableActionableRowProvider&lt;DataItem&gt;</code>. Non sa cosa sia una cella 'personale' o 'ricavi'. Riceve i dati correnti, la funzione di mutation della tabella e — il pezzo chiave — <code>mutateDataKey</code>, il percorso al campo da aggiornare, tipizzato sulle chiavi annidate di <code>DataItem</code>. È così che lo stesso provider serve strutture dati completamente diverse."
      deepDive:
        label: "DeepDive · il provider generico"
        blocks:
          - title: "La firma: generica sul dato, con la chiave tipizzata"
            code: |
              export const TableActionableRowProvider = <DataItem extends object>({
                children,
                currentData,
                mutateDataKey,                       // percorso al campo, es. "value" o "config.rate"
                rowUpdateMutationArgs: { mutationItemFn },
                dataValidationType = `numeric`,      // quale validatore Zod usa il parser
              }: {
                currentData: DataItem[]
                mutateDataKey: NestedKeyOf<DataItem>  // solo percorsi validi per DataItem
                dataValidationType?: ClipboardParseValidationType
                rowUpdateMutationArgs: {
                  mutationItemFn: (item: DataItem & { itemIndex: number }, extra: {
                    rowType: StandardInputType
                  }) => Promise<unknown>
                }
              }) => { /* ... */ }
          - title: "NestedKeyOf: il percorso è validato dal compilatore"
            code: |
              // "id" | "config" | "config.rate" | "config.view" ... — niente stringhe a caso
              type NestedKeyOf<T> = {
                [K in keyof T & (string | number)]: T[K] extends object
                  ? `${K}` | `${K}.${NestedKeyOf<T[K]>}`
                  : `${K}`
              }[keyof T & (string | number)]
          - title: "Il patch segue il percorso, senza mutare l'originale"
            code: |
              function getPatchedObjectByNestedProps<T extends object, V>(obj: T, path: string, value: V): T {
                const result = { ...obj }
                const keys = path.split(`.`)
                let current = result as Record<string, any>
                for (let i = 0; i < keys.length - 1; i++) {
                  current[keys[i]] = { ...current[keys[i]] } // copia il livello annidato
                  current = current[keys[i]]
                }
                current[keys[keys.length - 1]] = value
                return result
              }
    - title: "Modifiche chirurgiche, non reimport."
      text: "Le tre modalità di paste, il guardrail sul limite della riga, e un undo che rimette a posto solo le celle coinvolte. Le mutation partono in parallelo ma a gruppi di dieci, con feedback per singola cella: una griglia grande non blocca l'interfaccia e un errore su una cella non fa fallire le altre."
      deepDive:
        label: "DeepDive · paste, limiti, batch, undo"
        blocks:
          - title: "Tre modalità esplicite per le celle vuote"
            code: |
              const PASTE_ACTION_TYPES = {
                PASTE_ALL: `PASTE_ALL`,                     // incolla tutto
                PASTE_PRESERVE_EMPTY: `PASTE_PRESERVE_EMPTY`, // vuoto → tieni il valore attuale
                PASTE_SKIP_EMPTY: `PASTE_SKIP_EMPTY`,        // vuoto → salta la cella
              } as const

              const typePrepareFn = {
                [PASTE_ACTION_TYPES.PASTE_ALL]: (cps) => cps.data,
                [PASTE_ACTION_TYPES.PASTE_PRESERVE_EMPTY]: (cps) => cps.data,
                [PASTE_ACTION_TYPES.PASTE_SKIP_EMPTY]: (cps) =>
                  cps.data.filter((item) => item.validatedValue !== ``),
              }
          - title: "Il guardrail sul limite: chiedi, non troncare"
            code: |
              // incolli più celle di quante ne restano nella riga dal punto di partenza?
              if (clipboardParseResult.data.length > currentData.length - triggerCellIndex) {
                errorCode = PENDING_PASTE_ERROR.LIMIT_OVERFLOW // → dialog "Paste within limit?"
              }
          - title: "Mutation in batch da 10, feedback per cella"
            code: |
              // allSettled invece di Promise.all: una cella che fallisce non abbatte le altre
              const promises = args.upsertData.map((item, index) =>
                mutationItemFn(item, { rowType })
                  .then(() => ({ item, index, success: true }))
                  .catch(() => ({ item, index, success: false }))
              )

              const batchSize = 10
              const batched = []
              for (let i = 0; i < promises.length; i += batchSize) {
                batched.push(Promise.all(promises.slice(i, i + batchSize)))
              }
              const results = (await Promise.all(batched)).flat()
              // ogni risultato aggiorna il feedback della sua cella (verde/rosso)
          - title: "Undo mirato: solo le celle toccate"
            code: |
              const restoreDataCells = fullRowDataBeforePaste.filter(
                (_, i) =>
                  i >= contextMenuTriggerCellIndex &&
                  i < contextMenuTriggerCellIndex + pastedData.length
              )
              // rimette lo stato precedente solo su quelle celle: nessuna chiamata
              // per il resto della riga, che non è mai stato toccato

chicca:
  heading: "Multilingua e multivaluta, verificato su ogni combinazione."
  intro: "Un parser di numeri finanziari sbaglia in silenzio: <strong>1,234</strong> è milleduecentotrentaquattro per un americano e uno-virgola-due-tre-quattro per un italiano, e leggere male una cifra vuol dire corrompere un bilancio senza che nessuno se ne accorga. Per questo il parser non è coperto da qualche test scelto a mano, ma da una suite che lo fa girare su <strong>tutte le lingue supportate incrociate con tutte le valute ammesse</strong>, più i casi limite che rompono i parser ingenui: separatori misti, parentesi contabili, simboli attaccati al numero, input spazzatura."
  deepDive:
    label: "DeepDive · la suite di parsing"
    blocks:
      - title: "Ogni lingua × ogni valuta: formatta e ri-parsa"
        code: |
          it(`Should return number without currency`, () => {
            ALLOWED_CURRENCIES.forEach((currency) => {
              numbers.forEach((number) => {
                const formatted = formatNumber(number.input, { currency, style: `currency` })
                // qualunque valuta la scriva, il parser deve ricavarne il numero pulito
                expect(parseInputValue(formatted)).toBe(Number(number.expected).toFixed(number.precision))
              })
            })
          })

          it(`Should return formatted number for all supported locales`, () => {
            SUPPORTED_LOCALES.forEach((locale) => {
              numbers.forEach((number) => {
                const formatted = formatNumber(number.input, { language: locale })
                expect(parseInputValue(formatted)).toBe(Number(number.expected).toFixed(number.precision))
              })
            })
          })
      - title: "I casi limite che rompono i parser ingenui"
        code: |
          expect(parseInputValue(`1,234.56`)).toBe(`1234.56`)   // migliaia US + decimale
          expect(parseInputValue(`1234,56`)).toBe(`1234.56`)    // decimale IT
          expect(parseInputValue(`1.234,567.89`)).toBe(`1234567.89`) // separatori misti
          expect(parseInputValue(`(342,56)`)).toBe(`-342.56`)   // parentesi = negativo
          expect(parseInputValue(`$1234.56`)).toBe(`1234.56`)   // simbolo attaccato
          expect(parseInputValue(`1 234.56`)).toBe(`1234.56`)   // spazio come separatore

          // input che NON è un numero non deve diventare 0 di nascosto
          INVALID_NUMERIC_INPUTS.forEach((input) => expect(parseInputValue(input)).toBe(``))

sfide:
  heading: "Cosa poteva andare storto (e come l'abbiamo evitato)."
  paragraphs:
    - "<strong>La virgola che corrompe un bilancio.</strong> L'ambiguità tra separatore delle migliaia e decimale non è un dettaglio estetico: interpretare <em>1,234</em> come 1234 invece di 1,234 significa gonfiare un numero di mille volte, in silenzio, dentro un modello finanziario. La difesa non è indovinare la lingua dell'utente, ma una regola deterministica — due cifre dopo il separatore sono decimali, tre o più sono migliaia — e una suite di test che la verifica su ogni lingua e ogni valuta prima che una modifica al parser arrivi in produzione."
    - "<strong>Il paste parallelo che restituiva la cella sbagliata.</strong> La prima versione mandava tutte le mutation in un unico <code>Promise.all</code>. Al refetch, sulle selezioni grandi, la prima cella spesso non mostrava il valore incollato — anche se la richiesta POST era corretta. Il commento nel codice lo documenta ancora. La soluzione è stata passare a <code>allSettled</code> a gruppi di dieci: gli errori restano isolati alla loro cella e non si perdono aggiornamenti, tenendo reattiva anche una griglia grande."

primaDopo:
  statLabel: "Tempo per riempire una tabella"
  before:
    stat: "~15 min"
    width: "100%"
    items:
      - "Input manuale cella per cella — in media ~15 min a tabella, spesso 3-4 anni di dati insieme"
      - "Ogni formato di foglio (valuta, separatori, lingua) da riadattare a mano"
      - "Quattro celle sbagliate = ridigitare o reimportare tutta la tabella"
      - "Zero tabelle con copia-incolla"
  after:
    stat: "~30s"
    width: "6%"
    items:
      - "Copia-incolla diretto da Excel, Google Sheets o CSV"
      - "Numeri normalizzati in ogni lingua e valuta da un solo parser"
      - "Undo mirato sulle sole celle toccate, niente reimport"
      - "Lo stesso motore riusato in 31 tabelle, senza codice dedicato"

cta:
  heading: "Hai un flusso complicato che rallenta i tuoi utenti?"
  text: "Parliamone: 30 minuti per guardarlo insieme, capire se si può ridurre a pochi gesti e dirti onestamente se ne vale la pena."
---
