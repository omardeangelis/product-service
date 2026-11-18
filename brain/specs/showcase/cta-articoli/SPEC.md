---
domain: showcase
type: spec
status: implemented
links: ["[[specs/showcase/log-articoli/SPEC]]", "[[personas]]", "[[chore/product]]", "[[chore/motion]]", "[[specs/showcase/showcase-specs]]", "[[specs/showcase/cta-articoli/REPORT]]"]
created: 2026-11-17
ingested: true
last_ingested: 2026-11-18
updated: 2026-11-18
---

# Spec: Le CTA negli articoli di release ("Firma" e banner intermedio)

---

## User input

> Negli articoli delle release mi sembra mancare una CTA finale, con un banner come negli altri. Anche uno generico che rimandi a prenotare una call.
>
> Vorrei anche poter inserire delle CTA intermedie con dei bannerini intermedi per provare a convertire.

> Per il bannerino intermedio mi piace offerta, anche è un buon testo. Vorrei vedere una variante in cui si alternino i testi di team e founder. La logica deve essere che se non ci sono slot founder liberi si deve fare upsell di team. Come testo per founder questo mi piace "Da 2.200 € al mese. Pausa e disdetta libere, il codice è tuo dal primo giorno." Invece per la CTA finale vorrei vedere altre variazioni di firma, mi sembrava interessante e vorrei vedere delle variazioni. Anche questo tipo di CTA non mi dispiace come invito [screenshot del banner «review gratuita» di /pricing]

> Tieni firma, mi sembra il più interessante. Vorrei che ci fosse come sottotesto dopo la firma: Product Engineer - 10 anni di release in produzione. Modifichiamo il testo della firma: In questi articoli e su LinkedIn racconto le release dei prodotti dei miei clienti. Vuoi lo stesso ritmo di rilasci per i tuoi prodotti ? Prenota una chiamata di 30 minuti: guardiamo insieme il prodotto e ti dico se posso aiutarti. Per il banner intermedio, ovviamente ne vorrei massimo uno per articolo. Per quello da partner mi paiceve il testo: "Da 2.200 € al mese. Pausa e disdetta libere, il codice è tuo dal primo giorno." Per il team: "Un team di senior a 5000€ per sprint: costruisci più veloce dei tuoi competitor, valida uno sprint per volta"

> Si crea la spec

---

## Context

Le pagine delle release (`/showcase/<slug>/`, da [[specs/showcase/log-articoli/SPEC]] AC13) finiscono con due bottoni senza contesto: «Prenota una call di 30 min» e, se c'è, «Leggi il caso studio completo». I casi studio e `/pricing` chiudono invece con un banner che invita alla call. Il sito ha una sola conversione, la call prenotata ([[chore/product]]), e la release è spesso la pagina dove arriva chi viene da ricerca, feed o LinkedIn senza passare dalla home.

Questa spec aggiunge due inviti in ogni release:
- **Firma**, in fondo: Omar firma l'articolo in prima persona e propone la call;
- **un banner intermedio**, uno solo per articolo, a metà del corpo: un'offerta concreta, Partner o Team.

Persone (da [[personas]]):
- **CTO di startup o scale-up**: legge la release come prova di ritmo. Il banner Partner gli dà il prezzo d'ingresso e le garanzie, quello Team la velocità di un team intero.
- **Agenzia di design** e **Software house**: arrivano spesso da ricerca o dal feed direttamente su una release. La Firma spiega chi scrive e cosa propone senza dover tornare in home.

Riferimento vivo, fino al 2026-11-18: il prototipo in `src/lab/cta-articoli/` (rotta dev-only `/lab/cta-articoli`, sull'articolo Jev), cancellato in T8 dopo l'implementazione, scelto da Omar il 2026-11-17 dopo tre round:
- `Firma.astro`: il banner finale;
- `Inline.astro`: i due testi del banner intermedio;
- `Harness.astro`: la regola Partner/Team, il punto d'inserimento e l'interruttore del lab (tasti `S` e `T`).

Le review UX e UI del vincitore (`ux-advisor`, `ui-reviewer`) e lo state sweep non sono stati fatti.

---

## Non-Goals

- **I casi studio** (`/case-study/<slug>/`): hanno già il loro banner finale e non ricevono il banner intermedio.
- **Il bottone «Prenota una call» della nav** e il pulsante flottante fuori dalle release: restano come sono. Sulle release il pulsante flottante cambia solo per AC12.
- **Scegliere il punto del banner intermedio dal Markdown** con un segnaposto: il punto è automatico (AC7, scelta di Omar).
- **Testi diversi per articolo** o per persona: i testi sono due, uguali per tutte le release.
- **Misurare le conversioni** dei banner: il sito non ha analytics.
- **Feed RSS e `/llms.txt`**: non portano il corpo degli articoli, quindi nessuno dei due banner ci finisce.

---

## Acceptance Criteria

**Banner finale: Firma**

- **AC1.** In fondo a ogni pagina release, al posto dei due bottoni di oggi, c'è la Firma. Contiene, nell'ordine:
  1. la foto di Omar ritagliata sul viso, in un cerchio, il nome del founder letto da `src/config.ts` («Omar De Angelis») e sotto il sottotitolo «Product Engineer · 10 anni di release in produzione»;
  2. il paragrafo «In questi articoli e su LinkedIn racconto le release dei prodotti dei miei clienti. Vuoi lo stesso ritmo di rilasci per i tuoi prodotti? Prenota una chiamata di 30 minuti: guardiamo insieme il prodotto e ti dico se posso aiutarti.»;
  3. il bottone «Prenota una call di 30 min» verso il link Cal di `src/config.ts`, in una scheda nuova;
  4. un link secondario: «Leggi il caso studio completo» verso il caso studio, se la release ne ha uno pubblicato; altrimenti «Altri articoli» verso `/showcase/`.
- **AC2.** La foto è decorativa (testo alternativo vuoto): gli screen reader leggono il nome una volta sola. Il viso si riconosce nel cerchio anche su uno schermo 2×: la foto ha almeno il doppio della risoluzione del cerchio.

**Banner intermedio**

- **AC3.** Una pagina release mostra al massimo un banner intermedio. Il banner sta nel corpo dell'articolo, tra due sezioni, e contiene un punto verde decorativo, il testo e il bottone «Prenota →» verso il link Cal, in una scheda nuova.
- **AC4.** Il banner ha uno di due testi:
  - **Partner**: «**Da 2.200 € al mese.** Pausa e disdetta libere, il codice è tuo dal primo giorno.»
  - **Team**: «**Un team di senior a 5.000 € per sprint:** costruisci più veloce dei tuoi competitor, valida uno sprint per volta.»

  I due prezzi vengono da `src/config.ts` (il «da» del Partner e il prezzo a sprint del Team): se cambia un prezzo lì, cambia anche nel banner.
- **AC5.** Quale testo compare:
  - con almeno uno slot Partner libero in `src/config.ts`, le release prendono a turno Partner e Team in ordine di data, dalla più vecchia (che prende Partner). Una release senza banner intermedio (AC7) salta il suo turno;
  - con gli slot Partner finiti, ogni release mostra Team;
  - pubblicare una release più recente di tutte non cambia il testo delle release già online, con gli slot invariati.
- **AC6.** Gli screen reader annunciano il banner come una regione complementare con un nome: «Piano Partner» o «Piano Team».
- **AC7.** Il banner sta subito prima del titolo di sezione a metà del corpo: con N titoli di secondo livello, prima del titolo numero ⌊N/2⌋+1. Nell'articolo Jev (7 titoli) sta prima di «Pulizia e sinonimi».
  - Una release con meno di 2 titoli di secondo livello non ha il banner intermedio: resta solo la Firma.
  - Tra il banner e il titolo che lo segue non c'è spazio doppio.
- **AC8.** Gli stili dei link del corpo dell'articolo (colore accent, sottolineato) non si applicano al bottone del banner, né ad altri bottoni dentro il corpo.

**Larghezze, motion, assenza di JavaScript, pulsante flottante**

- **AC9.** Da 280 a 1440 px, a 1× e 1,25×, nessuno dei due banner fa scorrere la pagina in orizzontale e nessun testo è tagliato. Fino a 600 px il banner intermedio va a capo: il testo occupa tutta la riga accanto al punto, il bottone scende sotto, allineato al testo.
- **AC10.** Senza JavaScript entrambi i banner sono visibili e i loro link funzionano: lo stato nascosto dell'entrata lo applica lo script, come in [[specs/showcase/log-articoli/SPEC]] AC30.
- **AC11.** Le entrate seguono il motion brief qui sotto. Con `prefers-reduced-motion: reduce` nulla si sposta: la Firma resta identica, il banner intermedio fa solo la dissolvenza.
- **AC12.** Sulle release il pulsante flottante «Prenota 30 minuti →» sparisce quando la Firma è in vista e ricompare quando si torna sopra la Firma. Non copre mai il bottone della Firma, da 280 a 1440 px.

---

## Motion brief

**Entrata della Firma**
- **Verdict:** anima, solo opacità.
- **Trigger:** il 15% del blocco entra nello schermo.
- **Frequency:** una volta per visita.
- **Purpose:** la firma arriva in chiusura con calma, senza staccarsi dall'articolo.
- **Enter:** `opacity` 0→1. Nessuno spostamento.
- **Exit:** nessuna.
- **Easing:** `--ease-out`.
- **Duration:** `--dur-swap`.
- **Interrupt:** non si ripete.
- **Reduced motion:** uguale, perché non c'è spostamento.

**Entrata del banner intermedio**
- **Verdict:** anima, come gli altri reveal del sito.
- **Trigger:** il 15% del banner entra nello schermo.
- **Frequency:** una volta per visita.
- **Enter:** `opacity` 0→1 e `translateY(24px)`→0 (la classe `.reveal` di `src/styles/global.css`).
- **Easing:** `--ease-out-expo`.
- **Duration:** `--dur-reveal` (700ms), deviazione già scritta in [[chore/motion]] per i reveal.
- **Interrupt:** non si ripete.
- **Reduced motion:** sola dissolvenza, `--dur-swap` lineare (regola globale di `.reveal`).

**Bottone «Prenota →» del banner**
- **Enter:** alla pressione `scale(0.97)` in `--dur-press` `--ease-press`; il bottone della Firma usa il `.btn-primary` del sito.
- **Reduced motion:** niente scala.

**Pulsante flottante sulle release (AC12)**
- Riusa l'uscita e l'entrata che ha già (la classe `.show` di `Base.astro` e `global.css`): nessuna curva o durata nuova.

**Assumed:** nessuno; tutti i valori sono quelli del prototipo approvato.

---

## Constraints

- Sito statico: la scelta Partner/Team e il punto del banner si decidono in build. Quando cambiano gli slot in `src/config.ts`, il banner cambia al deploy successivo.
- Link Cal, nome del founder, prezzi e slot si leggono da `src/config.ts`, mai scritti nel componente (convenzione del repo).
- Motion solo con i token `--ease-*` e `--dur-*` di `src/styles/global.css`.
- Le pagine `.astro` restano senza JavaScript di framework.
- Non verificato nel prototipo: Mobile Safari, screen reader reali, la riduzione del movimento emulata (il pannello del browser non la supportava).

---

## Technical Notes

Valori del prototipo approvato, da tenere esatti:
- **Firma** (`src/lab/cta-articoli/Firma.astro`):
  - colonna larga al massimo 840px come il corpo, padding sezione `8px 0 96px`;
  - filetto `1px var(--line)` sopra, poi 40px;
  - avatar 48px tondo (nel prototipo le iniziali su `var(--ink)`; in produzione la foto, ritagliata sul viso, almeno 96×96 px);
  - nome in grassetto, sottotitolo `var(--muted)` a `.9rem`;
  - paragrafo `var(--ink)` a 1.15rem, interlinea 1.65, largo al massimo 640px;
  - azioni a 28px dal paragrafo, distanza `12px 24px`, link secondario `var(--muted)` 600 che diventa `var(--ink)` all'hover.
- **Banner intermedio** (`src/lab/cta-articoli/Inline.astro`):
  - margine verticale 36px, padding `14px 16px 14px 18px`, raggio 16px;
  - fondo `var(--accent-soft)`, bordo `1px #dde3ff`;
  - testo `var(--muted)` a `.95rem`, interlinea 1.5, parte in grassetto `var(--ink)`;
  - punto 8px `var(--ok)` con alone `0 0 0 4px var(--ok-soft)`;
  - bottone `var(--accent)` con testo bianco 600 a `.9rem`, padding `9px 16px`, a pillola;
  - sotto i 600px: il punto scende di 7px, il bottone rientra di 22px.
- Oggi la regola `.articolo-corpo :global(a)` di `src/pages/showcase/[slug].astro:93` colora ogni link del corpo: nel prototipo è ristretta a paragrafi ed elenchi (AC8).
- Il prototipo alterna con la posizione della release contata dalla più recente: così ogni nuova release cambia il testo di tutte le altre. AC5 conta dalla più vecchia, quindi le nuove si aggiungono in fondo senza spostare i turni. Oggi tutte e 6 le release hanno almeno 3 titoli di sezione.
- Il prototipo inserisce il banner con JavaScript. AC10 chiede che sia nell'HTML della build.
- «10 anni» è confermato da [[chore/product]] («10 anni di esperienza»).

---

## Open Questions

Nessuna. Le tre domande della prima stesura le ha chiuse Omar il 2026-11-17 (vedi Decision Log).

---

## Decision Log

| Decision | Rationale |
|----------|-----------|
| Banner finale «Firma» (scelto al round 3 su Coerente, Offerta, Review, Lettera e Scheda) | Voce in prima persona, cornice minima: è Omar che racconta le release, la chiusura continua l'articolo invece di cambiare registro. |
| Banner intermedio «Offerta» (round 2), uno solo per articolo (round 3) | Un'offerta concreta a metà lettura; più di un banner farebbe pesare la vendita sul contenuto. |
| Con slot Partner liberi, Partner e Team si alternano tra articoli; con slot finiti, sempre Team | Richiesta di Omar: niente promozione di un piano che non si può comprare, upsell sul Team. |
| Sottotitolo con «·» invece di «-» | Il punto in mezzo è il separatore usato nel resto del sito («data · progetto»). |
| «prodotti?» senza spazio prima del punto di domanda | Correzione tipografica del testo di Omar. |
| Prezzo Team scritto «5.000 €» e letto da `src/config.ts` | Stesso formato degli altri prezzi del sito; un prezzo solo in un posto solo ([[specs/sito/un-posto-solo/SPEC]]). |
| «Altri articoli» verso `/showcase/` quando la release non ha un caso studio | La Firma ha sempre un'uscita secondaria; oggi senza caso studio resta un bottone solo. |
| Questa spec sostituisce la parte «In fondo c'è…» di [[specs/showcase/log-articoli/SPEC]] AC13 | La chiusura della release ora è la Firma (AC1). |
| Punto del banner intermedio automatico, prima del titolo a metà (AC7) | Omar, 2026-11-17: nessun lavoro per articolo; un segnaposto nel Markdown resta un'aggiunta futura. |
| Foto di Omar al posto delle iniziali (AC1, AC2) | Omar, 2026-11-17: ha mandato la foto di un suo talk al Talent Garden, da ritagliare sul viso. |
| Sulle release il pulsante flottante sparisce quando la Firma è in vista (AC12) | Omar, 2026-11-17: due inviti uguali uno sopra l'altro non servono, e su telefono il flottante può coprire il bottone della Firma. |
