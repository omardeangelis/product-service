import { motion } from 'motion/react';
import { Link } from 'wouter';

const RICHIESTE = [
  { titolo: 'Nuovo onboarding', stato: 'Da rivedere' },
  { titolo: 'Export report mensile', stato: 'In corso' },
  { titolo: 'Notifiche via email', stato: 'Completata' },
];

export default function Panoramica() {
  return (
    <>
      <p className="eyebrow">Panoramica</p>
      <h1>Richieste del team</h1>
      <ul className="lista">
        {RICHIESTE.map((r) => (
          <li key={r.titolo}>
            <Link href="/dettaglio" asChild>
              <motion.a className="card" whileTap={{ scale: 0.97 }} transition={{ duration: 0.16 }}>
                <span>{r.titolo}</span>
                <span className="stato">{r.stato}</span>
              </motion.a>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
