---
# ⚠️ Contenuto placeholder — sostituire con dati e cliente reali.
title: "Come un SaaS B2B ha quasi triplicato l'attivazione ripensando l'onboarding."
excerpt: "Gli utenti si registravano ma non arrivavano mai al primo valore. In 3 settimane abbiamo portato la conversione al primo progetto dal 12% al 34%, senza aggiungere una sola feature."
tags: ["Real shipped code", "SaaS · B2B", "Piano trimestrale"]
order: 1

home:
  tag: "SaaS · B2B"
  title: "Onboarding che convertiva il 12%. Ora il 34%."
  problem: "Gli utenti si registravano ma non arrivavano mai al primo valore: flusso a 9 step, drop-off massiccio."
  solution: "Onboarding progressivo a 3 step con setup differito, misurato evento per evento."
  metrics:
    - value: "+183%"
      label: "attivazione"
    - value: "3 sett."
      label: "alla release"

meta:
  cliente: "SaaS B2B (~40 dipendenti)"
  ruolo: "Product Engineer"
  durata: "3 settimane"
  stack: "React · Node · PostgreSQL"

contesto:
  heading: "Un prodotto solido con un problema invisibile."
  paragraphs:
    - "Il cliente è una piattaforma SaaS per la gestione di progetti in ambito manifatturiero: prodotto maturo, clienti fidelizzati, churn basso. Il marketing funzionava: il traffico e le registrazioni crescevano mese su mese."
    - "Eppure il fatturato non seguiva. <strong>Le registrazioni raddoppiavano, i clienti paganti no.</strong> Da qualche parte, tra la registrazione e l'upgrade, gli utenti sparivano."

problema:
  heading: "Il 88% degli utenti non vedeva mai il valore del prodotto."
  intro: "Prima di scrivere codice, ho instrumentato il funnel di onboarding evento per evento. I dati hanno raccontato una storia precisa:"
  items:
    - title: "9 step obbligatori prima del primo valore."
      text: "Configurazione team, ruoli, integrazioni, notifiche: tutto richiesto <em>prima</em> di poter creare il primo progetto."
    - title: "Drop-off del 61% allo step \"invita il tuo team\"."
      text: "Gli utenti in valutazione non volevano coinvolgere colleghi prima di aver capito se il prodotto valesse la pena."
    - title: "Solo il 12% arrivava a creare un progetto."
      text: "Il momento in cui il prodotto dimostra il suo valore era sepolto in fondo a un percorso a ostacoli."
  funnel:
    title: "Funnel di onboarding prima dell'intervento"
    rows:
      - { label: "Registrazione", width: "100%", value: "100%" }
      - { label: "Setup iniziale completato", width: "74%", value: "74%" }
      - { label: "\"Invita il tuo team\"", width: "29%", value: "29%" }
      - { label: "Primo progetto creato", width: "12%", value: "12%", drop: true }
    note: "Dati dal tracking evento per evento instrumentato prima dell'intervento. <em>(Numeri placeholder, da sostituire con i dati reali.)</em>"

risultati:
  heading: "I numeri, prima di tutto."
  cards:
    - { pre: "12% → ", from: 12, to: 34, post: "%", label: "conversione registrazione → primo progetto" }
    - { pre: "+", from: 0, to: 27, post: "%", label: "trial → piano a pagamento" }
    - { pre: "", from: 0, to: 3, post: " settimane", label: "dalla diagnosi alla release in produzione" }
  chart:
    title: "Prima / dopo l'intervento"
    rows:
      - { label: "Attivazione · prima", width: "35%", value: "12%" }
      - { label: "Attivazione · dopo", width: "100%", value: "34%", after: true }
      - { label: "Step obbligatori · prima", width: "100%", value: "9", gap: true }
      - { label: "Step obbligatori · dopo", width: "33%", value: "3", after: true }

soluzione:
  heading: "Meno onboarding, non più onboarding."
  intro: "La tentazione era aggiungere: tooltip, video tutorial, una checklist gamificata. Ho proposto l'opposto: <strong>togliere tutto ciò che si frappone tra l'utente e il primo progetto.</strong>"
  items:
    - title: "Da 9 step a 3."
      text: "Nome, primo progetto, fatto. Tutto il resto (team, integrazioni, notifiche) è diventato configurazione differita, proposta nel momento in cui serve davvero."
    - title: "Progetto d'esempio precaricato."
      text: "L'utente atterra in un prodotto già vivo, non in una dashboard vuota. Il \"wow\" arriva al secondo 10, non al giorno 3."
    - title: "Ogni step misurato."
      text: "Eventi analytics su ogni transizione del funnel, così il team può vedere l'impatto di ogni futura modifica senza tirare a indovinare."
  figure: "🖥️ Screenshot del nuovo flusso a 3 step, da sostituire con immagine reale"

sfide:
  heading: "Cosa poteva andare storto (e come l'abbiamo evitato)."
  paragraphs:
    - "<strong>Il vincolo vero era il codice legacy:</strong> l'onboarding esistente era intrecciato con il sistema di permessi. Riscriverlo tutto avrebbe richiesto mesi. La soluzione è stata un nuovo flusso parallelo dietro feature flag, rilasciato al 10% degli utenti, poi al 50%, poi a tutti, con la possibilità di tornare indietro in un click."
    - "Il rollout graduale ha anche risolto la seconda paura del team: <strong>che i numeri fossero un caso.</strong> Con l'A/B test attivo per due settimane, il confronto vecchio-vs-nuovo era statisticamente solido prima della release completa."

primaDopo:
  statLabel: "Attivazione al primo progetto"
  before:
    stat: "12%"
    width: "35%"
    items:
      - "9 step obbligatori prima del primo valore"
      - "12% di utenti arrivava al primo progetto"
      - "Dashboard vuota al primo accesso"
      - "Zero visibilità sul funnel: si tirava a indovinare"
  after:
    stat: "34%"
    width: "100%"
    items:
      - "3 step, il resto è configurazione differita"
      - "34% di utenti crea il primo progetto"
      - "Prodotto già vivo con progetto d'esempio"
      - "Ogni step misurato: le decisioni si prendono sui dati"

quote:
  text: "Omar non ci ha chiesto \"cosa devo costruire\". Ci ha chiesto \"qual è il problema\", e poi ci ha mostrato coi numeri che la soluzione era togliere, non aggiungere. Testimonial placeholder, da sostituire con quote reale."
  initials: "MP"
  name: "Nome Cognome"
  role: "CEO, Nome Azienda"

cta:
  heading: "Hai un funnel che perde utenti?"
  text: "Parliamone: 30 minuti per capire il problema e dirti onestamente se posso aiutarti."
---
