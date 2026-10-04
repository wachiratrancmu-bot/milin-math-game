import { describe, it, expect } from 'vitest'
import { normalize, isCorrect, matchesAnswer, shuffle, buildRound } from './quiz'
import { DEFAULT_SETTINGS, migrateSettings } from './storage'
import type { Settings } from '../types'

describe('normalize / isCorrect', () => {
  it('ตัดช่องว่างออก', () => {
    expect(normalize(' 3, 6, 8 ')).toBe('3,6,8')
  })
  it('แปลงอักขระเต็มความกว้าง', () => {
    expect(normalize('１０＋３'.replace('１０', '10'))).toContain('+')
    expect(normalize('＞')).toBe('>')
  })
  it('เทียบคำตอบแบบยืดหยุ่นเรื่องช่องว่าง', () => {
    expect(isCorrect('3, 6, 8', '3,6,8')).toBe(true)
    expect(isCorrect('<', '<')).toBe(true)
    expect(isCorrect('9', '8')).toBe(false)
  })
  it('รับเครื่องหมายลบจากแป้นพิมพ์และตัวเลขไทย', () => {
    expect(isCorrect('10-6=4', '10 − 6 = 4')).toBe(true)
    expect(isCorrect('๑๕', '15')).toBe(true)
  })
  it('ยอมรับการสลับที่ของการบวก เมื่อข้อกำหนดไว้', () => {
    const q = { answer: '2 + 4 = 6', accept: ['4 + 2 = 6'] }
    expect(matchesAnswer(q, '2+4=6')).toBe(true)
    expect(matchesAnswer(q, '4+2=6')).toBe(true)
    expect(matchesAnswer(q, '6-4=2')).toBe(false)
  })
})

describe('shuffle', () => {
  it('คงจำนวนและสมาชิกเดิม', () => {
    const arr = [1, 2, 3, 4, 5]
    const out = shuffle(arr)
    expect(out).toHaveLength(arr.length)
    expect([...out].sort()).toEqual([...arr].sort())
  })
  it('ไม่แก้ไขอาเรย์เดิม', () => {
    const arr = [1, 2, 3]
    shuffle(arr)
    expect(arr).toEqual([1, 2, 3])
  })
})

describe('buildRound', () => {
  it('คืนจำนวนข้อตามที่ตั้งไว้', () => {
    const round = buildRound({ ...DEFAULT_SETTINGS, questionsPerRound: 15 })
    expect(round).toHaveLength(15)
  })
  it('ไม่มีข้อซ้ำในหนึ่งรอบ', () => {
    const round = buildRound({ ...DEFAULT_SETTINGS, questionsPerRound: 20 })
    const ids = round.map((q) => q.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
  it('ดึงเฉพาะหัวข้อที่เปิดใช้', () => {
    const settings: Settings = {
      ...DEFAULT_SETTINGS,
      enabledTopics: ['compare'],
      questionsPerRound: 8,
    }
    const round = buildRound(settings)
    expect(round.length).toBeGreaterThan(0)
    expect(round.every((q) => q.topic === 'compare')).toBe(true)
  })
  it('รวมข้อสอบที่พ่อแม่เพิ่มเอง', () => {
    // หัวข้อ relation มีข้อน้อยกว่า 30 จึงต้องถูกเลือกทุกข้อ รวมข้อที่เพิ่มเอง
    const settings: Settings = {
      ...DEFAULT_SETTINGS,
      enabledTopics: ['relation'],
      questionsPerRound: 30,
      customQuestions: [
        {
          id: 'custom-x',
          topic: 'relation',
          level: 'easy',
          kind: 'fill',
          text: '1 + 1 = □',
          answer: '2',
          custom: true,
        },
      ],
    }
    const round = buildRound(settings)
    expect(round.some((q) => q.id === 'custom-x')).toBe(true)
  })
  it('ฝึกรายบท: ได้เฉพาะข้อของบทที่เลือก', () => {
    for (const ch of [4, 5, 6] as const) {
      const round = buildRound({ ...DEFAULT_SETTINGS, questionsPerRound: 15 }, { chapters: [ch] })
      expect(round).toHaveLength(15)
      expect(round.every((q) => q.chapter === ch)).toBe(true)
    }
  })
  it('ข้อสอบจำลอง: 20 ข้อ ปรนัยล้วน และครบทุกหัวข้อ', () => {
    const round = buildRound({ ...DEFAULT_SETTINGS, questionsPerRound: 20 }, { choiceOnly: true })
    expect(round).toHaveLength(20)
    expect(round.every((q) => q.kind === 'choice')).toBe(true)
    expect(new Set(round.map((q) => q.topic)).size).toBe(DEFAULT_SETTINGS.enabledTopics.length)
  })
  it('ข้อสอบจำลองแบบผสม: ตอนที่ 2 เติมคำตอบ 5 ข้อ', () => {
    const round = buildRound({ ...DEFAULT_SETTINGS, questionsPerRound: 5 }, { fillOnly: true })
    expect(round).toHaveLength(5)
    expect(round.every((q) => q.kind === 'fill')).toBe(true)
  })
  it('ฝึกรายทักษะ: ได้เฉพาะทักษะที่เลือก', () => {
    const round = buildRound(
      { ...DEFAULT_SETTINGS, questionsPerRound: 5 },
      { topics: ['relation'] },
    )
    expect(round).toHaveLength(5)
    expect(round.every((q) => q.topic === 'relation')).toBe(true)
  })
  it('แบบฝึกรวม 40 ข้อ ไม่มีข้อซ้ำ', () => {
    const round = buildRound({ ...DEFAULT_SETTINGS, questionsPerRound: 40 })
    expect(round).toHaveLength(40)
    expect(new Set(round.map((q) => q.id)).size).toBe(40)
  })
})

describe('migrateSettings', () => {
  it('ค่าที่บันทึกจากคลังรุ่นเก่า (บทที่ 1) ถูกปรับให้เปิดทุกหัวข้อใหม่', () => {
    const old = { ...DEFAULT_SETTINGS, enabledTopics: ['place', 'rank', 'pattern'] as never }
    expect(migrateSettings(old).enabledTopics).toEqual(DEFAULT_SETTINGS.enabledTopics)
  })
  it('คงหัวข้อที่พ่อแม่เลือกไว้ ถ้าเป็นหัวข้อปัจจุบัน', () => {
    const s = { ...DEFAULT_SETTINGS, enabledTopics: ['add', 'sub'] as Settings['enabledTopics'] }
    expect(migrateSettings(s).enabledTopics).toEqual(['add', 'sub'])
  })
  it('ข้อที่พ่อแม่เพิ่มเองในหัวข้อเก่าย้ายไปหัวข้อใหม่ ไม่สูญหาย', () => {
    const s = {
      ...DEFAULT_SETTINGS,
      customQuestions: [
        { id: 'c1', topic: 'part', level: 'easy', kind: 'fill', text: 'x', answer: '1' },
      ] as never,
    }
    expect(migrateSettings(s).customQuestions[0].topic).toBe('add')
  })
})
