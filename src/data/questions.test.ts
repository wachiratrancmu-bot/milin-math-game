import { describe, it, expect } from 'vitest'
import { QUESTION_BANK, QUESTION_BY_ID } from './questions'
import { EXAM_BLUEPRINT, TOPIC_NAMES } from './curriculum'
import { LESSONS } from './lessons'
import type { Question, Topic } from '../types'

// ──────────────────────────────────────────────────────────────
// ตรวจความถูกต้องของคลังข้อสอบแบบอิสระ: คิดคำตอบใหม่จากโจทย์เอง
// แล้วเทียบกับคำตอบในคลัง (ไม่พึ่งฟังก์ชันที่ใช้สร้างข้อสอบ)
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
const fromThai = (s: string) => Number([...s].map((c) => '๐๑๒๓๔๕๖๗๘๙'.indexOf(c)).join(''))
const calc = (a: number, op: string, b: number) => (op === '+' ? a + b : a - b)
const EQUATION = /(\d+) ([+−]) (\d+) = (\d+)/g
const FULL_EQUATION = /^(\d+) ([+−]) (\d+) = (\d+)$/
const UNKNOWN = /(\d+|[□Δ]) ([+−]) (\d+|[□Δ]) = (\d+|[□Δ])/
const COMPARISON = /^(\d+) (=|≠|>|<) (\d+)$/

/** ประโยคสัญลักษณ์ที่สมบูรณ์เป็นจริงหรือไม่ */
function isTrueEquation(s: string): boolean {
  const m = s.match(FULL_EQUATION)
  return !!m && calc(+m[1], m[2], +m[3]) === +m[4]
}
function holds(a: number, sign: string, b: number): boolean {
  return sign === '=' ? a === b : sign === '≠' ? a !== b : sign === '>' ? a > b : a < b
}
const choiceQs = QUESTION_BANK.filter((q) => q.kind === 'choice')
const textOf = (q: Question) => [q.text, q.hint, q.explain, q.answer, ...(q.steps ?? [])]

describe('โครงสร้างคลังข้อสอบ', () => {
  it('id ไม่ซ้ำกัน และค้นหาตาม id ได้', () => {
    const ids = QUESTION_BANK.map((q) => q.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const q of QUESTION_BANK) expect(QUESTION_BY_ID.get(q.id)).toBe(q)
  })

  it('ทุกข้ออยู่ในบทที่ 4–6 และอยู่ในทักษะที่รู้จัก', () => {
    for (const q of QUESTION_BANK) {
      expect([4, 5, 6], q.id).toContain(q.chapter)
      expect(Object.keys(TOPIC_NAMES), q.id).toContain(q.topic)
    }
  })

  it('ข้อเลือกตอบ: มี 2–3 ตัวเลือก (ก ข ค) ไม่ซ้ำ และมีคำตอบที่ถูกอยู่ในตัวเลือก', () => {
    for (const q of choiceQs) {
      const choices = q.choices ?? []
      expect(choices.length, q.id).toBeGreaterThanOrEqual(2)
      expect(choices.length, q.id).toBeLessThanOrEqual(3)
      expect(new Set(choices).size, `${q.id} ตัวเลือกซ้ำ`).toBe(choices.length)
      expect(choices, q.id).toContain(q.answer)
    }
  })

  it('ข้อเติมคำตอบ: ตอบเป็นตัวเลข หรือเป็นประโยคสัญลักษณ์ที่เป็นจริง', () => {
    for (const q of QUESTION_BANK.filter((x) => x.kind === 'fill')) {
      if (q.format === 'sentence') {
        expect(isTrueEquation(q.answer), `${q.id}: ${q.answer}`).toBe(true)
        for (const a of q.accept ?? []) expect(isTrueEquation(a), `${q.id}: ${a}`).toBe(true)
      } else {
        expect(q.answer, q.id).toMatch(/^\d+$/)
      }
    }
  })

  it('ไม่มีคำใบ้ระหว่างทำข้อสอบ แต่ทุกข้อมีวิธีคิดให้ดูหลังตอบ', () => {
    for (const q of QUESTION_BANK) {
      const steps = q.steps ?? [q.hint, q.explain].filter(Boolean)
      expect(steps.length, q.id).toBeGreaterThan(0)
    }
  })
})

describe('ความถูกต้องของการคำนวณ', () => {
  it('ทุกสมการในโจทย์ วิธีคิด และคำตอบ คำนวณถูกต้อง', () => {
    for (const q of QUESTION_BANK) {
      for (const field of textOf(q)) {
        for (const m of (field ?? '').matchAll(EQUATION)) {
          expect(calc(+m[1], m[2], +m[3]), `${q.id}: ${m[0]}`).toBe(+m[4])
        }
      }
    }
  })

  it('โจทย์ที่มี □ หรือ Δ เมื่อแทนด้วยคำตอบแล้วสมการเป็นจริง', () => {
    let checked = 0
    for (const q of QUESTION_BANK) {
      if (q.format === 'sentence' || q.topic === 'relation') continue
      const m = q.text.match(UNKNOWN)
      if (!m || !/[□Δ]/.test(m[0])) continue
      const [a, b, c] = [m[1], m[3], m[4]].map((x) => (/[□Δ]/.test(x) ? +q.answer : +x))
      expect(calc(a, m[2], b), `${q.id}: ${q.text} ตอบ ${q.answer}`).toBe(c)
      checked++
    }
    expect(checked).toBeGreaterThan(30)
  })

  it('ความสัมพันธ์ของการบวกและการลบ: ตัวเลือกที่เป็นจริงมีเพียงข้อเดียวและเป็นคำตอบ', () => {
    for (const q of choiceQs.filter((x) => x.topic === 'relation')) {
      const choices = q.choices ?? []
      if (!choices.every((c) => FULL_EQUATION.test(c))) continue
      expect(choices.filter(isTrueEquation), q.id).toEqual([q.answer])
    }
  })

  it('“Δ + b = s หาได้จากประโยคลบใด” ตอบ s − b = Δ', () => {
    for (const q of QUESTION_BANK) {
      const m = q.text.match(/Δ \+ (\d+) = (\d+) ตัวเลขใน Δ หาได้จากประโยคสัญลักษณ์การลบใด/)
      if (!m) continue
      expect(q.answer, q.id).toBe(`${m[2]} − ${m[1]} = ${+m[2] - +m[1]}`)
    }
  })

  it('“ถ้า a + b = s แล้วข้อใดถูกต้อง” ตอบด้วยประโยคลบในชุดตัวเลขเดียวกัน', () => {
    for (const q of QUESTION_BANK) {
      const m = q.text.match(/ถ้า (\d+) \+ (\d+) = (\d+) แล้วข้อใดถูกต้อง/)
      if (!m) continue
      const am = q.answer.match(FULL_EQUATION)
      expect(am?.[2], q.id).toBe('−')
      expect(am?.[1], q.id).toBe(m[3])
      expect([m[1], m[2]].sort(), q.id).toEqual([am?.[3], am?.[4]].sort())
    }
  })

  it('ประโยคสัญลักษณ์จากเรื่องราว: เป็นจริง และใช้จำนวนจากโจทย์', () => {
    for (const q of QUESTION_BANK.filter((x) => x.topic === 'sentence' && !x.line)) {
      expect(isTrueEquation(q.answer), q.id).toBe(true)
      const [a, , b] = q.answer.split(' ')
      // โจทย์จากภาพ: นับจำนวนสิ่งของแต่ละกลุ่มในภาพ
      const nums =
        q.text.match(/\d+/g) ??
        (q.visual ?? '').split('+').map((g) => String([...g.replace(/\s/g, '')].length))
      expect(nums, q.id).toContain(a)
      expect(nums, q.id).toContain(b)
      const op = q.answer.includes('+') ? 'add' : 'sub'
      expect(op, q.id).toBe(q.chapter === 5 ? 'add' : 'sub')
    }
  })
})

describe('ความถูกต้องของเนื้อหาบทที่ 4', () => {
  it('เครื่องหมาย = ≠ > < : มีตัวเลือกที่ถูกเพียงตัวเดียว', () => {
    for (const q of choiceQs) {
      const m = q.text.match(/^(\d+) □ (\d+)$/)
      if (!m) continue
      const ok = (q.choices ?? []).filter((s) => holds(+m[1], s, +m[2]))
      expect(ok, `${q.id} ต้องมีคำตอบเดียว`).toEqual([q.answer])
    }
  })

  it('คำเปรียบเทียบ มากกว่า น้อยกว่า เท่ากับ ถูกต้อง', () => {
    for (const q of QUESTION_BANK) {
      const m = q.text.match(/^(\d+) □ (\d+) ควรเติมคำใด$/)
      if (!m) continue
      const [a, b] = [+m[1], +m[2]]
      expect(q.answer, q.id).toBe(a > b ? 'มากกว่า' : a < b ? 'น้อยกว่า' : 'เท่ากับ')
    }
  })

  it('“ข้อใดถูกต้อง” มีประโยคที่เป็นจริงเพียงข้อเดียว', () => {
    for (const q of choiceQs.filter((x) => x.text === 'ข้อใดถูกต้อง')) {
      const truths = (q.choices ?? []).filter((c) => {
        const m = c.match(COMPARISON)
        expect(m, `${q.id}: ${c}`).not.toBeNull()
        return !!m && holds(+m[1], m[2], +m[3])
      })
      expect(truths, q.id).toEqual([q.answer])
    }
  })

  it('เครื่องหมายอ่านถูกต้อง', () => {
    const read: Record<string, string> = {
      '=': 'เท่ากับ',
      '≠': 'ไม่เท่ากับ',
      '>': 'มากกว่า',
      '<': 'น้อยกว่า',
    }
    for (const q of QUESTION_BANK) {
      const m = q.text.match(/^เครื่องหมาย (\S) อ่านว่าอย่างไร$/)
      if (m) expect(q.answer, q.id).toBe(read[m[1]])
    }
  })

  it('จำนวนที่มากที่สุด/น้อยที่สุด มากกว่า/น้อยกว่า และระหว่าง ถูกต้อง', () => {
    for (const q of QUESTION_BANK) {
      const nums = (q.choices ?? []).map(Number)
      if (q.text === 'จำนวนใดมากที่สุด') expect(+q.answer, q.id).toBe(Math.max(...nums))
      if (q.text === 'จำนวนใดน้อยที่สุด') expect(+q.answer, q.id).toBe(Math.min(...nums))
      let m = q.text.match(/^จำนวนใด(มากกว่า|น้อยกว่า) (\d+)$/)
      if (m) {
        const [dir, t] = [m[1], +m[2]]
        const ok = nums.filter((x) => (dir === 'มากกว่า' ? x > t : x < t))
        expect(ok, `${q.id} ต้องมีคำตอบเดียว`).toEqual([+q.answer])
      }
      m = q.text.match(/^จำนวนที่อยู่ระหว่าง (\d+) กับ (\d+) คือจำนวนใด$/)
      if (m) expect(+q.answer, q.id).toBe((+m[1] + +m[2]) / 2)
      m = q.text.match(/^จำนวนที่อยู่ถัดจาก (\d+) คือจำนวนใด$/)
      if (m) expect(+q.answer, q.id).toBe(+m[1] + 1)
      m = q.text.match(/^จำนวนที่อยู่ก่อน (\d+) คือจำนวนใด$/)
      if (m) expect(+q.answer, q.id).toBe(+m[1] - 1)
      m = q.text.match(/^มี(.+) (\d+) \S+ มี(.+) (\d+) \S+ สิ่งใดมีจำนวนมากกว่า$/)
      if (m) expect(q.answer, q.id).toBe(+m[2] > +m[4] ? m[1] : m[3])
    }
  })

  it('เปรียบเทียบจากเรื่องราว: ประโยคที่ถูกใช้คำเปรียบเทียบตรงกับจำนวน', () => {
    let checked = 0
    for (const q of QUESTION_BANK.filter((x) =>
      x.text.endsWith('ข้อใดเปรียบเทียบจำนวนได้ถูกต้อง'),
    )) {
      const m = q.answer.match(/(\d+) \S+ (มากกว่า|น้อยกว่า) .+ (\d+) \S+$/)
      expect(m, q.id).not.toBeNull()
      if (!m) continue
      const [a, word, b] = [+m[1], m[2], +m[3]]
      expect(word, q.id).toBe(a > b ? 'มากกว่า' : 'น้อยกว่า')
      expect((q.text.match(/\d+/g) ?? []).map(Number).sort(), q.id).toEqual([a, b].sort())
      checked++
    }
    expect(checked).toBeGreaterThanOrEqual(3)
  })

  it('คำอ่าน ตัวเลขฮินดูอารบิก และตัวเลขไทยตรงกัน', () => {
    for (const q of QUESTION_BANK) {
      let m = q.text.match(/^จำนวน (\d+) อ่านว่าอย่างไร$/)
      if (m) expect(q.answer, q.id).toBe(WORDS[+m[1]])
      m = q.text.match(/^“(.+)” เขียนเป็นตัวเลขได้อย่างไร$/)
      if (m) expect(WORDS[+q.answer], q.id).toBe(m[1])
      m = q.text.match(/^ตัวเลขไทย (\S+) คือจำนวนใด$/)
      if (m) expect(+q.answer, q.id).toBe(fromThai(m[1]))
      m = q.text.match(/^(\d+) เขียนเป็นตัวเลขไทยได้อย่างไร$/)
      if (m) expect(fromThai(q.answer), q.id).toBe(+m[1])
    }
  })

  it('จำนวนสิ่งของในภาพตรงกับคำตอบ', () => {
    for (const q of QUESTION_BANK) {
      if (!q.visual) continue
      const items = [...q.visual.replace(/\s/g, '')]
      if (q.text.startsWith('นับ')) expect(items.length, q.id).toBe(+q.answer)
      if (q.text === 'ภาพนี้แทนจำนวนใด') {
        const value = items.reduce((sum, c) => sum + (c === '🔟' ? 10 : c === '⭐' ? 1 : 0), 0)
        expect(value, q.id).toBe(+q.answer)
      }
    }
  })

  it('หลักและค่าประจำหลักถูกต้อง', () => {
    for (const q of QUESTION_BANK) {
      let m = q.text.match(/^(\d+) มี (\d+|□) สิบ กับ (\d+|□) หน่วย$/)
      if (m) {
        const [n, t, o] = [m[1], m[2], m[3]].map((x) => (x === '□' ? +q.answer : +x))
        expect(t * 10 + o, q.id).toBe(n)
      }
      m = q.text.match(/^(\d+) สิบ กับ (\d+) หน่วย เป็นจำนวนใด$/)
      if (m) expect(+q.answer, q.id).toBe(+m[1] * 10 + +m[2])
      m = q.text.match(/^เลข (\d) ใน (\d+) อยู่ในหลักใด$/)
      if (m) expect(q.answer, q.id).toBe(m[2][0] === m[1] ? 'หลักสิบ' : 'หลักหน่วย')
      m = q.text.match(/^เลข (\d) ใน (\d+) มีค่าเท่าไร$/)
      if (m) expect(+q.answer, q.id).toBe(m[2][0] === m[1] ? +m[1] * 10 : +m[1])
      m = q.text.match(/ข้อใดบอกหลักของตัวเลขใน (\d+) ได้ถูกต้อง$/)
      if (m) {
        const [t, o] = [...m[1]]
        expect(q.answer, q.id).toBe(`เลข ${t} อยู่ในหลักสิบ และเลข ${o} อยู่ในหลักหน่วย`)
      }
    }
  })

  it('การเรียงลำดับถูกต้อง และแบบรูปเพิ่มหรือลดทีละ 1 หรือทีละ 10 (ค 1.2 ป.1/1)', () => {
    for (const q of QUESTION_BANK) {
      const m = q.text.match(/^เรียงจำนวน (.+) จาก(น้อยไปมาก|มากไปน้อย)$/)
      if (m) {
        const nums = m[1].trim().split(/\s+/).map(Number)
        expect(nums.length, q.id).toBeGreaterThanOrEqual(3)
        expect(nums.length, q.id).toBeLessThanOrEqual(5)
        const sorted = nums.sort((a, b) => (m[2] === 'น้อยไปมาก' ? a - b : b - a))
        expect(q.answer, q.id).toBe(sorted.join(', '))
      }
      if (q.text === 'จำนวนใดหายไปจากแบบรูป' && q.visual) {
        const seq = q.visual.split(', ').map((x) => (x === '□' ? +q.answer : +x))
        const step = seq[1] - seq[0]
        expect([1, -1, 10, -10], q.id).toContain(step)
        seq.forEach((x, i) => expect(x, q.id).toBe(seq[0] + i * step))
      }
    }
  })
})

describe('เส้นจำนวน', () => {
  const lineQs = QUESTION_BANK.filter((q) => q.line)

  it('มีโจทย์เส้นจำนวนทั้งนับเพิ่มและถอยหลัง', () => {
    expect(lineQs.some((q) => q.text.includes('นับเพิ่ม'))).toBe(true)
    expect(lineQs.some((q) => q.text.includes('ถอยหลัง'))).toBe(true)
  })

  it('เส้นจำนวนครอบคลุมจุดเริ่มต้นและจุดปลาย อยู่ในช่วง 0–20', () => {
    for (const q of lineQs) {
      const { min, max, start, end } = q.line!
      expect(min, q.id).toBeGreaterThanOrEqual(0)
      expect(max, q.id).toBeLessThanOrEqual(20)
      for (const v of [start, end]) {
        expect(v, q.id).toBeGreaterThanOrEqual(min)
        expect(v, q.id).toBeLessThanOrEqual(max)
      }
    }
  })

  it('เริ่มที่ a นับเพิ่ม/ถอยหลังไป n ช่อง ได้คำตอบถูกต้อง', () => {
    for (const q of lineQs) {
      const m = q.text.match(/เริ่มต้นที่ (\d+) (นับเพิ่ม|ถอยหลัง)ไป (\d+) ช่อง/)
      if (!m) continue
      const expected = m[2] === 'นับเพิ่ม' ? +m[1] + +m[3] : +m[1] - +m[3]
      expect(+q.answer, q.id).toBe(expected)
      expect(q.line, q.id).toMatchObject({ start: +m[1], end: expected })
    }
  })

  it('ระยะบนเส้นจำนวน และประโยคสัญลักษณ์การลบจากเส้นจำนวน ถูกต้อง', () => {
    for (const q of lineQs) {
      const m = q.text.match(/(นับเพิ่ม|ถอยหลัง)จาก (\d+) (?:ไป|มา)ถึง (\d+)/)
      if (!m) continue
      const [from, to] = [+m[2], +m[3]]
      const distance = Math.abs(to - from)
      expect(q.line, q.id).toMatchObject({ start: from, end: to })
      if (q.topic === 'sentence') expect(q.answer, q.id).toBe(`${from} − ${distance} = ${to}`)
      else expect(+q.answer, q.id).toBe(distance)
    }
  })
})

describe('ขอบเขตตามแนวข้อสอบ', () => {
  it('ใช้จำนวนไม่เกิน 20 ในโจทย์และคำตอบ และตัวเลือกบทที่ 5–6 ไม่เกิน 20', () => {
    // บทที่ 4 ใช้ตัวลวงสลับหลัก เช่น 13 กับ 31 ได้ เพราะ ค 1.1 ป.1/1 ครอบคลุมจำนวนถึง 100
    for (const q of QUESTION_BANK) {
      const extra = q.chapter === 4 ? [] : [...(q.choices ?? []), ...(q.accept ?? [])]
      const all = [q.text, q.answer, ...extra].join(' ')
      const nums = all.match(/\d+/g) ?? []
      for (const n of nums) expect(+n, `${q.id}: ${all}`).toBeLessThanOrEqual(20)
    }
  })

  it('มีรูปแบบข้อสอบตามแบบทดสอบของโรงเรียนครบ', () => {
    const has = (re: RegExp) => QUESTION_BANK.some((q) => re.test(q.text))
    expect(has(/ข้อใดบอกหลักของตัวเลขใน/)).toBe(true)
    expect(has(/ข้อใดเปรียบเทียบจำนวนได้ถูกต้อง/)).toBe(true)
    expect(has(/จงเขียนประโยคสัญลักษณ์/)).toBe(true)
    expect(has(/ถ้า \d+ \+ \d+ = \d+ แล้วข้อใดถูกต้อง/)).toBe(true)
    expect(has(/ถอยหลังไป \d+ ช่อง/)).toBe(true)
    expect(has(/ถอยหลังจาก \d+ มาถึง \d+/)).toBe(true)
    expect(has(/Δ/)).toBe(true)
    expect(has(/≠/) || QUESTION_BANK.some((q) => q.choices?.some((c) => c.includes('≠')))).toBe(
      true,
    )
  })

  it('เรื่องราวในโจทย์ไม่ซ้ำกัน (ข้อสอบชุดเดียวกันจะไม่เจอเรื่องเดิมสองครั้ง)', () => {
    const stories = QUESTION_BANK.filter(
      (q) => (q.topic === 'word' || q.topic === 'sentence') && !q.line && /\d/.test(q.text),
    ).map((q) => q.text.split(' ').slice(0, 4).join(' '))
    const dup = stories.filter((s, i) => stories.indexOf(s) !== i)
    expect(dup).toEqual([])
  })

  it('แต่ละบทมีข้อสอบพอสำหรับฝึก 15 ข้อ', () => {
    for (const ch of [4, 5, 6]) {
      expect(QUESTION_BANK.filter((q) => q.chapter === ch).length).toBeGreaterThanOrEqual(30)
    }
  })

  it('ข้อแบบเลือกตอบของแต่ละทักษะพอสำหรับข้อสอบจำลอง (อย่างน้อย 2 เท่าของจำนวนข้อ)', () => {
    for (const [topic, n] of Object.entries(EXAM_BLUEPRINT) as [Topic, number][]) {
      const choice = choiceQs.filter((q) => q.topic === topic)
      expect(choice.length, topic).toBeGreaterThanOrEqual(n * 2)
    }
  })

  it('มีข้อเติมคำตอบพอสำหรับตอนที่ 2 ของข้อสอบจำลอง', () => {
    expect(QUESTION_BANK.filter((q) => q.kind === 'fill').length).toBeGreaterThanOrEqual(15)
  })

  it('ข้อสอบจำลองมี 20 ข้อตามแนวข้อสอบ', () => {
    const total = Object.values(EXAM_BLUEPRINT).reduce((a, b) => a + b, 0)
    expect(total).toBe(20)
  })
})

describe('บทเรียน', () => {
  it('id ไม่ซ้ำ และทุกบทมีเนื้อหาและทักษะสำหรับฝึก', () => {
    const ids = LESSONS.map((l) => l.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const l of LESSONS) {
      expect(l.slides.length, l.id).toBeGreaterThan(0)
      expect(l.practiceTopics.length, l.id).toBeGreaterThan(0)
      expect(l.indicators.length, l.id).toBeGreaterThan(0)
    }
  })

  it('ทุกสมการในบทเรียนคำนวณถูกต้อง', () => {
    for (const l of LESSONS) {
      for (const s of l.slides) {
        for (const field of [s.title, s.big, ...s.body]) {
          for (const m of (field ?? '').matchAll(EQUATION)) {
            expect(calc(+m[1], m[2], +m[3]), `${l.id}: ${m[0]}`).toBe(+m[4])
          }
        }
      }
    }
  })

  it('เส้นจำนวนในบทเรียนครอบคลุมจุดเริ่มต้นและจุดปลาย', () => {
    for (const l of LESSONS) {
      for (const s of l.slides) {
        if (!s.line) continue
        const { min, max, start, end } = s.line
        expect(min <= Math.min(start, end) && Math.max(start, end) <= max, l.id).toBe(true)
      }
    }
  })

  it('ไม่ใช้จำนวนเกิน 20 ในบทเรียน', () => {
    for (const l of LESSONS) {
      for (const s of l.slides) {
        const nums = [s.title, s.big ?? '', ...s.body].join(' ').match(/\d+/g) ?? []
        for (const n of nums) expect(+n, `${l.id}: ${s.title}`).toBeLessThanOrEqual(20)
      }
    }
  })
})
