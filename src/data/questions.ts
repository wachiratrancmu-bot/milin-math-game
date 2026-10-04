import type { Level, Question, QuestionKind } from '../types'

// ──────────────────────────────────────────────────────────────
// คลังข้อสอบคณิตศาสตร์ ป.1 ตามแนวข้อสอบบทที่ 4–6 และตัวชี้วัดใน curriculum.ts
//
// ข้อคำนวณสร้างด้วยฟังก์ชันด้านล่าง ซึ่งคิดคำตอบ ตัวเลือก วิธีคิดทีละขั้น และภาพช่วยคิด
// จากตัวเลขจริง จึงไม่มีทางที่โจทย์กับคำตอบจะขัดกัน (questions.test.ts ตรวจซ้ำแบบอิสระ)
//
// วิธีคิดทีละขั้นใช้กลยุทธ์ "ทำให้ครบ 10" และ "ลบให้เหลือ 10"
// (National Research Council, 2009) และแสดงเป็นตัวอย่างการทำ (Sweller & Cooper, 1985)
// ──────────────────────────────────────────────────────────────

const WORDS: Record<number, string> = {
  10: 'สิบ',
  11: 'สิบเอ็ด',
  12: 'สิบสอง',
  13: 'สิบสาม',
  14: 'สิบสี่',
  15: 'สิบห้า',
  16: 'สิบหก',
  17: 'สิบเจ็ด',
  18: 'สิบแปด',
  19: 'สิบเก้า',
  20: 'ยี่สิบ',
}
const ONES = ['ศูนย์', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า']
const THAI_DIGITS = '๐๑๒๓๔๕๖๗๘๙'

const thai = (n: number) => [...String(n)].map((d) => THAI_DIGITS[Number(d)]).join('')
const reversed = (n: number) => Number([...String(n)].reverse().join(''))
const uniq = <T,>(xs: T[]) => [...new Set(xs)]
const tens = (n: number) => Math.floor(n / 10)
const ones = (n: number) => n % 10
const tensOnes = (n: number) => `${tens(n)} สิบ กับ ${ones(n)} หน่วย`
const repeat = (e: string, n: number) => Array.from({ length: n }, () => e).join('')
const range = (from: number, to: number) => {
  const step = from <= to ? 1 : -1
  const out: number[] = []
  for (let x = from; step > 0 ? x <= to : x >= to; x += step) out.push(x)
  return out
}

/** วาดภาพสิ่งของ จัดเป็นกลุ่มละ 10 ให้นับง่าย */
const picture = (e: string, n: number) => {
  const groups: string[] = []
  for (let left = n; left > 0; left -= 10) groups.push(repeat(e, Math.min(10, left)))
  return groups.join(' ')
}

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(`คลังข้อสอบผิดพลาด: ${msg}`)
}

/**
 * ตัวเลือกตัวเลข 3 ตัว (ก ข ค ตามรูปแบบข้อสอบของโรงเรียน):
 * คำตอบ + ตัวลวงจากความผิดพลาดที่พบบ่อย + จำนวนข้างเคียง
 */
function numChoices(answer: number, extra: number[] = [], max = 20): string[] {
  const out = [answer]
  const candidates = [...extra, answer + 1, answer - 1, answer + 2, answer - 2, answer + 3, answer - 3]
  for (const c of candidates) {
    if (out.length === 3) break
    if (Number.isInteger(c) && c >= 0 && c <= max && !out.includes(c)) out.push(c)
  }
  return out.map(String)
}

const smallFor = (kind: QuestionKind, choiceText: string, fillText = 'พิมพ์คำตอบ') =>
  kind === 'fill' ? fillText : choiceText

// ── วิธีคิดทีละขั้น ──────────────────────────────────────────

/** การบวก: นับต่อ / แยกหลักสิบ / ทำให้ครบ 10 */
export function addSteps(a: number, b: number): string[] {
  const s = a + b
  const big = Math.max(a, b)
  const little = Math.min(a, b)
  if (big < 10 && s > 10) {
    const need = 10 - big
    const rest = little - need
    return [
      `เริ่มจากจำนวนที่มากกว่า คือ ${big}`,
      `${big} ขาดอีก ${need} จึงครบ 10 จึงแบ่ง ${little} เป็น ${need} กับ ${rest}`,
      `${big} + ${need} = 10`,
      `10 + ${rest} = ${s}`,
    ]
  }
  if (big >= 10) {
    const u = big - 10
    return [
      `${big} คือ 1 สิบ กับ ${u} หน่วย`,
      `บวกหน่วยก่อน: ${u} + ${little} = ${u + little}`,
      `รวมกับ 1 สิบ: 10 + ${u + little} = ${s}`,
    ]
  }
  if (little === 0) return [`${a} + ${b} = ${s}`]
  return [
    `เริ่มจาก ${big} แล้วนับต่อไปอีก ${little}`,
    `นับต่อ: ${range(big + 1, s).join(', ')}`,
    `${a} + ${b} = ${s}`,
  ]
}

/** การลบ: นับถอยหลัง / แยกหลักสิบ / ลบให้เหลือ 10 */
export function subSteps(a: number, b: number): string[] {
  const d = a - b
  if (b === 0) return [`${a} − ${b} = ${d}`]
  if (a <= 10) {
    return [
      `เริ่มจาก ${a} แล้วนับถอยหลังไป ${b}`,
      `นับถอยหลัง: ${range(a - 1, d).join(', ')}`,
      `${a} − ${b} = ${d}`,
    ]
  }
  if (a === 20) {
    if (b === 10) return ['20 คือ 2 สิบ เอาออก 1 สิบ เหลือ 1 สิบ', '20 − 10 = 10']
    if (b < 10) {
      return [
        '20 คือ 2 สิบ',
        `ลบจาก 1 สิบก่อน: 10 − ${b} = ${10 - b}`,
        `รวมกับอีก 1 สิบ: 10 + ${10 - b} = ${d}`,
      ]
    }
    return ['ลบ 10 ก่อน: 20 − 10 = 10', `ลบอีก ${b - 10}: 10 − ${b - 10} = ${d}`]
  }
  const u = a - 10
  if (b <= u) {
    return [
      `${a} คือ 1 สิบ กับ ${u} หน่วย`,
      `ลบหน่วยก่อน: ${u} − ${b} = ${u - b}`,
      `รวมกับ 1 สิบ: 10 + ${u - b} = ${d}`,
    ]
  }
  if (b >= 10) return [`ลบ 10 ก่อน: ${a} − 10 = ${u}`, `ลบอีก ${b - 10}: ${u} − ${b - 10} = ${d}`]
  return [
    `แบ่ง ${b} เป็น ${u} กับ ${b - u}`,
    `ลบให้เหลือ 10 ก่อน: ${a} − ${u} = 10`,
    `ลบอีก ${b - u}: 10 − ${b - u} = ${d}`,
  ]
}

function addHint(a: number, b: number) {
  const s = a + b
  const big = Math.max(a, b)
  if (big < 10 && s > 10) return `ลองทำให้ครบ 10 ก่อน: ${big} ขาดอีกเท่าไรจึงครบ 10`
  if (big >= 10) return `แยก ${big} เป็น 10 กับ ${big - 10} แล้วบวกหน่วยก่อน`
  return `เริ่มจาก ${big} แล้วนับต่อไปอีก ${Math.min(a, b)}`
}

function subHint(a: number, b: number) {
  if (a <= 10) return `เริ่มจาก ${a} แล้วนับถอยหลังไป ${b}`
  const u = a - 10
  if (a === 20 || b >= 10) return 'ลองลบทีละสิบก่อน แล้วจึงลบหน่วย'
  if (b <= u) return `แยก ${a} เป็น 10 กับ ${u} แล้วลบหน่วยก่อน`
  return `ลองลบให้เหลือ 10 ก่อน: ${a} ต้องลบเท่าไรจึงเหลือ 10`
}

// ── บทที่ 4: อ่าน เขียน นับ (ค 1.1 ป.1/1) ─────────────────────

function readQ(id: string, n: number, level: Level): Question {
  const wrong = n === 11 ? 'สิบหนึ่ง' : n === 20 ? 'สองสิบ' : `${ONES[ones(n)]}สิบ`
  const near = [n - 1, n + 1, n - 2, n + 2].filter((m) => m >= 11 && m <= 20).map((m) => WORDS[m])
  return {
    id,
    topic: 'number',
    chapter: 4,
    level,
    kind: 'choice',
    text: `จำนวน ${n} อ่านว่าอย่างไร`,
    small: 'เลือกคำอ่านที่ถูกต้อง',
    answer: WORDS[n],
    choices: uniq([WORDS[n], wrong, ...near]).slice(0, 3),
    hint:
      n === 11
        ? 'เลข 1 ในหลักหน่วยของจำนวนสองหลัก อ่านว่า “เอ็ด”'
        : n === 20
          ? '2 สิบ อ่านว่า “ยี่สิบ”'
          : `${n} คือ ${tensOnes(n)} อ่านคำว่า “สิบ” ก่อน แล้วตามด้วยหน่วย`,
    explain: `${n} อ่านว่า ${WORDS[n]}`,
    model: { type: 'place', n },
  }
}

function writeQ(id: string, n: number, level: Level, kind: QuestionKind): Question {
  return {
    id,
    topic: 'number',
    chapter: 4,
    level,
    kind,
    text: `“${WORDS[n]}” เขียนเป็นตัวเลขได้อย่างไร`,
    small: smallFor(kind, 'เลือกตัวเลขที่ถูกต้อง', 'พิมพ์ตัวเลข'),
    answer: String(n),
    choices: kind === 'choice' ? numChoices(n, [reversed(n), tens(n) + ones(n)], 99) : undefined,
    hint: `${WORDS[n]} คือ ${tensOnes(n)}`,
    explain: `${WORDS[n]} เขียนเป็นตัวเลขได้ ${n}`,
    model: { type: 'place', n },
  }
}

function thaiToArabicQ(id: string, n: number, level: Level): Question {
  return {
    id,
    topic: 'number',
    chapter: 4,
    level,
    kind: 'choice',
    text: `ตัวเลขไทย ${thai(n)} คือจำนวนใด`,
    small: 'เลือกตัวเลขฮินดูอารบิกที่ตรงกัน',
    visual: thai(n),
    answer: String(n),
    choices: numChoices(n, [reversed(n)], 99),
    hint: [...String(n)].map((d) => `${THAI_DIGITS[Number(d)]} คือ ${d}`).join(' และ '),
    explain: `${thai(n)} คือ ${n}`,
  }
}

function arabicToThaiQ(id: string, n: number, level: Level): Question {
  return {
    id,
    topic: 'number',
    chapter: 4,
    level,
    kind: 'choice',
    text: `${n} เขียนเป็นตัวเลขไทยได้อย่างไร`,
    small: 'เลือกตัวเลขไทยที่ถูกต้อง',
    answer: thai(n),
    choices: numChoices(n, [reversed(n)], 99).map((s) => thai(Number(s))),
    hint: [...String(n)].map((d) => `${d} เขียนเป็น ${THAI_DIGITS[Number(d)]}`).join(' และ '),
    explain: `${n} เขียนเป็นตัวเลขไทยได้ ${thai(n)}`,
  }
}

function countQ(
  id: string,
  emoji: string,
  noun: string,
  unit: string,
  n: number,
  level: Level,
  kind: QuestionKind,
): Question {
  return {
    id,
    topic: 'number',
    chapter: 4,
    level,
    kind,
    text: `นับ${noun}ในภาพ มีทั้งหมดกี่${unit}`,
    small: smallFor(kind, 'นับแล้วเลือกคำตอบ', 'นับแล้วพิมพ์คำตอบ'),
    visual: picture(emoji, n),
    answer: String(n),
    choices: kind === 'choice' ? numChoices(n) : undefined,
    hint: n > 10 ? 'กรอบแรกมี 10 ไม่ต้องนับใหม่ ให้นับต่อจาก 10 ในกรอบที่สอง' : 'ชี้แล้วนับทีละหนึ่ง',
    explain: `นับได้ ${n} ${unit}`,
    steps:
      n > 10
        ? ['กรอบแรกมี 10', `นับต่อในกรอบที่สอง: ${range(11, n).join(', ')}`, `มีทั้งหมด ${n} ${unit}`]
        : undefined,
    model: { type: 'count', n },
  }
}

// ── บทที่ 4: หลักสิบ หลักหน่วย (ค 1.1 ป.1/1) ─────────────────

function composeQ(id: string, n: number, level: Level, kind: QuestionKind): Question {
  return {
    id,
    topic: 'place',
    chapter: 4,
    level,
    kind,
    text: `${tensOnes(n)} เป็นจำนวนใด`,
    small: smallFor(kind, 'เลือกจำนวนที่ถูกต้อง'),
    answer: String(n),
    choices: kind === 'choice' ? numChoices(n, [reversed(n), tens(n) + ones(n)], 99) : undefined,
    hint: `${tens(n)} สิบ คือ ${tens(n) * 10} แล้วนำมารวมกับหน่วย`,
    explain: `${tens(n) * 10} + ${ones(n)} = ${n}`,
    steps: [`${tens(n)} สิบ คือ ${tens(n) * 10}`, `${tens(n) * 10} + ${ones(n)} = ${n}`],
    model: { type: 'place', n },
  }
}

function tensQ(id: string, n: number, level: Level, kind: QuestionKind): Question {
  return {
    id,
    topic: 'place',
    chapter: 4,
    level,
    kind,
    text: `${n} มี □ สิบ กับ ${ones(n)} หน่วย`,
    small: smallFor(kind, 'เลือกจำนวนที่เติมใน □'),
    answer: String(tens(n)),
    choices: kind === 'choice' ? numChoices(tens(n), [ones(n), n], 99) : undefined,
    hint: 'ตัวเลขทางซ้ายอยู่ในหลักสิบ',
    explain: `${n} = ${tensOnes(n)}`,
    model: { type: 'place', n },
  }
}

function onesQ(id: string, n: number, level: Level, kind: QuestionKind): Question {
  return {
    id,
    topic: 'place',
    chapter: 4,
    level,
    kind,
    text: `${n} มี ${tens(n)} สิบ กับ □ หน่วย`,
    small: smallFor(kind, 'เลือกจำนวนที่เติมใน □'),
    answer: String(ones(n)),
    choices: kind === 'choice' ? numChoices(ones(n), [tens(n), n], 99) : undefined,
    hint: 'ตัวเลขทางขวาอยู่ในหลักหน่วย',
    explain: `${n} = ${tensOnes(n)}`,
    model: { type: 'place', n },
  }
}

function digitPlaceQ(id: string, n: number, pos: 'tens' | 'ones', level: Level): Question {
  assert(tens(n) !== ones(n), `${id} ตัวเลขซ้ำกัน ทำให้คำถามกำกวม`)
  const digit = pos === 'tens' ? tens(n) : ones(n)
  const answer = pos === 'tens' ? 'หลักสิบ' : 'หลักหน่วย'
  return {
    id,
    topic: 'place',
    chapter: 4,
    level,
    kind: 'choice',
    text: `เลข ${digit} ใน ${n} อยู่ในหลักใด`,
    small: 'เลือกหลักที่ถูกต้อง',
    visual: String(n),
    answer,
    choices: ['หลักสิบ', 'หลักหน่วย'],
    hint: 'ตัวเลขทางซ้ายอยู่ในหลักสิบ ตัวเลขทางขวาอยู่ในหลักหน่วย',
    explain: `${n} = ${tensOnes(n)} เลข ${digit} จึงอยู่ใน${answer}`,
    model: { type: 'place', n },
  }
}

function digitValueQ(id: string, n: number, pos: 'tens' | 'ones', level: Level): Question {
  assert(tens(n) !== ones(n), `${id} ตัวเลขซ้ำกัน ทำให้คำถามกำกวม`)
  const digit = pos === 'tens' ? tens(n) : ones(n)
  const value = pos === 'tens' ? digit * 10 : digit
  return {
    id,
    topic: 'place',
    chapter: 4,
    level,
    kind: 'choice',
    text: `เลข ${digit} ใน ${n} มีค่าเท่าไร`,
    small: 'เลือกค่าที่ถูกต้อง',
    visual: String(n),
    answer: String(value),
    choices: numChoices(value, [pos === 'tens' ? digit : digit * 10, n], 99),
    hint:
      pos === 'tens'
        ? 'ตัวเลขในหลักสิบบอกจำนวนสิบ เช่น 1 ในหลักสิบมีค่า 10'
        : 'ตัวเลขในหลักหน่วยมีค่าเท่ากับตัวเลขนั้น',
    explain:
      pos === 'tens'
        ? `เลข ${digit} อยู่ในหลักสิบ มีค่า ${digit} สิบ คือ ${value}`
        : `เลข ${digit} อยู่ในหลักหน่วย มีค่า ${value}`,
    model: { type: 'place', n },
  }
}

function tenPictureQ(id: string, n: number, level: Level, kind: QuestionKind): Question {
  return {
    id,
    topic: 'place',
    chapter: 4,
    level,
    kind,
    text: 'ภาพนี้แทนจำนวนใด',
    small: '🔟 แทน 1 สิบ   ⭐ แทน 1 หน่วย',
    visual: `${repeat('🔟', tens(n))} ${repeat('⭐', ones(n))}`.trim(),
    answer: String(n),
    choices: kind === 'choice' ? numChoices(n, [reversed(n), tens(n) + ones(n)], 99) : undefined,
    hint: 'นับ 🔟 เป็นสิบ แล้วนับ ⭐ เป็นหน่วย',
    explain: `${tensOnes(n)} คือ ${n}`,
    model: { type: 'place', n },
  }
}

// ── บทที่ 4: เปรียบเทียบ = ≠ > < (ค 1.1 ป.1/2) ─────────────────

const SIGN_WORD: Record<string, string> = {
  '>': 'มากกว่า',
  '<': 'น้อยกว่า',
  '=': 'เท่ากับ',
  '≠': 'ไม่เท่ากับ',
}
const holds = (a: number, sign: string, b: number) =>
  sign === '>' ? a > b : sign === '<' ? a < b : sign === '=' ? a === b : a !== b

const compareHint = (a: number, b: number) =>
  a === b ? 'ดูว่าสองจำนวนเท่ากันหรือไม่' : 'ดูหลักสิบก่อน ถ้าหลักสิบเท่ากันจึงดูหลักหน่วย'

function compareSignQ(id: string, a: number, b: number, level: Level): Question {
  // เมื่อสองจำนวนไม่เท่ากัน ทั้ง ≠ และ > หรือ < ถูกพร้อมกัน
  // จึงมี ≠ เป็นตัวเลือกเฉพาะข้อที่จำนวนเท่ากัน เพื่อให้มีคำตอบถูกเพียงข้อเดียว
  const choices = a === b ? ['=', '≠', '>'] : ['>', '<', '=']
  const answer = choices.find((s) => holds(a, s, b))!
  return {
    id,
    topic: 'compare',
    chapter: 4,
    level,
    kind: 'choice',
    text: `${a} □ ${b}`,
    small: 'เติมเครื่องหมายใดใน □ จึงจะถูกต้อง',
    answer,
    choices,
    hint: `${compareHint(a, b)} (ด้านที่กว้างของเครื่องหมาย > และ < หันไปทางจำนวนที่มากกว่า)`,
    explain: `${a} ${answer} ${b} อ่านว่า ${a} ${SIGN_WORD[answer]} ${b}`,
  }
}

function compareWordQ(id: string, a: number, b: number, level: Level): Question {
  const w = a > b ? 'มากกว่า' : a < b ? 'น้อยกว่า' : 'เท่ากับ'
  return {
    id,
    topic: 'compare',
    chapter: 4,
    level,
    kind: 'choice',
    text: `${a} □ ${b} ควรเติมคำใด`,
    small: 'เลือกคำที่เติมใน □',
    answer: w,
    choices: ['มากกว่า', 'น้อยกว่า', 'เท่ากับ'],
    hint: compareHint(a, b),
    explain: `${a} ${w} ${b}`,
  }
}

/** ข้อใดถูกต้อง: ประโยคเปรียบเทียบ 4 ข้อ ถูกเพียงข้อเดียว (ใช้ = ≠ > <) */
function compareTruthQ(id: string, statements: [number, string, number][], level: Level): Question {
  const fmt = ([a, s, b]: [number, string, number]) => `${a} ${s} ${b}`
  const truths = statements.filter(([a, s, b]) => holds(a, s, b))
  assert(truths.length === 1, `${id} ต้องมีข้อที่ถูกเพียงข้อเดียว`)
  const [a, s, b] = truths[0]
  return {
    id,
    topic: 'compare',
    chapter: 4,
    level,
    kind: 'choice',
    text: 'ข้อใดถูกต้อง',
    small: 'อ่านเครื่องหมายของแต่ละข้อ แล้วเลือกข้อที่ถูกต้อง',
    answer: fmt(truths[0]),
    choices: statements.map(fmt),
    hint: '= เท่ากับ · ≠ ไม่เท่ากับ · > มากกว่า · < น้อยกว่า',
    explain: `${a} ${s} ${b} อ่านว่า ${a} ${SIGN_WORD[s]} ${b} จึงถูกต้อง`,
  }
}

function readSignQ(id: string, sign: string, level: Level): Question {
  return {
    id,
    topic: 'compare',
    chapter: 4,
    level,
    kind: 'choice',
    text: `เครื่องหมาย ${sign} อ่านว่าอย่างไร`,
    small: 'เลือกคำอ่านที่ถูกต้อง',
    visual: sign,
    answer: SIGN_WORD[sign],
    // ตัวลวงคือเครื่องหมายที่เด็กมักสับสนกับเครื่องหมายนั้น
    choices:
      sign === '≠'
        ? ['ไม่เท่ากับ', 'เท่ากับ', 'มากกว่า']
        : sign === '>'
          ? ['มากกว่า', 'น้อยกว่า', 'เท่ากับ']
          : ['น้อยกว่า', 'มากกว่า', 'ไม่เท่ากับ'],
    hint: '≠ คือเครื่องหมายเท่ากับที่มีขีดทับ · ด้านที่กว้างของ > และ < หันไปทางจำนวนที่มากกว่า',
    explain: `${sign} อ่านว่า ${SIGN_WORD[sign]}`,
  }
}

function extremeQ(id: string, nums: number[], which: 'max' | 'min', level: Level): Question {
  const answer = which === 'max' ? Math.max(...nums) : Math.min(...nums)
  return {
    id,
    topic: 'compare',
    chapter: 4,
    level,
    kind: 'choice',
    text: which === 'max' ? 'จำนวนใดมากที่สุด' : 'จำนวนใดน้อยที่สุด',
    small: 'เลือกคำตอบที่ถูกต้อง',
    visual: nums.join('    '),
    answer: String(answer),
    choices: nums.map(String),
    hint: 'ดูหลักสิบก่อน แล้วจึงดูหลักหน่วย',
    explain: `เรียงจากน้อยไปมาก: ${[...nums].sort((x, y) => x - y).join(', ')}`,
  }
}

function moreLessQ(
  id: string,
  target: number,
  options: number[],
  dir: 'more' | 'less',
  level: Level,
): Question {
  const ok = options.filter((o) => (dir === 'more' ? o > target : o < target))
  assert(ok.length === 1, `${id} ต้องมีคำตอบที่ถูกเพียงข้อเดียว`)
  const w = dir === 'more' ? 'มากกว่า' : 'น้อยกว่า'
  return {
    id,
    topic: 'compare',
    chapter: 4,
    level,
    kind: 'choice',
    text: `จำนวนใด${w} ${target}`,
    small: 'เลือกคำตอบที่ถูกต้อง',
    answer: String(ok[0]),
    choices: options.map(String),
    hint: `${target} ไม่${w}ตัวเอง`,
    explain: `${ok[0]} ${w} ${target}`,
  }
}

function groupCompareQ(
  id: string,
  nameA: string,
  a: number,
  nameB: string,
  b: number,
  unit: string,
  level: Level,
): Question {
  assert(a !== b, `${id} สองกลุ่มต้องมีจำนวนไม่เท่ากัน`)
  const answer = a > b ? nameA : nameB
  return {
    id,
    topic: 'compare',
    chapter: 4,
    level,
    kind: 'choice',
    text: `มี${nameA} ${a} ${unit} มี${nameB} ${b} ${unit} สิ่งใดมีจำนวนมากกว่า`,
    small: 'เลือกคำตอบที่ถูกต้อง',
    answer,
    choices: [nameA, nameB, 'มีเท่ากัน'],
    hint: compareHint(a, b),
    explain: `${Math.max(a, b)} มากกว่า ${Math.min(a, b)} ${answer}จึงมีจำนวนมากกว่า`,
  }
}

// ── บทที่ 4: ลำดับ (ค 1.1 ป.1/3) และแบบรูป (ค 1.2 ป.1/1) ──────

function nextQ(id: string, n: number, level: Level, kind: QuestionKind): Question {
  return {
    id,
    topic: 'order',
    chapter: 4,
    level,
    kind,
    text: `จำนวนที่อยู่ถัดจาก ${n} คือจำนวนใด`,
    small: smallFor(kind, 'เลือกคำตอบที่ถูกต้อง'),
    visual: `${n} → □`,
    answer: String(n + 1),
    choices: kind === 'choice' ? numChoices(n + 1, [n - 1]) : undefined,
    hint: `นับเพิ่มจาก ${n} อีก 1`,
    explain: `${n} + 1 = ${n + 1}`,
  }
}

function prevQ(id: string, n: number, level: Level, kind: QuestionKind): Question {
  return {
    id,
    topic: 'order',
    chapter: 4,
    level,
    kind,
    text: `จำนวนที่อยู่ก่อน ${n} คือจำนวนใด`,
    small: smallFor(kind, 'เลือกคำตอบที่ถูกต้อง'),
    visual: `□ → ${n}`,
    answer: String(n - 1),
    choices: kind === 'choice' ? numChoices(n - 1, [n + 1]) : undefined,
    hint: `นับถอยหลังจาก ${n} ไป 1`,
    explain: `${n} − 1 = ${n - 1}`,
  }
}

function betweenQ(id: string, a: number, level: Level, kind: QuestionKind): Question {
  return {
    id,
    topic: 'order',
    chapter: 4,
    level,
    kind,
    text: `จำนวนที่อยู่ระหว่าง ${a} กับ ${a + 2} คือจำนวนใด`,
    small: smallFor(kind, 'เลือกคำตอบที่ถูกต้อง'),
    visual: `${a}, □, ${a + 2}`,
    answer: String(a + 1),
    choices: kind === 'choice' ? numChoices(a + 1, [a, a + 2]) : undefined,
    hint: `นับต่อจาก ${a} ไปอีก 1`,
    explain: `${a}, ${a + 1}, ${a + 2}`,
  }
}

/** แบบรูปของจำนวน: ตัวชี้วัดกำหนดให้เพิ่มขึ้นหรือลดลงทีละ 1 และทีละ 10 */
function sequenceQ(
  id: string,
  start: number,
  step: 1 | -1 | 10 | -10,
  length: number,
  missing: number,
  level: Level,
  kind: QuestionKind,
): Question {
  const seq = Array.from({ length }, (_, i) => start + i * step)
  assert(seq.every((x) => x >= 0 && x <= 20), `${id} จำนวนในแบบรูปต้องอยู่ระหว่าง 0–20`)
  const answer = seq[missing]
  return {
    id,
    topic: 'order',
    chapter: 4,
    level,
    kind,
    text: 'จำนวนใดหายไปจากแบบรูป',
    small: smallFor(kind, 'เลือกจำนวนที่เติมใน □'),
    visual: seq.map((x, i) => (i === missing ? '□' : String(x))).join(', '),
    answer: String(answer),
    choices: kind === 'choice' ? numChoices(answer, [answer + step, answer - step]) : undefined,
    hint: 'ดูสองจำนวนที่อยู่ติดกัน ว่าเพิ่มขึ้นหรือลดลงเท่าไร',
    explain: `แบบรูปนี้${step > 0 ? 'เพิ่มขึ้น' : 'ลดลง'}ทีละ ${Math.abs(step)}: ${seq.join(', ')}`,
  }
}

function sortQ(id: string, nums: number[], dir: 'asc' | 'desc', level: Level): Question {
  assert(nums.length >= 3 && nums.length <= 5, `${id} ตัวชี้วัดกำหนดให้เรียง 3 ถึง 5 จำนวน`)
  const sorted = [...nums].sort((x, y) => (dir === 'asc' ? x - y : y - x))
  const fmt = (xs: number[]) => xs.join(', ')
  const swapFirst = [sorted[1], sorted[0], ...sorted.slice(2)]
  const choices = uniq([fmt(sorted), fmt([...sorted].reverse()), fmt(swapFirst)])
  assert(choices.length === 3, `${id} ตัวเลือกซ้ำกัน`)
  return {
    id,
    topic: 'order',
    chapter: 4,
    level,
    kind: 'choice',
    text: `เรียงจำนวน ${nums.join('  ')} จาก${dir === 'asc' ? 'น้อยไปมาก' : 'มากไปน้อย'}`,
    small: 'เลือกลำดับที่ถูกต้อง',
    answer: fmt(sorted),
    choices,
    hint: dir === 'asc' ? 'หาจำนวนที่น้อยที่สุดก่อน' : 'หาจำนวนที่มากที่สุดก่อน',
    explain: sorted.join(dir === 'asc' ? ' < ' : ' > '),
  }
}

// ── บทที่ 5: การบวก (ค 1.1 ป.1/4) ────────────────────────────

function addQ(id: string, a: number, b: number, level: Level, kind: QuestionKind): Question {
  const s = a + b
  assert(s <= 20, `${id} ผลบวกต้องไม่เกิน 20`)
  return {
    id,
    topic: 'add',
    chapter: 5,
    level,
    kind,
    text: `${a} + ${b} = □`,
    small: smallFor(kind, 'เลือกผลบวกที่ถูกต้อง', 'พิมพ์ผลบวก'),
    answer: String(s),
    choices: kind === 'choice' ? numChoices(s, [Math.abs(a - b)]) : undefined,
    hint: addHint(a, b),
    explain: `${a} + ${b} = ${s}`,
    steps: addSteps(a, b),
    model: { type: 'add', a, b },
  }
}

function addUnknownQ(
  id: string,
  a: number,
  b: number,
  missing: 'first' | 'second',
  level: Level,
  kind: QuestionKind,
  box: '□' | 'Δ' = '□',
): Question {
  const s = a + b
  assert(s <= 20, `${id} ผลบวกต้องไม่เกิน 20`)
  const answer = missing === 'second' ? b : a
  const known = missing === 'second' ? a : b
  return {
    id,
    topic: 'add',
    chapter: 5,
    level,
    kind,
    text: missing === 'second' ? `${a} + ${box} = ${s}` : `${box} + ${b} = ${s}`,
    small: smallFor(kind, `เลือกจำนวนที่เติมใน ${box}`),
    answer: String(answer),
    choices: kind === 'choice' ? numChoices(answer, [s]) : undefined,
    hint: `${known} ต้องเพิ่มอีกเท่าไรจึงได้ ${s}`,
    explain: `${a} + ${b} = ${s}`,
    steps: [
      `${box} คือจำนวนที่บวกกับ ${known} แล้วได้ ${s}`,
      `หาได้จากการลบ: ${s} − ${known} = ${answer}`,
      `ตรวจคำตอบ: ${a} + ${b} = ${s}`,
    ],
    model: { type: 'add', a, b },
  }
}

// ── บทที่ 6: การลบ (ค 1.1 ป.1/4) ─────────────────────────────

function subQ(id: string, a: number, b: number, level: Level, kind: QuestionKind): Question {
  const d = a - b
  assert(a <= 20 && d >= 0, `${id} ตัวตั้งต้องไม่เกิน 20 และผลลบต้องไม่ติดลบ`)
  return {
    id,
    topic: 'sub',
    chapter: 6,
    level,
    kind,
    text: `${a} − ${b} = □`,
    small: smallFor(kind, 'เลือกผลลบที่ถูกต้อง', 'พิมพ์ผลลบ'),
    answer: String(d),
    choices: kind === 'choice' ? numChoices(d, [a + b]) : undefined,
    hint: subHint(a, b),
    explain: `${a} − ${b} = ${d}`,
    steps: subSteps(a, b),
    model: { type: 'sub', a, b },
  }
}

function subUnknownQ(
  id: string,
  a: number,
  b: number,
  missing: 'first' | 'second',
  level: Level,
  kind: QuestionKind,
  box: '□' | 'Δ' = '□',
): Question {
  const d = a - b
  assert(a <= 20 && d >= 0, `${id} ตัวตั้งต้องไม่เกิน 20 และผลลบต้องไม่ติดลบ`)
  const answer = missing === 'second' ? b : a
  return {
    id,
    topic: 'sub',
    chapter: 6,
    level,
    kind,
    text: missing === 'second' ? `${a} − ${box} = ${d}` : `${box} − ${b} = ${d}`,
    small: smallFor(kind, `เลือกจำนวนที่เติมใน ${box}`),
    answer: String(answer),
    choices:
      kind === 'choice' ? numChoices(answer, [d, missing === 'first' ? d - b : a + d]) : undefined,
    hint:
      missing === 'second'
        ? `${a} ต้องเอาออกเท่าไรจึงเหลือ ${d}`
        : `จำนวนใดเมื่อเอาออก ${b} แล้วเหลือ ${d}`,
    explain: `${a} − ${b} = ${d}`,
    steps:
      missing === 'second'
        ? [
            `${box} คือจำนวนที่เอาออกจาก ${a} แล้วเหลือ ${d}`,
            `หาได้จาก: ${a} − ${d} = ${b}`,
            `ตรวจคำตอบ: ${a} − ${b} = ${d}`,
          ]
        : [
            `${box} คือจำนวนเริ่มต้น เมื่อเอาออก ${b} แล้วเหลือ ${d}`,
            `หาได้จากการบวกกลับ: ${d} + ${b} = ${a}`,
            `ตรวจคำตอบ: ${a} − ${b} = ${d}`,
          ],
    model: { type: 'sub', a, b },
  }
}

// ── บทที่ 5–6: ประโยคสัญลักษณ์ (ค 1.1 ป.1/5) ───────────────────

function sentenceAddQ(
  id: string,
  level: Level,
  a: number,
  b: number,
  emoji: string,
  story?: (a: number, b: number) => string,
): Question {
  const s = a + b
  assert(s <= 20, `${id} ผลบวกต้องไม่เกิน 20`)
  const answer = `${a} + ${b} = ${s}`
  const wrongOp = a >= b ? `${a} − ${b} = ${a - b}` : `${b} − ${a} = ${b - a}`
  return {
    id,
    topic: 'sentence',
    chapter: 5,
    level,
    kind: 'choice',
    text: story
      ? `${story(a, b)} เขียนเป็นประโยคสัญลักษณ์ได้อย่างไร`
      : 'จากภาพ เขียนประโยคสัญลักษณ์แสดงการบวกได้อย่างไร',
    small: 'เลือกประโยคสัญลักษณ์ที่ถูกต้อง',
    visual: `${picture(emoji, a)} + ${picture(emoji, b)}`,
    answer,
    choices: uniq([answer, wrongOp, `${a} + ${b} = ${s + 1}`]),
    hint: 'ของถูกนำมารวมกันหรือเพิ่มเข้ามา ใช้การบวก แล้วตรวจผลลัพธ์ให้ถูกต้อง',
    explain: answer,
    steps: ['ของถูกนำมารวมกัน จึงใช้การบวก', `เขียนได้: ${a} + ${b} = □`, `คำนวณ: ${answer}`],
    model: { type: 'add', a, b },
  }
}

function sentenceSubQ(
  id: string,
  level: Level,
  a: number,
  b: number,
  emoji: string,
  story: (a: number, b: number) => string,
): Question {
  const d = a - b
  assert(a <= 20 && d >= 0, `${id} ตัวตั้งต้องไม่เกิน 20`)
  const answer = `${a} − ${b} = ${d}`
  return {
    id,
    topic: 'sentence',
    chapter: 6,
    level,
    kind: 'choice',
    text: `${story(a, b)} เขียนเป็นประโยคสัญลักษณ์ได้อย่างไร`,
    small: 'เลือกประโยคสัญลักษณ์ที่ถูกต้อง',
    visual: picture(emoji, a),
    answer,
    // ตัวลวงใช้เครื่องหมายผิด โดยไม่ใช้จำนวนเกิน 20 ที่ยังไม่ได้เรียน
    choices: uniq([
      answer,
      a + b <= 20 ? `${a} + ${b} = ${a + b}` : `${a} + ${b} = ${d}`,
      `${a} − ${b} = ${d + 1}`,
    ]),
    hint: 'ของถูกเอาออกไป จำนวนจึงลดลง ใช้การลบ แล้วตรวจผลลัพธ์ให้ถูกต้อง',
    explain: answer,
    steps: ['ของถูกเอาออกไป จึงใช้การลบ', `เขียนได้: ${a} − ${b} = □`, `คำนวณ: ${answer}`],
    model: { type: 'sub', a, b },
  }
}

// ── บทที่ 5–6: โจทย์ปัญหา (ค 1.1 ป.1/5) ────────────────────────
// ขั้นตอนตามแนวของ Pólya (1945): เข้าใจโจทย์ → วางแผน (ประโยคสัญลักษณ์) → คำนวณ → ตอบ
// เน้นให้เข้าใจสถานการณ์ ไม่ใช่จำคำสำคัญ (Karp, Bush, & Dougherty, 2014)

const WORD_SMALL = 'อ่านโจทย์ให้เข้าใจ แล้วหาคำตอบ'
const WORD_FILL_SMALL = 'อ่านโจทย์ แล้วพิมพ์คำตอบเป็นตัวเลข'

function wordAddQ(
  id: string,
  level: Level,
  a: number,
  b: number,
  unit: string,
  story: (a: number, b: number) => string,
  kind: QuestionKind = 'choice',
): Question {
  const s = a + b
  assert(s <= 20, `${id} ผลบวกต้องไม่เกิน 20`)
  return {
    id,
    topic: 'word',
    chapter: 5,
    level,
    kind,
    text: story(a, b),
    small: kind === 'fill' ? WORD_FILL_SMALL : WORD_SMALL,
    answer: String(s),
    choices: kind === 'choice' ? numChoices(s, [Math.abs(a - b)]) : undefined,
    hint: 'โจทย์ถามจำนวนทั้งหมด ของถูกนำมารวมกันหรือเพิ่มขึ้นใช่หรือไม่',
    explain: `${a} + ${b} = ${s} ตอบ ${s} ${unit}`,
    steps: [
      'เข้าใจโจทย์: นำจำนวนสองจำนวนมารวมกัน จึงใช้การบวก',
      `ประโยคสัญลักษณ์: ${a} + ${b} = □`,
      `คำนวณ: ${a} + ${b} = ${s}`,
      `ตอบ ${s} ${unit}`,
    ],
    model: { type: 'add', a, b },
  }
}

function wordSubQ(
  id: string,
  level: Level,
  a: number,
  b: number,
  unit: string,
  story: (a: number, b: number) => string,
  kind: QuestionKind = 'choice',
): Question {
  const d = a - b
  assert(a <= 20 && d >= 0, `${id} ตัวตั้งต้องไม่เกิน 20`)
  return {
    id,
    topic: 'word',
    chapter: 6,
    level,
    kind,
    text: story(a, b),
    small: kind === 'fill' ? WORD_FILL_SMALL : WORD_SMALL,
    answer: String(d),
    choices: kind === 'choice' ? numChoices(d, [a + b]) : undefined,
    hint: 'โจทย์ถามจำนวนที่เหลือ ของถูกเอาออกไปใช่หรือไม่',
    explain: `${a} − ${b} = ${d} ตอบ ${d} ${unit}`,
    steps: [
      'เข้าใจโจทย์: ของถูกเอาออกไป จำนวนที่เหลือจึงน้อยลง จึงใช้การลบ',
      `ประโยคสัญลักษณ์: ${a} − ${b} = □`,
      `คำนวณ: ${a} − ${b} = ${d}`,
      `ตอบ ${d} ${unit}`,
    ],
    model: { type: 'sub', a, b },
  }
}

/**
 * โจทย์เปรียบเทียบ “มากกว่ากันเท่าไร / น้อยกว่ากันเท่าไร / ต่างกันเท่าไร”
 * เป็นโจทย์ประเภทที่เด็กพบว่ายากที่สุด (Riley, Greeno, & Heller, 1983) จึงมีหลายข้อ
 */
function wordDiffQ(
  id: string,
  level: Level,
  big: number,
  little: number,
  unit: string,
  story: (big: number, little: number) => string,
  kind: QuestionKind = 'choice',
): Question {
  const d = big - little
  assert(big <= 20 && d > 0, `${id} จำนวนต้องไม่เกิน 20 และต้องต่างกัน`)
  return {
    id,
    topic: 'word',
    chapter: 6,
    level,
    kind,
    text: story(big, little),
    small: kind === 'fill' ? WORD_FILL_SMALL : WORD_SMALL,
    answer: String(d),
    choices: kind === 'choice' ? numChoices(d, [big + little, big]) : undefined,
    hint: 'โจทย์ให้เปรียบเทียบสองจำนวน ลองจับคู่ทีละชิ้น แล้วดูว่าเหลือกี่ชิ้นที่ไม่มีคู่',
    explain: `${big} − ${little} = ${d} ตอบ ${d} ${unit}`,
    steps: [
      'เข้าใจโจทย์: เปรียบเทียบสองจำนวนว่าต่างกันเท่าไร จึงใช้การลบ',
      `นำจำนวนที่มากกว่าลบด้วยจำนวนที่น้อยกว่า: ${big} − ${little} = □`,
      `คำนวณ: ${big} − ${little} = ${d}`,
      `ตอบ ${d} ${unit}`,
    ],
    model: { type: 'sub', a: big, b: little },
  }
}

/** อ่านโจทย์แล้วเลือกว่าจะใช้การบวกหรือการลบ */
function wordOperationQ(
  id: string,
  level: Level,
  op: 'add' | 'sub',
  a: number,
  b: number,
  story: (a: number, b: number) => string,
): Question {
  const equation = op === 'add' ? `${a} + ${b} = ${a + b}` : `${a} − ${b} = ${a - b}`
  assert(op === 'add' ? a + b <= 20 : a - b >= 0, `${id} ตัวเลขเกินขอบเขต`)
  return {
    id,
    topic: 'word',
    chapter: op === 'add' ? 5 : 6,
    level,
    kind: 'choice',
    text: `โจทย์ “${story(a, b)}” ต้องใช้การบวกหรือการลบ`,
    small: 'คิดว่าจำนวนเพิ่มขึ้น ลดลง หรือเป็นการเปรียบเทียบ',
    answer: op === 'add' ? 'การบวก' : 'การลบ',
    choices: ['การบวก', 'การลบ'],
    hint: 'นำมารวมกันหรือเพิ่มขึ้น ใช้การบวก · เอาออก หาจำนวนที่เหลือ หรือหาว่ามากกว่ากันเท่าไร ใช้การลบ',
    explain: `${op === 'add' ? 'ใช้การบวก' : 'ใช้การลบ'}: ${equation}`,
  }
}

// ── บทที่ 6: ความสัมพันธ์ของการบวกและการลบ (ค 1.1 ป.1/4) ───────

function relationSubQ(id: string, level: Level, a: number, b: number, kind: QuestionKind): Question {
  const s = a + b
  assert(s <= 20, `${id} ผลบวกต้องไม่เกิน 20`)
  return {
    id,
    topic: 'relation',
    chapter: 6,
    level,
    kind,
    text: `ถ้า ${a} + ${b} = ${s} แล้ว ${s} − ${b} = □`,
    small: smallFor(kind, 'เลือกจำนวนที่เติมใน □'),
    answer: String(a),
    choices: kind === 'choice' ? numChoices(a, [b, s]) : undefined,
    hint: `ตัวเลขชุดเดียวกัน ${a} ${b} และ ${s} ใช้ได้ทั้งการบวกและการลบ`,
    explain: `${s} − ${b} = ${a} เพราะ ${a} + ${b} = ${s}`,
    model: { type: 'add', a, b },
  }
}

function relationAddQ(id: string, level: Level, a: number, b: number, kind: QuestionKind): Question {
  const s = a + b
  assert(s <= 20, `${id} ผลบวกต้องไม่เกิน 20`)
  return {
    id,
    topic: 'relation',
    chapter: 6,
    level,
    kind,
    text: `ถ้า ${s} − ${b} = ${a} แล้ว ${a} + ${b} = □`,
    small: smallFor(kind, 'เลือกจำนวนที่เติมใน □'),
    answer: String(s),
    choices: kind === 'choice' ? numChoices(s, [Math.abs(a - b), a]) : undefined,
    hint: `ผลลบ ${a} บวกกลับด้วย ${b} จะได้จำนวนเริ่มต้น`,
    explain: `${a} + ${b} = ${s}`,
    model: { type: 'add', a, b },
  }
}

function relationCheckQ(id: string, level: Level, a: number, b: number): Question {
  const s = a + b
  assert(s <= 20 && a > b, `${id} ต้องให้ ${a} > ${b} และผลบวกไม่เกิน 20`)
  const answer = `${a} + ${b} = ${s}`
  return {
    id,
    topic: 'relation',
    chapter: 6,
    level,
    kind: 'choice',
    text: `ข้อใดใช้ตรวจคำตอบของ ${s} − ${b} = ${a} ได้`,
    small: 'เลือกประโยคสัญลักษณ์ที่ใช้ตรวจคำตอบ',
    answer,
    choices: [answer, `${a} + ${b} = ${s + 1}`, `${a} + ${b} = ${s - 1}`],
    hint: 'ตรวจคำตอบการลบโดยนำผลลบบวกกับจำนวนที่เอาออก ต้องได้จำนวนเริ่มต้น',
    explain: `${a} + ${b} = ${s} ได้จำนวนเริ่มต้นพอดี คำตอบจึงถูกต้อง`,
  }
}

// ──────────────────────────────────────────────────────────────
// คลังข้อสอบ
// ──────────────────────────────────────────────────────────────

// ── รูปแบบเดียวกับแบบทดสอบย่อยของโรงเรียน ───────────────────

/** ข้อใดบอกหลักของตัวเลขได้ถูกต้อง (ตัวเลือกเป็นประโยค) */
function placeStatementQ(id: string, n: number, level: Level, story?: string): Question {
  const t = tens(n)
  const o = ones(n)
  assert(t !== o, `${id} ตัวเลขซ้ำกัน ทำให้คำถามกำกวม`)
  const answer = `เลข ${t} อยู่ในหลักสิบ และเลข ${o} อยู่ในหลักหน่วย`
  return {
    id,
    topic: 'place',
    chapter: 4,
    level,
    kind: 'choice',
    text: `${story ? `${story} ` : ''}ข้อใดบอกหลักของตัวเลขใน ${n} ได้ถูกต้อง`,
    small: 'เลือกข้อที่ถูกต้อง',
    visual: String(n),
    answer,
    choices: [
      answer,
      `เลข ${t} อยู่ในหลักหน่วย และเลข ${o} อยู่ในหลักสิบ`,
      `ทั้งเลข ${t} และเลข ${o} อยู่ในหลักหน่วย`,
    ],
    hint: 'ตัวเลขทางซ้ายอยู่ในหลักสิบ ตัวเลขทางขวาอยู่ในหลักหน่วย',
    explain: `${n} = ${tensOnes(n)} เลข ${t} จึงอยู่ในหลักสิบ และเลข ${o} อยู่ในหลักหน่วย`,
    model: { type: 'place', n },
  }
}

/** เรื่องราวเปรียบเทียบของสองคน ข้อใดเปรียบเทียบได้ถูกต้อง */
function compareStoryQ(
  id: string,
  nameA: string,
  a: number,
  nameB: string,
  b: number,
  thing: string,
  unit: string,
  level: Level,
): Question {
  assert(a !== b, `${id} สองจำนวนต้องไม่เท่ากัน`)
  const rel = a < b ? 'น้อยกว่า' : 'มากกว่า'
  const sA = `${thing}ของ${nameA} ${a} ${unit}`
  const sB = `${thing}ของ${nameB} ${b} ${unit}`
  const answer = `${sA} ${rel} ${sB}`
  return {
    id,
    topic: 'compare',
    chapter: 4,
    level,
    kind: 'choice',
    text: `${nameA}มี${thing} ${a} ${unit} ${nameB}มี${thing} ${b} ${unit} ข้อใดเปรียบเทียบจำนวนได้ถูกต้อง`,
    small: 'เลือกข้อที่ถูกต้อง',
    answer,
    choices: [answer, `${sB} ${rel} ${sA}`, `${thing}ของทั้งสองคนมีจำนวนเท่ากัน`],
    hint: compareHint(a, b),
    explain: `${a} ${rel} ${b} จึงเขียนได้ว่า ${answer}`,
  }
}

/** จากความสัมพันธ์ของการบวกและการลบ ถ้า a + b = s แล้วข้อใดถูกต้อง */
function relationWhichQ(id: string, level: Level, a: number, b: number): Question {
  const s = a + b
  assert(s <= 20, `${id} ผลบวกต้องไม่เกิน 20`)
  const answer = `${s} − ${b} = ${a}`
  return {
    id,
    topic: 'relation',
    chapter: 6,
    level,
    kind: 'choice',
    text: `จากความสัมพันธ์ของการบวกและการลบ ถ้า ${a} + ${b} = ${s} แล้วข้อใดถูกต้อง`,
    small: 'เลือกข้อที่ถูกต้อง',
    answer,
    choices: [answer, `${s} − ${b} = ${a + 1}`, `${s} + ${b} = ${a}`],
    hint: `ตัวเลขชุดเดียวกัน ${a} ${b} และ ${s} ใช้ได้ทั้งการบวกและการลบ`,
    explain: `${s} − ${b} = ${a} เพราะ ${a} + ${b} = ${s}`,
    steps: [
      `ตัวเลขชุดเดียวกันคือ ${a}, ${b} และ ${s}`,
      `นำผลบวก ${s} ลบด้วย ${b} จะได้ ${a}`,
      `${s} − ${b} = ${a}`,
    ],
    model: { type: 'add', a, b },
  }
}

/** Δ + b = s ตัวเลขใน Δ หาได้จากประโยคสัญลักษณ์การลบใด */
function relationFindQ(id: string, level: Level, a: number, b: number, kind: QuestionKind): Question {
  const s = a + b
  assert(s <= 20, `${id} ผลบวกต้องไม่เกิน 20`)
  const answer = `${s} − ${b} = ${a}`
  return {
    id,
    topic: 'relation',
    chapter: 6,
    level,
    kind,
    format: kind === 'fill' ? 'sentence' : undefined,
    text: `ใช้ความสัมพันธ์ของการบวกและการลบหาตัวไม่ทราบค่า: Δ + ${b} = ${s} ตัวเลขใน Δ หาได้จากประโยคสัญลักษณ์การลบใด`,
    small: kind === 'fill' ? 'ใช้แป้นตัวเลขและเครื่องหมาย เขียนประโยคสัญลักษณ์การลบ' : 'เลือกข้อที่ถูกต้อง',
    answer,
    choices: kind === 'choice' ? [answer, `${s} − ${b} = ${a + 1}`, `${s} + ${b} = ${a}`] : undefined,
    hint: `Δ คือจำนวนที่บวกกับ ${b} แล้วได้ ${s}`,
    explain: `${s} − ${b} = ${a} ดังนั้น Δ = ${a}`,
    steps: [
      `Δ คือจำนวนที่บวกกับ ${b} แล้วได้ ${s}`,
      `หาได้จากการลบ: ${s} − ${b} = ${a}`,
      `ตรวจคำตอบ: ${a} + ${b} = ${s}`,
    ],
    model: { type: 'add', a, b },
  }
}

// ── เส้นจำนวน: นับเพิ่ม = เดินไปทางขวา ถอยหลัง = เดินไปทางซ้าย ──

const lineRange = (x: number, y: number) => ({
  min: Math.max(0, Math.min(x, y) - 2),
  max: Math.min(20, Math.max(x, y) + 2),
})

function lineMoveQ(
  id: string,
  start: number,
  count: number,
  dir: 'forward' | 'back',
  level: Level,
  kind: QuestionKind,
): Question {
  const forward = dir === 'forward'
  const end = forward ? start + count : start - count
  assert(end >= 0 && end <= 20, `${id} จำนวนบนเส้นจำนวนต้องอยู่ระหว่าง 0–20`)
  const verb = forward ? 'นับเพิ่ม' : 'ถอยหลัง'
  const equation = forward ? `${start} + ${count} = ${end}` : `${start} − ${count} = ${end}`
  return {
    id,
    topic: forward ? 'add' : 'sub',
    chapter: forward ? 5 : 6,
    level,
    kind,
    text: `ดูเส้นจำนวน เริ่มต้นที่ ${start} ${verb}ไป ${count} ช่อง จะถึงจำนวนใด`,
    small: smallFor(kind, 'เลือกคำตอบที่ถูกต้อง'),
    line: { ...lineRange(start, end), start, end },
    answer: String(end),
    choices: kind === 'choice' ? numChoices(end, [forward ? start - count : start + count]) : undefined,
    hint: forward ? 'นับเพิ่มคือเดินไปทางขวา' : 'ถอยหลังคือเดินไปทางซ้าย',
    explain: equation,
    steps: [
      `เริ่มที่ ${start}`,
      `${verb}ทีละ 1 ช่อง: ${range(forward ? start + 1 : start - 1, end).join(', ')}`,
      equation,
    ],
  }
}

function lineDistanceQ(id: string, from: number, to: number, level: Level, kind: QuestionKind): Question {
  const back = from > to
  const n = Math.abs(from - to)
  assert(n > 0 && from <= 20 && to <= 20, `${id} จำนวนบนเส้นจำนวนต้องไม่เกิน 20`)
  const equation = back ? `${from} − ${n} = ${to}` : `${from} + ${n} = ${to}`
  return {
    id,
    topic: back ? 'sub' : 'add',
    chapter: back ? 6 : 5,
    level,
    kind,
    text: back
      ? `จากเส้นจำนวน ถอยหลังจาก ${from} มาถึง ${to} ต้องถอยหลังกี่ช่อง`
      : `จากเส้นจำนวน นับเพิ่มจาก ${from} ไปถึง ${to} ต้องนับเพิ่มกี่ช่อง`,
    small: smallFor(kind, 'เลือกคำตอบที่ถูกต้อง'),
    line: { ...lineRange(from, to), start: from, end: to },
    answer: String(n),
    choices: kind === 'choice' ? numChoices(n, [to]) : undefined,
    hint: 'นับจำนวนช่องที่เดิน ไม่นับจุดเริ่มต้น',
    explain: equation,
    steps: [
      `เริ่มที่ ${from}`,
      `${back ? 'ถอยหลัง' : 'นับเพิ่ม'}ทีละ 1 ช่องจนถึง ${to}: ${range(back ? from - 1 : from + 1, to).join(', ')} นับได้ ${n} ช่อง`,
      equation,
    ],
  }
}

/** จากเส้นจำนวน ถอยหลังจาก a มาถึง b เขียนเป็นประโยคสัญลักษณ์การลบ */
function lineSentenceQ(id: string, from: number, to: number, level: Level, kind: QuestionKind): Question {
  const n = from - to
  assert(n > 0 && from <= 20, `${id} ต้องเป็นการถอยหลัง และจำนวนไม่เกิน 20`)
  const answer = `${from} − ${n} = ${to}`
  return {
    id,
    topic: 'sentence',
    chapter: 6,
    level,
    kind,
    format: kind === 'fill' ? 'sentence' : undefined,
    text: `จากเส้นจำนวน ถอยหลังจาก ${from} มาถึง ${to} ต้องถอยหลังกี่ช่อง เขียนเป็นประโยคสัญลักษณ์การลบ`,
    small: kind === 'fill' ? 'ใช้แป้นตัวเลขและเครื่องหมาย เขียนประโยคสัญลักษณ์' : 'เลือกประโยคสัญลักษณ์ที่ถูกต้อง',
    line: { ...lineRange(from, to), start: from, end: to },
    answer,
    choices: kind === 'choice' ? [answer, `${from} − ${n} = ${to + 1}`, `${to} − ${n} = ${from}`] : undefined,
    hint: 'นับจำนวนช่องที่ถอยหลัง แล้วเขียนเป็นการลบ',
    explain: answer,
    steps: [
      `ถอยหลังจาก ${from} ทีละ 1 ช่อง: ${range(from - 1, to).join(', ')} นับได้ ${n} ช่อง`,
      `ถอยหลังคือการลบ เขียนได้ ${answer}`,
    ],
  }
}

/** เขียนประโยคสัญลักษณ์เองแบบเติมคำตอบ (มีแป้น + − =) */
function sentenceFillQ(
  id: string,
  op: 'add' | 'sub',
  a: number,
  b: number,
  story: (a: number, b: number, result: number) => string,
  level: Level,
): Question {
  const result = op === 'add' ? a + b : a - b
  assert(result >= 0 && result <= 20 && a <= 20, `${id} จำนวนต้องอยู่ระหว่าง 0–20`)
  const answer = op === 'add' ? `${a} + ${b} = ${result}` : `${a} − ${b} = ${result}`
  return {
    id,
    topic: 'sentence',
    chapter: op === 'add' ? 5 : 6,
    level,
    kind: 'fill',
    format: 'sentence',
    text: `${story(a, b, result)} จงเขียนประโยคสัญลักษณ์`,
    small: 'ใช้แป้นตัวเลขและเครื่องหมาย + − = เขียนประโยคสัญลักษณ์',
    answer,
    // การบวกสลับที่กันได้ ผลบวกเท่าเดิม
    accept: op === 'add' ? [`${b} + ${a} = ${result}`] : undefined,
    hint: op === 'add' ? 'นำมารวมกันหรือเพิ่มขึ้น ใช้การบวก' : 'เอาออกหรือหาจำนวนที่เหลือ ใช้การลบ',
    explain: answer,
    steps: [
      op === 'add' ? 'นำจำนวนมารวมกัน จึงใช้การบวก' : 'มีของถูกเอาออกไป จึงใช้การลบ',
      `เขียนได้: ${answer}`,
    ],
    model: op === 'add' ? { type: 'add', a, b } : { type: 'sub', a, b },
  }
}

export const QUESTION_BANK: Question[] = [
  // ════════ บทที่ 4 จำนวน 11–20 ════════
  // อ่านจำนวน
  readQ('read-11', 11, 'medium'),
  readQ('read-14', 14, 'easy'),
  readQ('read-17', 17, 'easy'),
  readQ('read-19', 19, 'easy'),
  readQ('read-20', 20, 'medium'),
  // เขียนตัวเลขจากตัวหนังสือ
  writeQ('write-12', 12, 'easy', 'fill'),
  writeQ('write-13', 13, 'easy', 'choice'),
  writeQ('write-16', 16, 'easy', 'choice'),
  writeQ('write-19', 19, 'easy', 'fill'),
  writeQ('write-20', 20, 'medium', 'choice'),
  // ตัวเลขไทย
  thaiToArabicQ('thai-15', 15, 'easy'),
  thaiToArabicQ('thai-18', 18, 'medium'),
  arabicToThaiQ('thai-12', 12, 'easy'),
  arabicToThaiQ('thai-17', 17, 'medium'),
  // นับจากภาพ
  countQ('count-11', '🍎', 'แอปเปิล', 'ผล', 11, 'easy', 'choice'),
  countQ('count-13', '🐤', 'ลูกเจี๊ยบ', 'ตัว', 13, 'easy', 'fill'),
  countQ('count-14', '⭐', 'ดาว', 'ดวง', 14, 'easy', 'choice'),
  countQ('count-16', '🌸', 'ดอกไม้', 'ดอก', 16, 'medium', 'fill'),
  countQ('count-17', '🐟', 'ปลา', 'ตัว', 17, 'medium', 'choice'),
  countQ('count-20', '🎈', 'ลูกโป่ง', 'ลูก', 20, 'medium', 'choice'),

  // หลักสิบ หลักหน่วย
  composeQ('compose-13', 13, 'easy', 'fill'),
  composeQ('compose-16', 16, 'easy', 'choice'),
  composeQ('compose-19', 19, 'easy', 'choice'),
  composeQ('compose-20', 20, 'medium', 'choice'),
  tensQ('tens-15', 15, 'easy', 'choice'),
  tensQ('tens-20', 20, 'medium', 'fill'),
  onesQ('ones-19', 19, 'easy', 'choice'),
  onesQ('ones-20', 20, 'medium', 'choice'),
  onesQ('ones-14', 14, 'easy', 'fill'),
  digitPlaceQ('dplace-17', 17, 'ones', 'easy'),
  digitPlaceQ('dplace-13', 13, 'tens', 'easy'),
  digitPlaceQ('dplace-16', 16, 'ones', 'easy'),
  digitPlaceQ('dplace-20', 20, 'tens', 'medium'),
  digitValueQ('dvalue-18t', 18, 'tens', 'medium'),
  digitValueQ('dvalue-18o', 18, 'ones', 'medium'),
  digitValueQ('dvalue-14t', 14, 'tens', 'hard'),
  tenPictureQ('tenpic-12', 12, 'easy', 'choice'),
  tenPictureQ('tenpic-14', 14, 'easy', 'choice'),
  tenPictureQ('tenpic-17', 17, 'easy', 'fill'),
  tenPictureQ('tenpic-20', 20, 'medium', 'choice'),
  placeStatementQ('pstate-10', 10, 'medium', 'นาวานับสีเทียนรวมกันได้ 10 แท่งพอดี'),
  placeStatementQ('pstate-13', 13, 'easy', 'ในสวนมีต้นไม้ 13 ต้น'),
  placeStatementQ('pstate-15', 15, 'easy'),
  placeStatementQ('pstate-17', 17, 'easy', 'แม่ซื้อไข่ไก่มา 17 ฟอง'),
  placeStatementQ('pstate-20', 20, 'medium'),

  // เปรียบเทียบจำนวน = ≠ > <
  compareSignQ('cmp-18-15', 18, 15, 'easy'),
  compareSignQ('cmp-12-16', 12, 16, 'easy'),
  compareSignQ('cmp-14-14', 14, 14, 'easy'),
  compareSignQ('cmp-19-10', 19, 10, 'easy'),
  compareSignQ('cmp-20-11', 20, 11, 'medium'),
  compareSignQ('cmp-13-19', 13, 19, 'medium'),
  compareSignQ('cmp-17-17', 17, 17, 'medium'),
  compareSignQ('cmp-11-12', 11, 12, 'medium'),
  compareSignQ('cmp-9-15', 9, 15, 'medium'),
  compareWordQ('cmpw-12-16', 12, 16, 'easy'),
  compareWordQ('cmpw-18-15', 18, 15, 'easy'),
  compareWordQ('cmpw-14-14', 14, 14, 'easy'),
  compareWordQ('cmpw-20-17', 20, 17, 'medium'),
  readSignQ('sign-neq', '≠', 'easy'),
  readSignQ('sign-gt', '>', 'easy'),
  readSignQ('sign-lt', '<', 'easy'),
  compareTruthQ('truth-1', [[15, '=', 13], [15, '≠', 13], [13, '>', 15]], 'medium'),
  compareTruthQ('truth-2', [[12, '≠', 12], [20, '>', 18], [17, '>', 19]], 'medium'),
  compareTruthQ('truth-3', [[11, '>', 12], [13, '=', 13], [18, '≠', 18]], 'medium'),
  compareTruthQ('truth-4', [[16, '≠', 16], [12, '<', 15], [20, '=', 12]], 'hard'),
  extremeQ('max-1', [13, 18, 16], 'max', 'medium'),
  extremeQ('max-2', [20, 17, 19], 'max', 'medium'),
  extremeQ('min-1', [19, 12, 15], 'min', 'medium'),
  extremeQ('min-2', [16, 11, 13], 'min', 'medium'),
  moreLessQ('more-15', 15, [12, 15, 17], 'more', 'easy'),
  moreLessQ('more-18', 18, [16, 18, 20], 'more', 'medium'),
  moreLessQ('less-13', 13, [11, 13, 16], 'less', 'easy'),
  compareStoryQ('cstory-1', 'เก้า', 6, 'มิน', 9, 'รถของเล่น', 'คัน', 'easy'),
  compareStoryQ('cstory-2', 'นาวา', 15, 'ต้น', 12, 'ดินสอ', 'แท่ง', 'medium'),
  compareStoryQ('cstory-3', 'มิลิน', 13, 'น้อง', 18, 'สติกเกอร์', 'แผ่น', 'medium'),
  compareStoryQ('cstory-4', 'ปุ้ย', 20, 'ฝน', 17, 'ลูกแก้ว', 'ลูก', 'medium'),
  groupCompareQ('group-1', 'แอปเปิล', 13, 'ส้ม', 16, 'ผล', 'medium'),
  groupCompareQ('group-2', 'ลูกแก้วสีแดง', 18, 'ลูกแก้วสีฟ้า', 14, 'ลูก', 'medium'),

  // ลำดับ และแบบรูปของจำนวน (ทีละ 1 และทีละ 10)
  nextQ('next-11', 11, 'easy', 'choice'),
  nextQ('next-15', 15, 'easy', 'choice'),
  nextQ('next-19', 19, 'easy', 'fill'),
  prevQ('prev-20', 20, 'easy', 'choice'),
  prevQ('prev-17', 17, 'easy', 'fill'),
  prevQ('prev-11', 11, 'medium', 'choice'),
  betweenQ('between-13', 13, 'easy', 'fill'),
  betweenQ('between-17', 17, 'easy', 'choice'),
  sequenceQ('seq-1', 11, 1, 4, 2, 'easy', 'choice'),
  sequenceQ('seq-2', 15, 1, 5, 4, 'easy', 'fill'),
  sequenceQ('seq-3', 20, -1, 4, 3, 'easy', 'choice'),
  sequenceQ('seq-4', 16, -1, 4, 1, 'medium', 'fill'),
  sequenceQ('seq-5', 13, 1, 5, 4, 'medium', 'choice'),
  sequenceQ('seq-6', 17, 1, 4, 2, 'easy', 'choice'),
  sequenceQ('seq-7', 0, 10, 3, 2, 'medium', 'choice'),
  sequenceQ('seq-8', 20, -10, 3, 1, 'medium', 'choice'),
  sortQ('sort-1', [17, 12, 15], 'asc', 'easy'),
  sortQ('sort-2', [15, 18, 12], 'desc', 'easy'),
  sortQ('sort-3', [11, 19, 14, 16], 'desc', 'medium'),
  sortQ('sort-4', [20, 13, 18, 10], 'asc', 'medium'),
  sortQ('sort-5', [16, 11, 20, 13, 18], 'asc', 'hard'),

  // ════════ บทที่ 5 การบวกจำนวนไม่เกิน 20 ════════
  // ผลบวกไม่เกิน 10
  addQ('add-5-3', 5, 3, 'easy', 'choice'),
  addQ('add-4-2', 4, 2, 'easy', 'choice'),
  addQ('add-6-3', 6, 3, 'easy', 'fill'),
  addQ('add-7-2', 7, 2, 'easy', 'choice'),
  addQ('add-3-4', 3, 4, 'easy', 'choice'),
  addQ('add-2-8', 2, 8, 'easy', 'choice'),
  addQ('add-5-5', 5, 5, 'easy', 'fill'),
  // จำนวนที่มากกว่า 10 บวกจำนวนหนึ่งหลัก
  addQ('add-12-6', 12, 6, 'medium', 'choice'),
  addQ('add-11-5', 11, 5, 'medium', 'fill'),
  addQ('add-13-4', 13, 4, 'medium', 'choice'),
  addQ('add-10-7', 10, 7, 'medium', 'choice'),
  addQ('add-14-5', 14, 5, 'medium', 'choice'),
  addQ('add-15-3', 15, 3, 'medium', 'fill'),
  addQ('add-16-2', 16, 2, 'medium', 'choice'),
  addQ('add-12-7', 12, 7, 'medium', 'choice'),
  addQ('add-13-7', 13, 7, 'medium', 'choice'),
  // บวกข้ามสิบ (ทำให้ครบ 10)
  addQ('add-9-8', 9, 8, 'medium', 'choice'),
  addQ('add-8-6', 8, 6, 'medium', 'fill'),
  addQ('add-7-5', 7, 5, 'medium', 'choice'),
  addQ('add-9-4', 9, 4, 'medium', 'choice'),
  addQ('add-6-7', 6, 7, 'medium', 'choice'),
  addQ('add-8-8', 8, 8, 'medium', 'choice'),
  addQ('add-9-9', 9, 9, 'hard', 'fill'),
  addQ('add-7-6', 7, 6, 'medium', 'choice'),
  addQ('add-8-5', 8, 5, 'medium', 'choice'),
  addQ('add-4-9', 4, 9, 'medium', 'choice'),
  // หาตัวไม่ทราบค่า
  addUnknownQ('addu-3-6', 3, 6, 'second', 'easy', 'choice'),
  addUnknownQ('addu-7-5', 7, 5, 'second', 'medium', 'choice'),
  addUnknownQ('addu-10-8', 10, 8, 'second', 'medium', 'fill'),
  addUnknownQ('addu-6-5', 6, 5, 'second', 'medium', 'choice'),
  addUnknownQ('addu-12-7', 12, 7, 'second', 'medium', 'choice'),
  addUnknownQ('addu-8-7', 8, 7, 'second', 'hard', 'choice'),
  addUnknownQ('addu-9-5', 9, 5, 'first', 'hard', 'choice'),
  addUnknownQ('addu-9-8', 9, 8, 'first', 'hard', 'fill'),
  addUnknownQ('addu-9-4', 9, 4, 'first', 'hard', 'choice'),
  addUnknownQ('addu-d-7-5', 7, 5, 'second', 'medium', 'choice', 'Δ'),
  addUnknownQ('addu-d-9-5', 9, 5, 'first', 'hard', 'fill', 'Δ'),
  // เส้นจำนวน: นับเพิ่ม
  lineMoveQ('line-f-12-3', 12, 3, 'forward', 'easy', 'choice'),
  lineMoveQ('line-f-9-5', 9, 5, 'forward', 'medium', 'fill'),
  lineDistanceQ('line-d-13-18', 13, 18, 'medium', 'choice'),
  // เขียนประโยคสัญลักษณ์การบวกเอง
  sentenceFillQ(
    'senf-add-1',
    'add',
    2,
    4,
    (a, b, s) => `ไอศกรีม ${a} ถ้วย รวมกับไอศกรีม ${b} ถ้วย เป็น ${s} ถ้วย`,
    'easy',
  ),
  sentenceFillQ('senf-add-2', 'add', 9, 5, (a, b) => `บนต้นไม้มีนก ${a} ตัว บินมาเพิ่มอีก ${b} ตัว`, 'medium'),
  sentenceFillQ('senf-add-3', 'add', 12, 6, (a, b) => `มีดินสอ ${a} แท่ง ซื้อเพิ่มอีก ${b} แท่ง`, 'medium'),

  // ประโยคสัญลักษณ์การบวก
  sentenceAddQ('sen-add-1', 'easy', 5, 4, '🐤'),
  sentenceAddQ('sen-add-2', 'easy', 7, 3, '🐟', (a, b) => `มีปลา ${a} ตัว ซื้อมาเพิ่มอีก ${b} ตัว`),
  sentenceAddQ('sen-add-3', 'medium', 8, 4, '🎈', (a, b) => `มีลูกโป่ง ${a} ลูก ได้มาอีก ${b} ลูก`),
  sentenceAddQ('sen-add-4', 'medium', 12, 5, '🍊', (a, b) => `ในจานมีส้ม ${a} ผล วางเพิ่มอีก ${b} ผล`),
  sentenceAddQ(
    'sen-add-5',
    'medium',
    9,
    6,
    '🌸',
    (a, b) => `มีดอกไม้สีชมพู ${a} ดอก ดอกไม้สีขาว ${b} ดอก นำมารวมกัน`,
  ),
  sentenceAddQ('sen-add-6', 'medium', 11, 6, '🍬', (a, b) => `มีลูกอม ${a} เม็ด แม่ให้มาอีก ${b} เม็ด`),

  // โจทย์ปัญหาการบวก
  wordAddQ(
    'word-add-1',
    'easy',
    4,
    5,
    'ฟอง',
    (a, b) => `แม่ไก่ออกไข่วันแรก ${a} ฟอง วันที่สอง ${b} ฟอง รวมเป็นไข่กี่ฟอง`,
  ),
  wordAddQ(
    'word-add-2',
    'medium',
    9,
    6,
    'แท่ง',
    (a, b) => `มิลินมีดินสอ ${a} แท่ง แม่ซื้อให้อีก ${b} แท่ง มิลินมีดินสอทั้งหมดกี่แท่ง`,
  ),
  wordAddQ(
    'word-add-3',
    'medium',
    12,
    5,
    'ตัว',
    (a, b) => `ในสวนมีนก ${a} ตัว บินมาเพิ่มอีก ${b} ตัว ในสวนมีนกทั้งหมดกี่ตัว`,
  ),
  wordAddQ(
    'word-add-4',
    'medium',
    8,
    9,
    'คน',
    (a, b) => `ห้องเรียนมีนักเรียนชาย ${a} คน นักเรียนหญิง ${b} คน ห้องเรียนนี้มีนักเรียนทั้งหมดกี่คน`,
  ),
  wordAddQ(
    'word-add-5',
    'medium',
    11,
    7,
    'เม็ด',
    (a, b) => `มีลูกอมสีแดง ${a} เม็ด สีเขียว ${b} เม็ด มีลูกอมทั้งหมดกี่เม็ด`,
  ),
  wordAddQ(
    'word-add-6',
    'medium',
    14,
    4,
    'เล่ม',
    (a, b) => `มีสมุด ${a} เล่ม ครูให้มาอีก ${b} เล่ม มีสมุดทั้งหมดกี่เล่ม`,
  ),
  wordAddQ(
    'word-add-7',
    'hard',
    6,
    7,
    'หน้า',
    (a, b) =>
      `มิลินอ่านหนังสือวันจันทร์ ${a} หน้า วันอังคารอ่านอีก ${b} หน้า สองวันมิลินอ่านหนังสือทั้งหมดกี่หน้า`,
    'fill',
  ),
  wordOperationQ(
    'word-op-add-1',
    'easy',
    'add',
    10,
    5,
    (a, b) => `มีไก่ ${a} ตัว ซื้อมาอีก ${b} ตัว มีไก่ทั้งหมดกี่ตัว`,
  ),
  wordOperationQ(
    'word-op-add-2',
    'medium',
    'add',
    8,
    7,
    (a, b) => `มีส้ม ${a} ผล มีมังคุด ${b} ผล มีผลไม้รวมกันกี่ผล`,
  ),

  // ════════ บทที่ 6 การลบจำนวนไม่เกิน 20 ════════
  // ตัวตั้งไม่เกิน 10
  subQ('sub-9-4', 9, 4, 'easy', 'choice'),
  subQ('sub-8-3', 8, 3, 'easy', 'choice'),
  subQ('sub-7-5', 7, 5, 'easy', 'fill'),
  subQ('sub-10-6', 10, 6, 'easy', 'choice'),
  subQ('sub-6-2', 6, 2, 'easy', 'choice'),
  subQ('sub-10-3', 10, 3, 'easy', 'fill'),
  subQ('sub-9-9', 9, 9, 'easy', 'choice'),
  // ไม่ต้องลบข้ามสิบ
  subQ('sub-15-3', 15, 3, 'medium', 'choice'),
  subQ('sub-18-7', 18, 7, 'medium', 'choice'),
  subQ('sub-19-5', 19, 5, 'medium', 'fill'),
  subQ('sub-17-4', 17, 4, 'medium', 'choice'),
  subQ('sub-16-6', 16, 6, 'medium', 'choice'),
  subQ('sub-14-2', 14, 2, 'medium', 'choice'),
  subQ('sub-20-10', 20, 10, 'medium', 'choice'),
  subQ('sub-18-8', 18, 8, 'medium', 'fill'),
  subQ('sub-19-13', 19, 13, 'medium', 'choice'),
  subQ('sub-17-12', 17, 12, 'medium', 'choice'),
  // ลบข้ามสิบ (ลบให้เหลือ 10 ก่อน)
  subQ('sub-20-6', 20, 6, 'medium', 'choice'),
  subQ('sub-13-5', 13, 5, 'medium', 'choice'),
  subQ('sub-12-8', 12, 8, 'medium', 'fill'),
  subQ('sub-15-7', 15, 7, 'medium', 'choice'),
  subQ('sub-11-4', 11, 4, 'medium', 'choice'),
  subQ('sub-14-9', 14, 9, 'medium', 'choice'),
  subQ('sub-16-8', 16, 8, 'medium', 'fill'),
  subQ('sub-17-9', 17, 9, 'medium', 'choice'),
  subQ('sub-12-3', 12, 3, 'medium', 'choice'),
  subQ('sub-13-8', 13, 8, 'medium', 'choice'),
  subQ('sub-20-13', 20, 13, 'hard', 'choice'),
  subQ('sub-11-9', 11, 9, 'hard', 'choice'),
  // หาตัวไม่ทราบค่า
  subUnknownQ('subu-9-5', 9, 5, 'second', 'easy', 'choice'),
  subUnknownQ('subu-12-5', 12, 5, 'second', 'medium', 'choice'),
  subUnknownQ('subu-16-6', 16, 6, 'second', 'medium', 'fill'),
  subUnknownQ('subu-15-3', 15, 3, 'second', 'medium', 'choice'),
  subUnknownQ('subu-18-9', 18, 9, 'second', 'hard', 'choice'),
  subUnknownQ('subu-20-7', 20, 7, 'second', 'hard', 'choice'),
  subUnknownQ('subu-14-5', 14, 5, 'first', 'hard', 'choice'),
  subUnknownQ('subu-15-7', 15, 7, 'first', 'hard', 'fill'),
  subUnknownQ('subu-11-6', 11, 6, 'first', 'hard', 'choice'),
  subUnknownQ('subu-d-16-6', 16, 6, 'second', 'medium', 'choice', 'Δ'),
  subUnknownQ('subu-d-14-5', 14, 5, 'first', 'hard', 'choice', 'Δ'),
  // เส้นจำนวน: ถอยหลัง
  lineMoveQ('line-b-8-2', 8, 2, 'back', 'easy', 'fill'),
  lineMoveQ('line-b-17-4', 17, 4, 'back', 'medium', 'choice'),
  lineMoveQ('line-b-20-3', 20, 3, 'back', 'medium', 'choice'),
  lineDistanceQ('line-d-10-4', 10, 4, 'medium', 'choice'),
  lineDistanceQ('line-d-19-12', 19, 12, 'hard', 'fill'),
  lineSentenceQ('line-s-10-4', 10, 4, 'medium', 'fill'),
  lineSentenceQ('line-s-16-11', 16, 11, 'hard', 'choice'),
  // เขียนประโยคสัญลักษณ์การลบเอง
  sentenceFillQ('senf-sub-1', 'sub', 13, 5, (a, b) => `มีส้ม ${a} ผล แบ่งให้น้อง ${b} ผล`, 'medium'),
  sentenceFillQ('senf-sub-2', 'sub', 17, 8, (a, b) => `แจกันมีดอกไม้ ${a} ดอก เหี่ยวไป ${b} ดอก`, 'medium'),
  sentenceFillQ(
    'senf-sub-3',
    'sub',
    14,
    9,
    (a, b, d) => `มีลูกแก้ว ${a} ลูก ทำหายไป ${b} ลูก เหลือ ${d} ลูก`,
    'hard',
  ),

  // ประโยคสัญลักษณ์การลบ
  sentenceSubQ('sen-sub-1', 'easy', 9, 3, '🐦', (a, b) => `มีนก ${a} ตัว บินไป ${b} ตัว`),
  sentenceSubQ('sen-sub-2', 'medium', 15, 4, '🍎', (a, b) => `มีแอปเปิล ${a} ผล กินไป ${b} ผล`),
  sentenceSubQ('sen-sub-3', 'medium', 12, 5, '🎈', (a, b) => `มีลูกโป่ง ${a} ลูก แตกไป ${b} ลูก`),
  sentenceSubQ('sen-sub-4', 'medium', 17, 6, '🍪', (a, b) => `มีคุกกี้ ${a} ชิ้น แบ่งให้น้อง ${b} ชิ้น`),
  sentenceSubQ('sen-sub-5', 'medium', 20, 8, '🍬', (a, b) => `มีลูกอม ${a} เม็ด กินไป ${b} เม็ด`),

  // โจทย์ปัญหาการลบ
  wordSubQ(
    'word-sub-1',
    'easy',
    14,
    3,
    'เล่ม',
    (a, b) => `ในตู้มีหนังสือ ${a} เล่ม ครูหยิบออกไป ${b} เล่ม ในตู้เหลือหนังสือกี่เล่ม`,
  ),
  wordSubQ(
    'word-sub-2',
    'medium',
    18,
    6,
    'ชิ้น',
    (a, b) => `มีขนม ${a} ชิ้น ให้เพื่อนไป ${b} ชิ้น เหลือขนมกี่ชิ้น`,
  ),
  wordSubQ(
    'word-sub-3',
    'medium',
    20,
    7,
    'ฟอง',
    (a, b) => `แม่มีไข่ ${a} ฟอง ใช้ทำอาหาร ${b} ฟอง เหลือไข่กี่ฟอง`,
  ),
  wordSubQ(
    'word-sub-4',
    'medium',
    16,
    9,
    'ลูก',
    (a, b) => `มีลูกโป่ง ${a} ลูก แตกไป ${b} ลูก เหลือลูกโป่งกี่ลูก`,
    'fill',
  ),
  wordSubQ(
    'word-sub-5',
    'medium',
    13,
    5,
    'ตัว',
    (a, b) => `ในบ่อมีปลา ${a} ตัว ช้อนออกไป ${b} ตัว ในบ่อเหลือปลากี่ตัว`,
  ),
  // โจทย์เปรียบเทียบ
  wordDiffQ(
    'word-diff-1',
    'medium',
    15,
    9,
    'แผ่น',
    (big, little) =>
      `มิลินมีสติกเกอร์ ${big} แผ่น น้องมีสติกเกอร์ ${little} แผ่น มิลินมีสติกเกอร์มากกว่าน้องกี่แผ่น`,
  ),
  wordDiffQ(
    'word-diff-2',
    'medium',
    18,
    13,
    'ผล',
    (big, little) =>
      `ต้นส้มมีผล ${big} ผล ต้นมะม่วงมีผล ${little} ผล ต้นส้มมีผลมากกว่าต้นมะม่วงกี่ผล`,
  ),
  wordDiffQ(
    'word-diff-3',
    'medium',
    16,
    12,
    'ตัว',
    (big, little) =>
      `ห้องเรียนมีเก้าอี้ ${big} ตัว มีนักเรียน ${little} คน เก้าอี้มีมากกว่านักเรียนกี่ตัว`,
  ),
  wordDiffQ(
    'word-diff-4',
    'hard',
    12,
    7,
    'ลูก',
    (big, little) => `แดงมีลูกแก้ว ${little} ลูก ดำมีลูกแก้ว ${big} ลูก แดงมีลูกแก้วน้อยกว่าดำกี่ลูก`,
  ),
  wordDiffQ(
    'word-diff-5',
    'hard',
    19,
    11,
    'อัน',
    (big, little) => `มียางลบ ${little} อัน มีไม้บรรทัด ${big} อัน ไม้บรรทัดมีมากกว่ายางลบกี่อัน`,
    'fill',
  ),
  wordDiffQ(
    'word-diff-6',
    'hard',
    17,
    9,
    'คน',
    (big, little) =>
      `ทีมแดงมีนักกีฬา ${big} คน ทีมฟ้ามีนักกีฬา ${little} คน สองทีมมีนักกีฬาต่างกันกี่คน`,
  ),
  wordOperationQ(
    'word-op-sub-1',
    'easy',
    'sub',
    15,
    6,
    (a, b) => `มีนก ${a} ตัว บินหนีไป ${b} ตัว เหลือนกกี่ตัว`,
  ),
  wordOperationQ(
    'word-op-sub-2',
    'medium',
    'sub',
    13,
    8,
    (a, b) => `มีส้ม ${a} ผล มีกล้วย ${b} ผล ส้มมากกว่ากล้วยกี่ผล`,
  ),

  // ความสัมพันธ์ของการบวกและการลบ
  relationSubQ('rel-1', 'medium', 8, 5, 'choice'),
  relationSubQ('rel-2', 'medium', 6, 9, 'fill'),
  relationSubQ('rel-3', 'medium', 7, 4, 'choice'),
  relationAddQ('rel-4', 'medium', 5, 7, 'choice'),
  relationCheckQ('rel-5', 'hard', 9, 8),
  relationCheckQ('rel-6', 'hard', 8, 6),
  relationWhichQ('rel-which-1', 'medium', 4, 5),
  relationWhichQ('rel-which-2', 'medium', 8, 6),
  relationWhichQ('rel-which-3', 'hard', 9, 7),
  relationFindQ('rel-find-1', 'medium', 5, 4, 'choice'),
  relationFindQ('rel-find-2', 'hard', 8, 7, 'fill'),
  relationFindQ('rel-find-3', 'hard', 6, 9, 'choice'),
]

/** ค้นข้อสอบจาก id (ใช้กับการทบทวนข้อที่เคยผิด) */
export const QUESTION_BY_ID: ReadonlyMap<string, Question> = new Map(
  QUESTION_BANK.map((q) => [q.id, q]),
)
