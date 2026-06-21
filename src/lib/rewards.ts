import type { Progress, Settings, Mode, RoundResult } from '../types'

// ──────────────────────────────────────────────────────────────
// ตรรกะระบบรางวัล (ฟังก์ชันบริสุทธิ์ — ทดสอบได้ง่าย ไม่พึ่ง React)
// ──────────────────────────────────────────────────────────────

export interface RoundInput {
  score: number
  total: number
  mode: Mode
  perTopic: Record<string, { right: number; total: number }>
  maxStreak: number
}

/**
 * คำนวณความคืบหน้าใหม่และผลสรุปของรอบ
 * - ได้ดาว = จำนวนข้อที่ถูก (+ โบนัสถ้าทำเต็ม)
 * - ดาวสะสมครบ threshold → ปลดล็อกรางวัล 1 ใบ (วนหลายใบได้)
 * @param now วันที่/เวลาแบบสตริง (ส่งเข้ามาเพื่อให้ฟังก์ชันบริสุทธิ์)
 */
export function applyRound(
  progress: Progress,
  settings: Settings,
  s: RoundInput,
  now: string,
): { next: Progress; result: RoundResult } {
  const threshold = Math.max(1, settings.rewardThreshold)
  const perfect = s.total > 0 && s.score === s.total
  const bonus = perfect ? settings.fullMarksBonus : 0
  const starsGained = s.score + bonus

  let starBalance = progress.starBalance + starsGained
  let newTickets = 0
  while (starBalance >= threshold) {
    starBalance -= threshold
    newTickets++
  }

  const next: Progress = {
    totalCorrect: progress.totalCorrect + s.score,
    starBalance,
    ticketsEarned: progress.ticketsEarned + newTickets,
    ticketsRedeemed: progress.ticketsRedeemed,
    bestStreak: Math.max(progress.bestStreak, s.maxStreak),
    perfectRounds: progress.perfectRounds + (perfect ? 1 : 0),
    history: [
      { date: now, score: s.score, total: s.total, mode: s.mode },
      ...progress.history,
    ].slice(0, 30),
  }

  const result: RoundResult = {
    score: s.score,
    total: s.total,
    mode: s.mode,
    perTopic: s.perTopic,
    starsGained,
    newTickets,
  }

  return { next, result }
}
