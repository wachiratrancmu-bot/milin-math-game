import type { Chapter, Question, Settings, Mix } from '../types'
import { QUESTION_BANK, EXAM_BLUEPRINT } from '../data/questions'

// ──────────────────────────────────────────────────────────────
// ตรรกะการสุ่มชุดข้อสอบและตรวจคำตอบ
// ──────────────────────────────────────────────────────────────

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

/** เทียบคำตอบแบบยืดหยุ่น (ตัดช่องว่าง/อักขระเต็มความกว้าง) */
export function normalize(x: string): string {
  return String(x)
    .trim()
    .replace(/\s+/g, '')
    .replace(/＋/g, '+')
    .replace(/＞/g, '>')
    .replace(/＜/g, '<')
    .replace(/[，]/g, ',')
}

export function isCorrect(value: string, answer: string): boolean {
  return normalize(value) === normalize(answer)
}

/** สัดส่วนระดับความยากตามความท้าทายที่เลือก */
const MIX_RATIO: Record<Mix, { easy: number; medium: number; hard: number }> = {
  warmup: { easy: 0.6, medium: 0.35, hard: 0.05 },
  balanced: { easy: 0.3, medium: 0.55, hard: 0.15 },
  challenge: { easy: 0.15, medium: 0.55, hard: 0.3 },
}

export interface RoundOptions {
  /** ฝึกเฉพาะบทที่กำหนด (ข้อที่พ่อแม่เพิ่มเองจะไม่ถูกรวม เพราะไม่ได้ระบุบท) */
  chapters?: Chapter[]
  /** ใช้เฉพาะข้อแบบเลือกตอบ (ปรนัย) เหมือนข้อสอบจริง */
  choiceOnly?: boolean
}

/**
 * สร้างชุดข้อสอบหนึ่งรอบ
 * - ดึงเฉพาะหัวข้อที่เปิดใช้ + ข้อที่พ่อแม่เพิ่มเอง แล้วกรองตามบท/ชนิดข้อ
 * - กระจายตามน้ำหนักแนวข้อสอบ (EXAM_BLUEPRINT) แล้วเติมให้ครบจำนวน
 */
export function buildRound(settings: Settings, options: RoundOptions = {}): Question[] {
  const enabled = new Set(settings.enabledTopics)
  const chapters = options.chapters ? new Set<Chapter>(options.chapters) : null
  const pool: Question[] = [...QUESTION_BANK, ...settings.customQuestions].filter(
    (q) =>
      enabled.has(q.topic) &&
      (!chapters || (q.chapter !== undefined && chapters.has(q.chapter))) &&
      (!options.choiceOnly || q.kind === 'choice'),
  )
  const count = Math.max(1, settings.questionsPerRound)
  if (pool.length === 0) return []

  const ratio = MIX_RATIO[settings.mix]

  // จัดโควตาต่อหัวข้อตามน้ำหนักแนวข้อสอบ เฉพาะหัวข้อที่มีข้อสอบในชุดนี้
  const topics = settings.enabledTopics.filter((t) => pool.some((q) => q.topic === t))
  const totalWeight = topics.reduce((sum, t) => sum + (EXAM_BLUEPRINT[t] ?? 1), 0)

  const selected: Question[] = []
  const used = new Set<string>()

  for (const topic of topics) {
    const quota = Math.round((count * (EXAM_BLUEPRINT[topic] ?? 1)) / totalWeight)
    const byTopic = pool.filter((q) => q.topic === topic)
    const picked = pickByLevel(byTopic, quota, ratio, used)
    selected.push(...picked)
  }

  // เติมให้ครบจำนวน หากยังขาด
  if (selected.length < count) {
    const rest = shuffle(pool.filter((q) => !used.has(q.id)))
    for (const q of rest) {
      if (selected.length >= count) break
      selected.push(q)
      used.add(q.id)
    }
  }

  return shuffle(selected).slice(0, count)
}

function pickByLevel(
  byTopic: Question[],
  quota: number,
  ratio: { easy: number; medium: number; hard: number },
  used: Set<string>,
): Question[] {
  if (quota <= 0 || byTopic.length === 0) return []
  const buckets = {
    easy: shuffle(byTopic.filter((q) => q.level === 'easy')),
    medium: shuffle(byTopic.filter((q) => q.level === 'medium')),
    hard: shuffle(byTopic.filter((q) => q.level === 'hard')),
  }
  const want = {
    easy: Math.round(quota * ratio.easy),
    medium: Math.round(quota * ratio.medium),
    hard: Math.round(quota * ratio.hard),
  }
  const out: Question[] = []
  const take = (level: 'easy' | 'medium' | 'hard', n: number) => {
    for (const q of buckets[level]) {
      if (out.length >= quota) break
      if (n <= 0) break
      if (used.has(q.id)) continue
      out.push(q)
      used.add(q.id)
      n--
    }
  }
  take('easy', want.easy)
  take('medium', want.medium)
  take('hard', want.hard)

  // ยังไม่ครบโควตา — เติมจากข้อที่เหลือในหัวข้อนี้
  if (out.length < quota) {
    for (const q of shuffle(byTopic)) {
      if (out.length >= quota) break
      if (used.has(q.id)) continue
      out.push(q)
      used.add(q.id)
    }
  }
  return out
}
