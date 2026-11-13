---
domain: _root
type: personas
links: ["[[index]]", "[[chore/product]]"]
created: 2026-11-12
updated: 2026-11-12
---

# Personas

Chi visita spatalo.tech e deve uscirne con una call prenotata. Il sito è una marketing page: lo leggono una o due volte, spesso da desktop durante l'orario di lavoro, decidendo se fidarsi di uno studio esterno. Fonte: indicazioni di Omar (2026-11-12).

## CTO di startup o scale-up

- **Chi è:** responsabile tecnico di un prodotto che deve correre per i prossimi 3–6 mesi, con un team interno sotto pressione o non ancora completo.
- **Cosa cerca:** capacità di consegna subito, senza i tempi e i rischi di un'assunzione. Vuole qualcuno che capisca il prodotto, non solo che esegua ticket.
- **Cosa lo convince:** codice reale già rilasciato (casi studio "Real shipped code" con metriche), qualità tecnica visibile, il primo deploy in produzione entro 5 giorni, il codice suo dal primo giorno, la possibilità di mettere in pausa o disdire.
- **Cosa lo fa andare via:** linguaggio da agenzia generico, promesse senza prove, prezzi nascosti, la sensazione di parlare con un commerciale invece che con chi scrive il codice.

## Agenzia di design

- **Chi è:** studio che progetta prodotti digitali per i propri clienti e ha bisogno di qualcuno che trasformi i suoi design in prodotto funzionante, rivendendolo con il proprio marchio (white label).
- **Cosa cerca:** un partner tecnico che rispetti il design fino al dettaglio (motion e interazioni compresi), si presenti al cliente a nome dell'agenzia e non gli porti via la relazione.
- **Cosa lo convince:** cura visiva e del motion del sito stesso (è la prova), prototipi interattivi, un prezzo prevedibile da poter ricaricare sul cliente, discrezione.
- **Cosa lo fa andare via:** un sito poco curato, un'implementazione che "approssima" il design, nessun segnale di saper lavorare dietro un altro marchio.

## Software house

- **Chi è:** azienda di sviluppo con più progetti che i suoi sviluppatori riescono a coprire; cerca capacità extra in white label per non rinunciare a lavori o non sforare le consegne.
- **Cosa cerca:** sviluppatori senior autonomi che entrino in un progetto avviato, seguano i suoi processi e scalino su e giù con i picchi.
- **Cosa lo convince:** abbonamento flessibile (pausa e disdetta libere), un unico referente, tempi di avvio brevi, stack e metodo dichiarati.
- **Cosa lo fa andare via:** vincoli contrattuali lunghi, l'impressione di un freelance che non regge un carico vero, nessuna indicazione su come si integra nei loro processi.

## Gap aperti

- Il copy attuale della home parla a "Scale-up / Agency / Startup" (`src/pages/index.astro`, sezione "per chi"): non nomina ancora le software house né il white label.
