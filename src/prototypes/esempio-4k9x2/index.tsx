import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { Route, Switch, useLocation } from 'wouter';
import { Shell, type PrototypeProps } from '../Shell';
import Panoramica from './pages/Panoramica';
import Dettaglio from './pages/Dettaglio';
import './style.css';

/*
 * Prototipo di esempio: due pagine con transizione animata.
 * Le rotte qui devono corrispondere a `pages` in src/config.ts,
 * altrimenti il refresh su una sottopagina dà 404 in produzione.
 */
export default function App({ base }: PrototypeProps) {
  return (
    <Shell base={base}>
      <MotionConfig reducedMotion="user" transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}>
        <div className="esempio">
          <Pagine />
        </div>
      </MotionConfig>
    </Shell>
  );
}

function Pagine() {
  const [location] = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.main
        key={location}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
      >
        <Switch location={location}>
          <Route path="/" component={Panoramica} />
          <Route path="/dettaglio" component={Dettaglio} />
        </Switch>
      </motion.main>
    </AnimatePresence>
  );
}
