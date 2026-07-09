---
# ⚠️ Contenuto placeholder — sostituire con dati e cliente reali.
title: "Da idea a primi clienti paganti in 8 settimane."
excerpt: "Un founder non tecnico con una tesi validata a voce, zero prodotto e investitori in attesa di una demo. Otto settimane dopo: MVP in produzione e 12 clienti paganti al giorno 30."
tags: ["Real shipped code", "Fintech · MVP", "Piano MVP"]
order: 4

home:
  tag: "Fintech · MVP"
  title: "Da idea a primi clienti paganti in 8 settimane."
  problem: "Founder non tecnico con una tesi validata a voce ma zero prodotto e investitori in attesa di una demo."
  solution: "MVP con scope brutalmente ridotto al flusso che genera revenue, il resto in waiting list."
  metrics:
    - value: "8 sett."
      label: "al lancio"
    - value: "12"
      label: "clienti paganti al D30"

meta:
  cliente: "Startup fintech pre-seed (placeholder)"
  ruolo: "Product Engineer · MVP"
  durata: "8 settimane"
  stack: "Next.js · PostgreSQL · Stripe"

contesto:
  heading: "Una tesi forte, zero prodotto."
  paragraphs:
    - "Il founder aveva passato sei mesi a parlare con potenziali clienti: PMI che gestivano gli anticipi di cassa via email e fogli di calcolo. Trenta interviste, quindici lettere di intento, una tesi chiara."
    - "Ma la tesi era ferma lì. <strong>Nessun prodotto, nessun co-founder tecnico, e un round che non si chiudeva senza una demo funzionante.</strong> Ogni mese di attesa era runway bruciato."

problema:
  heading: "Il rischio non era costruire male. Era costruire troppo."
  intro: "La prima settimana non ho scritto codice: ho riletto le interviste e mappato cosa serviva davvero per la prima transazione. Tre trappole da evitare:"
  items:
    - title: "La feature list dell'entusiasmo: 40 voci."
      text: "Dashboard, notifiche, app mobile, integrazioni bancarie. Con quel piano il lancio sarebbe arrivato <em>dopo</em> la fine del runway."
    - title: "Ogni feature in più ritardava la risposta all'unica domanda che contava."
      text: "Qualcuno pagherà? Tutto ciò che non contribuiva a rispondere era, per definizione, rimandabile."
    - title: "Il settore imponeva vincoli veri fin dal giorno uno."
      text: "Gestire denaro significa audit trail, permessi e riconciliazione: le uniche cose <em>non</em> negoziabili dello scope."
  funnel:
    title: "Dalla feature list allo scope del lancio"
    rows:
      - { label: "Feature richieste all'inizio", width: "100%", value: "40" }
      - { label: "Dopo la discovery", width: "45%", value: "18" }
      - { label: "Nello scope dell'MVP", width: "20%", value: "8" }
      - { label: "Necessarie per la prima transazione", width: "12%", value: "5", drop: true }
    note: "Il resto è finito in una waiting list visibile ai clienti, che è diventata a sua volta uno strumento di validazione. <em>(Numeri placeholder.)</em>"

risultati:
  heading: "I numeri, prima di tutto."
  cards:
    - { pre: "", from: 0, to: 8, post: " settimane", label: "dalla prima call al lancio in produzione" }
    - { pre: "", from: 0, to: 12, post: " clienti", label: "paganti entro 30 giorni dal lancio" }
    - { pre: "", from: 0, to: 100, post: "%", label: "delle transazioni riconciliate automaticamente" }
  chart:
    title: "Scope: richiesto vs lanciato"
    rows:
      - { label: "Feature immaginate", width: "100%", value: "40" }
      - { label: "Feature al lancio", width: "20%", value: "8", after: true }
      - { label: "Settimane stimate per la versione completa", width: "100%", value: "36+", gap: true }
      - { label: "Settimane al lancio reale", width: "22%", value: "8", after: true }

soluzione:
  heading: "Costruire la risposta, non l'app completa."
  intro: "Lo scope finale: il flusso che porta un cliente dalla registrazione alla prima transazione pagata. <strong>Tutto il resto in waiting list, visibile, votabile dai clienti.</strong>"
  items:
    - title: "Solo il flusso che genera revenue."
      text: "Onboarding, richiesta anticipo, approvazione, incasso. Cinque schermate curate, non quaranta abbozzate."
    - title: "Infrastruttura noiosa e solida."
      text: "Stack volutamente convenzionale, pagamenti su Stripe, audit trail su ogni operazione. In fintech l'originalità va spesa sul prodotto, non sull'infrastruttura."
    - title: "Analytics dal giorno uno."
      text: "Ogni step del funnel misurato dal primo deploy: al giorno 30 sapevamo non solo che 12 clienti pagavano, ma quali segmenti convertivano meglio: dati che hanno guidato il pitch del round."
  figure: "🖥️ Screenshot del flusso di richiesta anticipo, da sostituire con immagine reale"

sfide:
  heading: "Cosa poteva andare storto (e come l'abbiamo evitato)."
  paragraphs:
    - "<strong>Lo scope creep è una malattia dei founder sotto pressione.</strong> Ogni settimana arrivava una feature \"indispensabile\" suggerita da un investitore o da un prospect. La regola concordata al kickoff: tutto entra in waiting list, niente entra nello sprint. La roadmap si riordina solo alla weekly review, dati alla mano."
    - "Il secondo rischio era il passaggio di consegne: <strong>un MVP che solo io sapevo toccare sarebbe stato un lock-in, non un asset.</strong> Codice nel repository del cliente dal primo giorno, documentazione di onboarding scritta man mano, e a fine ingaggio due settimane di affiancamento al primo dev interno."

primaDopo:
  statLabel: "Distanza dalla risposta \"qualcuno pagherà?\""
  before:
    stat: "∞"
    width: "100%"
    items:
      - "Tesi validata solo a voce, zero prodotto"
      - "Feature list da 40 voci e 9 mesi di sviluppo"
      - "Round fermo in attesa di una demo"
      - "Nessun dato reale su cui decidere"
  after:
    stat: "30gg"
    width: "30%"
    items:
      - "MVP in produzione in 8 settimane"
      - "12 clienti paganti al giorno 30"
      - "Demo live e metriche reali nel pitch"
      - "Roadmap guidata dai dati, non dalle opinioni"

quote:
  text: "Mi aspettavo un preventivo per l'app dei miei sogni. Omar mi ha convinto a costruirne un decimo, ed è stato quello che ha chiuso il round. Testimonial placeholder, da sostituire con quote reale."
  initials: "LM"
  name: "Nome Cognome"
  role: "Founder & CEO, Nome Startup"

cta:
  heading: "Hai una tesi da validare?"
  text: "Parliamone: 30 minuti per capire se un MVP è la risposta giusta, e quanto piccolo può essere."
---
