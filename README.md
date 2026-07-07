# Personal site — prototipo

Prototipo statico del sito personale di Omar De Angelis — **Freelance Product Engineer**.

Tre pagine HTML self-contained (CSS e JS inline, nessuna dipendenza, nessuna build):

| Pagina | Contenuto |
|---|---|
| [`index.html`](index.html) | Homepage: hero, come lavoro, modello ad abbonamento, confronto, vetrina progetti con scroll orizzontale pinnato, prezzi, FAQ |
| [`case-study.html`](case-study.html) | Template della pagina caso studio: problema → soluzione → risultati, con funnel chart animato, count-up e prima/dopo |
| [`pricing.html`](pricing.html) | Pagina prezzi dedicata: piani Solo/Team, MVP e a progetto, garanzia, FAQ |

## Come vederlo

Basta aprire `index.html` nel browser — oppure:

```sh
npx serve .
```

## Note per chi lo guarda

- È un **prototipo di design**: tutti i numeri, i casi studio, le metriche e le testimonianze sono **placeholder**.
- La vetrina in homepage blocca lo scroll verticale e lo converte in orizzontale (desktop); su mobile e con `prefers-reduced-motion` degrada a carosello swipe nativo.
- Feedback benvenuti su: gerarchia dei contenuti, tono di voce, pricing, animazioni (troppe? poche?).
