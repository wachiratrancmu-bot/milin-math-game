// ──────────────────────────────────────────────────────────────
// เสียงเอฟเฟกต์สั้น ๆ สร้างด้วย Web Audio API (ไม่ต้องโหลดไฟล์)
// ──────────────────────────────────────────────────────────────

let ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  return ctx
}

function tone(freq: number, start: number, duration: number, type: OscillatorType = 'sine') {
  const ac = getCtx()
  if (!ac) return
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = type
  osc.frequency.value = freq
  osc.connect(gain)
  gain.connect(ac.destination)
  const t0 = ac.currentTime + start
  gain.gain.setValueAtTime(0.0001, t0)
  gain.gain.exponentialRampToValueAtTime(0.18, t0 + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)
  osc.start(t0)
  osc.stop(t0 + duration + 0.02)
}

export function playCorrect(enabled: boolean) {
  if (!enabled) return
  tone(660, 0, 0.12, 'triangle')
  tone(880, 0.1, 0.16, 'triangle')
}

export function playWrong(enabled: boolean) {
  if (!enabled) return
  tone(300, 0, 0.18, 'sine')
  tone(220, 0.12, 0.22, 'sine')
}

export function playReward(enabled: boolean) {
  if (!enabled) return
  ;[523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.22, 'triangle'))
}

export function playClick(enabled: boolean) {
  if (!enabled) return
  tone(440, 0, 0.05, 'square')
}
