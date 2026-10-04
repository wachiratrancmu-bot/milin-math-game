import { describe, it, expect } from 'vitest'
import { QUESTION_BANK, TOPIC_NAMES, EXAM_BLUEPRINT } from './questions'
import type { Topic } from '../types'

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
const UNKNOWN = /(\d+|□) ([+−]) (\d+|□) = (\d+|□)/

describe('โครงสร้างคลังข้อสอบ', () => {
  it('id ไม่ซ้ำกัน', () => {
    const ids = QUESTION_BANK.map((q) => q.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('ทุกข้ออยู่ในบทที่ 4–6 และอยู่ในหัวข้อที่รู้จัก', () => {
    for (const q of QUESTION_BANK) {
      expect([4, 5, 6], q.id).toContain(q.chapter)
      expect(Object.keys(TOPIC_NAMES), q.id).toContain(q.topic)
    }
  })

  it('ข้อเลือกตอบ: ตัวเลือกไม่ซ้ำ มีอย่างน้อย 2 ตัว และมีคำตอบที่ถูกอยู่ในตัวเลือก', () => {
    for (const q of QUESTION_BANK.filter((x) => x.kind === 'choice')) {
      const choices = q.choices ?? []
      expect(choices.length, q.id).toBeGreaterThanOrEqual(2)
      expect(new Set(choices).size, `${q.id} ตัวเลือกซ้ำ`).toBe(choices.length)
      expect(choices, q.id).toContain(q.answer)
    }
  })

  it('ข้อเติมคำ: คำตอบเป็นตัวเลขที่พิมพ์ได้', () => {
    for (const q of QUESTION_BANK.filter((x) => x.kind === 'fill')) {
      expect(q.answer, q.id).toMatch(/^\d+$/)
    }
  })
})

describe('ความถูกต้องของเนื้อหา', () => {
  it('ทุกสมการในโจทย์ คำใบ้ วิธีคิด และคำตอบ คำนวณถูกต้อง', () => {
    for (const q of QUESTION_BANK) {
      for (const field of [q.text, q.hint, q.explain, q.answer]) {
        for (const m of (field ?? '').matchAll(EQUATION)) {
          expect(calc(+m[1], m[2], +m[3]), `${q.id}: ${m[0]}`).toBe(+m[4])
        }
      }
    }
  })

  it('โจทย์ที่มี □ เมื่อแทนด้วยคำตอบแล้วสมการเป็นจริง', () => {
    for (const q of QUESTION_BANK) {
      const m = q.text.match(UNKNOWN)
      if (!m || !m[0].includes('□')) continue
      const [a, b, c] = [m[1], m[3], m[4]].map((x) => (x === '□' ? +q.answer : +x))
      expect(calc(a, m[2], b), `${q.id}: ${q.text} ตอบ ${q.answer}`).toBe(c)
    }
  })

  it('เครื่องหมายและคำเปรียบเทียบถูกต้อง', () => {
    for (const q of QUESTION_BANK) {
      const m = q.text.match(/^(\d+) □ (\d+)( ควรเติมคำใด)?$/)
      if (!m) continue
      const [a, b] = [+m[1], +m[2]]
      const expected = m[3]
        ? a > b
          ? 'มากกว่า'
          : a < b
            ? 'น้อยกว่า'
            : 'เท่ากับ'
        : a > b
          ? '>'
          : a < b
            ? '<'
            : '='
      expect(q.answer, q.id).toBe(expected)
    }
  })

  it('จำนวนที่มากที่สุด/น้อยที่สุดถูกต้อง', () => {
    for (const q of QUESTION_BANK) {
      const nums = (q.choices ?? []).map(Number)
      if (q.text === 'จำนวนใดมากที่สุด') expect(+q.answer, q.id).toBe(Math.max(...nums))
      if (q.text === 'จำนวนใดน้อยที่สุด') expect(+q.answer, q.id).toBe(Math.min(...nums))
    }
  })

  it('มากกว่า/น้อยกว่า/ระหว่าง และการเปรียบเทียบสองกลุ่มถูกต้อง', () => {
    for (const q of QUESTION_BANK) {
      let m = q.text.match(/^จำนวนใด(มากกว่า|น้อยกว่า) (\d+)$/)
      if (m) {
        const [dir, t] = [m[1], +m[2]]
        const ok = (q.choices ?? []).map(Number).filter((x) => (dir === 'มากกว่า' ? x > t : x < t))
        expect(ok, `${q.id} ต้องมีคำตอบเดียว`).toEqual([+q.answer])
      }
      m = q.text.match(/^จำนวนที่อยู่ระหว่าง (\d+) กับ (\d+) คือจำนวนใด$/)
      if (m) expect(+q.answer, q.id).toBe((+m[1] + +m[2]) / 2)
      m = q.text.match(/^มี(.+) (\d+) \S+ มี(.+) (\d+) \S+ สิ่งใดมีจำนวนมากกว่า$/)
      if (m) expect(q.answer, q.id).toBe(+m[2] > +m[4] ? m[1] : m[3])
      m = q.text.match(/^เลข (\d) ใน (\d+) มีค่าเท่าไร$/)
      if (m) {
        const [d, n] = [m[1], m[2]]
        expect(+q.answer, q.id).toBe(n[0] === d ? +d * 10 : +d)
      }
    }
  })

  it('คำอ่าน ตัวเลข และเลขไทยตรงกัน', () => {
    for (const q of QUESTION_BANK) {
      let m = q.text.match(/^จำนวน (\d+) อ่านว่าอย่างไร$/)
      if (m) expect(q.answer, q.id).toBe(WORDS[+m[1]])
      m = q.text.match(/^“(.+)” เขียนเป็นตัวเลขได้อย่างไร$/)
      if (m) expect(WORDS[+q.answer], q.id).toBe(m[1])
      m = q.text.match(/^เลขไทย (.+) คือจำนวนใด$/)
      if (m) expect(+q.answer, q.id).toBe(fromThai(m[1]))
      m = q.text.match(/^(\d+) เขียนเป็นเลขไทยได้อย่างไร$/)
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

  it('หลักสิบและหลักหน่วยถูกต้อง', () => {
    for (const q of QUESTION_BANK) {
      let m = q.text.match(/^(\d+) มี (\d+|□) สิบ กับ (\d+|□) หน่วย$/)
      if (m) {
        const [n, t, o] = [m[1], m[2], m[3]].map((x) => (x === '□' ? +q.answer : +x))
        expect(t * 10 + o, q.id).toBe(n)
      }
      m = q.text.match(/^(\d+) สิบ กับ (\d+) หน่วย เป็นจำนวนใด$/)
      if (m) expect(+q.answer, q.id).toBe(+m[1] * 10 + +m[2])
      m = q.text.match(/^เลข (\d) ใน (\d+) อยู่ในหลักใด$/)
      if (m) {
        const [d, n] = [m[1], m[2]]
        expect(q.answer, q.id).toBe(n[0] === d ? 'หลักสิบ' : 'หลักหน่วย')
      }
    }
  })

  it('การเรียงลำดับและแบบรูปถูกต้อง', () => {
    for (const q of QUESTION_BANK) {
      const m = q.text.match(/^เรียงจำนวน (.+) จาก(น้อยไปมาก|มากไปน้อย)$/)
      if (m) {
        const nums = m[1].split(/\s+/).map(Number)
        const sorted = nums.sort((a, b) => (m[2] === 'น้อยไปมาก' ? a - b : b - a))
        expect(q.answer, q.id).toBe(sorted.join(', '))
      }
      if (q.text === 'เติมจำนวนที่หายไป' && q.visual) {
        const seq = q.visual.split(', ').map((x) => (x === '□' ? +q.answer : +x))
        const step = seq[1] - seq[0]
        seq.forEach((x, i) => expect(x, q.id).toBe(seq[0] + i * step))
      }
    }
  })

  it('บทที่ 5–6 ใช้จำนวนไม่เกิน 20 ทั้งในโจทย์และคำตอบ', () => {
    for (const q of QUESTION_BANK.filter((x) => x.chapter === 5 || x.chapter === 6)) {
      const nums = `${q.text} ${q.answer}`.match(/\d+/g) ?? []
      for (const n of nums) expect(+n, `${q.id}: ${q.text}`).toBeLessThanOrEqual(20)
    }
  })
})

describe('จำนวนข้อสอบเพียงพอ', () => {
  it('แต่ละบทมีข้อสอบพอสำหรับฝึก 15 ข้อ', () => {
    for (const ch of [4, 5, 6]) {
      expect(QUESTION_BANK.filter((q) => q.chapter === ch).length).toBeGreaterThanOrEqual(30)
    }
  })

  it('ข้อแบบเลือกตอบของแต่ละหัวข้อพอสำหรับข้อสอบจำลอง', () => {
    for (const [topic, n] of Object.entries(EXAM_BLUEPRINT) as [Topic, number][]) {
      const choice = QUESTION_BANK.filter((q) => q.topic === topic && q.kind === 'choice')
      expect(choice.length, topic).toBeGreaterThanOrEqual(n * 2)
    }
  })

  it('ข้อสอบจำลอง 20 ข้อตามน้ำหนักแนวข้อสอบ', () => {
    const total = Object.values(EXAM_BLUEPRINT).reduce((a, b) => a + b, 0)
    expect(total).toBe(20)
  })
})
