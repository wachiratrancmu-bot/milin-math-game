import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Progress, RoundResult } from '../types'
import { DEFAULT_PROGRESS, loadProgress, saveProgress } from '../lib/storage'
import { applyRound, type RoundInput } from '../lib/rewards'
import { useSettings } from './SettingsContext'

export type RoundSummary = RoundInput

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
    const { next, result } = applyRound(progress, settings, s, new Date().toLocaleString('th-TH'))
    setProgress(next)
    return result
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
