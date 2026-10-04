import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import type { Progress, Question, RoundResult } from '../types'
import { DEFAULT_PROGRESS, loadProgress, saveProgress } from '../lib/storage'
import { applyRound, type RoundInput } from '../lib/rewards'
import { recordResult, type ExamGrade } from '../lib/learning'
import { useSettings } from './SettingsContext'

export type RoundSummary = RoundInput

interface ProgressCtx {
  progress: Progress
  /** บันทึกผลการตอบหนึ่งข้อ (ใช้วัดความเชี่ยวชาญและกล่องทบทวน) */
  recordAnswer: (q: Question, firstTryCorrect: boolean) => void
  /** บันทึกผลหนึ่งรอบของการฝึก คืนค่าสรุปดาว/รางวัลที่ได้ */
  finishRound: (s: RoundSummary) => RoundResult
  /** บันทึกผลข้อสอบจำลอง (รวมบันทึกผลรายข้อ) */
  finishExam: (grade: ExamGrade) => RoundResult
  markLessonDone: (id: string) => void
  /** ผู้ปกครองกดเมื่อมอบรางวัลแล้ว */
  redeemTicket: () => void
  /** จำนวนรางวัลที่ยังไม่ได้มอบ */
  pendingTickets: number
  resetProgress: () => void
}

const Ctx = createContext<ProgressCtx | null>(null)

const now = () => new Date().toLocaleString('th-TH')

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { settings } = useSettings()
  const [progress, setProgress] = useState<Progress>(() => loadProgress())
  // เก็บค่าล่าสุดเสมอ เพื่อให้การบันทึกหลายครั้งติดกันใน event เดียวไม่ทับกัน
  const latest = useRef(progress)

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  const update = (fn: (p: Progress) => Progress) => {
    latest.current = fn(latest.current)
    setProgress(latest.current)
  }

  const recordAnswer = (q: Question, firstTryCorrect: boolean) =>
    update((p) => recordResult(p, q, firstTryCorrect))

  const finishRound = (s: RoundSummary): RoundResult => {
    const { next, result } = applyRound(latest.current, settings, s, now())
    update(() => next)
    return result
  }

  const finishExam = (grade: ExamGrade): RoundResult => {
    let p = latest.current
    for (const item of grade.items) p = recordResult(p, item.question, item.correct)
    const { next, result } = applyRound(
      p,
      settings,
      {
        score: grade.score,
        total: grade.total,
        mode: 'exam',
        perTopic: grade.perTopic,
        maxStreak: 0,
      },
      now(),
    )
    update(() => ({
      ...next,
      examHistory: [
        { date: now(), score: grade.score, total: grade.total, perTopic: grade.perTopic },
        ...next.examHistory,
      ].slice(0, 20),
    }))
    return result
  }

  const markLessonDone = (id: string) =>
    update((p) => (p.lessonsDone.includes(id) ? p : { ...p, lessonsDone: [...p.lessonsDone, id] }))

  const redeemTicket = () =>
    update((p) => ({ ...p, ticketsRedeemed: Math.min(p.ticketsEarned, p.ticketsRedeemed + 1) }))

  const resetProgress = () => update(() => ({ ...DEFAULT_PROGRESS }))

  const pendingTickets = Math.max(0, progress.ticketsEarned - progress.ticketsRedeemed)

  return (
    <Ctx.Provider
      value={{
        progress,
        recordAnswer,
        finishRound,
        finishExam,
        markLessonDone,
        redeemTicket,
        pendingTickets,
        resetProgress,
      }}
    >
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
