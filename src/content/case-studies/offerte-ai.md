---
title: "Automatizzare la creazione di un brief di progetto in 3 domande"
excerpt: "Una chat interattiva dove l'AI ti intervista, interpreta e legge PDF, immagini, TXT e ti accompagna nella creazione dell'offerta: propone la tariffa di mercato e in 3 domande l'annuncio completo e pronto da pubblicare."
tags: ["Real shipped code", "Talent platform · SaaS", "AI integration"]
order: 2

home:
  tag: "Talent platform · AI"
  title: "Da form  chat interattiva: il brief si crea in 3 domande."
  problem: "Il wizard manuale accettava descrizioni di una riga: offerte vaghe, tariffe fuori mercato, candidature poco pertinenti."
  solution: "Una chat AI che intervista e ti guida lungo la creazione dell'offerta: legge PDF, immagini, TXT generando un output completo e revisionabile."
  metrics:
    - value: "3"
      label: "domande per la prima versione"
    - value: "+64%"
      label: "candidature per offerta"

meta:
  cliente: "SeVedemo · Talent platform"
  ruolo: "Product Engineer"
  durata: "4 settimane"
  stack: "Express · Effect · OpenAI · Sharp · GCS"

contesto:
  heading: "Ottimizzare il flusso di creazione delle offerte."
  paragraphs:
    - "Dopo aver ottimizzato il flusso di creazione dei profili riducendo il tempo di creazione < 37 secondi e migliorando l'accuratezza grazie alla <a href='/case-study/onboarding-saas'>sincronizzazione con LinkedIn</a>, rimaneva un problema simile dall'altra parte del marketplace dove le aziende pubblicavano offerte passando da wizard a 5 step che non facilitavano la creazione di un annuncio completo e standardizzati"
    - "Chi ricerca un professionista non sempre è un recruiter o ha esperienza nella creazione di offerte, né ha una conoscenza approfondita del mercato. <strong>Il risultato erano offerte vaghe, con descrizioni di una riga e tariffe scollegate dal mercato;</strong> portando a poche candidature e soprattutto disallineate dal profilo desiderato."

problema:
  heading: "Un form lungo che richiedeva all'utente di recepire troppe informazioni prima di iniziare."
  intro: "Il flusso di creazione era un wizard classico: Progetto & Ruolo, Tariffa, Contratto, Link per il colloquio & anteprima pre pubblicazione. Tecnicamente impeccabile, praticamente inutile per chi non sa già cosa scrivere. Il form validava i campi, non la qualità."
  items:
    - title: "Nessuna guida sul contenuto."
      text: "Il wizard chiedeva titolo, categoria, tag e descrizione, ma non aiutava a scriverli né a fornire dati a supporto."
    - title: "Tariffe senza riferimenti di mercato."
      text: "E' una scelta che non paga dare per scontato che chiunque cerchi un freelance conosca le tariffe di mercato."
    - title: "Descrizioni approssimative producono candidature disallineate."
      text: "Nessuna garanzia di coerenza tra descrizione, responsabilità, aspettative con le competenze richieste e utili a realzzare il progetto."
  gallery:
    caption: "Il vecchio flusso: il wizard a 5 step che validava i campi ma non aiutava a compilarli."
    shots:
      - { src: "/case-studies/offerte-ai/old-flow/1-progetto.png", alt: "Vecchio flusso: scelta della tipologia di progetto" }
      - { src: "/case-studies/offerte-ai/old-flow/2-offerta.png", alt: "Vecchio flusso: form con titolo, categoria e descrizione libera" }
      - { src: "/case-studies/offerte-ai/old-flow/3-contratto.png", alt: "Vecchio flusso: dettagli del contratto e tariffe senza riferimenti di mercato" }
      - { src: "/case-studies/offerte-ai/old-flow/4-ats.png", alt: "Vecchio flusso: scelta dell'ATS per le candidature" }
      - { src: "/case-studies/offerte-ai/old-flow/5-preview.png", alt: "Vecchio flusso: anteprima di un'offerta con descrizione di una riga" }

risultati:
  heading: "Offerte coerenti, candidature più pertinenti."
  cards:
    - { pre: "", from: 0, to: 3, post: "", label: "domande in media per produrre un brief di progetto" }
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

soluzione:
  heading: "Un'intervista, non un form."
  intro: "<strong>Un recruiter non ti dà un form da compilare</strong> ma fa le domande, legge documenti, immagini e curriculum e se qualcosa non è chiaro ti aiuta a risolvere il problema."
  items:
    - title: "L'AI intervista come un recruiter."
      text: "Deduce ed estrae titolo, categoria, seniority e competenze. La strategia è esplicita nel prompt: fornire una priva versione entro 3 scambi, poi recuperare informazioni mancanti ed infine suggerire la tariffa."
    - title: "Supporta fino a 10 file: PDF, immagini e TXT."
      text: "Curriculum, requisiti, descrizioni di progetto: che siano PDF o immagini si allegano direttamente in chat, vengono compressi, processati ed entrano nel contesto della conversazione."
    - title: "Tariffe coerenti con il mercato."
      text: "Le tariffe vengono confrontate con quelle dei freelance presenti in piattaforma. Nessun dati è casuale: l'AI propone un range di mercato coerente con il ruolo, la seniority e le competenze richieste."
    - title: "Human in the loop."
      text: "U secondo modello estrae dalla conversazione il payload strutturato dell'offerta e aggiorna l'anteprima accanto alla chat. Rendendo ogni passaggio revisionabile prima della pubblicazione."
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
  heading: "Come funziona il nostro AI recruiter."
  intro: "L'interfaccia è una chat in Solid.js e sul BE un servizio Express costruito con Effect: errori tipizzati, retry con backoff esponenziale e ogni chiamata AI tracciata con il suo costo."
  items:
    - title: "Due modelli, due lavori."
      text: "Un modello si occupa di conversare con l'utente, il secondo riassume, estrae informazioni e indica che cosa manca per porre le domande corrette. L'estrazione del payload usa un modello mini con structured output: mai parsing fragile, mai campi inventati."
      deepDive:
        label: "DeepDive · il service dei due modelli"
        blocks:
          - title: "Un modello supporta la conversazione"
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
    - title: "File allegati: compressione, parsing e storage temporaneo."
      text: "Il tipo di file si decide dai magic bytes non dall'estensione e le immagini vengono compresse con Sharp a qualità decrescente fino a rientrare nel budget; i PDF diventano immagini pagina per pagina via Poppler. Tutto passa da uno storage temporaneo su GCS e viene eliminato alla fine o all'interruzione del processo."
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
      text: "Ogni conversazione ha un budget di token stimato. Superata la soglia, la storia si comprime: restano i primi messaggi e gli ultimi, con un riassunto al posto del resto, rimuovendo gli allegati vecchi. Il context bloat è il modo più rapido per far degradare qualità e costi."
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
      text: "Le richieste fuori tema vengono reindirizzate con una escalation a tre livelli, le istruzioni nascoste nei file allegati vengono ignorate per design e hard limit su messaggi e dimensioni mitigano file enormi e costi eccessivi."
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
  heading: "Evaluation pipeline come se piovesse!"
  intro: "Ogni modello è dotato di prompt univoco e si appoggia su tools condivisi in altre parti del prodotto. Per evitare regressioni, ogni modifica al prompt o ai tool passa da una pipeline di evaluation che genera 30 scenari diversi li itera ed un Model Grader li valuta, confronta con il valore precedente e se è diminuito oltre la soglia di passaggio blocca il rilascio. Tutto automatico, tutto in CI/CD."
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
  heading: "Gestire formati e contenuti diversi, senza perdere la conversazione."
  paragraphs:
    - "Tutto diventa un'immagine: sembra controintuitivo ma abbiamo scelto di convertire file e PDF in immagini e farle passare attraverso una flusso di compressione incrementale. In questo modo il modello non deve fare parsing di PDF o DOCX, ma legge le immagini come se fossero screenshot e non perde mai il contesto della conversazione."

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
  heading: "Vuoi integrare l'AI dentro il tuo prodotto?"
  text: "Parliamone: 30 minuti per capire se un'integrazione abbia senso nel tuo caso."
---
