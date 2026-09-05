/**
 * Arcade-style LearnFlow SFX. Run: node scripts/gen-sfx.js
 */
const fs = require("fs");
const path = require("path");

const SR = 44100;
const TAU = Math.PI * 2;

function clamp(x, a = -1, b = 1) {
  return Math.max(a, Math.min(b, x));
}

function osc(type, phase) {
  const p = phase - Math.floor(phase);
  if (type === "sine") return Math.sin(TAU * p);
  if (type === "tri") return 1 - 4 * Math.abs(p - 0.5);
  if (type === "square") {
    return (
      (Math.sin(TAU * p) +
        Math.sin(TAU * 3 * p) / 3 +
        Math.sin(TAU * 5 * p) / 5 +
        Math.sin(TAU * 7 * p) / 7) *
      0.82
    );
  }
  if (type === "saw") {
    return (
      (Math.sin(TAU * p) +
        Math.sin(TAU * 2 * p) / 2 +
        Math.sin(TAU * 3 * p) / 3 +
        Math.sin(TAU * 4 * p) / 4 +
        Math.sin(TAU * 5 * p) / 5) *
      0.52
    );
  }
  return 0;
}

function expDecay(t, tau) {
  return Math.exp(-Math.max(0, t) / tau);
}

function attack(t, a) {
  if (a <= 0) return 1;
  return t >= a ? 1 : t / a;
}

function render(dur, fn) {
  const n = Math.max(1, Math.floor(dur * SR));
  const L = new Float64Array(n);
  const R = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const s = fn(i / SR, i);
    if (typeof s === "number") {
      L[i] = s;
      R[i] = s;
    } else {
      L[i] = s[0];
      R[i] = s[1];
    }
  }
  return { L, R };
}

function add(dst, src, at, gainL = 1, gainR = gainL) {
  const i0 = Math.floor(at * SR);
  const n = Math.max(src.L.length, src.R.length);
  const need = i0 + n;
  if (need > dst.L.length) {
    const L = new Float64Array(need);
    const R = new Float64Array(need);
    L.set(dst.L);
    R.set(dst.R);
    dst.L = L;
    dst.R = R;
  }
  for (let i = 0; i < n; i++) {
    dst.L[i0 + i] += (src.L[i] || 0) * gainL;
    dst.R[i0 + i] += (src.R[i] || 0) * gainR;
  }
}

function mix(...parts) {
  const dst = { L: new Float64Array(8), R: new Float64Array(8) };
  for (const p of parts) {
    if (!p) continue;
    if (Array.isArray(p)) add(dst, p[0], p[1] || 0, p[2] ?? 1, p[3] ?? p[2] ?? 1);
    else add(dst, p, 0, 1, 1);
  }
  return dst;
}

function highpass(ch, cutoff) {
  const rc = 1 / (TAU * cutoff);
  const dt = 1 / SR;
  const a = rc / (rc + dt);
  const out = new Float64Array(ch.length);
  let prevX = 0;
  let prevY = 0;
  for (let i = 0; i < ch.length; i++) {
    out[i] = a * (prevY + ch[i] - prevX);
    prevX = ch[i];
    prevY = out[i];
  }
  return out;
}

function saturate(ch, drive = 1.15) {
  const out = new Float64Array(ch.length);
  for (let i = 0; i < ch.length; i++) out[i] = Math.tanh(ch[i] * drive);
  return out;
}

function normalize(buf, peak = 0.92) {
  let m = 1e-9;
  for (let i = 0; i < buf.L.length; i++) {
    m = Math.max(m, Math.abs(buf.L[i]), Math.abs(buf.R[i]));
  }
  const g = peak / m;
  for (let i = 0; i < buf.L.length; i++) {
    buf.L[i] *= g;
    buf.R[i] *= g;
  }
  buf.L = saturate(highpass(buf.L, 70), 1.08);
  buf.R = saturate(highpass(buf.R, 70), 1.08);
  m = 1e-9;
  for (let i = 0; i < buf.L.length; i++) {
    m = Math.max(m, Math.abs(buf.L[i]), Math.abs(buf.R[i]));
  }
  const g2 = peak / m;
  for (let i = 0; i < buf.L.length; i++) {
    buf.L[i] *= g2;
    buf.R[i] *= g2;
  }
  return buf;
}

function pad(buf, extra = 0.04) {
  const z = Math.floor(extra * SR);
  const L = new Float64Array(buf.L.length + z);
  const R = new Float64Array(buf.R.length + z);
  L.set(buf.L);
  R.set(buf.R);
  return { L, R };
}

function writeWav(file, buf) {
  const n = buf.L.length;
  const dataSize = n * 4;
  const out = Buffer.alloc(44 + dataSize);
  out.write("RIFF", 0);
  out.writeUInt32LE(36 + dataSize, 4);
  out.write("WAVE", 8);
  out.write("fmt ", 12);
  out.writeUInt32LE(16, 16);
  out.writeUInt16LE(1, 20);
  out.writeUInt16LE(2, 22);
  out.writeUInt32LE(SR, 24);
  out.writeUInt32LE(SR * 4, 28);
  out.writeUInt16LE(4, 32);
  out.writeUInt16LE(16, 34);
  out.write("data", 36);
  out.writeUInt32LE(dataSize, 40);
  for (let i = 0; i < n; i++) {
    out.writeInt16LE((clamp(buf.L[i]) * 32767) | 0, 44 + i * 4);
    out.writeInt16LE((clamp(buf.R[i]) * 32767) | 0, 46 + i * 4);
  }
  fs.writeFileSync(file, out);
}

function noiseBurst(dur, envFn, pan = 0) {
  return render(dur, (t) => {
    const n = (Math.random() * 2 - 1) * envFn(t);
    return [n * (1 - pan * 0.45), n * (1 + pan * 0.45)];
  });
}

function thump(startFreq, endFreq, dur, gain) {
  return render(dur, (t) => {
    const f = startFreq + (endFreq - startFreq) * (t / dur);
    const e = attack(t, 0.004) * expDecay(t, dur * 0.22);
    const s = osc("sine", (startFreq * t + (endFreq - startFreq) * t * t / (2 * dur)) ) * e * gain;
    return s;
  });
}

function bell(freq, dur, gain, { brightness = 0.45, pan = 0, vibrato = 0 } = {}) {
  return render(dur, (t) => {
    const e = attack(t, 0.003) * expDecay(t, dur * 0.26);
    const vib = vibrato ? Math.sin(TAU * 5.5 * t) * vibrato : 0;
    const fm = Math.sin(TAU * freq * 2.02 * t) * brightness * expDecay(t, 0.045);
    const phase = freq * (1 + vib) * t + (fm * 1.8) / TAU;
    const s =
      (osc("sine", phase) +
        osc("sine", phase * 2) * 0.2 * brightness +
        osc("sine", phase * 3.01) * 0.07 * brightness) *
      e *
      gain;
    const l = s * (1 - pan * 0.35);
    const r = s * (1 + pan * 0.35);
    return [l, r];
  });
}

function chip(freq, dur, gain, { slide = 0, pan = 0 } = {}) {
  return render(dur, (t) => {
    const e = attack(t, 0.002) * expDecay(t, dur * 0.18);
    const f = freq + slide * (t / dur);
    const phase = (freq + slide * t / (2 * dur)) * t;
    const s = (osc("square", phase) * 0.55 + osc("tri", phase) * 0.55) * e * gain;
    return [s * (1 - pan * 0.3), s * (1 + pan * 0.3)];
  });
}

function slideTone(f0, f1, dur, gain, type = "tri") {
  return render(dur, (t) => {
    const u = t / dur;
    const e = attack(t, 0.006) * (1 - u * 0.15) * expDecay(t, dur * 0.55);
    const phase = (f0 * t + (f1 - f0) * t * t / (2 * dur));
    return osc(type, phase) * e * gain;
  });
}

function siren(dur, base, depth, rate, gain) {
  return render(dur, (t) => {
    const e = attack(t, 0.02) * (t > dur - 0.08 ? (dur - t) / 0.08 : 1);
    const wob = Math.sin(TAU * rate * t);
    const f = base + depth * wob;
    const phase = base * t - (depth / (TAU * rate)) * Math.cos(TAU * rate * t);
    const s = (osc("tri", phase) * 0.7 + osc("sine", phase * 2) * 0.25) * e * gain;
    const pan = Math.sin(TAU * (rate * 0.5) * t) * 0.45;
    return [s * (1 - pan), s * (1 + pan)];
  });
}

function honk(freq, dur, gain) {
  return render(dur, (t) => {
    const e = attack(t, 0.008) * (t < dur * 0.55 ? 1 : (dur - t) / (dur * 0.45));
    const s =
      (osc("saw", freq * t) * 0.35 + osc("square", freq * t) * 0.25 + osc("sine", freq * t) * 0.5) *
      e *
      gain;
    return s;
  });
}

function correct() {
  const sparkle = noiseBurst(
    0.028,
    (t) => attack(t, 0.001) * expDecay(t, 0.009) * 0.2,
    0.15
  );
  return pad(
    normalize(
      mix(
        [thump(240, 70, 0.05, 0.38), 0],
        [sparkle, 0],
        [chip(783.99, 0.07, 0.28, { pan: -0.25 }), 0.0],
        [chip(987.77, 0.1, 0.46, { pan: -0.1 }), 0.032],
        [chip(1318.51, 0.24, 0.58, { pan: 0.08 }), 0.068],
        [bell(1567.98, 0.3, 0.3, { brightness: 0.6, pan: 0.4 }), 0.11],
        [bell(1975.53, 0.28, 0.2, { brightness: 0.75, pan: -0.45 }), 0.15],
        [bell(2637.02, 0.3, 0.16, { brightness: 0.85, pan: 0.55 }), 0.2],
        [bell(3135.96, 0.22, 0.1, { brightness: 0.95, pan: -0.15 }), 0.26],
        [bell(1318.51, 0.18, 0.12, { brightness: 0.4, pan: 0.2 }), 0.3]
      )
    ),
    0.05
  );
}

function wrong() {
  const click = noiseBurst(0.012, (t) => attack(t, 0.001) * expDecay(t, 0.005) * 0.28, -0.1);
  const boing = render(0.26, (t) => {
    const bounce = t > 0.11 ? 28 * expDecay(t - 0.11, 0.04) : 0;
    const f = 310 * Math.exp(-t * 7.2) + 92 + bounce;
    const phase = (310 / 7.2) * (1 - Math.exp(-7.2 * t)) + 92 * t + (bounce ? 28 * 0.04 * (1 - Math.exp(-(t - 0.11) / 0.04)) : 0);
    const e = attack(t, 0.004) * expDecay(t, 0.11);
    const s = (osc("tri", phase) * 0.75 + osc("square", phase) * 0.18) * e * 0.72;
    return [s * 1.05, s * 0.9];
  });
  return pad(normalize(mix([click, 0], [boing, 0])), 0.03);
}

function warn() {
  const a = chip(1174.66, 0.055, 0.4, { pan: -0.3 });
  const b = chip(1567.98, 0.09, 0.52, { pan: 0.25 });
  const crystal = bell(2349.32, 0.2, 0.28, { brightness: 0.85, pan: 0.1 });
  return pad(normalize(mix([a, 0], [b, 0.07], [crystal, 0.08])), 0.04);
}

function timesUp() {
  const crash = noiseBurst(0.09, (t) => attack(t, 0.002) * expDecay(t, 0.028) * 0.55, 0);
  return pad(
    normalize(
      mix(
        [crash, 0],
        [bell(1760, 0.12, 0.28, { brightness: 0.8, pan: -0.5 }), 0],
        [bell(1975, 0.12, 0.22, { brightness: 0.8, pan: 0.5 }), 0.04],
        [siren(0.36, 698, 160, 8.5, 0.4), 0.03],
        [honk(392.0, 0.1, 0.48), 0.36],
        [honk(329.63, 0.1, 0.46), 0.47],
        [honk(261.63, 0.18, 0.5), 0.58],
        [slideTone(440, 70, 0.36, 0.18, "saw"), 0.56],
        [bell(523.25, 0.2, 0.12, { brightness: 0.3, pan: 0.2 }), 0.72]
      )
    ),
    0.06
  );
}

const dir = path.join(__dirname, "..", "assets", "sfx");
fs.mkdirSync(dir, { recursive: true });
writeWav(path.join(dir, "correct.wav"), correct());
writeWav(path.join(dir, "wrong.wav"), wrong());
writeWav(path.join(dir, "warn.wav"), warn());
writeWav(path.join(dir, "times-up.wav"), timesUp());
console.log("sfx written", fs.readdirSync(dir).join(", "));
