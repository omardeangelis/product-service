---
title: "Beautiful UI: curare ogni stato dell'interfaccia"
excerpt: "Sfruttare l'accelerazione data dall'AI per dedicare tempo a curare happy path, errori e stati intermedi, validando prototipi interattivi prima di scrivere codice."
published: "2026-11-10"
project: "SeVedemo"
cover:
  kind: video
  src: /releases/beautiful-ui/stati.mp4
  poster: /releases/beautiful-ui/poster.jpg
  alt: "La barra delle azioni di un'offerta generata dall'AI che passa da caricamento, dati mancanti, errore, limite del piano e riuscita"
caseStudy: offerte-ai
---

## Cosa vuol dire creare una bella interfaccia?

Un'interfaccia è più di un happy path e del semplice raggiungimento di un obiettivo.

È la cura di ogni scenario: dal caricamento all'errore, dal completamento parziale alla ripresa. Vuol dire avere una soluzione chiara e una decisione presa per ogni schermata che l'utente si troverà davanti, anche quando è offline.

In questo esempio mostriamo il flusso di revisione di un'[offerta di lavoro scritta da un assistente AI](/case-study/offerte-ai).

La soluzione implementata è una semplice floating bar che rende espliciti errori e campi mancanti e guida l'utente verso la prossima azione.

### Caricamento

![La barra elenca i passi: creazione dell'offerta, poi ricerca dei freelance compatibili](/releases/beautiful-ui/1-caricamento.jpg)

La barra racconta cosa sta succedendo, passo per passo.

### Parziale

![Mancano quattro campi: tariffa, durata, impegno e sede, ognuno in un chip](/releases/beautiful-ui/2-dati-mancanti.jpg)

Mancano quattro campi. Ognuno è un chip che porta dritto al campo da compilare.

### Errore

![L'offerta non è stata creata, le modifiche restano e c'è un pulsante per riprovare](/releases/beautiful-ui/3-errore.jpg)

La richiesta è fallita e le modifiche sono ancora lì: per riprovare basta un clic.

### Limite del piano

![Raggiunto il limite di offerte attive del piano, con il link per fare l'upgrade](/releases/beautiful-ui/4-limite-piano.jpg)

La bozza è salvata e, una volta fatto l'upgrade, si potrà andare avanti.

### Riuscita

![Offerta creata, e i profili compatibili sono in arrivo](/releases/beautiful-ui/5-riuscita.jpg)

Una conferma, e la prossima cosa che sta per succedere.

## La gestione degli stati intermedi

Gli stati intermedi descrivono gli scenari in cui l'utente cambia idea, riceve un errore, dimentica un campo o si interrompe per concludere in un secondo momento.

La difficoltà principale sta nel riuscire a immedesimarsi in un utente che non sa come raggiungere l'obiettivo, o a cui il percorso non è chiaro.

Lavorando da solo il problema cresce: manca un collega che chieda «e se l'utente cambia idea a metà?». Una possibile soluzione è la skill [ui-sweep](/showcase/ui-sweep/), con cui ho mitigato questo problema: nell'articolo racconto come bilanciare l'accelerazione rafforzando il processo di refinement e analizzando ogni stato prima di scrivere codice di produzione.

## Produrre di più o produrre più qualità

L'accelerazione ti permette di fare «di più», ma sei tu a decidere cosa sia quel «di più»:

- più quality gate;
- più tempo per scoprire e gestire i casi limite;
- più tempo per portare creatività nel processo.

L'obiettivo è riprenderti il tuo tempo e investirlo in ciò che conta davvero. Il codice ora si genera più in fretta: il tempo per curare ogni stato di errore c'è.

## Esplorare più soluzioni con prototipi interattivi

La barra qui sopra è un prototipo: il pannello a sinistra forza ogni esito, così ogni stato si può vedere e testare prima che esista una riga di codice di produzione.

Se vuoi iterare e testare un prototipo allo stesso modo, prova la skill `/prototype`. Costruisce varianti divergenti dello stesso pezzo di UI, ti fa scegliere la vincente e ne passa in rassegna gli stati prima che diventi una specifica. Come ui-sweep, fa parte di [brain-manager](https://www.npmjs.com/package/brain-manager): per usarla basta chiedere al proprio agente di installare solo questa skill.
