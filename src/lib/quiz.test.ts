import { describe, it, expect } from 'vitest'
import { normalize, isCorrect, shuffle, buildRound } from './quiz'
import { DEFAULT_SETTINGS } from './storage'
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
      enabledTopics: ['rank'],
      questionsPerRound: 8,
    }
    const round = buildRound(settings)
    expect(round.length).toBeGreaterThan(0)
    expect(round.every((q) => q.topic === 'rank')).toBe(true)
  })
  it('รวมข้อสอบที่พ่อแม่เพิ่มเอง', () => {
    const settings: Settings = {
      ...DEFAULT_SETTINGS,
      enabledTopics: ['part'],
      questionsPerRound: 30,
      customQuestions: [
        {
          id: 'custom-x',
          topic: 'part',
          level: 'easy',
          kind: 'fill',
          text: '1+1=?',
          answer: '2',
          custom: true,
        },
      ],
    }
    const round = buildRound(settings)
    expect(round.some((q) => q.id === 'custom-x')).toBe(true)
  })
})
