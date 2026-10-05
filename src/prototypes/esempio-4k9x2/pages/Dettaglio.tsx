import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Link } from 'wouter';

export default function Dettaglio() {
  const [approvata, setApprovata] = useState(false);
  return (
    <>
      <Link href="/" className="indietro">
        ← Tutte le richieste
      </Link>
      <p className="eyebrow">Dettaglio</p>
      <h1>Nuovo onboarding</h1>
      <p className="testo">
        Ridurre gli step obbligatori e salvare i progressi a ogni passaggio, così chi abbandona può
        riprendere da dove era rimasto.
      </p>
      <motion.button
        className="bottone"
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.16 }}
        onClick={() => setApprovata((v) => !v)}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={approvata ? 'si' : 'no'}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
          >
            {approvata ? 'Approvata ✓' : 'Approva richiesta'}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </>
  );
}
