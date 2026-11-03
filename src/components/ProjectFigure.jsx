import styles from './ProjectFigure.module.css';

/* Small schematic sketches, one per project id. Decorative only. */

function Ais() {
  const track = [
    [14, 54],
    [38, 49],
    [62, 45],
    [86, 43],
    [110, 38],
  ];
  return (
    <>
      <path className={styles.land} d="M184 80 C190 62 204 52 240 48 L240 80 Z" />
      {track.map(([x, y]) => (
        <circle key={x} className={styles.muted} cx={x} cy={y} r="2.2" />
      ))}
      <path className={styles.dashed} d="M114 36 Q160 22 196 40" />
      <path className={styles.accentFill} d="M108 33 L120 36 L108 41 Z" />
      <circle className={styles.ring} cx="200" cy="43" r="5" />
    </>
  );
}

const LEAF = ['....##..', '...####.', '..##x##.', '.######.', '.#x###..', '..###...', '.#.#....', '#.......'];

function Plant() {
  const size = 8;
  const left = 120 - (LEAF[0].length * size) / 2;
  return LEAF.flatMap((row, y) =>
    [...row].map((cell, x) =>
      cell === '.' ? null : (
        <rect
          key={`${x}-${y}`}
          className={cell === 'x' ? styles.mutedFill : styles.accentFill}
          x={left + x * size}
          y={8 + y * size}
          width={size - 1}
          height={size - 1}
        />
      ),
    ),
  );
}

const wave = (x) => 40 + 14 * Math.sin(x / 13) + 6 * Math.sin(x / 5);
const line = (from, to) => {
  const pts = [];
  for (let x = from; x <= to; x += 3) pts.push(`${x},${wave(x).toFixed(1)}`);
  return `M${pts.join(' L')}`;
};

function Lstm() {
  const now = 168;
  return (
    <>
      <path className={styles.stroke} d={line(8, now)} />
      <path className={styles.dashed} d={`M${now} ${wave(now).toFixed(1)} H232`} />
      <path className={styles.accentStroke} d={line(now, 232)} />
      <path className={styles.rule} d={`M${now} 8 V72`} />
    </>
  );
}

function Website() {
  return (
    <>
      <circle className={styles.blob1} cx="92" cy="44" r="24" />
      <circle className={styles.blob2} cx="126" cy="34" r="18" />
      <circle className={styles.blob1} cx="150" cy="50" r="14" />
    </>
  );
}

const FIGURES = { ais: Ais, plant: Plant, lstm: Lstm, website: Website };

export default function ProjectFigure({ id }) {
  const Figure = FIGURES[id];
  if (!Figure) return null;
  return (
    <svg className={styles.figure} viewBox="0 0 240 80" aria-hidden="true" focusable="false">
      <Figure />
    </svg>
  );
}
