---
title: "Jev su SeVedemo: un caso d'uso concreto come model grader"
excerpt: "Jev giudica le skill estratte da ogni profilo: tiene le <strong>30 che contano</strong>, ordinate per pertinenza e attualità."
published: "2026-09-22"
project: "SeVedemo"
cover:
  kind: video
  src: /releases/jev/jev.mp4
  poster: /releases/jev/copertina.png
  alt: "Jev su SeVedemo: l'LLM propone le skill, Jev le controlla, il codice decide quali tenere"
metric:
  value: "0,48 s"
  label: "per giudicare le skill di un profilo"
---

Uno degli aspetti che più mi gasa del lavorare a un prodotto è la possibilità di sperimentare e restare in contatto con l'innovazione giorno dopo giorno.

## Lo scetticismo su Jev

Ho letto molto scetticismo sulla concreta utilità di Jev, e lamentele sulla mancanza di casi d'uso concreti. Per rispondere ho deciso di provarlo direttamente su [SeVedemo](https://www.linkedin.com/company/sevedemo/), dandogli il ruolo di **model grader**: un modello chiamato a giudicare un output. Nel nostro caso giudica la pertinenza delle skill che estraiamo dai profili prima di trasformarle in embedding.

## Il problema: troppe skill, nessun controllo

Senza scendere troppo nel dettaglio: l'obiettivo è ridurre le skill di ogni profilo a un massimo di 30, ordinarle per frequenza e pertinenza e assegnare a ognuna un punteggio.

Il problema nasceva dal fatto che il nostro LLM estraeva le competenze in modo indipendente, e noi ne tenevamo 30.

10 estrazioni consecutive producevano 10 liste simili, ma con un ordine incoerente e non basato sulla pertinenza rispetto al profilo.

![L'estrazione fino a oggi: 32 label dall'LLM, tagliate alle prime 30 senza controlli](/releases/jev/1-estrazione.jpg)

## Jev come grader

Per ogni skill candidata Jev risponde a tre domande: la persona l'ha usata davvero? È una skill? Quanto è centrale nel suo percorso? Il modello si limita a prendere decisioni in parallelo, senza generare testo: così risolve il problema dell'ordinamento con latenza e costi bassi. In media impiega 0,48 secondi a profilo (su 36 richieste, al massimo 1,08 s), per circa $0,00034.

![Jev valuta ogni skill candidata: usata, è una skill, centralità](/releases/jev/2-grader.jpg)

## Pulizia e sinonimi

Una regola semplice decide cosa resta: ogni risposta deve superare una soglia di confidenza del 50%. Così escono le skill usate poco o mai, e quelle che non sono skill (come «communication»). Quando invece il problema è il nome, debole o poco diffuso, l'LLM propone fino a tre sinonimi affermati e Jev li rivaluta senza sapere che sono riscritti. La precisione dell'estrazione passa dal 94% al 98%.

![La regola: usata, skill e nome affermato sopra 0,5; i nomi deboli vengono sostituiti da un sinonimo](/releases/jev/3-sinonimi.jpg)

## Entrano solo le 30 che contano

Le competenze vengono organizzate secondo quattro criteri, e nel profilo entrano solo le prime 30:

1. principali nelle esperienze recenti;
2. usate con regolarità in esperienze consecutive;
3. marginali, ma usate nei ruoli precedenti;
4. non usate nelle ultime due posizioni.

L'idea è assegnare un peso coerente a una competenza usata 5 anni fa e a una usata tutti i giorni negli ultimi 4 mesi. Nello stesso profilo, «frontend development» passa dalla posizione 31, fuori dal taglio, alla 2.

![Taglio a 30 ordinato per centralità: frontend development passa da #31 a #2](/releases/jev/4-taglio-30.jpg)

## Aggiornamento: in produzione

Il passo successivo era permettere agli utenti di confermare, scartare e rivalutare le skill che estraiamo, così da correggere il tiro nelle estrazioni successive. Ora il flusso è in produzione: la conferma delle skill la racconto nell'articolo sulle [skill suggerite](/showcase/skill-suggerite/).

## Vale la pena usare Jev?

Per carità di Dio, niente che non si potesse ottenere con un qualsiasi LLM a temperatura 0 e un `json_schema` come risposta. Jev non rende l'estrazione più precisa da solo e non spiega le sue scelte: giudica e ordina.

![Cosa migliora e cosa non garantisce](/releases/jev/5-ipotesi.jpg)

L'aspetto che preferisco di Typesafe (Jev), oltre ovviamente ai token in output gratis, è aver riportato alla luce la flessibilità che si ottiene bilanciando la capacità cognitiva e quella decisionale di un modello.
