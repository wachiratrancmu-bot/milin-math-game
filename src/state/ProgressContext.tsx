import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Progress, RoundResult, Mode } from '../types'
import { DEFAULT_PROGRESS, loadProgress, saveProgress } from '../lib/storage'
import { useSettings } from './SettingsContext'

export interface RoundSummary {
  score: number
  total: number
  mode: Mode
  perTopic: Record<string, { right: number; total: number }>
  maxStreak: number
}

interface ProgressCtx {
  progress: Progress
  /** บันทึกผลหนึ่งรอบ คืนค่าสรุปดาว/รางวัลที่ได้ */
  finishRound: (s: RoundSummary) => RoundResult
  /** พ่อแม่กดเมื่อมอบรางวัลให้ลูกแล้ว */
  redeemTicket: () => void
  /** จำนวนรางวัลที่ยังไม่ได้มอบ */
  pendingTickets: number
  resetProgress: () => void
}

const Ctx = createContext<ProgressCtx | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { settings } = useSettings()
  const [progress, setProgress] = useState<Progress>(() => loadProgress())

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  const finishRound = (s: RoundSummary): RoundResult => {
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
        { date: new Date().toLocaleString('th-TH'), score: s.score, total: s.total, mode: s.mode },
        ...progress.history,
      ].slice(0, 30),
    }
    setProgress(next)

    return {
      score: s.score,
      total: s.total,
      mode: s.mode,
      perTopic: s.perTopic,
      starsGained,
      newTickets,
    }
  }

  const redeemTicket = () =>
    setProgress((p) => ({
      ...p,
      ticketsRedeemed: Math.min(p.ticketsEarned, p.ticketsRedeemed + 1),
    }))

  const resetProgress = () => setProgress({ ...DEFAULT_PROGRESS })

  const pendingTickets = Math.max(0, progress.ticketsEarned - progress.ticketsRedeemed)

  return (
    <Ctx.Provider value={{ progress, finishRound, redeemTicket, pendingTickets, resetProgress }}>
      {children}
    </Ctx.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProgress(): ProgressCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useProgress ต้องอยู่ภายใน ProgressProvider')
  return ctx
}
