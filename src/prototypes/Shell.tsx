import { useEffect, type ReactNode } from 'react';
import { Router, useLocation } from 'wouter';

/** Props che ogni prototipo riceve dalla pagina generata in integration.mjs. */
export type PrototypeProps = { base: string };

/*
 * Involucro comune dei prototipi: un router con base /p/<slug>, così dentro
 * al prototipo link e rotte si scrivono relativi ("/", "/dettaglio").
 */
export function Shell({ base, children }: PrototypeProps & { children: ReactNode }) {
  return (
    <Router base={base}>
      <ScrollToTop />
      {children}
    </Router>
  );
}

// A ogni cambio pagina si riparte dall'alto, come in un sito vero.
function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}
