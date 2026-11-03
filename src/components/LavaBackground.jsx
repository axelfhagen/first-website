import { useEffect, useRef } from 'react';
import styles from './LavaBackground.module.css';

const VERTEX = `
attribute vec2 pos;
void main() { gl_Position = vec4(pos, 0.0, 1.0); }
`;

// Metaballs drifting on slow sine paths, with a little domain warp so the
// edges wobble like wax. Colors come from --bg, --lava-1 and --lava-2.
const FRAGMENT = `
precision mediump float;
uniform vec2 res;
uniform float time;
uniform vec3 bg;
uniform vec3 lava1;
uniform vec3 lava2;

float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

void main() {
  float aspect = res.x / res.y;
  vec2 p = gl_FragCoord.xy / res.y;
  p += 0.035 * vec2(sin(p.y * 4.0 + time * 0.5) + 0.5 * sin(p.y * 9.0 - time * 0.8),
                    cos(p.x * 3.5 - time * 0.4) + 0.5 * cos(p.x * 8.0 + time * 0.7));

  // Blobs spread across the width, each bobbing up and down at its own pace.
  float field = 0.0;
  for (int i = 0; i < 6; i++) {
    float f = float(i);
    vec2 c = vec2(
      aspect * (0.08 + 0.168 * f + 0.07 * sin(time * 0.09 + f * 2.1)),
      0.5 + 0.4 * sin(time * (0.05 + 0.013 * f) + f * 2.4)
    );
    float r = 0.12 + 0.04 * mod(f * 1.7, 2.0);
    vec2 d = p - c;
    d.y *= 0.85;
    field += r * r / dot(d, d);
  }

  float glow = smoothstep(0.6, 1.3, field);
  float body = smoothstep(1.25, 1.75, field);
  vec3 wax = mix(lava1, lava2, gl_FragCoord.y / res.y);
  vec3 col = mix(bg, wax, glow * 0.45 + body * 0.55);

  // Dither so the soft gradients don't band.
  col += (hash(gl_FragCoord.xy) - 0.5) / 255.0;
  gl_FragColor = vec4(col, 1.0);
}
`;

// The field is smooth, so rendering below screen resolution is invisible and much cheaper.
const SCALE = 0.5;

function readColor(style, name) {
  const hex = style.getPropertyValue(name).trim().replace('#', '');
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
}

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

/** Subtle lava-lamp blobs behind the page (WebGL). Renders nothing without WebGL. */
export default function LavaBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (typeof window.WebGLRenderingContext === 'undefined') return;
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    if (!vs || !fs) return;
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(program, 'pos');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const u = Object.fromEntries(
      ['res', 'time', 'bg', 'lava1', 'lava2'].map((name) => [name, gl.getUniformLocation(program, name)]),
    );

    const setColors = () => {
      const style = getComputedStyle(document.documentElement);
      gl.uniform3fv(u.bg, readColor(style, '--bg'));
      gl.uniform3fv(u.lava1, readColor(style, '--lava-1'));
      gl.uniform3fv(u.lava2, readColor(style, '--lava-2'));
    };

    const resize = () => {
      canvas.width = Math.max(1, Math.round(window.innerWidth * SCALE));
      canvas.height = Math.max(1, Math.round(window.innerHeight * SCALE));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(u.res, canvas.width, canvas.height);
    };

    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const start = performance.now();
    let frame = 0;
    const draw = (now) => {
      gl.uniform1f(u.time, reduced.matches ? 20 : 20 + (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduced.matches) frame = requestAnimationFrame(draw);
    };
    const redraw = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(draw);
    };

    setColors();
    resize();
    redraw();

    const onResize = () => {
      resize();
      redraw();
    };
    window.addEventListener('resize', onResize);
    reduced.addEventListener('change', redraw);
    // Theme toggles flip data-theme on <html>; pick up the new token colors.
    const observer = new MutationObserver(() => {
      setColors();
      redraw();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
      reduced.removeEventListener('change', redraw);
      observer.disconnect();
      // Don't lose the context: StrictMode remounts and getContext would hand back the dead one.
      gl.deleteProgram(program);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
