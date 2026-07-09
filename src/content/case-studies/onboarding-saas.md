---
title: "L'onboarding che si compila da solo: dal 12,5% all'80% di completamento."
excerpt: "Un flusso di 11 step manuali che solo il 12,5% degli utenti portava a termine. L'abbiamo sostituito con la sincronizzazione del profilo LinkedIn: Apify estrae i dati, l'utente rivede e conferma, e ora l'80% completa l'onboarding in meno di 37 secondi."
tags: ["Real shipped code", "Talent platform · SaaS", "Onboarding & attivazione"]
order: 1

home:
  tag: "Talent platform"
  title: "Onboarding completato dal 12,5%. Ora dall'80%."
  problem: "11 step manuali e ~15 minuti di form: su 500 utenti registrati, solo il 12,5% completava il profilo."
  solution: "Il profilo si sincronizza da LinkedIn: uno scraper Apify estrae i dati e precompila i campi, l'utente rivede e conferma."
  metrics:
    - value: "6,4×"
      label: "tasso di completamento"
    - value: "−84%"
      label: "costo per profilo attivo"

meta:
  cliente: "SeVedemo · Talent platform"
  ruolo: "Product Engineer"
  durata: "3 settimane"
  stack: "React · TanStack · Express · Apify · PostHog"

contesto:
  heading: "Una piattaforma dove il profilo è il prodotto."
  paragraphs:
    - "SeVedemo mette in contatto professionisti digitali e aziende. Tutto il valore per chi si iscrive passa da una cosa sola: un profilo completo, credibile, trovabile. Un profilo a metà è un profilo invisibile."
    - "Le registrazioni crescevano, spinte dalle campagne di acquisizione: circa 3,50 € per utente registrato. Ma i profili completi no. <strong>Su 500 utenti registrati, solo il 12,5% arrivava in fondo all'onboarding:</strong> ogni profilo attivo, l'unica cosa che genera valore, costava in realtà ~28 € di advertising. L'87,5% del budget moriva dentro un form."

problema:
  heading: "11 step manuali, 15 minuti di form, 87,5% di abbandono."
  intro: "Prima di toccare il codice ho instrumentato il funnel con PostHog, evento per evento, sulla coorte dei 500 utenti registrati. Il problema non era il prodotto: era il prezzo d'ingresso."
  items:
    - title: "11 step obbligatori, tutti da compilare a mano."
      text: "Competenze, ruolo, esperienze, formazione, bio, tariffa, lingue, foto, contatti: ogni schermata un form, ogni campo digitato da zero."
    - title: "~15 minuti di tempo medio di completamento."
      text: "Informazioni che l'utente aveva <em>già scritto</em> altrove, su LinkedIn o nel CV, e che gli chiedevamo di ricopiare a mano, campo per campo."
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
  note: "Il dato che non avevamo messo a budget: <strong>le iscrizioni organiche.</strong> Con l'80% dei nuovi utenti che arriva a un profilo completo e visibile, la piattaforma ha iniziato a portare utenti da sola. Nei 60 giorni dopo il rilascio PostHog ha registrato uno spike del +38% di iscrizioni non legate alle campagne: profili completi che vengono trovati e condivisi portano altri professionisti, a costo zero."

soluzione:
  heading: "Il profilo si sincronizza da LinkedIn."
  intro: "La strada ovvia era ottimizzare gli 11 step: meno campi, copy migliore, una progress bar più incoraggiante. Ho proposto di eliminarli. <strong>Tutto quello che chiedevamo esisteva già sul profilo LinkedIn dell'utente:</strong> bastava sincronizzarlo."
  items:
    - title: "Apify legge il profilo, Express lo traduce."
      text: "Uno scraper Apify estrae dal profilo pubblico LinkedIn esperienze, formazione, competenze, lingue e bio; un servizio Express orchestra l'estrazione e mappa ogni sezione sul modello dati della piattaforma."
    - title: "Parsing asincrono, mai un'attesa muta."
      text: "TanStack Query gestisce il polling dello stato di estrazione: l'utente segue in tempo reale ogni fase (analisi, mappatura, preparazione) invece di fissare uno spinner infinito."
    - title: "Revisione, non compilazione."
      text: "I dati estratti atterrano in un form TanStack Form già precompilato e validato: l'utente corregge quello che vuole e conferma. Digitare è l'eccezione, non la regola."
  video:
    src: "/case-studies/onboarding/onboarding.mp4"
    caption: "Il nuovo flusso registrato in tempo reale: dalla sincronizzazione con LinkedIn all'onboarding completato in meno di 37 secondi."

chicca:
  heading: "Il profilo si aggiorna con un click."
  intro: "Il problema gemello dell'onboarding è il profilo che invecchia: nel vecchio flusso nessuno tornava ad aggiornare 11 schermate. Ora c'è un solo bottone, <strong>Aggiorna</strong>: ripete la sincronizzazione con LinkedIn e propone le differenze da confermare. Meno di 15 secondi, e il profilo torna allineato alla realtà."
  video:
    src: "/case-studies/onboarding/resync.mp4"
    caption: "Un click su Aggiorna: il profilo esistente si riallinea a LinkedIn in meno di 15 secondi."

sfide:
  heading: "Cosa poteva andare storto (e come l'abbiamo evitato)."
  paragraphs:
    - "<strong>I profili reali sono disordinati:</strong> sezioni mancanti, lingue miste, formati imprevedibili. Lo scraping non poteva essere un tutto-o-niente. Ogni campo estratto è indipendente: se qualcosa non si riesce a mappare, il campo resta vuoto ed editabile e il flusso va avanti. Il caso peggiore è un form precompilato a metà, mai un vicolo cieco."
    - "<strong>E chi un profilo online non ce l'ha?</strong> Il percorso manuale non è sparito: è diventato il fallback, insieme all'import da CV. Il rollout è avvenuto dietro feature flag, con il funnel instrumentato su PostHog step per step: il confronto vecchio-vs-nuovo era misurato, non raccontato, prima della release a tutti gli utenti."

primaDopo:
  statLabel: "Onboarding completato"
  before:
    stat: "12,5%"
    width: "16%"
    items:
      - "11 step obbligatori, ~15 minuti di form"
      - "Ogni campo ricopiato a mano da LinkedIn o dal CV"
      - "12,5% di completamento su 500 utenti"
      - "~28 € di spesa ads per ogni profilo attivo"
      - "Profili a metà, invisibili alle aziende"
  after:
    stat: "80%"
    width: "100%"
    items:
      - "Profilo sincronizzato da LinkedIn in meno di 37 secondi"
      - "Campi precompilati dallo scraper: si rivede, non si digita"
      - "80% di completamento"
      - "4,40 € per profilo attivo, a parità di campagne"
      - "Profilo aggiornabile con un click, in meno di 15 secondi"

cta:
  heading: "Il tuo onboarding perde utenti?"
  text: "Parliamone: 30 minuti per capire dove si rompe il funnel e dirti onestamente se posso aiutarti."
---
