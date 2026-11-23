// The horizontal rules on this site are guitar strings: crossing one with the
// pointer plucks it. Sound is opt-in through the footer toggle.
const NOTES = [82.41, 110, 146.83, 196, 246.94, 329.63] // E A D G B E
const MID = 14
const REST = `M0 ${MID}H9999`

interface Str {
  svg: SVGSVGElement
  path: SVGPathElement
  i: number
  raf: number
}

let strings: Str[] = []
let lastY: number | null = null
let ctx: AudioContext | null = null
const buffers = new Map<number, AudioBuffer>()
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches

function soundOn() {
  try {
    return localStorage.getItem('sound') === 'on'
  } catch {
    return false
  }
}

function play(i: number, gain: number) {
  if (!ctx || !soundOn()) return
  const f = NOTES[i % 6]
  let buf = buffers.get(i % 6)
  if (!buf) {
    // Karplus-Strong plucked string
    const sr = ctx.sampleRate
    const n = Math.round(sr / f)
    const len = Math.floor(sr * 2.2)
    buf = ctx.createBuffer(1, len, sr)
    const d = buf.getChannelData(0)
    for (let k = 0; k < n; k++) d[k] = Math.random() * 2 - 1
    for (let k = n; k < len; k++) d[k] = (d[k - n] + d[k - n + 1]) * 0.5 * 0.996
    buffers.set(i % 6, buf)
  }
  const src = ctx.createBufferSource()
  src.buffer = buf
  const g = ctx.createGain()
  g.gain.value = 0.25 * gain
  src.connect(g).connect(ctx.destination)
  src.start()
}

function pluck(s: Str, p: number, amp: number, silent = false) {
  if (!silent) play(s.i, amp / 11)
  if (reduced()) return
  cancelAnimationFrame(s.raf)
  const w = s.svg.clientWidth
  p = Math.min(0.92, Math.max(0.08, p))
  const c = [1, 2, 3, 4, 5, 6].map(n => Math.sin(n * Math.PI * p) / (n * n))
  const k = amp / c.reduce((a, cn, j) => a + cn * Math.sin((j + 1) * Math.PI * p), 0)
  const f = 9 - (5 - (s.i % 6)) * 0.9
  const t0 = performance.now()
  s.svg.classList.add('live')
  const frame = (now: number) => {
    const t = (now - t0) / 1000
    if (t > 2.4) {
      s.path.setAttribute('d', REST)
      s.svg.classList.remove('live')
      return
    }
    let d = `M0 ${MID}`
    const steps = 48
    for (let j = 1; j <= steps; j++) {
      const x = j / steps
      let y = 0
      for (let n = 1; n <= 6; n++) {
        y += c[n - 1] * Math.sin(n * Math.PI * x) * Math.cos(2 * Math.PI * f * n * t) * Math.exp(-t * (1.1 + 0.9 * n))
      }
      d += `L${(x * w).toFixed(1)} ${(MID + y * k).toFixed(2)}`
    }
    s.path.setAttribute('d', d)
    s.raf = requestAnimationFrame(frame)
  }
  s.raf = requestAnimationFrame(frame)
}

function setup() {
  strings = []
  lastY = null
  document.documentElement.classList.add('has-strings')
  document.querySelectorAll<HTMLElement>('.section:not(.plain), .year, .site-foot').forEach((host, i) => {
    host.querySelector(':scope > .string')?.remove()
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('class', 'string')
    svg.setAttribute('aria-hidden', 'true')
    svg.style.setProperty('--gauge', `${2.4 - (i % 6) * 0.28}px`)
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute('d', REST)
    svg.append(path)
    host.prepend(svg)
    strings.push({ svg, path, i, raf: 0 })
  })
  const btn = document.querySelector<HTMLButtonElement>('.sound')
  if (btn) {
    const paint = () => {
      btn.setAttribute('aria-pressed', String(soundOn()))
      btn.textContent = soundOn() ? '♪ Sound on' : '♪ Sound off'
    }
    paint()
    btn.onclick = () => {
      try {
        localStorage.setItem('sound', soundOn() ? 'off' : 'on')
      } catch {}
      if (soundOn()) {
        ctx ??= new AudioContext()
        ctx.resume()
        strings.slice(0, 6).forEach((s, j) => setTimeout(() => pluck(s, 0.3, 7), j * 70))
      }
      paint()
    }
  }
  if (location.pathname === '/' && !reduced()) {
    strings.slice(0, 6).forEach((s, j) => setTimeout(() => pluck(s, 0.25, 6, true), 500 + j * 90))
  }
}

function onMove(e: PointerEvent) {
  const y = e.clientY
  if (lastY !== null && y !== lastY) {
    for (const s of strings) {
      const r = s.svg.getBoundingClientRect()
      const mid = r.top + MID
      if ((lastY - mid) * (y - mid) < 0 && e.clientX >= r.left && e.clientX <= r.right) {
        pluck(s, (e.clientX - r.left) / r.width, Math.min(11, Math.max(3.5, Math.abs(y - lastY) * 0.7)))
      }
    }
  }
  lastY = y
}

function onDown(e: PointerEvent) {
  if (soundOn() && !ctx) ctx = new AudioContext()
  ctx?.resume()
  for (const s of strings) {
    const r = s.svg.getBoundingClientRect()
    if (Math.abs(e.clientY - (r.top + MID)) < 12 && e.clientX >= r.left && e.clientX <= r.right) {
      pluck(s, (e.clientX - r.left) / r.width, 9)
    }
  }
}

document.addEventListener('pointermove', onMove, { passive: true })
document.addEventListener('pointerdown', onDown, { passive: true })
document.addEventListener('pointerleave', () => (lastY = null))
document.addEventListener('astro:page-load', setup)
