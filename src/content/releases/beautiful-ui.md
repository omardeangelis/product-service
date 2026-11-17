---
title: "Beautiful UI means taking care of every state"
excerpt: "Loading, empty, error, partial, offline. Acceleration lets you do <em>more</em>, but you are the one who decides what that more is."
published: "2026-11-10"
project: "SeVedemo"
cover:
  kind: video
  src: /releases/beautiful-ui/stati.mp4
  poster: /releases/beautiful-ui/poster.jpg
  alt: "The action bar of an AI-generated job offer going through loading, missing data, error, plan limit and success"
caseStudy: offerte-ai
lang: en
---

## Every state is part of the interface

Crafting beautiful interfaces for beautiful users means taking care of every state: loading, empty, error, partial, offline. The happy path is the screen you design first, but the other states are where people actually end up: when the network drops, when a field is missing, when their plan runs out.

The video shows the review step of a job offer written by an AI assistant. A single action bar carries every outcome the real system can return, and each one tells people what happened and what they can do next.

### Loading

![The bar lists the steps: creating the offer, then looking for matching freelancers](/releases/beautiful-ui/1-caricamento.jpg)

The bar says what is happening, step by step, instead of showing a spinner and nothing else.

### Partial

![Four fields are missing: rate, duration, commitment and location, each one a chip](/releases/beautiful-ui/2-dati-mancanti.jpg)

Four fields are missing. Each one is a chip that takes you straight to the field to fill in.

### Error

![The offer could not be created, the edits are still there, with a Retry button](/releases/beautiful-ui/3-errore.jpg)

The request failed, but nothing is lost: the edits are still there and retrying is one click away.

### Plan limit

![The plan's active-offer limit is reached, with a link to upgrade](/releases/beautiful-ui/4-limite-piano.jpg)

Not an error: the draft is saved and the way forward is an upgrade, not a dead end.

### Success

![Offer created, and the matching profiles are on their way](/releases/beautiful-ui/5-riuscita.jpg)

A confirmation, and the next thing that is about to happen.

## What “more” should mean

Acceleration allows you to do “more”, but you are the one who decides what that “more” is. In my view it means:

- more quality gates;
- more time to discover and handle edge cases;
- more time to bring creativity into the process.

The goal is to take back your time and invest it in what you believe matters most, instead of empty productivity or busywork. Faster code generation does not make an error state less important; it just leaves you with no excuse to skip it.

## Try it: the /prototype skill

The bar above is a prototype: the panel on the left forces each outcome, so every state can be seen and tested before a line of production code exists.

If you want to iterate on and test a prototype the same way, try the `/prototype` skill. It builds divergent variants of the same piece of UI, lets you pick a winner and sweeps through its states before it turns into a spec. It is part of [brain-manager](https://www.npmjs.com/package/brain-manager), and you do not need the whole package: ask your agent to install just this one skill.
