import { describe, it, expect } from 'vitest'
import { applyRound, type RoundInput } from './rewards'
import { DEFAULT_PROGRESS, DEFAULT_SETTINGS } from './storage'
import type { Progress } from '../types'

const round = (over: Partial<RoundInput> = {}): RoundInput => ({
  score: 5,
  total: 10,
  mode: 'practice',
  perTopic: {},
  maxStreak: 3,
  ...over,
})

describe('applyRound', () => {
  it('ได้ดาวเท่ากับจำนวนข้อที่ถูก (เมื่อไม่ทำเต็ม)', () => {
    const { next, result } = applyRound(
      DEFAULT_PROGRESS,
      DEFAULT_SETTINGS,
      round({ score: 7, total: 10 }),
      'x',
    )
    expect(result.starsGained).toBe(7)
    expect(next.starBalance).toBe(7)
    expect(next.totalCorrect).toBe(7)
    expect(result.newTickets).toBe(0)
  })

  it('ทำเต็มได้โบนัสดาว', () => {
    const { result } = applyRound(
      DEFAULT_PROGRESS,
      DEFAULT_SETTINGS,
      round({ score: 10, total: 10 }),
      'x',
    )
    expect(result.starsGained).toBe(10 + DEFAULT_SETTINGS.fullMarksBonus)
  })

  it('สะสมครบ threshold ปลดล็อกรางวัล และหักดาวออก', () => {
    const start: Progress = { ...DEFAULT_PROGRESS, starBalance: 28 }
    const settings = { ...DEFAULT_SETTINGS, rewardThreshold: 30, fullMarksBonus: 0 }
    const { next, result } = applyRound(start, settings, round({ score: 5, total: 10 }), 'x')
    expect(result.newTickets).toBe(1)
    expect(next.ticketsEarned).toBe(1)
    expect(next.starBalance).toBe(3) // 28 + 5 = 33 → -30 = 3
  })

  it('ได้หลายรางวัลในรอบเดียวถ้าดาวพอ', () => {
    const settings = { ...DEFAULT_SETTINGS, rewardThreshold: 5, fullMarksBonus: 0 }
    const { next, result } = applyRound(
      DEFAULT_PROGRESS,
      settings,
      round({ score: 12, total: 12 }),
      'x',
    )
    expect(result.newTickets).toBe(2) // 12 / 5 = 2 ใบ เหลือ 2
    expect(next.starBalance).toBe(2)
  })

  it('เก็บสถิติเล่นต่อเนื่องสูงสุดและจำนวนรอบที่ทำเต็ม', () => {
    const start: Progress = { ...DEFAULT_PROGRESS, bestStreak: 4 }
    const { next } = applyRound(
      start,
      DEFAULT_SETTINGS,
      round({ score: 10, total: 10, maxStreak: 8 }),
      'x',
    )
    expect(next.bestStreak).toBe(8)
    expect(next.perfectRounds).toBe(1)
  })

  it('ไม่แตะจำนวนรางวัลที่มอบไปแล้ว และจำกัดประวัติไว้ 30 รอบ', () => {
    const history = Array.from({ length: 30 }, (_, i) => ({
      date: `d${i}`,
      score: 1,
      total: 1,
      mode: 'exam' as const,
    }))
    const start: Progress = { ...DEFAULT_PROGRESS, ticketsRedeemed: 2, ticketsEarned: 3, history }
    const { next } = applyRound(start, DEFAULT_SETTINGS, round(), 'newest')
    expect(next.ticketsRedeemed).toBe(2)
    expect(next.history).toHaveLength(30)
    expect(next.history[0].date).toBe('newest')
  })
})
