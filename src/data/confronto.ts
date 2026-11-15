/*
 * Dati e logica della board "Confronto": 4 corsie x 4 colonne, 3 sprint da 10 giorni lavorativi.
 * Modulo puro: lo importano sia il componente Astro (build) sia lo script nel browser.
 */
import { GUARANTEE } from '../config.ts';

export const SPRINTS = 3;
export const SPRINT_DAYS = 10;
/** millisecondi di animazione per giorno lavorativo */
export const MS_PER_DAY = 150;

export const COLUMNS = ['Da fare', 'In corso', 'In review', 'In produzione'] as const;

export const LANES = [
  { key: 'pe', name: 'Product Engineer', sub: 'in abbonamento', seedStatus: 'Kickoff fatto, si parte' },
  { key: 'freelancer', name: 'Freelancer', sub: 'classico', seedStatus: 'Cerco un freelancer' },
  { key: 'agenzia', name: 'Agenzia', sub: '', seedStatus: 'Richiesta di preventivo' },
  { key: 'assunzione', name: 'Assunzione', sub: 'interna', seedStatus: 'Annuncio pubblicato' },
] as const;

export const SEED_CODE = 'ONB-142';
export const SEED_TITLE = 'Nuovo onboarding';

export type Ev = {
  d: number;
  id: string;
  col?: number;
  st?: string;
  warn?: boolean;
  ship?: boolean;
  add?: { code: string; title: string };
};

export type Ticket = {
  id: string;
  code: string;
  title: string;
  status: string;
  warn: boolean;
  shipped: boolean;
};

export type LaneState = { key: string; cells: Ticket[][]; shipped: number };
export type BoardState = { lanes: LaneState[] };

/** corsia di un ticket: `pe-2` -> `pe` */
export function laneOf(id: string): string {
  return id.split('-')[0];
}

/**
 * Scenario tipico, in giorni lavorativi. Il primo ticket del Product Engineer segue la garanzia
 * (`days`): in review 2 giorni prima, in produzione il giorno `days`.
 */
export function buildEvents(days: number): Ev[] {
  if (!Number.isInteger(days) || days < 5 || days > 8) {
    throw new Error(
      `GUARANTEE.days deve essere tra 5 e 8 (ora ${days}): sotto 5 due spostamenti dello stesso ticket distano meno di 2 giorni e si sovrappongono; sopra 8 il nuovo ticket compare meno di 2 giorni prima di spostarsi al giorno 11`,
    );
  }
  const G = days;
  const events: Ev[] = [
    // sprint 1
    { d: 1, id: 'pe-1', col: 1, st: 'Scope deciso con te' },
    { d: G - 2, id: 'pe-1', col: 2, st: 'PR aperta' },
    { d: 4, id: 'freelancer-1', st: 'Trovato: inizia tra 2 settimane' },
    { d: G, id: 'pe-1', col: 3, ship: true },
    { d: 5, id: 'agenzia-1', st: 'Preventivo: 3 settimane di stima' },
    { d: G + 1, id: 'pe-2', add: { code: 'PDF-77', title: 'Export PDF' }, st: 'Prossimo sprint' },
    { d: 8, id: 'assunzione-1', st: '48 candidature da leggere' },
    // sprint 2
    { d: 11, id: 'pe-2', col: 1, st: 'In sviluppo' },
    { d: 11, id: 'freelancer-1', col: 1, st: 'In sviluppo, 3 giorni a settimana' },
    { d: 12, id: 'agenzia-1', st: 'Preventivo approvato, rev. 2' },
    { d: 14, id: 'pe-2', col: 2, st: 'PR aperta' },
    { d: 15, id: 'assunzione-1', st: 'Colloqui: 2 di 8' },
    { d: 16, id: 'pe-2', col: 3, ship: true },
    { d: 17, id: 'pe-3', add: { code: 'BIL-31', title: 'Refactor billing' }, st: 'Prossimo sprint' },
    { d: 17, id: 'freelancer-1', st: 'Offline da 2 giorni', warn: true },
    { d: 18, id: 'agenzia-1', st: 'In attesa del team' },
    { d: 19, id: 'freelancer-1', st: 'Di nuovo online', warn: false },
    // sprint 3
    { d: 21, id: 'pe-3', col: 1, st: 'In sviluppo' },
    { d: 21, id: 'agenzia-1', col: 1, st: 'Kickoff con il team assegnato' },
    { d: 23, id: 'assunzione-1', st: 'Colloqui: 6 di 8' },
    { d: 22, id: 'freelancer-1', col: 2, st: 'PR aperta: brief da chiarire' },
    { d: 24, id: 'pe-3', col: 2, st: 'PR aperta' },
    { d: 26, id: 'pe-3', col: 3, ship: true },
    { d: 27, id: 'pe-4', add: { code: 'KPI-12', title: 'Dashboard attivazione' }, st: 'Prossimo sprint' },
    // il freelancer chiude il suo primo ticket a fine sprint 3: tre volte il tempo del Product Engineer
    { d: 27, id: 'freelancer-1', col: 3, ship: true },
    { d: 30, id: 'assunzione-1', st: 'Ancora in recruiting: 4-6 mesi', warn: true },
  ];
  // sort stabile: a parità di giorno resta l'ordine scritto sopra
  return events.sort((a, b) => a.d - b.d);
}

export const EVENTS: Ev[] = buildEvents(GUARANTEE.days);

/** Stato della board dopo aver applicato tutti gli eventi con `d <= day`. Pura: oggetti nuovi a ogni chiamata. */
export function stateAt(day: number, events: Ev[] = EVENTS): BoardState {
  const lanes: LaneState[] = LANES.map((l) => ({
    key: l.key,
    cells: COLUMNS.map((_, c) =>
      c === 0
        ? [{ id: `${l.key}-1`, code: SEED_CODE, title: SEED_TITLE, status: l.seedStatus, warn: false, shipped: false }]
        : [],
    ),
    shipped: 0,
  }));

  for (const ev of events) {
    if (ev.d > day) continue;
    const lane = lanes.find((l) => l.key === laneOf(ev.id));
    if (!lane) continue;
    if (ev.add) {
      lane.cells[0].push({
        id: ev.id,
        code: ev.add.code,
        title: ev.add.title,
        status: ev.st ?? '',
        warn: false,
        shipped: false,
      });
    }
    let from = -1;
    let ticket: Ticket | undefined;
    lane.cells.forEach((cell, c) => {
      const t = cell.find((x) => x.id === ev.id);
      if (t) {
        from = c;
        ticket = t;
      }
    });
    if (!ticket) continue;
    if (ev.st !== undefined && !ev.add) ticket.status = ev.st;
    if (ev.warn !== undefined) ticket.warn = ev.warn;
    if (ev.ship) ticket.shipped = true;
    if (ev.col !== undefined && ev.col !== from) {
      lane.cells[from] = lane.cells[from].filter((x) => x !== ticket);
      lane.cells[ev.col].push(ticket);
    }
  }

  for (const lane of lanes) lane.shipped = lane.cells.flat().filter((t) => t.shipped).length;
  return { lanes };
}
