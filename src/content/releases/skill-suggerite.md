---
title: "Skill suggerite su SeVedemo: il giusto peso a ogni competenza"
excerpt: "SeVedemo ora divide le skill di un profilo per pertinenza e le aggiorna nel tempo. <strong>Quelle che confermi tu pesano di più</strong> di quelle proposte dall'LLM."
published: "2026-10-20"
project: "SeVedemo"
cover:
  kind: video
  src: /releases/skill-suggerite/skill-suggerite.mp4
  poster: /releases/skill-suggerite/copertina.png
  alt: "Skill suggerite su SeVedemo: peso in ricerca 0,64 per una skill suggerita, 1,00 per una confermata, 0 per una rifiutata"
metric:
  value: "× 1,00"
  label: "il peso di una skill che confermi tu"
---

Non è mai banale far vedere il lavoro che si fa sul backend. Su [SeVedemo](https://www.linkedin.com/company/sevedemo/) passiamo molto tempo a rifinire il modo in cui mappiamo le competenze di un professionista, e il criterio su cui investiamo di più è la **pertinenza**.

Con questa release SeVedemo segue meglio come cambia un professionista nel tempo: quali competenze si consolidano, quali evolvono e quali vengono lasciate indietro.

Al centro resta la persona. Le competenze confermate da chi ha il profilo pesano di più di quelle estratte da un LLM, perché la ricerca non deve diventare una gara a chi scrive il profilo migliore per una macchina.

## Da una lista piatta a tre fasce

Le skill arrivano da tre fonti: il CV caricato, l'import del profilo LinkedIn o quello che il freelance scrive a mano. Prima finivano tutte in una lista piatta, sullo stesso piano, senza distinzioni.

Ora ogni skill viene confrontata con il profilo (bio, esperienze e formazione) e finisce in una di tre fasce:

- **pertinenti**: dichiarate o confermate, entrano di default e pesano **× 1,00**;
- **affini**: dedotte dall'LLM, pesano **× 0,75** finché il freelance non le approva o le scarta;
- **non pertinenti**: escluse o rifiutate, non contano in ricerca.

![Prima e ora: le skill estratte da CV, LinkedIn o a mano divise in pertinenti, affini e non pertinenti](/releases/skill-suggerite/1-fasce.jpg)

## Un profilo che si aggiorna

Il profilo non si estrae una volta sola. Quando cambia qualcosa (un nuovo sync con LinkedIn, un'esperienza in più, un CV con un corso nuovo, una bio riscritta) SeVedemo rilegge cosa è cambiato e propone le nuove affini.

Le proposte si rinnovano a ogni estrazione, mentre le scelte del freelance restano: una skill rifiutata non torna più. Nell'esempio del video, in sei mesi e quattro estrazioni un profilo da designer passa da 4 a 9 skill pertinenti, man mano che si sposta verso il motion, il 3D e il ruolo di design lead.

![Quattro estrazioni in sei mesi: a ogni aggiornamento del profilo cambiano le affini proposte e crescono le pertinenti](/releases/skill-suggerite/2-aggiornamento.jpg)

## Decidi una volta

Le skill compatibili compaiono in una sezione che vede solo il freelance. Con **+** entrano fra le sue skill, con **×** non vengono più riproposte.

Ogni skill ha un nome solo: «Usability Tests» diventa «usability testing», e una skill che è già nel profilo non viene proposta di nuovo. Così il nome combacia più facilmente con quello che cerca il recruiter, e spariscono i duplicati e le skill scritte male.

![La sezione competenze con le skill aggiunte, i pulsanti per confermare o rifiutare e lo stato di ogni skill dopo il salvataggio](/releases/skill-suggerite/3-conferma.jpg)

## Il peso in ricerca

Quando un recruiter cerca una competenza, ogni skill del profilo contribuisce così:

> contributo = 0,85 × similarità × peso, + 0,15 se il nome è esatto

Una skill suggerita ti fa trovare, ma più in basso (0,64 nell'esempio). La stessa skill confermata arriva a 1,00, e una rifiutata non conta. La conferma del freelance conta più di qualsiasi suggerimento.

C'è anche un tetto: al massimo 30 competenze per profilo, per evitare profili gonfiati di skill.

![Ricerca di «prototyping»: contributo 0,64 da suggerita, 1,00 da confermata, 0 da rifiutata, e il tetto di 30 competenze](/releases/skill-suggerite/4-peso.jpg)

## In breve

- estrazioni più efficaci, da CV, LinkedIn o a mano;
- niente più duplicati né skill scritte male;
- una pertinenza e un peso per ogni skill;
- l'intervento umano ha sempre la priorità.

L'LLM propone, il freelance decide, la ricerca pesa.
