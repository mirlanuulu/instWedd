import styles from './WaxSeal.module.css';

// Неровный контур сургуча в системе координат 100×100.
const WAX_OUTLINE =
  'M93.8 50.0C93.2 56.6 91.9 63.2 89.1 68.8C86.4 74.5 82.0 79.8 77.1 84.0C72.3 88.2 66.2 92.4 60.0 94.0C53.9 95.6 46.3 95.2 40.0 93.6C33.8 92.0 27.4 88.7 22.3 84.7C17.3 80.7 13.0 75.2 9.6 69.4C6.2 63.7 1.8 56.4 2.0 50.0C2.2 43.6 7.7 37.3 10.8 31.1C13.9 25.0 15.6 17.0 20.5 13.0C25.3 8.9 33.6 7.6 40.1 6.7C46.6 5.9 53.5 6.5 59.6 8.1C65.7 9.7 71.3 12.8 76.9 16.3C82.5 19.8 90.4 23.6 93.2 29.2C96.0 34.8 94.5 43.4 93.8 50.0Z';

// Та же ломаная, что в clip-path половин в WaxSeal.module.css.
const CRACK_LINE = '52,3 46,22 55,38 47,55 56,72 49,97';

type Initials = readonly [string, string];

function SealFace({ initials }: { initials: Initials }) {
  return (
    <span className={styles.face}>
      <svg viewBox="0 0 100 100" focusable="false">
        <path className={styles.wax} d={WAX_OUTLINE} />
        <ellipse className={styles.gloss} cx="36" cy="30" rx="26" ry="15" transform="rotate(-25 36 30)" />
        <circle className={styles.stamp} cx="50" cy="50" r="33" />
        <circle className={styles.rimDark} cx="50" cy="50" r="33" />
        <circle className={styles.rimLight} cx="50" cy="50" r="29" />
      </svg>
      <span className={styles.initials}>
        {initials[0]}
        <span className={styles.amp}>&amp;</span>
        {initials[1]}
      </span>
    </span>
  );
}

/**
 * Сургучная печать из двух половин. Части помечены data-part:
 * по ним анимация открытия в EnvelopeIntro находит, что трескается и падает.
 */
export function WaxSeal({ initials, pulsing }: { initials: Initials; pulsing: boolean }) {
  return (
    <span className={`${styles.seal} ${pulsing ? styles.pulsing : ''}`} data-part="seal">
      <span className={styles.ring} />
      <span className={styles.shadow} data-part="seal-shadow" />
      <span className={styles.body} data-part="seal-body">
        <span className={`${styles.half} ${styles.halfLeft}`} data-part="seal-left">
          <SealFace initials={initials} />
        </span>
        <span className={`${styles.half} ${styles.halfRight}`} data-part="seal-right">
          <SealFace initials={initials} />
        </span>
        <svg className={styles.crack} data-part="seal-crack" viewBox="0 0 100 100" focusable="false">
          <polyline points={CRACK_LINE} />
        </svg>
      </span>
    </span>
  );
}
