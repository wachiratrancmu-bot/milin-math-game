import type { Settings, Progress, Topic } from '../types'
import { EXAM_BLUEPRINT, TOPIC_NAMES } from '../data/curriculum'

// ──────────────────────────────────────────────────────────────
// บันทึก/อ่านค่าจาก localStorage แบบกันพังด้วยเวอร์ชัน schema
// ──────────────────────────────────────────────────────────────

const SETTINGS_KEY = 'milin.math.settings.v1'
const PROGRESS_KEY = 'milin.math.progress.v1'

export const DEFAULT_SETTINGS: Settings = {
  pin: '1234',
  questionsPerRound: 20,
  mode: 'practice',
  mix: 'balanced',
  enabledTopics: Object.keys(EXAM_BLUEPRINT) as Settings['enabledTopics'],
  sound: true,
  readAloud: true,
  examDate: '2026-10-05',
  autoAdvanceSeconds: 10,
  maxTries: 2,
  rewardThreshold: 30,
  fullMarksBonus: 5,
  rewardName: 'ไอศกรีม',
  rewardEmoji: '🍦',
  playerName: 'มิลิน',
  customQuestions: [],
}

export const DEFAULT_PROGRESS: Progress = {
  totalCorrect: 0,
  starBalance: 0,
  ticketsEarned: 0,
  ticketsRedeemed: 0,
  bestStreak: 0,
  perfectRounds: 0,
  history: [],
  rounds: 0,
  topicStats: {},
  mistakes: {},
  examHistory: [],
  lessonsDone: [],
}

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    // รวมกับค่า default เผื่อมีฟิลด์ใหม่ที่เพิ่มภายหลัง
    return { ...fallback, ...parsed }
  } catch {
    return fallback
  }
}

function save<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // เต็มหรือถูกปิด — ข้ามไป ไม่ให้แอปพัง
  }
}

const isTopic = (t: string): t is Topic => t in TOPIC_NAMES

/** หัวข้อจากคลังข้อสอบรุ่นก่อน (บทที่ 1) → หัวข้อใหม่ที่ใกล้เคียงที่สุด */
const LEGACY_TOPIC: Record<string, Topic> = {
  expand: 'place',
  part: 'add',
  rank: 'order',
  pattern: 'order',
}

/** ปรับค่าที่บันทึกไว้จากเวอร์ชันเก่าให้ใช้กับคลังข้อสอบปัจจุบันได้ */
export function migrateSettings(s: Settings): Settings {
  const stored: string[] = s.enabledTopics ?? []
  const hasLegacy = stored.some((t) => !isTopic(t))
  const topics = stored.filter(isTopic)
  return {
    ...s,
    // พบหัวข้อรุ่นเก่า = คลังข้อสอบเปลี่ยนแล้ว จึงเปิดทุกหัวข้อใหม่ให้ครบ
    enabledTopics: hasLegacy || topics.length === 0 ? [...DEFAULT_SETTINGS.enabledTopics] : topics,
    customQuestions: (s.customQuestions ?? []).map((q) =>
      isTopic(q.topic) ? q : { ...q, topic: LEGACY_TOPIC[q.topic] ?? 'number' },
    ),
  }
}

export const loadSettings = (): Settings => migrateSettings(load(SETTINGS_KEY, DEFAULT_SETTINGS))
export const saveSettings = (s: Settings): void => save(SETTINGS_KEY, s)

export const loadProgress = (): Progress => load(PROGRESS_KEY, DEFAULT_PROGRESS)
export const saveProgress = (p: Progress): void => save(PROGRESS_KEY, p)
