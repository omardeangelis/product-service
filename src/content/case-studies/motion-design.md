---
title: "UX e animazioni per creare un prodotto che gli utenti vogliono usare."
excerpt: "Rifinire l'esperienza non è quasi mai la priorità: le animazioni sembrano un lusso, il feedback visivo qualcosa che si fa «dopo». Eppure è proprio lì che si gioca la differenza tra un prodotto che si deve usare e uno che si vuole usare. Questa è la storia di una rifinitura sistematica del movimento — e non te la racconto soltanto: le demo sono vive, si cliccano."
tags: ["Real shipped code", "Talent platform · SaaS", "UX & motion engineering"]
order: 4
draft: false

home:
  tag: "Talent platform · Motion"
  title: "UX e animazioni: un prodotto che gli utenti vogliono usare."
  problem: "Bottoni muti al tocco, popover comparsi a mezz'aria, tendine distrutte di colpo: l'app funzionava, ma l'esperienza restava grezza — e l'utente, non vedendo risposta, premeva di nuovo."
  solution: "Una curva sola come filo conduttore, feedback a ogni tocco, uscite animate e rispetto del reduced motion: un'interfaccia che risponde, un'esperienza più fluida. Nel caso studio le demo sono vive: si cliccano."
  metrics:
    - value: "162"
      label: "file rifiniti toccando un solo componente"
    - value: "160ms"
      label: "di feedback a ogni tocco"

meta:
  cliente: "SeVedemo · Talent platform"
  ruolo: "Product Engineer"
  durata: "1 mese"
  stack: "Solid.js · Motion · Kobalte · Tailwind"

contesto:
  heading: "Spostare il focus sull'utente."
  paragraphs:
    - "Dopo mesi passati a costruire feature, la piattaforma funzionava — ma rifinire l'esperienza non era mai stata la priorità. Eppure anche un prodotto digitale è un oggetto fisico: pop-up, bottoni e modali nascono da qualche parte, reagiscono quando li tocchi, si spostano, escono di scena. Il movimento è l'informazione che li tiene insieme — dice da dove nasce una cosa, dove va, cosa è cambiato — e quando manca l'utente fa più fatica, anche se non sa dirlo."

problema:
  heading: "L'utente non riceveva le giuste risposte."
  intro: "Prima di scrivere una riga di CSS ho fatto un censimento del movimento esistente: cosa si muoveva, con quale curva, e cosa spariva e basta. Il quadro era coerente — nel senso peggiore: quasi tutto usava i default del browser, o niente."
  items:
    - title: "Nessuna risposta visiva."
      text: "In tutta l'app non esisteva un solo stato attivo sui bottoni: premere non produceva alcuna reazione. Su mobile, o con la rete lenta, l'utente non aveva modo di sapere se il click fosse arrivato — e premeva di nuovo."
    - title: "Elementi che si muovevano in modo innaturale."
      text: "Menu, tooltip e popover si espandevano dal proprio centro, materializzati a mezz'aria, staccati dal pulsante premuto. Le tendine entravano con l'easing di default e in chiusura venivano distrutte all'istante — nell'ATS il pannello si svuotava prima ancora di sparire. Niente si muoveva come farebbe un oggetto reale."
    - title: "Accessibilità e performance."
      text: "La preferenza «riduci movimento» era ignorata o applicata a caso, gli item della sidebar compressa restavano senza tooltip, i menu lunghi sforavano il bordo dello schermo. E <em>transition-all</em> animava qualunque proprietà, comprese quelle che costringono il browser a ricalcolare il layout a ogni frame."

risultati:
  heading: "Pochi numeri, tanta differenza sotto il dito."
  cards:
    - { pre: "", from: 0, to: 162, post: "", label: "file hanno guadagnato il feedback al tocco grazie a un solo componente condiviso" }
    - { pre: "", from: 0, to: 200, post: "ms", label: "di uscita di scena per le tendine, sulla stessa curva con cui entrano" }
    - { pre: "0", post: "", label: "transition-all rimasti nel codice: liste esplicite, solo proprietà che la GPU anima senza ricalcolare il layout" }
  note: "Il risultato vero di una rifinitura non sta in un funnel: sta nel fatto che <strong>l'interfaccia adesso risponde.</strong> Per questo, poco più sotto, il caso studio non si legge soltanto: le demo sono vive, con le stesse curve e le stesse durate andate in produzione. Si cliccano."

soluzione:
  heading: "Rendere il movimento portatore di informazioni."
  intro: "Il principio alla base di ogni intervento: <strong>il movimento deve dare un'informazione</strong> — da dove nasce una cosa, dove va, cosa è cambiato — mai attirare l'attenzione su di sé. Il filo conduttore è una curva sola, quella delle tendine di iOS: parte decisa, si posa morbida. Definita una volta nei token, usata ovunque."
  items:
    - title: "Un vocabolario di movimento condiviso."
      text: "Due curve con un nome — <em>ease-drawer</em> per pannelli e tendine, un ease-out deciso per i micro-feedback — e durate standard: 160ms per il tocco, 200ms per le uscite, 300ms per i cambi di layout. Le decisioni si prendono una volta sola, non componente per componente."
    - title: "Componenti condivisi, non pagine."
      text: "Il feedback al tocco è entrato nel bottone base usato da 162 file: un intervento in un punto solo ha rifinito tutta l'app. Stessa logica per menu, popover, select e tendine: si sistema l'origine, non le mille istanze."
    - title: "Le uscite esistono."
      text: "Un pannello che si chiude deve uscire di scena, non essere distrutto: il contenuto sopravvive alla chiusura quel tanto che basta — 200ms — per scivolare via sulla stessa curva con cui è entrato. Chiudere ha un verso, non è più un taglio in montaggio."

motion:
  heading: "Perché parlare quando puoi provare?"
  intro: "Il movimento non si può valutare da uno screenshot. Queste cinque demo ricreano gli interventi principali con i valori reali andati in produzione — stesse curve, stesse durate, stesse origini. Gli scenari sono separati: prova il <em>prima</em>, poi il <em>dopo</em>, e senti la differenza."
  curve:
    value: "cubic-bezier(0.32, 0.72, 0, 1)"
    caption: "La curva delle tendine di iOS: parte decisa, si posa morbida. È il filo conduttore di tutti gli interventi."
  items:
    - eyebrow: "Bottoni · feedback al tocco"
      title: "Adesso rispondono quando li premi."
      before: "Nessun feedback al tocco: in tutta l'app non esisteva un solo stato <code>:active</code>. Su mobile, o con la rete lenta, premere sembrava non fare nulla finché non cambiava schermata."
      after: "Il bottone condiviso — quello usato da 162 file — si comprime a <code>scale 0.97</code> mentre lo tieni premuto, in 160ms. Un cenno, non un salto: l'interfaccia ti ha sentito."
      demo: "press"
      demoLabel: "Demo · tieni premuto ciascun bottone"
      demoNote: "valori reali: 160ms · cubic-bezier(0.23, 1, 0.32, 1)"
    - eyebrow: "Menu · tooltip · popover · select"
      title: "Crescono dal punto in cui li apri."
      before: "Comparivano espandendosi dal proprio centro — come materializzati a mezz'aria, staccati dal pulsante premuto."
      after: "Si espandono a partire dal loro <code>transform-origin</code> reale: sembrano nascere dal bottone che hai toccato."
      demo: "origin"
      demoLabel: "Demo · clicca uno scenario per volta"
      demoNote: "rallentata ed esagerata per rendere visibile il punto di partenza"
    - eyebrow: "Tendine · drawer · sheet"
      title: "La curva di iOS, non l'easing di default."
      before: "Easing generico del browser: un movimento un po' meccanico, che parte e finisce piatto."
      after: "La curva <code>ease-drawer</code>: scatto iniziale deciso e atterraggio morbido. La sensazione fisica delle tendine di iOS."
      demo: "easing"
      demoLabel: "Demo · apri prima una, poi l'altra"
      demoNote: "stessa durata (460ms, rallentata): cambia solo la curva"
    - eyebrow: "Tendine · chiusura"
      title: "E adesso escono, invece di sparire."
      before: "In chiusura la tendina svaniva di colpo: chiudere e buttare via il contenuto erano la stessa cosa, nello stesso istante, e il pannello veniva distrutto prima di poter scivolare via. Nell'ATS andava anche peggio: usciva vuota."
      after: "Il pannello sopravvive alla chiusura quel tanto che basta per uscire di scena: <code>200ms</code> sulla stessa curva con cui è entrato, contenuto ancora al suo posto."
      demo: "exit"
      demoLabel: "Demo · apri, poi richiudi ciascuna"
      demoNote: "durata reale: 200ms — la differenza è tutta nel secondo clic"
    - eyebrow: "Barra laterale"
      title: "Si comprime tutta in un colpo solo."
      before: "La compressione avveniva in tre tempi: l'icona saltava al centro, il titolo di sezione lasciava uno spazio vuoto, gli item compressi restavano senza tooltip."
      after: "Barra e contenuto si muovono all'unisono: l'icona resta ferma, il titolo si richiude in altezza, l'etichetta sfuma. E ogni item compresso mostra il suo tooltip."
      demo: "sidebar"
      demoLabel: "Demo · clicca la barra per comprimerla"
      demoNote: "barra e contenuto all'unisono, in 300ms"
  outro: "Se hai «riduci movimento» attivo, queste demo si adeguano da sole: resta la dissolvenza, sparisce lo spostamento. Esattamente come fa l'app."

tech:
  heading: "Stack, curve di animazione e come sono implementate."
  intro: "Lo stack è <strong>Solid.js</strong>, con <strong>Kobalte</strong> per le primitive dei componenti — popover, select, tooltip: accessibili, e con gli stati giusti da animare — e <strong>Motion</strong> dove una transition non basta. Ma il cuore è il vocabolario di token che rende le scelte ripetibili: i valori che senti nelle demo qui sopra sono questi."
  items:
    - title: "Il vocabolario in design token."
      text: "Due curve con un nome e tre durate standard. La differenza tra un'interfaccia curata e una animata a caso è tutta qui: le decisioni di motion si prendono una volta sola, poi si riusano."
      deepDive:
        label: "DeepDive · i token del movimento"
        blocks:
          - title: "Le curve e le durate, definite una volta"
            lang: "css"
            code: |
              :root {
                /* la curva delle tendine di iOS: parte decisa, si posa morbida */
                --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
                /* ease-out deciso per i micro-feedback (press, hover) */
                --ease-out-strong: cubic-bezier(0.23, 1, 0.32, 1);

                --dur-press: 160ms;  /* feedback al tocco */
                --dur-exit: 200ms;   /* uscite di scena */
                --dur-layout: 300ms; /* sidebar e cambi di layout */
              }
    - title: "Il feedback al tocco sul bottone condiviso."
      text: "La proprietà <em>scale</em> indipendente, non <em>transform</em>: si compone con qualunque transform già presente sul bottone senza sovrascriverla. 160ms in entrata e in uscita: un cenno, non un salto."
      deepDive:
        label: "DeepDive · lo stato :active"
        blocks:
          - title: "Un solo componente, 162 file rifiniti"
            lang: "css"
            code: |
              .button {
                transition:
                  background-color var(--dur-press) var(--ease-out-strong),
                  scale var(--dur-press) var(--ease-out-strong);
              }

              .button:active {
                scale: 0.97; /* la proprietà indipendente: non tocca il transform esistente */
              }
    - title: "L'uscita che sopravvive allo smontaggio."
      text: "Un componente che si smonta alla chiusura non lascia niente da animare. Le primitive Kobalte lo gestiscono da sole: tengono vivo il nodo finché l'animazione di chiusura non è conclusa. Per i pannelli custom il pattern è questo: la chiusura diventa uno stato intermedio che tiene in vita pannello e contenuto per i 200ms dell'uscita; lo smontaggio vero arriva solo a transizione conclusa."
      deepDive:
        label: "DeepDive · il pattern dell'uscita, ridotto all'osso"
        blocks:
          - title: "Lo stato closing guida la transizione"
            lang: "css"
            code: |
              .drawer[data-state='open'] {
                transform: translateX(0);
                transition: transform var(--dur-exit) var(--ease-drawer);
              }

              .drawer[data-state='closing'] {
                transform: translateX(100%); /* stessa curva dell'ingresso, al contrario */
                transition: transform var(--dur-exit) var(--ease-drawer);
              }
          - title: "Lo smontaggio aspetta la fine della transizione"
            lang: "tsx"
            code: |
              const [state, setState] = createSignal<'open' | 'closing' | 'closed'>('open');

              // chiudere non smonta: passa per lo stato intermedio
              const close = () => setState('closing');

              // il contenuto resta al suo posto per i 200ms dell'uscita;
              // solo a transizione conclusa il pannello viene smontato davvero
              const onTransitionEnd = () => {
                if (state() === 'closing') setState('closed');
              };
    - title: "Niente più transition-all, e il reduced motion come regola."
      text: "Liste esplicite di proprietà: transform e opacity, ciò che il compositor anima senza ricalcolare il layout. E con «riduci movimento» attivo lo spostamento sparisce, la dissolvenza resta: l'informazione «qualcosa è apparso» non si perde mai."
      deepDive:
        label: "DeepDive · proprietà giuste e reduced motion"
        blocks:
          - title: "Meno movimento, non zero movimento"
            lang: "css"
            code: |
              @media (prefers-reduced-motion: reduce) {
                .popover {
                  /* la dissolvenza resta: qualcosa è apparso */
                  animation: fade-in var(--dur-press) linear;
                  /* lo spostamento no */
                  transform: none;
                }
              }

sfide:
  heading: "Ridisegnare la gestione dello stato e generalizzare l'intervento."
  paragraphs:
    - "<strong>Le uscite si scontrano con il ciclo di vita dei componenti.</strong> Un pannello smontato nell'istante stesso in cui si chiude non lascia niente da animare: per questo le tendine sparivano di colpo. Per arrivare all'obiettivo ho dovuto riorganizzare la gestione dello stato — in meglio: la chiusura è diventata uno stato esplicito del componente, non un evento istantaneo, che tiene in vita pannello e contenuto per i 200ms dell'uscita; lo smontaggio arriva solo a transizione conclusa. Nell'ATS, dove la tendina si svuotava prima ancora di chiudersi, la stessa riorganizzazione ha risolto anche quello."
    - "<strong>Generalizzare senza rompere niente.</strong> Il punto non era mai il singolo componente: era ridefinire i primitivi condivisi — bottone, popover, select, tendine — perché ogni rifinitura si propagasse da sola a tutta l'app e restasse mantenibile nel tempo. Ogni modifica è stata additiva — uno stato attivo, una curva nei token, mai un cambio di layout — e i cinque piani sono stati chiusi uno alla volta, con i fix successivi emersi da review e da uso reale. Così un intervento in un punto solo ha rifinito 162 file."

primaDopo:
  statLabel: "File ed elementi con animazioni curate"
  before:
    stat: "0"
    width: "4%"
    items:
      - "Nessuno stato attivo in tutta l'app"
      - "Popover e menu materializzati a mezz'aria"
      - "Tendine distrutte all'istante, senza uscita di scena"
      - "transition-all ovunque e reduced motion ignorato"
  after:
    stat: "162+"
    width: "100%"
    items:
      - "scale 0.97 in 160ms su ogni bottone, da un solo componente condiviso"
      - "Menu e popover nascono dal punto in cui li apri"
      - "Uscite di 200ms sulla stessa curva dell'ingresso"
      - "Solo transform e opacity, e chi chiede meno movimento lo ottiene"

cta:
  heading: "Crea un prodotto che i tuoi utenti vogliono usare."
  text: "30 minuti davanti alla tua interfaccia: ti dico onestamente dove il movimento dà informazione e dove invece manca."
---
