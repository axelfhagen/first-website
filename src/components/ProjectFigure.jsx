import { useId } from 'react';
import { useI18n } from '../i18n/useI18n.js';
import styles from './ProjectFigure.module.css';

/*
 * Small schematic sketches, one per project id, each showing what the project does.
 * Decorative (aria-hidden); the card text says the same thing in words.
 * All drawn in a 320×84 box.
 */

const W = 320;
const H = 84;

const f1 = (n) => n.toFixed(1);
const toPath = (pts) => `M${pts.map(([x, y]) => `${f1(x)},${f1(y)}`).join(' L')}`;

/* Point and tangent on a quadratic Bézier. */
const quad = ([x0, y0], [cx, cy], [x1, y1], t) => {
  const u = 1 - t;
  return [u * u * x0 + 2 * u * t * cx + t * t * x1, u * u * y0 + 2 * u * t * cy + t * t * y1];
};
const quadTangent = ([x0, y0], [cx, cy], [x1, y1], t) => [
  2 * (1 - t) * (cx - x0) + 2 * t * (x1 - cx),
  2 * (1 - t) * (cy - y0) + 2 * t * (y1 - cy),
];

function Arrow({ x1, x2, y }) {
  return <path className={styles.stroke} d={`M${x1} ${y} H${x2} M${x2 - 4} ${y - 3} L${x2} ${y} L${x2 - 4} ${y + 3}`} />;
}

/* ---------- AIS: past pings → ship now → forecast cone → position in 5 days ---------- */

const PAST = [[14, 66], [80, 60], [156, 44]];
// Control point continues the last heading so the track bends smoothly into the forecast.
const NEXT = [[156, 44], [214, 31.8], [284, 38]];

function Ais({ t }) {
  const pings = Array.from({ length: 9 }, (_, i) => quad(...PAST, i / 9));
  const [sx, sy] = PAST[2];
  const [hx, hy] = quadTangent(...PAST, 1);
  const heading = (Math.atan2(hy, hx) * 180) / Math.PI;

  // Uncertainty cone: widens with the forecast horizon.
  const steps = 16;
  const upper = [];
  const lower = [];
  for (let i = 0; i <= steps; i++) {
    const s = i / steps;
    const [x, y] = quad(...NEXT, s);
    const [dx, dy] = quadTangent(...NEXT, s);
    const len = Math.hypot(dx, dy);
    const w = 1 + 10 * s;
    upper.push([x + (dy / len) * w, y - (dx / len) * w]);
    lower.push([x - (dy / len) * w, y + (dx / len) * w]);
  }
  const cone = `${toPath([...upper, ...lower.reverse()])} Z`;
  const days = [1, 2, 3, 4].map((d) => quad(...NEXT, d / 5));
  const [ex, ey] = NEXT[2];

  return (
    <>
      <path className={styles.land} d="M0 0 H96 C84 8 64 10 46 12 C28 14 12 22 0 28 Z" />
      <path className={styles.land} d="M214 84 C220 72 236 66 254 68 C276 70 294 62 320 58 V84 Z" />

      {pings.map(([x, y]) => (
        <circle key={x} className={styles.mutedFill} cx={f1(x)} cy={f1(y)} r="2" />
      ))}

      <path className={styles.cone} d={cone} />
      <ellipse className={styles.cone} cx={ex} cy={ey} rx="12" ry="11" />
      <path className={styles.dashedAccent} d={`M${sx} ${sy} Q${NEXT[1].join(' ')} ${ex} ${ey}`} />
      {days.map(([x, y]) => (
        <circle key={x} className={styles.accentFill} cx={f1(x)} cy={f1(y)} r="1.6" />
      ))}
      <circle className={styles.ring} cx={ex} cy={ey} r="3.5" />

      <path className={styles.textFill} d="M7 0 L1 -3.5 L-7 -3.5 L-7 3.5 L1 3.5 Z" transform={`translate(${sx} ${sy}) rotate(${f1(heading)})`} />

      <text className={styles.label} x={sx} y={sy + 17} textAnchor="middle">
        {t('figures.now')}
      </text>
      <text className={styles.labelAccent} x={ex} y={ey - 16} textAnchor="middle">
        {t('figures.fiveDays')}
      </text>
    </>
  );
}

/* ---------- Plant: 96×96 leaf → conv layers → healthy / sick ---------- */

// 14×14 pixel leaf: '#' leaf, '|' midrib, 's' stem, 'x' sick spot.
const LEAF = [
  '.........####|',
  '.......#####|#',
  '......#####|##',
  '.....####x|###',
  '.....##x#|####',
  '....####|##x#.',
  '....###|#####.',
  '...###|#####..',
  '...#x|###x#...',
  '...#|####.....',
  '...s#x#.......',
  '..s...........',
  '.s............',
  's.............',
];
const LEAF_CLASS = { '#': 'accentFill', '|': 'rib', s: 'accentFill', x: 'spot' };

function Stack({ x, cy, size, n, gap }) {
  // n feature maps seen at an angle, back to front.
  const depth = (n - 1) * gap;
  return Array.from({ length: n }, (_, i) => {
    const off = depth - i * gap;
    return (
      <rect
        key={i}
        className={styles.map}
        x={x + off}
        y={cy - size / 2 - off + depth / 2}
        width={size}
        height={size}
        rx="1"
      />
    );
  });
}

function Plant({ t }) {
  const cell = 4.8;
  const left = 14;
  const top = 4;
  const sick = 0.87;
  const barX = 276;
  const barW = 38;

  return (
    <>
      {LEAF.flatMap((row, y) =>
        [...row].map((c, x) => {
          if (c === '.') return null;
          return (
            <rect
              key={`${x}-${y}`}
              className={styles[LEAF_CLASS[c]]}
              x={left + x * cell}
              y={top + y * cell}
              width={cell - 0.7}
              height={cell - 0.7}
            />
          );
        }),
      )}
      <text className={styles.label} x={left + 7 * cell} y="80" textAnchor="middle">
        {t('figures.pixels')}
      </text>

      <Arrow x1={88} x2={102} y={38} />
      <Stack x={108} cy={38} size={34} n={3} gap={4} />
      <Stack x={162} cy={38} size={22} n={4} gap={3} />
      <Stack x={200} cy={38} size={11} n={5} gap={2.5} />
      <Arrow x1={226} x2={238} y={38} />

      <text className={styles.label} x="244" y="33">
        {t('figures.healthy')}
      </text>
      <rect className={styles.mutedFill} x={barX} y="27" width={barW * (1 - sick)} height="6" rx="1" />
      <text className={styles.labelAccent} x="244" y="50">
        {t('figures.sick')}
      </text>
      <rect className={styles.accentFill} x={barX} y="44" width={barW * sick} height="6" rx="1" />
    </>
  );
}

/* ---------- LSTM: history → 18-step forecast vs. naive baseline vs. what happened ---------- */

const NOW = 196;
const STEP = 4;
const END = NOW + 18 * STEP;
const truth = (x) => 46 + 13 * Math.sin(x / 14) + 6 * Math.sin(x / 5.5 + 1);
const forecast = (x) => truth(x) + 5 * ((x - NOW) / (END - NOW)) * Math.sin((x - NOW) / 6);
const ghostA = (x) => 36 + 8 * Math.sin(x / 19 + 2) + 4 * Math.sin(x / 7);
const ghostB = (x) => 58 + 7 * Math.sin(x / 11 + 4) + 3 * Math.sin(x / 4);
const sample = (fn, from, to, dx = 2) => {
  const pts = [];
  for (let x = from; x < to; x += dx) pts.push([x, fn(x)]);
  pts.push([to, fn(to)]);
  return toPath(pts);
};

function Lstm({ t }) {
  const steps = Array.from({ length: 18 }, (_, i) => NOW + (i + 1) * STEP);
  const base = truth(NOW);
  return (
    <>
      {/* A couple of the other 48,000 series, faintly. */}
      <path className={styles.ghost} d={sample(ghostA, 8, END)} />
      <path className={styles.ghost} d={sample(ghostB, 8, END)} />

      <path className={styles.rule} d={`M${NOW} 14 V80`} />
      <path className={styles.rule} d={`M${NOW + 1} 11 H${END} V14`} />
      <text className={styles.label} x={(NOW + END) / 2} y="8" textAnchor="middle">
        {t('figures.next18')}
      </text>

      <path className={styles.stroke} d={sample(truth, 8, NOW)} />
      <path className={styles.thin} d={sample(truth, NOW, END)} />
      <path className={styles.dashed} d={`M${NOW} ${f1(base)} H${END}`} />
      <path className={styles.accentStroke} d={sample(forecast, NOW, END)} />
      {steps.map((x) => (
        <circle key={x} className={styles.accentFill} cx={x} cy={f1(forecast(x))} r="1.4" />
      ))}

      <text className={styles.labelAccent} x={END + 6} y={f1(forecast(END) + 3)}>
        {t('figures.model')}
      </text>
      <text className={styles.label} x={END + 6} y={f1(base + 3)}>
        {t('figures.baseline')}
      </text>
    </>
  );
}

/* ---------- Website: photo → resized copies + blur placeholder → the page ---------- */

function Pic({ x, y, w, h }) {
  return (
    <>
      <rect className={styles.frame} x={x} y={y} width={w} height={h} rx="1" />
      <path
        className={styles.mountain}
        d={`M${x} ${y + h} L${x + 0.34 * w} ${y + 0.42 * h} L${x + 0.55 * w} ${y + 0.72 * h} L${x + 0.72 * w} ${y + 0.52 * h} L${x + w} ${y + h} Z`}
      />
      <circle className={styles.sun} cx={x + 0.78 * w} cy={y + 0.27 * h} r={Math.min(w, h) * 0.09} />
    </>
  );
}

function Website({ t }) {
  const id = useId();
  const clip = `${id}-clip`;
  const blur = `${id}-blur`;
  const win = { x: 168, y: 5, w: 144, h: 74 };

  return (
    <>
      <defs>
        <clipPath id={clip}>
          <rect x={win.x} y={win.y} width={win.w} height={win.h} rx="4" />
        </clipPath>
        <filter id={blur} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.6" />
        </filter>
      </defs>

      <Pic x={10} y={22} w={48} h={36} />
      <Arrow x1={62} x2={74} y={40} />
      <Pic x={80} y={35.5} w={30} h={22.5} />
      <Pic x={115} y={43} w={20} h={15} />
      <g filter={`url(#${blur})`}>
        <Pic x={140} y={49} w={12} h={9} />
      </g>
      <text className={styles.label} x="116" y="74" textAnchor="middle">
        {t('figures.sizes')}
      </text>
      <Arrow x1={152} x2={164} y={40} />

      {/* The page itself: lava blobs behind a single column with a row of photos. */}
      <g clipPath={`url(#${clip})`}>
        <rect className={styles.page} x={win.x} y={win.y} width={win.w} height={win.h} />
        <circle className={styles.blob1} cx="292" cy="34" r="24" />
        <circle className={styles.blob2} cx="266" cy="70" r="15" />
        <circle className={styles.blob1} cx="176" cy="78" r="13" />
      </g>
      <rect className={styles.frame} x={win.x} y={win.y} width={win.w} height={win.h} rx="4" />
      <path className={styles.rule} d={`M${win.x} ${win.y + 11} H${win.x + win.w}`} />
      {[0, 1, 2].map((i) => (
        <circle key={i} className={styles.mutedFill} cx={win.x + 7 + i * 6} cy={win.y + 5.5} r="1.6" />
      ))}

      <rect className={styles.textFill} x="182" y="24" width="44" height="4" rx="1" />
      <rect className={styles.textLine} x="182" y="33" width="96" height="2.4" rx="1" />
      <rect className={styles.textLine} x="182" y="39" width="78" height="2.4" rx="1" />
      <Pic x={182} y={50} w={26} h={19} />
      <Pic x={211} y={50} w={38} h={19} />
      <Pic x={252} y={50} w={14} h={19} />
    </>
  );
}

const FIGURES = { ais: Ais, plant: Plant, lstm: Lstm, website: Website };

export default function ProjectFigure({ id }) {
  const { t } = useI18n();
  const Figure = FIGURES[id];
  if (!Figure) return null;
  return (
    <svg className={styles.figure} viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
      <Figure t={t} />
    </svg>
  );
}
