import { useState } from 'react';
import Photo from './Photo.jsx';
import Lightbox from './Lightbox.jsx';
import styles from './PhotoGrid.module.css';

/**
 * Masonry grid of photos (CSS columns). Each photo opens the lightbox on the
 * same list, so ←/→ in the viewer follows the grid.
 *
 * layout="rows" packs photos into justified rows at their own aspect ratio;
 * "strip" is a single horizontally scrolling row.
 * `priority` loads the first N photos eagerly (use for above-the-fold grids).
 */
export default function PhotoGrid({ photos, layout = 'masonry', showTripLinks = false, label, priority = 0 }) {
  const [openIndex, setOpenIndex] = useState(null);

  if (photos.length === 0) return null;

  const sizes = {
    strip: '(min-width: 48rem) 22rem, 70vw',
    rows: '(min-width: 52rem) 20rem, 50vw',
    masonry: '(min-width: 64rem) 24rem, (min-width: 40rem) 50vw, 100vw',
  }[layout];

  return (
    <>
      <ul className={styles[layout]} aria-label={label}>
        {photos.map((photo, i) => (
          <li key={photo.id} className={styles.item} style={{ '--ar': photo.width / photo.height }}>
            <button type="button" className={styles.button} onClick={() => setOpenIndex(i)}>
              <Photo photo={photo} sizes={sizes} fit={layout === 'masonry' ? 'natural' : 'cover'} eager={i < priority} />
            </button>
          </li>
        ))}
      </ul>
      <Lightbox
        photos={photos}
        index={openIndex}
        onIndexChange={setOpenIndex}
        onClose={() => setOpenIndex(null)}
        showTripLink={showTripLinks}
      />
    </>
  );
}
