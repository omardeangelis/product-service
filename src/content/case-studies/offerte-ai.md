---
title: "L'offerta di lavoro si scrive in chat: un'AI che intervista come un recruiter."
excerpt: "Un wizard a 5 step che accettava descrizioni di una riga: offerte vaghe, tariffe fuori mercato, candidature a caso. L'abbiamo sostituito con una conversazione: alleghi un PDF, l'AI ti intervista, propone la tariffa di mercato e in 3 domande l'annuncio completo è in anteprima, pronto da pubblicare."
tags: ["Real shipped code", "Talent platform · SaaS", "AI integration"]
order: 2

home:
  tag: "Talent platform · AI"
  title: "Da form a conversazione: l'offerta si crea in 3 domande."
  problem: "Il wizard manuale accettava descrizioni di una riga: offerte vaghe, tariffe fuori mercato, candidature poco pertinenti."
  solution: "Una chat AI che intervista come un recruiter: legge PDF e brief, propone tariffe di mercato e genera l'annuncio completo con anteprima live."
  metrics:
    - value: "3"
      label: "domande per pubblicare"
    - value: "+64%"
      label: "candidature per offerta"

meta:
  cliente: "SeVedemo · Talent platform"
  ruolo: "Product Engineer"
  durata: "4 settimane"
  stack: "Express · Effect · OpenAI · Sharp · GCS"

contesto:
  heading: "Il collo di bottiglia si era spostato dall'altra parte del marketplace."
  paragraphs:
    - "Il lato professionisti l'avevamo già sistemato: profili completi in meno di 37 secondi grazie alla sincronizzazione con LinkedIn. Ma un marketplace vive di entrambi i lati, e le aziende che pubblicavano offerte avevano lo stesso identico problema in forma diversa."
    - "Chi pubblica un'offerta su SeVedemo spesso non è un recruiter di professione: è un founder, un PM, qualcuno dell'HR abituato ad assumere dipendenti, non freelance. <strong>Il risultato erano offerte vaghe, con descrizioni di una riga e tariffe scollegate dal mercato:</strong> i freelance non capivano cosa avrebbero fatto davvero, e le candidature arrivavano poche e poco pertinenti."

problema:
  heading: "Cinque step di form, descrizioni di una riga."
  intro: "Il flusso di creazione era un wizard classico: Progetto, Offerta, Contratto, ATS, Preview. Tecnicamente corretto, praticamente inutile per chi non sa già cosa scrivere. Il form validava i campi, non la qualità."
  items:
    - title: "Nessuna guida sul contenuto."
      text: "Il wizard chiedeva titolo, categoria, tag e descrizione, ma non aiutava a scriverli: una descrizione come <em>\"Costruire prodotti che risolvano davvero soluzioni\"</em> passava la validazione e finiva pubblicata così."
    - title: "Tariffe decise a sentimento."
      text: "Chi arriva dal recruiting tradizionale ragiona in RAL, non in tariffa giornaliera freelance. Il form chiedeva un minimo e un massimo senza alcun riferimento di mercato: offerte fuori range in entrambe le direzioni."
    - title: "Offerte vaghe, candidature a caso."
      text: "Un annuncio senza responsabilità concrete e requisiti chiari attira candidature generiche. Le aziende ricevevano poco e male, e la colpa ricadeva sulla piattaforma."
  gallery:
    caption: "Il vecchio flusso: il wizard a 5 step che validava i campi ma non aiutava a compilarli."
    shots:
      - { src: "/case-studies/offerte-ai/old-flow/1-progetto.png", alt: "Vecchio flusso: scelta della tipologia di progetto" }
      - { src: "/case-studies/offerte-ai/old-flow/2-offerta.png", alt: "Vecchio flusso: form con titolo, categoria e descrizione libera" }
      - { src: "/case-studies/offerte-ai/old-flow/3-contratto.png", alt: "Vecchio flusso: dettagli del contratto e tariffe senza riferimenti di mercato" }
      - { src: "/case-studies/offerte-ai/old-flow/4-ats.png", alt: "Vecchio flusso: scelta dell'ATS per le candidature" }
      - { src: "/case-studies/offerte-ai/old-flow/5-preview.png", alt: "Vecchio flusso: anteprima di un'offerta con descrizione di una riga" }

risultati:
  heading: "Offerte più ricche, candidature più pertinenti."
  cards:
    - { pre: "", from: 0, to: 3, post: "", label: "domande in media per arrivare all'annuncio completo in anteprima" }
    - { pre: "22% → ", from: 22, to: 96, post: "%", label: "offerte pubblicate con descrizione completa (ruolo, responsabilità, requisiti)" }
    - { pre: "+", from: 0, to: 64, post: "%", label: "candidature per offerta nei 30 giorni dopo il rilascio" }
  chart:
    title: "Prima / dopo l'intervento"
    rows:
      - { label: "Descrizione completa · prima", width: "23%", value: "22%" }
      - { label: "Descrizione completa · dopo", width: "100%", value: "96%", after: true }
      - { label: "Tempo di creazione · prima", width: "100%", value: "~18 min", gap: true }
      - { label: "Tempo di creazione · dopo", width: "22%", value: "~4 min", after: true }
      - { label: "Candidature per offerta · prima", width: "38%", value: "5", gap: true }
      - { label: "Candidature per offerta · dopo", width: "62%", value: "8,2", after: true }
  note: "Il dato più interessante è arrivato dal funnel su PostHog: <strong>le offerte create in chat convertono meglio anche lato freelance.</strong> Una descrizione con responsabilità e requisiti concreti fa autoselezionare i candidati giusti: più candidature, e soprattutto candidature che l'azienda risponde invece di ignorare."

soluzione:
  heading: "Un'intervista, non un form."
  intro: "La strada ovvia era migliorare il wizard: più suggerimenti, più esempi, più validazioni. Ho proposto di cambiarne la natura. <strong>Un recruiter esperto non ti dà un form da compilare: ti fa le domande giuste e scrive lui l'annuncio.</strong> Così si comporta la chat."
  items:
    - title: "L'AI intervista come un recruiter."
      text: "Dal primo messaggio deduce da sola titolo, categoria, seniority e competenze, senza chiedere conferme inutili. La strategia è esplicita nel prompt: chiudere entro 3 scambi, poi ogni informazione mancante viene dedotta dal contesto e dalle tariffe di mercato."
    - title: "Alleghi un PDF, la chat lo legge."
      text: "CV, brief o capitolato: PDF e immagini si allegano direttamente in chat, vengono compressi e processati lato server ed entrano nel contesto della conversazione. L'utente non ricopia niente."
    - title: "Tariffe agganciate al mercato."
      text: "Tool dedicati estraggono le competenze richieste e la tariffa media di mercato per profili simili: la chat propone sempre un range realistico in EUR al giorno e chiede conferma esplicita solo sul budget, l'unico campo dove non si improvvisa."
    - title: "Anteprima live, pubblicazione in un click."
      text: "A ogni scambio un secondo modello estrae dalla conversazione il payload strutturato dell'offerta e aggiorna l'anteprima accanto alla chat. Alla chiusura, l'annuncio completo (ruolo, responsabilità, requisiti) passa alla revisione finale e si pubblica."
  gallery:
    caption: "Il nuovo flusso: dal brief allegato in chat all'annuncio completo in anteprima, fino alla revisione prima della pubblicazione."
    shots:
      - { src: "/case-studies/offerte-ai/new-flow/1-chat-start.png", alt: "Nuovo flusso: la chat di creazione con l'anteprima offerta accanto" }
      - { src: "/case-studies/offerte-ai/new-flow/2-upload-pdf.png", alt: "Nuovo flusso: upload di un PDF direttamente nel messaggio" }
      - { src: "/case-studies/offerte-ai/new-flow/3-intervista.png", alt: "Nuovo flusso: l'AI deduce profilo e competenze e fa le domande mancanti" }
      - { src: "/case-studies/offerte-ai/new-flow/4-rifinitura.png", alt: "Nuovo flusso: la chat propone il range di tariffa di mercato" }
      - { src: "/case-studies/offerte-ai/new-flow/5-anteprima-live.png", alt: "Nuovo flusso: annuncio completo generato in anteprima accanto alla chat" }
      - { src: "/case-studies/offerte-ai/new-flow/6-revisione.png", alt: "Nuovo flusso: revisione e perfezionamento dell'offerta generata prima di pubblicarla" }

tech:
  heading: "L'integrazione AI, senza magia."
  intro: "La parte visibile è una chat. La parte che la tiene in piedi in produzione è un servizio Express costruito con Effect: errori tipizzati, retry con backoff esponenziale e ogni chiamata AI tracciata con il suo costo."
  items:
    - title: "Due modelli, due lavori."
      text: "La conversazione è gestita in streaming da un modello grande con la persona del recruiter. L'estrazione del payload usa un modello mini con structured output in JSON Schema strict: mai parsing fragile, mai campi inventati. Le etichette in italiano che l'utente legge vengono mappate sugli enum interni della piattaforma."
      deepDive:
        label: "DeepDive · il service dei due modelli"
        blocks:
          - title: "Il modello grande conversa in streaming"
            code: |
              export const createChatStream = (
                messages: ChatMessage[],
                context: ChatContext
              ): Effect.Effect<AsyncIterable<ChatCompletionChunk>, AiServiceError> =>
                Effect.tryPromise({
                  try: () =>
                    openai.chat.completions.create({
                      model: CHAT_MODEL, // la persona del recruiter vive nel system prompt
                      messages: [
                        { role: "system", content: buildSystemPrompt(context) },
                        ...messages,
                      ],
                      stream: true,
                      stream_options: { include_usage: true },
                    }),
                  catch: (cause) => new AiServiceError({ cause }),
                });
          - title: "Il modello mini estrae con JSON Schema strict"
            code: |
              export const extractPayload = (
                messages: ChatMessage[],
                context: ChatContext,
                usageContext?: AiUsageContext
              ): Effect.Effect<AiJobOfferPayload, AiServiceError> =>
                createTrackedChatCompletion(
                  {
                    model: EXTRACTION_MODEL, // estrae, non conversa
                    response_format: {
                      type: "json_schema",
                      json_schema: {
                        name: "job_offer_payload",
                        strict: true,
                        schema: aiJobOfferPayloadJsonSchema,
                      },
                    },
                    messages: [
                      { role: "system", content: buildExtractionSystemPrompt(context) },
                      ...messages,
                    ],
                  },
                  { usageContext, callKind: AI_USAGE_CALL_KINDS.EXTRACTION }
                ).pipe(
                  Effect.mapError((cause) => new AiServiceError({ cause })),
                  Effect.map((res) => resolveRatePayload(parsePayload(res)))
                );
          - title: "La tariffa si normalizza prima di arrivare al form"
            code: |
              const resolveRatePayload = (raw: AiJobOfferPayload): AiJobOfferPayload => {
                if (raw.payment_type === "fixed") {
                  return { ...raw, rate_min: null, rate_max: null, rate_unit: null };
                }

                validateJobOfferRate({
                  daily_rate_min: raw.rate_min ?? null,
                  daily_rate_max: raw.rate_max ?? null,
                  payment_type: "daily",
                });

                return { ...raw, payment_type: "daily", rate_unit: "daily" };
              };
    - title: "File processing difensivo."
      text: "Il tipo di file si decide dai magic bytes, non dall'estensione. Le immagini vengono compresse con Sharp a qualità decrescente fino a rientrare nel budget; i PDF diventano immagini pagina per pagina via Poppler. Tutto passa da uno storage temporaneo su GCS e viene eliminato dopo il processing."
      deepDive:
        label: "DeepDive · la pipeline dei file"
        blocks:
          - title: "L'orchestrazione, un Effect per step"
            code: |
              export function validateAndAssemble(message: string, files: StoredFile[]) {
                return Effect.gen(function* () {
                  const processed = yield* processFiles(files); // Sharp per le immagini, Poppler per i PDF
                  const blocks = assembleContentBlocks(message, processed);
                  yield* validateImageBlocksBeforeSend(blocks); // niente oltre soglia arriva al modello
                  return blocks;
                });
              }
          - title: "Il tipo lo decidono i magic bytes"
            code: |
              export function detectFileType(buffer: Buffer): DetectedFileType | null {
                if (buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46) {
                  return { category: "pdf", mimeType: "application/pdf" }; // %PDF
                }
                if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
                  return { category: "image", mimeType: "image/png" };
                }
                if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
                  return { category: "image", mimeType: "image/jpeg" };
                }
                return null; // l'estensione dichiarata non conta niente
              }
          - title: "Sharp scala la qualità finché non rientra nel budget"
            code: |
              const JPEG_QUALITIES = [80, 60, 40, 20] as const;

              for (const quality of JPEG_QUALITIES) {
                const compressed = await sharp(buffer)
                  .resize(width, height, { fit: "inside", withoutEnlargement: true })
                  .jpeg({ quality })
                  .toBuffer();

                if (compressed.length <= IMAGE_TARGET_RAW_SIZE) {
                  return buildImageBlock(compressed, "jpeg");
                }
              }
          - title: "Lo storage temporaneo su GCS"
            code: |
              export function storeFile(userId: string, file: UploadedFile) {
                return Effect.tryPromise({
                  try: async () => {
                    const fileId = crypto.randomUUID();
                    await bucket.file(buildGcsPath(userId, fileId)).save(file.buffer, {
                      metadata: { contentType: file.detectedType.mimeType /* ... */ },
                    });
                    return fileId; // al client torna solo l'id, mai il file
                  },
                  catch: (cause) => new GcsStoreError({ operation: "upload", cause }),
                });
              }

              export const downloadFiles = (fileIds: string[], userId: string) =>
                Effect.all(fileIds.map((id) => downloadFile(id, userId)), { concurrency: 3 });
    - title: "Auto-compaction del contesto."
      text: "Ogni conversazione ha un budget di token stimato. Superata la soglia, la storia si comprime: restano i primi messaggi e gli ultimi, con un messaggio ponte al posto del resto, e gli allegati vecchi vengono strippati. Il context bloat è il modo più rapido per far degradare qualità e costi di una chat AI."
      deepDive:
        label: "DeepDive · la compaction"
        blocks:
          - title: "Il budget si stima prima di chiamare il modello"
            code: |
              export const TOKEN_BUDGET = 8000;

              export const estimateTokens = (messages: ChatMessage[]): number =>
                messages.reduce((acc, m) => {
                  if (typeof m.content === "string") {
                    return acc + Math.ceil(m.content.length / 4);
                  }
                  return acc + m.content.reduce(
                    (sum, part) =>
                      part.type === "text" ? sum + Math.ceil(part.text.length / 4) : sum + 250,
                    0
                  );
                }, 0);
          - title: "Primi e ultimi messaggi restano, in mezzo un ponte"
            code: |
              const MAX_MESSAGES_FOR_API = 10;
              const ALWAYS_KEEP_FIRST = 2;

              export const trimMessagesForChat = (messages: ChatMessage[]): ChatMessage[] => {
                if (messages.length <= MAX_MESSAGES_FOR_API) return messages;

                const first = messages.slice(0, ALWAYS_KEEP_FIRST);
                const recent = messages.slice(-(MAX_MESSAGES_FOR_API - ALWAYS_KEEP_FIRST));
                const bridge: ChatMessage = {
                  role: "user",
                  content: "[Messaggi precedenti omessi per brevità. Le informazioni raccolte finora sono già riflesse nei messaggi successivi.]",
                };

                return [...first, bridge, ...recent];
              };
          - title: "Gli allegati vecchi escono dal contesto"
            code: |
              export const stripOldFileContent = (messages: ChatMessage[]): ChatMessage[] =>
                messages.map((msg, i) => {
                  if (i === messages.length - 1) return msg; // l'ultimo tiene i suoi allegati
                  if (Array.isArray(msg.content)) {
                    const textPart = msg.content.find((p) => p.type === "text");
                    return { ...msg, content: textPart?.text ?? "" };
                  }
                  return msg;
                });
    - title: "Guardrail espliciti."
      text: "Il modello fa solo recruiting: le richieste fuori tema vengono reindirizzate con una escalation a tre livelli, le istruzioni nascoste nei file allegati vengono ignorate per design, e limiti duri su messaggi e dimensioni proteggono da abusi e costi fuori controllo."
      deepDive:
        label: "DeepDive · limiti e retry"
        blocks:
          - title: "Errori tipizzati, non stringhe"
            code: |
              import { Data } from "effect";

              export class AiServiceError extends Data.TaggedError("AiServiceError")<{
                cause?: unknown;
              }> {}

              export class TokenBudgetExceededError extends Data.TaggedError(
                "TokenBudgetExceededError"
              )<{ cause?: unknown }> {}

              export class DbError extends Data.TaggedError("DbError")<{ cause?: unknown }> {}
          - title: "Limiti duri validati con Zod prima di toccare il modello"
            code: |
              export const aiJobOfferChatRequestSchema = z.object({
                messages: z.array(chatMessageSchema).min(1).max(50),
                file_ids: z.array(z.string().uuid()).max(10).optional().default([]),
                visibility: z.enum(visibilityEnum),
                company_id: z.string(),
              });
          - title: "Retry con backoff esponenziale"
            code: |
              Effect.tryPromise({
                try: () => openai.chat.completions.create(params),
                catch: (cause) => new AiServiceError({ cause }),
              }).pipe(
                // due tentativi extra, 500ms poi 1s: un blip di rete non diventa un errore utente
                Effect.retry(
                  Schedule.exponential("500 millis").pipe(Schedule.intersect(Schedule.recurs(2)))
                )
              );

chicca:
  heading: "Il prompt ha una pipeline di test."
  intro: "Il rischio delle feature AI è che il primo che tocca il prompt dopo di te rompa tutto senza accorgersene. Per questo ho lasciato al team una <strong>pipeline di evaluation</strong>: un generatore crea decine di scenari realistici e diversi tra loro, il flusso gira su ciascuno e un modello giudice valuta ogni risposta su criteri espliciti, alcuni bloccanti. Il report HTML mostra punteggi, violazioni e pass rate: si modifica il prompt, si rilancia la pipeline, e la regressione si vede prima del deploy invece che dalle lamentele degli utenti."
  deepDive:
    label: "DeepDive · la pipeline di evaluation"
    blocks:
      - title: "1 · Il dataset si genera da solo"
        code: |
          // un LLM genera scenari diversi tra loro: personas, edge case, lingue
          const scenarios = yield* evaluator.generateDataset({
            taskDescription: JOB_OFFER_TASK,
            totalScenarios: 30,
            generationModel: GENERATION_MODEL,
          });
      - title: "2 · Ogni scenario gira e un modello giudice lo valuta"
        code: |
          const results = yield* Effect.all(
            scenarios.map((scenario) =>
              Effect.gen(function* () {
                const input = extractInput(scenario);
                const output = yield* runPromptFn(input);
                const grade = yield* grader.grade(input, output, scenario);
                return { scenario, input, output, grade };
              })
            ),
            { concurrency: 3 }
          );
      - title: "3 · Pass rate e criteri bloccanti"
        code: |
          const passThreshold = options.passThreshold ?? 7; // sotto il 7 non si passa
          const passRate =
            (scores.filter((s) => s >= passThreshold).length / scores.length) * 100;

          // i criteri bloccanti vincono sullo score: se violati, il run è rosso
          const mandatoryCriteria = grader.getMandatoryCriteria();
          const mandatoryViolationCount = results.filter((r) =>
            r.grade.violations.some((v) => mandatoryCriteria.includes(v))
          ).length;

sfide:
  heading: "Cosa poteva andare storto (e come l'abbiamo evitato)."
  paragraphs:
    - "<strong>Le immagini divorano il contesto.</strong> Un PDF di dieci pagine diventa dieci immagini nella conversazione, e dopo tre allegati la chat scoppia o costa dieci volte tanto. La risposta è la compaction: budget di token, allegati vecchi rimossi dal contesto, compressione aggressiva prima ancora di arrivare al modello. Il caso peggiore è un'immagine meno nitida, mai una conversazione persa."
    - "<strong>Il tono doveva restare da consulente, non da form parlante.</strong> Un LLM lasciato a se stesso riformula, ricapitola e chiede conferme su tutto. Il prompt vieta esplicitamente questi pattern e la pipeline di evaluation li tratta come violazioni bloccanti: se una modifica fa tornare il modello burocratico, il punteggio crolla prima che arrivi in produzione."

primaDopo:
  statLabel: "Offerte con descrizione completa"
  before:
    stat: "22%"
    width: "23%"
    items:
      - "Wizard a 5 step, ~18 minuti per pubblicare"
      - "Descrizioni di una riga accettate senza guida"
      - "Tariffe decise a sentimento, spesso fuori mercato"
      - "Candidature poche e poco pertinenti"
  after:
    stat: "96%"
    width: "100%"
    items:
      - "Un'intervista in chat che chiude in 3 domande"
      - "Annuncio completo generato: ruolo, responsabilità, requisiti"
      - "Range di tariffa proposto dai dati di mercato"
      - "PDF e brief allegati in chat, anteprima live e pubblicazione in un click"

cta:
  heading: "Vuoi portare l'AI dentro il tuo prodotto?"
  text: "Parliamone: 30 minuti per capire se un'integrazione del genere ha senso nel tuo caso e dirtelo onestamente."
---
