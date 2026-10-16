import { useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/useI18n.js';
import { photoStore, tripTitle } from '../data/photos.js';
import styles from './Lightbox.module.css';

const SWIPE_PX = 50;

/**
 * Full-screen photo viewer on a native <dialog> (focus trap, Esc and top-layer
 * for free). ←/→ and swipes move through `photos`, wrapping at the ends.
 */
export default function Lightbox({ photos, index, onIndexChange, onClose, showTripLink = false }) {
  const { t, lang, locale } = useI18n();
  const dialogRef = useRef(null);
  const touchX = useRef(null);
  const open = index != null && photos[index] != null;
  const photo = open ? photos[index] : null;
  const count = photos.length;

  const step = useCallback(
    (delta) => onIndexChange((index + delta + count) % count),
    [index, count, onIndexChange],
  );

  const openerRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      openerRef.current = document.activeElement;
      dialog.showModal();
    }
    if (!open && dialog.open) {
      dialog.close();
      // Browsers differ on restoring focus after close(); do it explicitly.
      openerRef.current?.focus?.();
      openerRef.current = null;
    }
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
    };
  }, [open, step]);

  // Warm the cache for the neighbours so ←/→ feel instant.
  useEffect(() => {
    if (!open || count < 2) return;
    for (const d of [1, -1]) {
      const p = photos[(index + d + count) % count];
      const img = new Image();
      img.sizes = '100vw';
      img.srcset = p.widths.map((w) => `${p.src}-${w}.webp ${w}w`).join(', ');
    }
  }, [open, index, count, photos]);

  const trip = photo?.tripId ? photoStore.trip(photo.tripId) : null;
  const date = photo?.date
    ? new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(photo.date))
    : null;

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-label={t('lightbox.label')}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        // Clicking the backdrop (the dialog itself, not its content) closes it.
        if (e.target === e.currentTarget) onClose();
      }}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > SWIPE_PX && count > 1) step(dx < 0 ? 1 : -1);
      }}
    >
      {photo && (
        <>
          <div className={styles.bar}>
            <span className={styles.position} aria-live="polite">
              {t('lightbox.position', { i: index + 1, n: count })}
            </span>
            <button type="button" className={styles.close} onClick={onClose}>
              {t('lightbox.close')}
              <span aria-hidden="true"> ✕</span>
            </button>
          </div>

          <figure className={styles.figure} onClick={(e) => e.target === e.currentTarget && onClose()}>
            <img
              key={photo.id}
              className={styles.image}
              src={`${photo.src}-${photo.widths.at(-1)}.webp`}
              srcSet={photo.widths.map((w) => `${photo.src}-${w}.webp ${w}w`).join(', ')}
              sizes={`min(100vw, calc(86svh * ${photo.width / photo.height}))`}
              width={photo.width}
              height={photo.height}
              alt={photo.alt ?? photo.caption ?? ''}
              style={{ backgroundImage: `url(${photo.blur})` }}
            />
            <figcaption className={styles.caption}>
              {photo.caption && <span className={styles.captionText}>{photo.caption}</span>}
              <span className={styles.meta}>
                {[photo.location, date].filter(Boolean).join(' · ')}
                {showTripLink && trip && (
                  <>
                    {' · '}
                    <Link to={`/plog/${trip.id}`} className="link" onClick={onClose}>
                      {t('lightbox.viewTrip')}: {tripTitle(trip, lang)}
                    </Link>
                  </>
                )}
              </span>
            </figcaption>
          </figure>

          {count > 1 && (
            <>
              <button type="button" className={`${styles.nav} ${styles.prev}`} onClick={() => step(-1)} aria-label={t('lightbox.prev')}>
                <span aria-hidden="true">←</span>
              </button>
              <button type="button" className={`${styles.nav} ${styles.next}`} onClick={() => step(1)} aria-label={t('lightbox.next')}>
                <span aria-hidden="true">→</span>
              </button>
            </>
          )}
        </>
      )}
    </dialog>
  );
}
