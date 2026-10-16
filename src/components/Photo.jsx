import { useEffect, useRef, useState } from 'react';
import styles from './Photo.module.css';

/**
 * Responsive photo from the generated manifest: srcset over the pre-built WebP
 * widths, intrinsic aspect ratio (no layout shift) and a blurred placeholder
 * that the full image fades in over.
 *
 * fit="cover" fills the parent box (the parent must have a size) instead of
 * using the photo's own aspect ratio.
 */
export default function Photo({ photo, sizes = '100vw', eager = false, fit = 'natural', className = '' }) {
  const imgRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const fallback = photo.widths.find((w) => w >= 960) ?? photo.widths.at(-1);

  useEffect(() => {
    // A cached image can finish loading before React attaches onLoad.
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) setLoaded(true);
  }, []);

  return (
    <span
      className={`${styles.frame} ${styles[fit]} ${className}`}
      style={{ backgroundImage: `url(${photo.blur})`, aspectRatio: fit === 'natural' ? `${photo.width} / ${photo.height}` : undefined }}
    >
      <img
        ref={imgRef}
        className={`${styles.img} ${loaded ? styles.loaded : ''}`}
        src={`${photo.src}-${fallback}.webp`}
        srcSet={photo.widths.map((w) => `${photo.src}-${w}.webp ${w}w`).join(', ')}
        sizes={sizes}
        width={photo.width}
        height={photo.height}
        alt={photo.alt ?? photo.caption ?? ''}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : undefined}
        decoding="async"
        onLoad={() => setLoaded(true)}
      />
    </span>
  );
}
