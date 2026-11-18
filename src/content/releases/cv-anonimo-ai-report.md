---
title: "CV e AI Report: meno lavoro manuale ed errori di anonimizzazione"
excerpt: "Due nuovi strumenti su SeVedemo: <strong>fino a 20 CV anonimi in un click</strong> e il report di un'offerta con le candidature ordinate per compatibilità."
published: "2026-11-17"
project: "SeVedemo"
cover:
  kind: video
  src: /releases/cv-report/cv-report.mp4
  poster: /releases/cv-report/copertina.png
  alt: "CV anonimo e Application AI Report: report di sei candidati anonimi con punteggio da 0 a 100"
metric:
  value: "20 CV"
  label: "anonimi in un click"
---

Copia, incolla, oscura il numero di telefono, rinomina il file, invia. Moltiplicalo per ogni candidato, ogni settimana, per decine di offerte al giorno.

Per rispondere a questo problema abbiamo rilasciato su [SeVedemo](https://www.linkedin.com/company/sevedemo/) due nuovi strumenti: l'**anonimizzatore di CV** e l'**AI Report** delle offerte di lavoro.

## Ridurre il lavoro manuale e mitigare gli errori di anonimizzazione

Preparare un CV anonimo a mano vuol dire aprire un file nuovo e copiare, uno alla volta, i blocchi che servono: esperienze, skill, formazione. Nome, email, telefono e città restano fuori, ma vanno cercati anche dentro la bio, dove spesso si ripetono.

Sono circa sei copia-incolla per CV. Con 20 candidati diventano 120, e il giorno dopo si ricomincia con un'altra offerta.

![Creazione manuale di un CV anonimo: 6 copia-incolla per CV, 120 per 20 CV](/releases/cv-report/1-a-mano.jpg)

## Anonimizza più profili per volta

Ora dalla lista candidature o dal tuo pool personale scegli i profili e scarichi un unico ZIP con i CV anonimi, fino a 20 alla volta.

Viene creato un PDF con formato standard per ogni CV, in cui vengono rimossi nome e contatti e la città viene ridotta a regione, garantendo la privacy del candidato. Il risultato è un profilo che evidenzia le competenze e l'esperienza del candidato, senza rivelare informazioni personali e con il logo della tua azienda: pronto per essere inviato al cliente.

![Sei candidature selezionate e lo ZIP con sei CV anonimi, nome e contatti rimossi](/releases/cv-report/2-anonimi.jpg)

## Analizzare un'offerta in pochi secondi

Il secondo strumento aiuta ad analizzare i candidati rispetto a un'offerta. Per ogni candidatura viene fornito un punteggio di compatibilità che valuta la pertinenza delle competenze, esperienze e tariffe del candidato generando un punteggio da 1 a 100.

Il risultato è un report che raccoglie fino a 50 candidature, ordinate per punteggio e filtrabili per stato di candidatura, creando così una shortlist anonima, ordinata per compatibilità.

![Da un'offerta con 50 candidature al report: candidati anonimi ordinati da 92 a 46](/releases/cv-report/3-report.jpg)

## L'LLM spiega, il codice controlla

Per ogni candidato l'LLM scrive una scheda: competenze tecniche, seniority, requisiti soddisfatti, disponibilità, soffermandosi sui punti di forza ed evidenziando i rischi. Il modello riceve il profilo anonimo e lavora solo su di esso, quindi vede competenze ed esperienze, non la persona.

Il commento rimane opzionale e non deve prevedere un fallimento, per questo prima del PDF il codice fa due controlli:

- **nessun dato personale**: l'LLM non può scrivere dati personali del candidato, né nome, né città, né contatti;
- **solo skill del profilo**: l'LLM non può attribuire al candidato competenze che non ha.

Se uno dei due fallisce c'è un nuovo tentativo; se fallisce ancora, la scheda esce con il solo punteggio, senza commento.

![Profilo anonimo con score 92 e la scheda dell'LLM, con i due controlli prima del PDF](/releases/cv-report/4-controlli.jpg)

## Un PDF cachato che risparmia token

Il report è un PDF statico che ha come obiettivo di essere approvato e inviato al cliente così com'è, o condiviso con i colleghi. Se nessuna modifica è stata apportata dal candidato o all'offerta stessa, il PDF viene cachato e non richiede ulteriori chiamate all'LLM. In questo modo si risparmiano token e tempo di elaborazione.

![Prima richiesta 19,9 s con 19 chiamate LLM, la stessa richiesta 0,18 s con 0 token](/releases/cv-report/5-salvato.jpg)

## Due strumenti per liberare tempo da dedicare alle relazioni

Nessuno di questi strumenti è pensato per scartare o selezionare candidati: la decisione resta a chi fa il recruiting. Servono a liberare persone e aziende dalla documentazione standard.

Ed è lì che vogliamo concentrare automazioni e uso dell'AI, con privacy e compliance come prossima area di intervento.

Per ora i due strumenti sono dietro feature flag, nei piani headhunter, team ed enterprise.

Provali su SeVedemo e dimmi cosa possiamo fare per restituirti tempo da dedicare alle relazioni e ai rapporti umani.
