---
title: "ui-sweep: rivedere ogni interazione quando lavori da solo"
excerpt: "Una skill che, da un prototipo o da un'interfaccia, genera un report con uno screenshot e un prototipo interattivo per <strong>ogni stato</strong>, voluto o no."
published: "2026-11-03"
project: "brain-manager"
cover:
  kind: video
  src: /releases/ui-sweep/refinement.mp4
  poster: /releases/ui-sweep/copertina.jpg
  alt: "ui-sweep sul flusso di sincronizzazione LinkedIn: ogni interazione con il suo screenshot e il suo prototipo"
---

## Da solo sei più veloce, ma hai più bias

Mi trovo sempre più spesso a lavorare da solo su feature di grandi dimensioni, che prima avrebbero richiesto un team.

Questo salto di produttività ha un costo: si perde il valore che feedback e opinioni diverse portano durante lo sviluppo e la rifinitura, e i propri bias non trovano più nessuno che li contraddica.

## L'evoluzione del refinement

Gestire da soli interi rami di prodotto è il futuro, ed è un cambiamento da guidare, non da subire.

Non si può lavorare come prima: raccogliere una specifica, svilupparla e scaricare sul QA il compito di intercettare incoerenze, errori e slop.

Bisogna invece rafforzare il processo di rifinitura con un flusso che permetta di:

- intercettare lo slop prima che arrivi in produzione;
- esplorare gli scenari intermedi;
- rivedere di persona i flussi cruciali;
- prendere le decisioni di prodotto e renderle esplicite.

## ui-sweep: esplora ogni scenario

Da qui nasce **ui-sweep**, una skill che parte da un prototipo o da un'interfaccia e genera un report. Per ogni interazione il report dà uno screenshot e il rimando a un prototipo interattivo in cui riprodurre lo scenario. Così sono descritti tutti gli stati, voluti e non, in cui un utente si ritroverà.

## Il mio flusso di lavoro: brain-manager

La skill fa parte di un pacchetto più grande che uso ogni giorno: gestisce anche la scrittura delle specifiche, i piani di implementazione paralleli, l'implementazione e la review. Si chiama [brain-manager](https://www.npmjs.com/package/brain-manager) e sì, il nome è terribile e non c'entra nulla.

Non serve installarlo tutto: basta chiedere al proprio agente di installare una singola skill.

## Evolutive e ricerca

Nello sviluppo agentico, il punto in cui vedo più margine di miglioramento è la pianificazione. Un muro di testo e 30 domande non sono il modo migliore per pianificare: onestamente, è l'ultimo che sceglierei.

Per questo ho deciso di continuare la ricerca sui flussi di discovery e di pianificazione ad alto livello, con una soluzione MCP-first.
