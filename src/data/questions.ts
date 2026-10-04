import type { Chapter, Level, Question, QuestionKind, Topic } from '../types'

// ──────────────────────────────────────────────────────────────
// คลังข้อสอบคณิตศาสตร์ ป.1 ตามแนวข้อสอบบทที่ 4–6
//   บทที่ 4 จำนวน 11–20
//   บทที่ 5 การบวกจำนวนไม่เกิน 20
//   บทที่ 6 การลบจำนวนไม่เกิน 20
// ข้อคำนวณสร้างด้วยฟังก์ชันด้านล่าง ซึ่งคิดคำตอบ ตัวเลือก และวิธีคิดจากตัวเลขจริง
// จึงไม่มีทางที่โจทย์กับคำตอบจะขัดกัน (มีเทสต์ตรวจซ้ำใน questions.test.ts)
// ──────────────────────────────────────────────────────────────

export const TOPIC_NAMES: Record<Topic, string> = {
  number: 'อ่าน เขียน และนับจำนวน 11–20',
  place: 'หลักสิบและหลักหน่วย',
  compare: 'การเปรียบเทียบจำนวน',
  order: 'การเรียงลำดับและการนับ',
  add: 'การบวกไม่เกิน 20',
  sub: 'การลบไม่เกิน 20',
  sentence: 'ประโยคสัญลักษณ์',
  word: 'โจทย์ปัญหา',
  relation: 'ความสัมพันธ์ของการบวกและการลบ',
}

export const TOPIC_ICONS: Record<Topic, string> = {
  number: '🔢',
  place: '🧮',
  compare: '⚖️',
  order: '🚂',
  add: '➕',
  sub: '➖',
  sentence: '✏️',
  word: '📖',
  relation: '🔁',
}

export const CHAPTER_NAMES: Record<Chapter, string> = {
  4: 'บทที่ 4 จำนวน 11–20',
  5: 'บทที่ 5 การบวกจำนวนไม่เกิน 20',
  6: 'บทที่ 6 การลบจำนวนไม่เกิน 20',
}

/** สรุปสิ่งที่ต้องทำได้ก่อนสอบ แยกตามบท (แสดงที่หน้าแรก) */
export const CHAPTER_GUIDE: {
  chapter: Chapter
  icon: string
  points: string[]
  example: string
}[] = [
  {
    chapter: 4,
    icon: '🔢',
    points: [
      'อ่านและเขียนจำนวน 11–20 (ตัวเลข ตัวหนังสือ เลขไทย)',
      'นับจำนวนจากภาพ นับเพิ่มและนับถอยหลัง',
      'เปรียบเทียบด้วย มากกว่า น้อยกว่า เท่ากับ (> < =)',
      'บอกหลักสิบและหลักหน่วย',
    ],
    example: '15 = 1 สิบ กับ 5 หน่วย · 20 = 2 สิบ กับ 0 หน่วย',
  },
  {
    chapter: 5,
    icon: '➕',
    points: [
      'หาผลบวกที่ไม่เกิน 20',
      'หาตัวไม่ทราบค่า เช่น 7 + □ = 12',
      'เขียนประโยคสัญลักษณ์จากภาพหรือเรื่องราว',
      'โจทย์ปัญหาการบวก',
    ],
    example: '9 + 8 → ทำให้ครบ 10 ก่อน: 9 + 1 = 10 แล้ว 10 + 7 = 17',
  },
  {
    chapter: 6,
    icon: '➖',
    points: [
      'หาผลลบของจำนวนไม่เกิน 20',
      'หาตัวไม่ทราบค่า เช่น 12 − □ = 7',
      'เขียนประโยคสัญลักษณ์การลบ',
      'โจทย์ปัญหา “เหลือ” “มากกว่ากันกี่” “ต่างกันเท่าไร”',
      'ตรวจคำตอบการลบด้วยการบวก',
    ],
    example: '13 − 5 → ลบให้เหลือ 10 ก่อน: 13 − 3 = 10 แล้ว 10 − 2 = 8',
  },
]

/**
 * จำนวนข้อต่อหัวข้อในข้อสอบ 20 ข้อ (ใช้เป็นน้ำหนักเวลาสุ่มชุด)
 * บทที่ 4 = 7 ข้อ · การคำนวณบวก/ลบ = 6 ข้อ · ประโยคสัญลักษณ์ 2 · โจทย์ปัญหา 4 · ความสัมพันธ์ 1
 */
export const EXAM_BLUEPRINT: Record<Topic, number> = {
  number: 2,
  place: 2,
  compare: 2,
  order: 1,
  add: 3,
  sub: 3,
  sentence: 2,
  word: 4,
  relation: 1,
}

export const LEVEL_NAMES = {
  easy: 'เริ่มต้น',
  medium: 'เก่งขึ้น',
  hard: 'ท้าทาย',
} as const

// ── เครื่องมือช่วยสร้างข้อสอบ ─────────────────────────────────

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

/** วาดภาพสิ่งของ จัดเป็นกลุ่มละ 10 ให้นับง่าย */
const picture = (e: string, n: number) => {
  const groups: string[] = []
  for (let left = n; left > 0; left -= 10) groups.push(repeat(e, Math.min(10, left)))
  return groups.join(' ')
}

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(`คลังข้อสอบผิดพลาด: ${msg}`)
}

/** ตัวเลือกตัวเลข 4 ตัว: คำตอบ + ตัวลวงที่มาจากความผิดพลาดที่พบบ่อย + จำนวนข้างเคียง */
function numChoices(answer: number, extra: number[] = [], max = 20): string[] {
  const out = [answer]
  const candidates = [...extra, answer + 1, answer - 1, answer + 2, answer - 2, answer + 3, answer - 3]
  for (const c of candidates) {
    if (out.length === 4) break
    if (Number.isInteger(c) && c >= 0 && c <= max && !out.includes(c)) out.push(c)
  }
  return out.map(String)
}

const smallFor = (kind: QuestionKind, choiceText: string, fillText = 'พิมพ์คำตอบ') =>
  kind === 'fill' ? fillText : choiceText

// ── บทที่ 4: อ่าน เขียน นับ ────────────────────────────────

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
    choices: uniq([WORDS[n], wrong, ...near]).slice(0, 4),
    hint:
      n === 11
        ? 'เลข 1 ที่อยู่หลักหน่วยของจำนวนสองหลัก อ่านว่า “เอ็ด”'
        : n === 20
          ? '2 สิบ อ่านว่า “ยี่สิบ”'
          : `${n} คือ ${tensOnes(n)} อ่านว่า สิบ แล้วตามด้วย ${ONES[ones(n)]}`,
    explain: `${n} อ่านว่า ${WORDS[n]}`,
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
  }
}

function thaiToArabicQ(id: string, n: number, level: Level): Question {
  return {
    id,
    topic: 'number',
    chapter: 4,
    level,
    kind: 'choice',
    text: `เลขไทย ${thai(n)} คือจำนวนใด`,
    small: 'เลือกเลขฮินดูอารบิกที่ตรงกัน',
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
    text: `${n} เขียนเป็นเลขไทยได้อย่างไร`,
    small: 'เลือกเลขไทยที่ถูกต้อง',
    answer: thai(n),
    choices: numChoices(n, [reversed(n)], 99).map((s) => thai(Number(s))),
    hint: [...String(n)].map((d) => `${d} เขียนเป็น ${THAI_DIGITS[Number(d)]}`).join(' และ '),
    explain: `${n} เขียนเป็นเลขไทยได้ ${thai(n)}`,
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
    small: n > 10 ? 'กรอบแรกมี 10 แล้วนับต่อในกรอบถัดไป' : 'ชี้แล้วนับทีละหนึ่ง',
    visual: picture(emoji, n),
    answer: String(n),
    choices: kind === 'choice' ? numChoices(n) : undefined,
    hint: n > 10 ? `กรอบแรกมี 10 นับต่อไปอีก ${n - 10} ได้ ${n}` : `นับทีละหนึ่งจนครบ`,
    explain: `นับได้ ${n} ${unit}`,
  }
}

// ── บทที่ 4: หลักสิบ หลักหน่วย ────────────────────────────

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
    hint: `${tens(n)} สิบ คือ ${tens(n) * 10} รวมกับ ${ones(n)} หน่วย`,
    explain: `${tens(n) * 10} + ${ones(n)} = ${n}`,
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
    hint: 'เลขทางซ้ายอยู่ในหลักสิบ',
    explain: `${n} = ${tensOnes(n)}`,
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
    hint: 'เลขทางขวาอยู่ในหลักหน่วย',
    explain: `${n} = ${tensOnes(n)}`,
  }
}

function digitPlaceQ(id: string, n: number, pos: 'tens' | 'ones', level: Level): Question {
  assert(tens(n) !== ones(n), `${id} เลขโดดซ้ำกัน ทำให้คำถามกำกวม`)
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
    hint: 'เลขทางซ้ายอยู่ในหลักสิบ เลขทางขวาอยู่ในหลักหน่วย',
    explain: `${n} = ${tensOnes(n)} เลข ${digit} จึงอยู่ใน${answer}`,
  }
}

function digitValueQ(id: string, n: number, pos: 'tens' | 'ones', level: Level): Question {
  assert(tens(n) !== ones(n), `${id} เลขโดดซ้ำกัน ทำให้คำถามกำกวม`)
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
    hint: pos === 'tens' ? `เลขในหลักสิบ 1 ตัว มีค่า 10` : `เลขในหลักหน่วยมีค่าเท่ากับตัวมันเอง`,
    explain:
      pos === 'tens'
        ? `เลข ${digit} อยู่ในหลักสิบ มีค่า ${digit} สิบ คือ ${value}`
        : `เลข ${digit} อยู่ในหลักหน่วย มีค่า ${value}`,
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
    hint: `นับ 🔟 ได้ ${tens(n)} สิบ นับ ⭐ ได้ ${ones(n)} หน่วย`,
    explain: `${tensOnes(n)} คือ ${n}`,
  }
}

// ── บทที่ 4: เปรียบเทียบ ──────────────────────────────────

const signOf = (a: number, b: number) => (a > b ? '>' : a < b ? '<' : '=')
const SIGN_WORD: Record<string, string> = { '>': 'มากกว่า', '<': 'น้อยกว่า', '=': 'เท่ากับ' }

function compareHint(a: number, b: number) {
  if (a === b) return 'สองจำนวนเท่ากัน ใช้ “เท่ากับ” (=)'
  return `ดูหลักสิบก่อน ถ้าหลักสิบเท่ากันให้ดูหลักหน่วย ${Math.max(a, b)} มากกว่า ${Math.min(a, b)}`
}

function compareSignQ(id: string, a: number, b: number, level: Level): Question {
  const s = signOf(a, b)
  return {
    id,
    topic: 'compare',
    chapter: 4,
    level,
    kind: 'choice',
    text: `${a} □ ${b}`,
    small: 'เลือกเครื่องหมายที่เติมใน □',
    answer: s,
    choices: ['>', '<', '='],
    hint: `${compareHint(a, b)} (ด้านที่อ้ากว้างของเครื่องหมายหันไปทางจำนวนที่มากกว่า)`,
    explain: `${a} ${s} ${b} อ่านว่า ${a} ${SIGN_WORD[s]} ${b}`,
  }
}

function compareWordQ(id: string, a: number, b: number, level: Level): Question {
  const w = SIGN_WORD[signOf(a, b)]
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
  return {
    id,
    topic: 'compare',
    chapter: 4,
    level,
    kind: 'choice',
    text: `จำนวนใด${dir === 'more' ? 'มากกว่า' : 'น้อยกว่า'} ${target}`,
    small: 'เลือกคำตอบที่ถูกต้อง',
    answer: String(ok[0]),
    choices: options.map(String),
    hint: `${dir === 'more' ? 'มากกว่า' : 'น้อยกว่า'} ${target} ไม่นับ ${target} เอง`,
    explain: `${ok[0]} ${dir === 'more' ? 'มากกว่า' : 'น้อยกว่า'} ${target}`,
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

// ── บทที่ 4: เรียงลำดับ นับเพิ่ม นับถอยหลัง ───────────────

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

function sequenceQ(
  id: string,
  start: number,
  step: number,
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
    text: 'เติมจำนวนที่หายไป',
    small: 'สังเกตว่าจำนวนเพิ่มขึ้นหรือลดลงทีละเท่าไร',
    visual: seq.map((x, i) => (i === missing ? '□' : String(x))).join(', '),
    answer: String(answer),
    choices: kind === 'choice' ? numChoices(answer, [answer + step, answer - step]) : undefined,
    hint: step > 0 ? `นับเพิ่มทีละ ${step}` : `นับถอยหลังทีละ ${-step}`,
    explain: seq.join(', '),
  }
}

function sortQ(id: string, nums: number[], dir: 'asc' | 'desc', level: Level): Question {
  const sorted = [...nums].sort((x, y) => (dir === 'asc' ? x - y : y - x))
  const fmt = (xs: number[]) => xs.join(', ')
  const swapFirst = [sorted[1], sorted[0], ...sorted.slice(2)]
  const swapLast = [...sorted.slice(0, -2), sorted[sorted.length - 1], sorted[sorted.length - 2]]
  const choices = uniq([fmt(sorted), fmt([...sorted].reverse()), fmt(swapFirst), fmt(swapLast)])
  assert(choices.length === 4, `${id} ตัวเลือกซ้ำกัน`)
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
    hint: dir === 'asc' ? 'เริ่มจากจำนวนที่น้อยที่สุด' : 'เริ่มจากจำนวนที่มากที่สุด',
    explain: sorted.join(dir === 'asc' ? ' < ' : ' > '),
  }
}

// ── บทที่ 5: การบวก ───────────────────────────────────────

function addHint(a: number, b: number) {
  const s = a + b
  const big = Math.max(a, b)
  const little = Math.min(a, b)
  if (big < 10 && s > 10) {
    const need = 10 - big
    return `ทำให้ครบ 10 ก่อน: ${big} + ${need} = 10 แล้วบวกอีก ${little - need} ได้ ${s}`
  }
  if (big >= 10) {
    const u = big - 10
    return `${big} คือ 1 สิบ กับ ${u} หน่วย นำหน่วยมาบวกกัน ${u} + ${little} = ${u + little} รวมกับ 1 สิบ ได้ ${s}`
  }
  return `เริ่มจาก ${big} แล้วนับต่อไปอีก ${little} ได้ ${s}`
}

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
    visual: s <= 10 ? `${repeat('🍎', a)} + ${repeat('🍎', b)}` : undefined,
    answer: String(s),
    choices: kind === 'choice' ? numChoices(s, [Math.abs(a - b)]) : undefined,
    hint: addHint(a, b),
    explain: `${a} + ${b} = ${s}`,
  }
}

function addUnknownQ(
  id: string,
  a: number,
  b: number,
  missing: 'first' | 'second',
  level: Level,
  kind: QuestionKind,
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
    text: missing === 'second' ? `${a} + □ = ${s}` : `□ + ${b} = ${s}`,
    small: smallFor(kind, 'เลือกจำนวนที่เติมใน □'),
    answer: String(answer),
    choices: kind === 'choice' ? numChoices(answer, [s]) : undefined,
    hint:
      missing === 'second'
        ? `${known} ต้องเพิ่มอีกเท่าไรจึงได้ ${s} หาได้จาก ${s} − ${known} = ${answer}`
        : `จำนวนใดบวก ${known} แล้วได้ ${s} หาได้จาก ${s} − ${known} = ${answer}`,
    explain: `${a} + ${b} = ${s}`,
  }
}

// ── บทที่ 6: การลบ ────────────────────────────────────────

function subHint(a: number, b: number) {
  const d = a - b
  if (a <= 10) return `เริ่มจาก ${a} แล้วนับถอยหลังไป ${b} ได้ ${d}`
  if (a === 20) {
    if (b === 10) return '20 คือ 2 สิบ เอาออก 1 สิบ เหลือ 1 สิบ คือ 10'
    if (b < 10) return `20 คือ 2 สิบ นำ 10 − ${b} = ${10 - b} แล้วรวมกับอีก 1 สิบ ได้ ${d}`
    return `ลบ 10 ก่อน: 20 − 10 = 10 แล้วลบอีก ${b - 10} ได้ ${d}`
  }
  const u = a - 10
  if (b <= u) {
    return `${a} คือ 1 สิบ กับ ${u} หน่วย นำหน่วยมาลบกัน ${u} − ${b} = ${u - b} รวมกับ 1 สิบ ได้ ${d}`
  }
  if (b >= 10) return `ลบ 10 ก่อน: ${a} − 10 = ${u} แล้วลบอีก ${b - 10} ได้ ${d}`
  return `ลบให้เหลือ 10 ก่อน: ${a} − ${u} = 10 แล้วลบอีก ${b - u} ได้ ${d}`
}

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
  }
}

function subUnknownQ(
  id: string,
  a: number,
  b: number,
  missing: 'first' | 'second',
  level: Level,
  kind: QuestionKind,
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
    text: missing === 'second' ? `${a} − □ = ${d}` : `□ − ${b} = ${d}`,
    small: smallFor(kind, 'เลือกจำนวนที่เติมใน □'),
    answer: String(answer),
    choices: kind === 'choice' ? numChoices(answer, [d, missing === 'first' ? d - b : a + d]) : undefined,
    hint:
      missing === 'second'
        ? `${a} ต้องเอาออกเท่าไรจึงเหลือ ${d} หาได้จาก ${a} − ${d} = ${b}`
        : `จำนวนใดลบ ${b} แล้วเหลือ ${d} หาได้จาก ${d} + ${b} = ${a}`,
    explain: `${a} − ${b} = ${d}`,
  }
}

// ── บทที่ 5–6: ประโยคสัญลักษณ์ ─────────────────────────────

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
      : 'จากภาพ เขียนประโยคสัญลักษณ์การบวกได้อย่างไร',
    small: 'เลือกประโยคสัญลักษณ์ที่ถูกต้อง',
    visual: `${picture(emoji, a)} + ${picture(emoji, b)}`,
    answer,
    choices: uniq([answer, wrongOp, `${a} + ${b} = ${s + 1}`, `${a} + ${b} = ${s - 1}`]),
    hint: 'มีของเพิ่มเข้ามา จำนวนจึงมากขึ้น ใช้การบวก',
    explain: answer,
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
    choices: uniq([
      answer,
      `${a} + ${b} = ${a + b}`,
      `${a} − ${b} = ${d + 1}`,
      `${a} − ${b} = ${d > 0 ? d - 1 : d + 2}`,
    ]),
    hint: 'มีของถูกเอาออกไป จำนวนจึงลดลง ใช้การลบ',
    explain: answer,
  }
}

// ── บทที่ 5–6: โจทย์ปัญหา ───────────────────────────────────

const WORD_SMALL = 'อ่านโจทย์ให้เข้าใจ แล้วหาคำตอบ'

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
    small: kind === 'fill' ? 'อ่านโจทย์ แล้วพิมพ์คำตอบเป็นตัวเลข' : WORD_SMALL,
    answer: String(s),
    choices: kind === 'choice' ? numChoices(s, [Math.abs(a - b)]) : undefined,
    hint: `โจทย์ถามจำนวนทั้งหมดเมื่อนำมารวมกัน จึงใช้การบวก ${a} + ${b}`,
    explain: `${a} + ${b} = ${s} ตอบ ${s} ${unit}`,
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
    small: kind === 'fill' ? 'อ่านโจทย์ แล้วพิมพ์คำตอบเป็นตัวเลข' : WORD_SMALL,
    answer: String(d),
    choices: kind === 'choice' ? numChoices(d, [a + b]) : undefined,
    hint: `ของถูกเอาออกไป จำนวนที่เหลือจึงน้อยลง ใช้การลบ ${a} − ${b}`,
    explain: `${a} − ${b} = ${d} ตอบ ${d} ${unit}`,
  }
}

/** โจทย์เปรียบเทียบ “มากกว่ากันกี่ / น้อยกว่ากันกี่ / ต่างกันเท่าไร” */
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
    small: kind === 'fill' ? 'อ่านโจทย์ แล้วพิมพ์คำตอบเป็นตัวเลข' : WORD_SMALL,
    answer: String(d),
    choices: kind === 'choice' ? numChoices(d, [big + little, big]) : undefined,
    hint: `หาว่าต่างกันเท่าไร ให้นำจำนวนที่มากลบด้วยจำนวนที่น้อย ${big} − ${little}`,
    explain: `${big} − ${little} = ${d} ตอบ ${d} ${unit}`,
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
    small: 'คิดว่าจำนวนเพิ่มขึ้น หรือลดลง/หาผลต่าง',
    answer: op === 'add' ? 'การบวก' : 'การลบ',
    choices: ['การบวก', 'การลบ'],
    hint: 'รวมกันหรือเพิ่มขึ้น ใช้การบวก · เอาออก เหลือ หรือหาว่ามากกว่ากันกี่ ใช้การลบ',
    explain: `${op === 'add' ? 'ใช้การบวก' : 'ใช้การลบ'}: ${equation}`,
  }
}

// ── บทที่ 6: ความสัมพันธ์ของการบวกและการลบ ───────────────

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
    hint: `นำผลบวก ${s} ลบด้วย ${b} จะได้อีกจำนวนหนึ่งที่นำมาบวกกัน`,
    explain: `${s} − ${b} = ${a} เพราะ ${a} + ${b} = ${s}`,
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
    hint: `ผลลบ ${a} บวกกลับด้วย ${b} จะได้ตัวตั้ง ${s}`,
    explain: `${a} + ${b} = ${s}`,
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
    choices: [answer, `${a} + ${b} = ${s + 1}`, `${a} − ${b} = ${a - b}`, `${a} + ${b} = ${s - 1}`],
    hint: 'ตรวจคำตอบการลบ ทำได้โดยนำผลลบบวกกับตัวลบ ต้องได้ตัวตั้ง',
    explain: `${a} + ${b} = ${s} ตรงกับตัวตั้ง จึงตอบถูก`,
  }
}

// ──────────────────────────────────────────────────────────────
// คลังข้อสอบ
// ──────────────────────────────────────────────────────────────

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
  // เลขไทย
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

  // เปรียบเทียบจำนวน
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
  extremeQ('max-1', [13, 18, 11, 16], 'max', 'medium'),
  extremeQ('max-2', [20, 17, 19, 12], 'max', 'medium'),
  extremeQ('min-1', [19, 12, 15, 14], 'min', 'medium'),
  extremeQ('min-2', [16, 11, 18, 13], 'min', 'medium'),
  moreLessQ('more-15', 15, [12, 14, 15, 17], 'more', 'easy'),
  moreLessQ('more-18', 18, [16, 18, 20, 17], 'more', 'medium'),
  moreLessQ('less-13', 13, [11, 13, 16, 19], 'less', 'easy'),
  groupCompareQ('group-1', 'แอปเปิล', 13, 'ส้ม', 16, 'ผล', 'medium'),
  groupCompareQ('group-2', 'ลูกแก้วสีแดง', 18, 'ลูกแก้วสีฟ้า', 14, 'ลูก', 'medium'),

  // เรียงลำดับ นับเพิ่ม นับถอยหลัง
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
  sequenceQ('seq-5', 12, 2, 4, 3, 'medium', 'choice'),
  sequenceQ('seq-6', 10, 2, 5, 2, 'hard', 'choice'),
  sequenceQ('seq-7', 20, -2, 4, 2, 'hard', 'choice'),
  sortQ('sort-1', [17, 12, 15], 'asc', 'easy'),
  sortQ('sort-2', [15, 18, 12], 'desc', 'easy'),
  sortQ('sort-3', [11, 19, 14, 16], 'desc', 'medium'),
  sortQ('sort-4', [20, 13, 18, 10], 'asc', 'hard'),

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

  // ประโยคสัญลักษณ์การบวก
  sentenceAddQ('sen-add-1', 'easy', 5, 4, '🐤'),
  sentenceAddQ('sen-add-2', 'easy', 7, 3, '🐟', (a, b) => `มีปลา ${a} ตัว ซื้อมาเพิ่มอีก ${b} ตัว`),
  sentenceAddQ('sen-add-3', 'medium', 8, 4, '🎈', (a, b) => `มีลูกโป่ง ${a} ลูก ได้มาอีก ${b} ลูก`),
  sentenceAddQ('sen-add-4', 'medium', 12, 5, '🍊', (a, b) => `ในจานมีส้ม ${a} ผล วางเพิ่มอีก ${b} ผล`),
  sentenceAddQ('sen-add-5', 'medium', 9, 6, '🌸', (a, b) => `มีดอกไม้สีชมพู ${a} ดอก ดอกไม้สีขาว ${b} ดอก รวมกันทั้งหมด`),
  sentenceAddQ('sen-add-6', 'medium', 11, 6, '🍬', (a, b) => `มีลูกอม ${a} เม็ด แม่ให้มาอีก ${b} เม็ด`),

  // โจทย์ปัญหาการบวก
  wordAddQ('word-add-1', 'easy', 4, 5, 'ฟอง', (a, b) => `แม่ไก่ออกไข่วันแรก ${a} ฟอง วันที่สอง ${b} ฟอง รวมเป็นไข่กี่ฟอง`),
  wordAddQ('word-add-2', 'medium', 9, 6, 'แท่ง', (a, b) => `มิลินมีดินสอ ${a} แท่ง แม่ซื้อให้อีก ${b} แท่ง มิลินมีดินสอทั้งหมดกี่แท่ง`),
  wordAddQ('word-add-3', 'medium', 12, 5, 'ตัว', (a, b) => `ในสวนมีนก ${a} ตัว บินมาเพิ่มอีก ${b} ตัว ในสวนมีนกทั้งหมดกี่ตัว`),
  wordAddQ('word-add-4', 'medium', 8, 9, 'คน', (a, b) => `ห้องเรียนมีนักเรียนชาย ${a} คน นักเรียนหญิง ${b} คน ห้องเรียนนี้มีนักเรียนทั้งหมดกี่คน`),
  wordAddQ('word-add-5', 'medium', 11, 7, 'เม็ด', (a, b) => `มีลูกอมสีแดง ${a} เม็ด สีเขียว ${b} เม็ด มีลูกอมทั้งหมดกี่เม็ด`),
  wordAddQ('word-add-6', 'medium', 14, 4, 'เล่ม', (a, b) => `มีสมุด ${a} เล่ม ครูให้มาอีก ${b} เล่ม มีสมุดทั้งหมดกี่เล่ม`),
  wordAddQ('word-add-7', 'hard', 6, 7, 'หน้า', (a, b) => `มิลินอ่านหนังสือวันจันทร์ ${a} หน้า วันอังคารอ่านอีก ${b} หน้า สองวันมิลินอ่านหนังสือทั้งหมดกี่หน้า`, 'fill'),
  wordOperationQ('word-op-add-1', 'easy', 'add', 10, 5, (a, b) => `มีไก่ ${a} ตัว ซื้อมาอีก ${b} ตัว มีไก่ทั้งหมดกี่ตัว`),
  wordOperationQ('word-op-add-2', 'medium', 'add', 8, 7, (a, b) => `มีส้ม ${a} ผล มีมังคุด ${b} ผล มีผลไม้รวมกันกี่ผล`),

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

  // ประโยคสัญลักษณ์การลบ
  sentenceSubQ('sen-sub-1', 'easy', 9, 3, '🐦', (a, b) => `มีนก ${a} ตัว บินไป ${b} ตัว`),
  sentenceSubQ('sen-sub-2', 'medium', 15, 4, '🍎', (a, b) => `มีแอปเปิล ${a} ผล กินไป ${b} ผล`),
  sentenceSubQ('sen-sub-3', 'medium', 12, 5, '🎈', (a, b) => `มีลูกโป่ง ${a} ลูก แตกไป ${b} ลูก`),
  sentenceSubQ('sen-sub-4', 'medium', 17, 6, '🍪', (a, b) => `มีคุกกี้ ${a} ชิ้น แบ่งให้น้อง ${b} ชิ้น`),
  sentenceSubQ('sen-sub-5', 'medium', 20, 8, '🍬', (a, b) => `มีลูกอม ${a} เม็ด กินไป ${b} เม็ด`),

  // โจทย์ปัญหาการลบ
  wordSubQ('word-sub-1', 'easy', 14, 3, 'เล่ม', (a, b) => `ในตู้มีหนังสือ ${a} เล่ม ครูหยิบออกไป ${b} เล่ม ในตู้เหลือหนังสือกี่เล่ม`),
  wordSubQ('word-sub-2', 'medium', 18, 6, 'ชิ้น', (a, b) => `มีขนม ${a} ชิ้น ให้เพื่อนไป ${b} ชิ้น เหลือขนมกี่ชิ้น`),
  wordSubQ('word-sub-3', 'medium', 20, 7, 'ฟอง', (a, b) => `แม่มีไข่ ${a} ฟอง ใช้ทำอาหาร ${b} ฟอง เหลือไข่กี่ฟอง`),
  wordSubQ('word-sub-4', 'medium', 16, 9, 'ลูก', (a, b) => `มีลูกโป่ง ${a} ลูก แตกไป ${b} ลูก เหลือลูกโป่งกี่ลูก`, 'fill'),
  wordSubQ('word-sub-5', 'medium', 13, 5, 'ตัว', (a, b) => `ในบ่อมีปลา ${a} ตัว ช้อนออกไป ${b} ตัว ในบ่อเหลือปลากี่ตัว`),
  // โจทย์เปรียบเทียบ มากกว่ากันกี่ / น้อยกว่ากันกี่ / ต่างกันเท่าไร
  wordDiffQ('word-diff-1', 'medium', 15, 9, 'แผ่น', (big, little) => `มิลินมีสติกเกอร์ ${big} แผ่น น้องมีสติกเกอร์ ${little} แผ่น มิลินมีสติกเกอร์มากกว่าน้องกี่แผ่น`),
  wordDiffQ('word-diff-2', 'medium', 18, 13, 'ผล', (big, little) => `ต้นส้มมีผล ${big} ผล ต้นมะม่วงมีผล ${little} ผล ต้นส้มมีผลมากกว่าต้นมะม่วงกี่ผล`),
  wordDiffQ('word-diff-3', 'medium', 16, 12, 'ตัว', (big, little) => `ห้องเรียนมีเก้าอี้ ${big} ตัว มีนักเรียน ${little} คน เก้าอี้มีมากกว่านักเรียนกี่ตัว`),
  wordDiffQ('word-diff-4', 'hard', 12, 7, 'ลูก', (big, little) => `แดงมีลูกแก้ว ${little} ลูก ดำมีลูกแก้ว ${big} ลูก แดงมีลูกแก้วน้อยกว่าดำกี่ลูก`),
  wordDiffQ('word-diff-5', 'hard', 19, 11, 'อัน', (big, little) => `มียางลบ ${little} อัน มีไม้บรรทัด ${big} อัน ไม้บรรทัดมีมากกว่ายางลบกี่อัน`, 'fill'),
  wordDiffQ('word-diff-6', 'hard', 17, 9, 'คน', (big, little) => `ทีมแดงมีนักกีฬา ${big} คน ทีมฟ้ามีนักกีฬา ${little} คน สองทีมมีนักกีฬาต่างกันกี่คน`),
  wordOperationQ('word-op-sub-1', 'easy', 'sub', 15, 6, (a, b) => `มีนก ${a} ตัว บินหนีไป ${b} ตัว เหลือนกกี่ตัว`),
  wordOperationQ('word-op-sub-2', 'medium', 'sub', 13, 8, (a, b) => `มีส้ม ${a} ผล มีกล้วย ${b} ผล ส้มมากกว่ากล้วยกี่ผล`),

  // ความสัมพันธ์ของการบวกและการลบ
  relationSubQ('rel-1', 'medium', 8, 5, 'choice'),
  relationSubQ('rel-2', 'medium', 6, 9, 'fill'),
  relationSubQ('rel-3', 'medium', 7, 4, 'choice'),
  relationAddQ('rel-4', 'medium', 5, 7, 'choice'),
  relationCheckQ('rel-5', 'hard', 9, 8),
  relationCheckQ('rel-6', 'hard', 8, 6),
]
