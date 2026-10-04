import type { MistakeEntry, Progress, Question, Topic, TopicStat } from '../types'
import { matchesAnswer } from './quiz'

// ──────────────────────────────────────────────────────────────
// ตรรกะการเรียนรู้ (ฟังก์ชันบริสุทธิ์ ทดสอบได้ไม่พึ่ง React)
// - ความเชี่ยวชาญรายทักษะ: เกณฑ์แบบ mastery learning (Bloom, 1968)
// - กล่องทบทวนข้อที่ผิด: ระบบกล่อง Leitner (1972) + การเว้นระยะ (Cepeda et al., 2006)
// ──────────────────────────────────────────────────────────────

/** ใช้ผลการตอบครั้งแรกกี่ข้อล่าสุดในการวัดความเชี่ยวชาญ */
export const RECENT_WINDOW = 10

export type MasteryLevel = 'none' | 'learning' | 'almost' | 'mastered'

export const MASTERY_LABEL: Record<MasteryLevel, string> = {
  none: 'ยังไม่ได้ฝึก',
  learning: 'กำลังฝึก',
  almost: 'ใกล้เชี่ยวชาญ',
  mastered: 'เชี่ยวชาญ',
}

export interface Mastery {
  level: MasteryLevel
  /** สัดส่วนที่ตอบถูกในครั้งแรก (0–1) */
  accuracy: number
  /** จำนวนข้อที่ใช้คำนวณ */
  count: number
}

/**
 * เชี่ยวชาญ = ตอบถูกในครั้งแรกอย่างน้อย 90% จากอย่างน้อย 8 ข้อล่าสุด
 * ใกล้เชี่ยวชาญ = อย่างน้อย 70% จากอย่างน้อย 5 ข้อ
 */
export function mastery(stat?: TopicStat): Mastery {
  const recent = stat?.recent ?? []
  const count = recent.length
  if (count === 0) return { level: 'none', accuracy: 0, count }
  const accuracy = recent.reduce((a, b) => a + b, 0) / count
  const level: MasteryLevel =
    count >= 8 && accuracy >= 0.9
      ? 'mastered'
      : count >= 5 && accuracy >= 0.7
        ? 'almost'
        : 'learning'
  return { level, accuracy, count }
}

/** ข้อที่ผิดพร้อมทบทวนหรือยัง: กล่อง 1 ทบทวนได้ทันที กล่อง 2 ต้องผ่านไปอย่างน้อย 2 รอบ */
export const isDue = (e: MistakeEntry, rounds: number) => e.box === 1 || rounds - e.lastRound >= 2

/**
 * บันทึกผลการตอบหนึ่งข้อ
 * @param firstTryCorrect ตอบถูกตั้งแต่ครั้งแรกหรือไม่ (ใช้วัดความเชี่ยวชาญและกล่องทบทวน)
 */
export function recordResult(p: Progress, q: Question, firstTryCorrect: boolean): Progress {
  const prev = p.topicStats[q.topic] ?? { attempts: 0, correct: 0, recent: [] }
  const stat: TopicStat = {
    attempts: prev.attempts + 1,
    correct: prev.correct + (firstTryCorrect ? 1 : 0),
    recent: [...prev.recent, firstTryCorrect ? 1 : 0].slice(-RECENT_WINDOW),
  }

  const mistakes = { ...p.mistakes }
  const entry = mistakes[q.id]
  if (!firstTryCorrect) {
    // ตอบผิด → กลับไปกล่อง 1
    mistakes[q.id] = { box: 1, lastRound: p.rounds, wrongCount: (entry?.wrongCount ?? 0) + 1 }
  } else if (entry) {
    if (entry.box === 1) {
      // ถูกครั้งแรกหลังผิด → กล่อง 2 รอทบทวนอีกครั้งในรอบถัด ๆ ไป
      mistakes[q.id] = { ...entry, box: 2, lastRound: p.rounds }
    } else if (p.rounds > entry.lastRound) {
      // ถูกอีกครั้งในรอบอื่น → จำได้แล้ว นำออกจากกล่อง
      delete mistakes[q.id]
    }
  }

  return { ...p, topicStats: { ...p.topicStats, [q.topic]: stat }, mistakes }
}

/** ข้อที่ถึงเวลาทบทวน เรียงจากกล่อง 1 และข้อที่ผิดบ่อยก่อน */
export function dueMistakes(p: Progress, pool: Question[]): Question[] {
  const byId = new Map(pool.map((q) => [q.id, q]))
  return Object.entries(p.mistakes)
    .filter(([id, e]) => byId.has(id) && isDue(e, p.rounds))
    .sort(([, a], [, b]) => a.box - b.box || b.wrongCount - a.wrongCount)
    .map(([id]) => byId.get(id)!)
}

/** ทักษะที่ควรฝึกต่อ: ยังไม่เชี่ยวชาญ เรียงจากความแม่นยำต่ำสุด (ทักษะที่ยังไม่ได้ฝึกนับเป็น 50%) */
export function topicsToPractice(p: Progress, topics: Topic[]): Topic[] {
  return topics
    .map((t) => ({ t, m: mastery(p.topicStats[t]) }))
    .filter(({ m }) => m.level !== 'mastered')
    .sort((a, b) => (a.m.count ? a.m.accuracy : 0.5) - (b.m.count ? b.m.accuracy : 0.5))
    .map(({ t }) => t)
}

export interface ExamItemResult {
  question: Question
  chosen?: string
  correct: boolean
}

export interface ExamGrade {
  score: number
  total: number
  perTopic: Record<string, { right: number; total: number }>
  items: ExamItemResult[]
}

/** ตรวจข้อสอบจำลอง ข้อที่ไม่ได้ตอบนับเป็นผิด */
export function gradeExam(questions: Question[], answers: Record<string, string>): ExamGrade {
  const perTopic: ExamGrade['perTopic'] = {}
  const items = questions.map((question) => {
    const chosen = answers[question.id]
    const correct = chosen !== undefined && chosen !== '' && matchesAnswer(question, chosen)
    const cur = perTopic[question.topic] ?? { right: 0, total: 0 }
    perTopic[question.topic] = { right: cur.right + (correct ? 1 : 0), total: cur.total + 1 }
    return { question, chosen, correct }
  })
  return { score: items.filter((i) => i.correct).length, total: questions.length, perTopic, items }
}

/** จำนวนวันจากวันนี้ถึงวันที่กำหนด (0 = วันนี้, ติดลบ = ผ่านไปแล้ว, null = ไม่ได้ตั้งค่า) */
export function daysUntil(date: string, today: Date = new Date()): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date)
  if (!m) return null
  const target = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  return Math.round((target.getTime() - start.getTime()) / 86_400_000)
}
