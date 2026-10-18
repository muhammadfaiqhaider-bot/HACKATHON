'use client';
import { motion } from 'framer-motion';

// One orchestrated moment: each letter rises out of a mask, staggered left to right.
export default function HeroHeadline({ words }) {
  let n = 0;
  return (
    <h1 className="display" aria-label={words.join(' ')}>
      {words.map((w, wi) => (
        <span key={wi} className="w" aria-hidden="true" style={{ marginRight: wi < words.length - 1 ? '.22em' : 0 }}>
          {[...w].map((ch, ci) => (
            <motion.span key={ci} className="c" initial={{ y: '105%' }} animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.25 + n++ * 0.045, ease: [0.16, 1, 0.3, 1] }}>
              {ch}
            </motion.span>
          ))}
        </span>
      ))}
    </h1>
  );
}
