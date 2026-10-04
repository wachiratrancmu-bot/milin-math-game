// ──────────────────────────────────────────────────────────────
// อ่านโจทย์ออกเสียงภาษาไทยด้วย Web Speech API (ไม่ต้องใช้อินเทอร์เน็ต ถ้าเครื่องมีเสียงภาษาไทย)
// ช่วยเด็กที่ยังอ่านไม่คล่อง (Buzick & Stone, 2014)
// ──────────────────────────────────────────────────────────────

const SPOKEN: [RegExp, string][] = [
  [/□/g, ' ช่องว่าง '],
  [/Δ/g, ' สามเหลี่ยม '],
  [/\+/g, ' บวก '],
  [/−/g, ' ลบ '],
  [/≠/g, ' ไม่เท่ากับ '],
  [/=/g, ' เท่ากับ '],
  [/>/g, ' มากกว่า '],
  [/</g, ' น้อยกว่า '],
  [/→/g, ' '],
  [/[“”]/g, ''],
]

/** แปลงสัญลักษณ์คณิตศาสตร์เป็นคำอ่าน */
export function toSpeech(text: string): string {
  return SPOKEN.reduce((s, [re, word]) => s.replace(re, word), text)
    .replace(/\s+/g, ' ')
    .trim()
}

export const canSpeak = () =>
  typeof window !== 'undefined' &&
  'speechSynthesis' in window &&
  'SpeechSynthesisUtterance' in window

export function speak(text: string) {
  if (!canSpeak()) return
  const synth = window.speechSynthesis
  synth.cancel()
  const utterance = new SpeechSynthesisUtterance(toSpeech(text))
  utterance.lang = 'th-TH'
  const thaiVoice = synth.getVoices().find((v) => v.lang.toLowerCase().startsWith('th'))
  if (thaiVoice) utterance.voice = thaiVoice
  utterance.rate = 0.85
  synth.speak(utterance)
}

export function stopSpeaking() {
  if (canSpeak()) window.speechSynthesis.cancel()
}
