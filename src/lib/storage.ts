import type { Settings, Progress } from '../types'
import { EXAM_BLUEPRINT } from '../data/questions'

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
  showHints: true,
  sound: true,
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

export const loadSettings = (): Settings => load(SETTINGS_KEY, DEFAULT_SETTINGS)
export const saveSettings = (s: Settings): void => save(SETTINGS_KEY, s)

export const loadProgress = (): Progress => load(PROGRESS_KEY, DEFAULT_PROGRESS)
export const saveProgress = (p: Progress): void => save(PROGRESS_KEY, p)
