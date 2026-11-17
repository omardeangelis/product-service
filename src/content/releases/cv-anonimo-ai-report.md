---
title: "CV anonimo e AI Report: meno documenti da preparare a mano su SeVedemo"
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

## Il lavoro che nessuno vuole fare

Preparare un CV anonimo a mano vuol dire aprire un file nuovo e copiare, uno alla volta, i blocchi che servono: esperienze, skill, formazione. Nome, email, telefono e città restano fuori, ma vanno cercati anche dentro la bio, dove spesso si ripetono.

Sono circa sei copia-incolla per CV. Con 20 candidati diventano 120, e il giorno dopo si ricomincia con un'altra offerta.

![Creazione manuale di un CV anonimo: 6 copia-incolla per CV, 120 per 20 CV](/releases/cv-report/1-a-mano.jpg)

## CV anonimi, tutti insieme

Ora dalla lista candidature scegli i profili e scarichi un unico ZIP con i CV anonimi, fino a 20 alla volta.

Da ogni PDF escono nome e contatti, e la città resta solo come regione. Restano skill, esperienze e formazione, e il PDF esce con il tuo logo, pronto da mandare al cliente.

![Sei candidature selezionate e lo ZIP con sei CV anonimi, nome e contatti rimossi](/releases/cv-report/2-anonimi.jpg)

## Il report di un'offerta in pochi secondi

Il secondo strumento parte dall'offerta. Ogni candidatura viene confrontata con le skill richieste e con la tariffa, e riceve un punteggio da 0 a 100. Il punteggio lo calcola il codice, non l'LLM: così due report sulla stessa offerta ordinano i candidati allo stesso modo.

Il report raccoglie fino a 50 candidature, le prime per punteggio, e prima puoi filtrarle per stato. Ne esce una shortlist anonima, ordinata per compatibilità.

![Da un'offerta con 50 candidature al report: candidati anonimi ordinati da 92 a 46](/releases/cv-report/3-report.jpg)

## L'LLM spiega, il codice controlla

Per ogni candidato l'LLM scrive una scheda: competenze tecniche, seniority, quanti requisiti copre, disponibilità, punti di forza, gap e rischi, e una sintesi in una riga. Lavora solo sul profilo già anonimo, quindi vede competenze ed esperienze, non la persona.

Il commento resta testo libero, e per questo prima del PDF il codice fa due controlli:

- **nessun dato personale** nel testo;
- **solo skill del profilo**: l'LLM non può attribuire al candidato competenze che non ha.

Se uno dei due fallisce c'è un nuovo tentativo; se fallisce ancora, la scheda esce con il solo punteggio, senza commento.

![Profilo anonimo con score 92 e la scheda dell'LLM, con i due controlli prima del PDF](/releases/cv-report/4-controlli.jpg)

## Un PDF salvato, che risparmia token

Il report è un solo PDF con il tuo logo, da inviare al cliente così com'è o da condividere con i colleghi. Ne salviamo una copia per offerta e per azienda.

Nelle nostre misure su 19 candidati la prima richiesta fa 19 chiamate all'LLM e richiede 19,9 secondi. Se poi nulla è cambiato, la stessa richiesta torna in 0,18 secondi, con zero chiamate e zero token. Se cambia un candidato, si rigenera solo la sua scheda.

![Prima richiesta 19,9 s con 19 chiamate LLM, la stessa richiesta 0,18 s con 0 token](/releases/cv-report/5-salvato.jpg)

## Non per scartare, ma per liberare tempo

Nessuno di questi strumenti è pensato per scartare o selezionare candidati: la decisione resta a chi fa il recruiting. Servono a liberare persone e aziende dalla documentazione standard.

Ed è lì che vogliamo concentrare automazioni e uso dell'AI, con privacy e compliance come prossima area di intervento.

Per ora i due strumenti sono dietro feature flag, nei piani headhunter, team ed enterprise.

Provali su SeVedemo e dimmi cosa possiamo fare per restituirti tempo da dedicare alle relazioni e ai rapporti umani.
