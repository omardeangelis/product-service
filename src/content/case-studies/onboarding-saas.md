---
title: "L'onboarding che si compila da solo: dal 12,5% all'80% di completamento."
excerpt: "Un flusso di 11 step manuali che solo il 12,5% degli utenti portava a termine. L'abbiamo sostituito con la sincronizzazione del profilo LinkedIn: Apify estrae i dati, l'utente rivede e conferma, e ora l'80% completa l'onboarding in meno di 37 secondi."
tags: ["Real shipped code", "Talent platform · SaaS", "Onboarding & attivazione"]
order: 1

home:
  tag: "Talent platform"
  title: "Incremento del tasso di completamento dell'onboarding dal 12,5% all'80%."
  problem: "11 step manuali e richiedevano ~15 minuti: su 500 utenti registrati, solo il 12,5% completava il profilo."
  solution: "Importare e sincronizzare il profilo con LinkedIn usando uno scraper Apify con cui precompilare i campi, lasciando all'utente il compito di rivedere e confermare."
  metrics:
    - value: "6,4×"
      label: "tasso di completamento"
    - value: "−84%"
      label: "costo per profilo attivo"

meta:
  cliente: "SeVedemo · Talent platform"
  ruolo: "Product Engineer"
  durata: "4 settimane"
  stack: "React · TanStack · Express · Apify · PostHog"

contesto:
  heading: "Una piattaforma dove il profilo è il prodotto."
  paragraphs:
    - "SeVedemo mette in contatto freelance digitali e aziende. Per semplificare iscrizione e manutenzione del profilo, abbiamo implementato una soluzione di sincronizzazione con LinkedIn."
    - "Le registrazioni crescevano ed erano accompagnate dalle campagne di acquisizione: circa 3,50 € per utente registrato. Ma i profili completi no. <strong>Su 500 utenti registrati, solo il 12,5% arrivava in fondo all'onboarding:</strong> attivare e mostrare un profilo aveva un costo nascosto, di ~28 €. L'87,5% del budget rimaneva bloccato dentro un form."

problema:
  heading: "11 step manuali, 15 minuti di form, 87,5% di abbandono."
  intro: "Il primo passo era ricostruire il fannuel e individuare eventuali frizioni. Implementando posthog ed tracciando ogni evento per evento, sulla coorte dei 500 utenti registrati. Il problema non era il prodotto: era la barrira di ingresso."
  items:
    - title: "11 step obbligatori da compilare manualmente e obbligatori."
      text: "Competenze, ruolo, esperienze, formazione, bio, tariffa, lingue, foto, contatti: ogni schermata un form, ogni campo digitato da zero."
    - title: "~15 minuti di tempo medio di completamento."
      text: "Informazioni che l'utente aveva <em>già scritto</em> altrove, su LinkedIn o nel CV, che gli chieste di ricopiare a mano, senza alcun valore ricevuto in cambio."
    - title: "Solo il 12,5% arrivava in fondo."
      text: "Gli altri restavano con un profilo a metà: invisibili alle aziende, nessun valore ricevuto, nessun motivo per tornare."
  funnel:
    title: "Funnel di onboarding prima dell'intervento"
    rows:
      - { label: "Registrazione", width: "100%", value: "100%" }
      - { label: "Competenze e ruolo", width: "54%", value: "54%" }
      - { label: "Esperienze e formazione", width: "28%", value: "28%" }
      - { label: "Onboarding completato", width: "12.5%", value: "12,5%", drop: true }
    note: "Coorte di 500 utenti registrati, funnel instrumentato con PostHog prima dell'intervento."
  gallery:
    caption: "Il vecchio flusso: 9 delle 11 schermate di inserimento manuale che ogni utente doveva attraversare."
    shots:
      - { src: "/case-studies/onboarding/old-flow/1-skills.png", alt: "Vecchio flusso: inserimento manuale delle competenze" }
      - { src: "/case-studies/onboarding/old-flow/2-role.png", alt: "Vecchio flusso: selezione del ruolo" }
      - { src: "/case-studies/onboarding/old-flow/3-experience.png", alt: "Vecchio flusso: inserimento delle esperienze lavorative" }
      - { src: "/case-studies/onboarding/old-flow/4-edu.png", alt: "Vecchio flusso: inserimento della formazione" }
      - { src: "/case-studies/onboarding/old-flow/5-bio.png", alt: "Vecchio flusso: scrittura della bio" }
      - { src: "/case-studies/onboarding/old-flow/6-price.png", alt: "Vecchio flusso: impostazione della tariffa" }
      - { src: "/case-studies/onboarding/old-flow/7-lingue.png", alt: "Vecchio flusso: inserimento delle lingue" }
      - { src: "/case-studies/onboarding/old-flow/8-profile.png", alt: "Vecchio flusso: completamento del profilo" }
      - { src: "/case-studies/onboarding/old-flow/9-contact.png", alt: "Vecchio flusso: inserimento dei contatti" }

risultati:
  heading: "I numeri, prima di tutto."
  cards:
    - { pre: "12,5% → ", from: 12, to: 80, post: "%", label: "utenti che completano l'onboarding" }
    - { pre: "−", from: 0, to: 84, post: "%", label: "costo di acquisizione per profilo attivo, a parità di spesa ads" }
    - { pre: "+", from: 0, to: 38, post: "%", label: "iscrizioni organiche nei 60 giorni dopo il rilascio" }
  chart:
    title: "Prima / dopo l'intervento"
    rows:
      - { label: "Completamento · prima", width: "16%", value: "12,5%" }
      - { label: "Completamento · dopo", width: "100%", value: "80%", after: true }
      - { label: "Costo ads per profilo attivo · prima", width: "100%", value: "~28 €", gap: true }
      - { label: "Costo ads per profilo attivo · dopo", width: "16%", value: "4,40 €", after: true }
      - { label: "Tempo di completamento · prima", width: "100%", value: "~15 min", gap: true }
      - { label: "Tempo di completamento · dopo", width: "5%", value: "37 s", after: true }
  note: "Uno dei risultati più interessanti dell'analisi post implementazione <strong>le iscrizioni organiche:</strong> la piattaforma ha iniziato a portare utenti a cascata. Nei 60 giorni dopo il rilascio PostHog ha registrato uno spike del +38% di iscrizioni non legate alle campagne: profili completi che vengono trovati e condivisi portano altri professionisti, a costo zero."

soluzione:
  heading: "Il profilo si sincronizza da LinkedIn."
  intro: "L'idea è stata di ereditare il lavoro e il valore già creato dall'utente su LinkedIn: semplificando anche la manutenzione del profilo nel futuro. Come ?"
  items:
    - title: "Apify scraper, il lavoro sporco lo fa lui. Anzi loro."
      text: "Uno scraper Apify più uno di fallback estraggono dal profilo pubblico LinkedIn esperienze, formazione, competenze, lingue e bio orchestrati da un service in cui dopo estrazione, un LLM mappa e categorizza il freelance, estrendone skills, esperienze e ricostruiendo il profilo in un formato coerente con la piattaforma. Il tutto in meno di 37 secondi."
    - title: "Parsing, estrazione e mappatura in tempo reale."
      text: "TanStack Query gestisce il polling estrazione ottimistico. Appena la skill sono pronte, l'utente vede il form precompilato, nel frattempo vengono estratte altre informazioni. Il flusso è asincrono e ottimizzato per la velocità: l'utente non aspetta mai."
    - title: "Revisione, non compilazione."
      text: "Il carico cognitivo dell'utente è ridotto al minimo: deve inserire solo le informazioni mancanti come tariffa oraria, il CV ed eventuali contatti e portfolio."
  video:
    src: "/case-studies/onboarding/onboarding.mp4"
    caption: "Il nuovo flusso registrato in tempo reale: dalla sincronizzazione con LinkedIn all'onboarding completato in meno di 37 secondi."

chicca:
  heading: "Il profilo rimane sincronizzato con LinkedIn."
  intro: "Mantenere il proprio profilo LinkedIn vuol dire mantener il profilo su SeVedemo. Un bottone, <strong>Aggiorna</strong>: ripete la sincronizzazione e propone le differenze da confermare ed in meno di 15 secondi e il profilo torna allineato alla realtà."
  video:
    src: "/case-studies/onboarding/resync.mp4"
    caption: "Un click e il profilo si riallinea a LinkedIn in meno di 15 secondi."

sfide:
  heading: "Cosa poteva andare storto (e come l'abbiamo evitato)."
  paragraphs:
    - "<strong>I profili sono disordinati:</strong> sezioni mancanti, formati imprevedibili, simpaticoni e artisti dei job title. La validazione andava ammorbidita: se qualcosa non si riesce a mappare, il campo resta vuoto ed viene ricostruito dal contesto generale dal LLM."
    - "<strong>Il percorso manuale non è sparito: </strong> è diventato il fallback accompagnato dall'import dal CV."

primaDopo:
  statLabel: "Onboarding completato"
  before:
    stat: "12,5%"
    width: "16%"
    items:
      - "11 step obbligatori, ~15 minuti di form"
      - "Ogni campo ricopiato a mano da LinkedIn o dal CV"
      - "12,5% tasso di completamento su 500 utenti"
      - "~28 € di spesa media per un profilo attivo"
      - "Profili incompleti e invisibili alle aziende"
  after:
    stat: "80%"
    width: "100%"
    items:
      - "Profilo creato e sincronizzato con LinkedIn in meno di 37 secondi"
      - "Campi precompilati dallo scraper: si rivede, non si digita"
      - "80% di completamento"
      - "4,40 € per profilo attivo a parità di spesa"
      - "Facilita di manutenzione del profilo nel tempo, con un click"

cta:
  heading: "Vuoi migliorare il tasso di completamento del tuo onboarding?"
  text: "Parliamone: 30 minuti per analizzare il funnel e capire se possiamo aiutarti."
---
