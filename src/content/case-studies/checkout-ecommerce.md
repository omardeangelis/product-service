---
# ⚠️ Contenuto placeholder — sostituire con dati e cliente reali.
title: "Checkout ricostruito da zero: carrelli abbandonati dimezzati in un mese."
excerpt: "Il 70% del traffico arrivava da mobile, ma il checkout era pensato per desktop e impiegava 6 secondi ad arrivare al pagamento. L'abbiamo riscritto mobile-first: -48% di abbandoni."
tags: ["Real shipped code", "E-commerce", "Piano mensile"]
order: 2

home:
  tag: "E-commerce"
  title: "Checkout ricostruito, carrelli abbandonati dimezzati."
  problem: "Checkout legacy lento (6s al pagamento) e inutilizzabile da mobile, dove arrivava il 70% del traffico."
  solution: "Checkout one-page mobile-first, pagamento in 2 tap, fallback offline-friendly."
  metrics:
    - value: "-48%"
      label: "abbandoni"
    - value: "1.2s"
      label: "al pagamento"

meta:
  cliente: "E-commerce D2C (placeholder)"
  ruolo: "Product Engineer"
  durata: "4 settimane"
  stack: "Next.js · Stripe · Shopify API"

contesto:
  heading: "Un negozio che cresceva, un checkout che frenava."
  paragraphs:
    - "Il cliente è un e-commerce D2C con un catalogo consolidato e campagne social che funzionavano: il traffico cresceva trimestre su trimestre, soprattutto da Instagram e TikTok — quindi da mobile."
    - "Ma la crescita del traffico non si traduceva in ordini. <strong>Il carrello si riempiva, il checkout lo svuotava.</strong> Il tasso di abbandono al pagamento era il doppio del benchmark di settore."

problema:
  heading: "Un checkout desktop-first in un business mobile-first."
  intro: "Ho instrumentato ogni step del checkout e registrato sessioni reali. Tre colli di bottiglia, tutti evitabili:"
  items:
    - title: "6 secondi per arrivare al form di pagamento."
      text: "Il checkout caricava l'intero bundle del sito, più tre script di terze parti bloccanti, <em>prima</em> di mostrare qualsiasi cosa."
    - title: "5 schermate, 23 campi, zero autofill."
      text: "Su mobile significava minuti di digitazione. Ogni campo in più era una percentuale di utenti in meno."
    - title: "Errori di rete = carrello perso."
      text: "Su connessioni mobili instabili un timeout buttava via l'intero stato del checkout. L'utente ricominciava da capo — o più spesso, non ricominciava."
  funnel:
    title: "Funnel di checkout — prima dell'intervento"
    rows:
      - { label: "Carrello", width: "100%", value: "100%" }
      - { label: "Inizio checkout", width: "64%", value: "64%" }
      - { label: "Dati di spedizione completati", width: "38%", value: "38%" }
      - { label: "Pagamento completato", width: "21%", value: "21%", drop: true }
    note: "Dati da tracking lato client su 30 giorni. <em>(Numeri placeholder — da sostituire con i dati reali.)</em>"

risultati:
  heading: "I numeri, prima di tutto."
  cards:
    - { pre: "-", from: 0, to: 48, post: "%", label: "carrelli abbandonati al checkout" }
    - { pre: "1.2s", post: "", label: "dal tap sul carrello al form di pagamento" }
    - { pre: "+", from: 0, to: 31, post: "%", label: "conversione checkout da mobile" }
  chart:
    title: "Prima / dopo l'intervento"
    rows:
      - { label: "Tempo al pagamento · prima", width: "100%", value: "6s" }
      - { label: "Tempo al pagamento · dopo", width: "20%", value: "1.2s", after: true }
      - { label: "Campi da compilare · prima", width: "100%", value: "23", gap: true }
      - { label: "Campi da compilare · dopo", width: "30%", value: "7", after: true }

soluzione:
  heading: "Una pagina, due tap, niente da perdere."
  intro: "Invece di ottimizzare il checkout esistente, l'ho sostituito con un flusso nuovo e brutalmente ridotto — <strong>una sola pagina, progettata per il pollice, non per il mouse.</strong>"
  items:
    - title: "One-page checkout mobile-first."
      text: "Un'unica schermata con i 7 campi davvero necessari, autofill nativo del browser e wallet (Apple Pay / Google Pay) come prima scelta: pagamento in 2 tap."
    - title: "Stato persistente e offline-friendly."
      text: "Ogni campo salvato localmente man mano: un timeout o un refresh non buttano via niente. Il carrello sopravvive alla metropolitana."
    - title: "Payment element isolato dal resto del sito."
      text: "Il checkout carica solo il codice che gli serve: 1.2 secondi al form di pagamento anche su rete 4G, misurati sul percentile 75."
  figure: "🖥️ Screenshot del checkout one-page — da sostituire con immagine reale"

sfide:
  heading: "Cosa poteva andare storto (e come l'abbiamo evitato)."
  paragraphs:
    - "<strong>Non puoi fermare la cassa di un negozio aperto.</strong> Il nuovo checkout è andato in produzione dietro feature flag, prima sul 10% del traffico mobile, con il vecchio flusso come fallback istantaneo. Nessun ordine perso durante la transizione."
    - "Il secondo rischio era contabile: <strong>ogni modifica al checkout tocca pagamenti veri.</strong> Ogni release è stata accompagnata da riconciliazione automatica ordini-transazioni, così qualsiasi discrepanza sarebbe emersa in ore, non a fine mese."

primaDopo:
  statLabel: "Abbandono al checkout"
  before:
    stat: "79%"
    width: "100%"
    items:
      - "5 schermate e 23 campi da compilare"
      - "6 secondi di caricamento prima del form"
      - "Timeout di rete = carrello perso"
      - "Wallet mobile non supportati"
  after:
    stat: "41%"
    width: "52%"
    items:
      - "Una pagina, 7 campi, autofill nativo"
      - "1.2 secondi al form di pagamento"
      - "Stato persistente: niente si perde"
      - "Apple Pay e Google Pay in 2 tap"

quote:
  text: "Pensavamo servisse un redesign del sito. Omar ci ha mostrato che il problema era un imbuto rotto in fondo al funnel — e l'ha sistemato senza toccare il resto. Testimonial placeholder, da sostituire con quote reale."
  initials: "GB"
  name: "Nome Cognome"
  role: "Founder, Nome Brand"

cta:
  heading: "Il tuo checkout perde ordini?"
  text: "Parliamone: 30 minuti per capire il problema e dirti onestamente se posso aiutarti."
---
