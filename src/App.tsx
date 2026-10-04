import { useEffect, useMemo, useRef, useState } from 'react'
import type { Chapter, Question, Settings, Topic } from './types'
import { CHAPTER_NAMES, TOPIC_NAMES } from './data/curriculum'
import { QUESTION_BANK } from './data/questions'
import { LESSONS, type Lesson } from './data/lessons'
import { useSettings } from './state/SettingsContext'
import { useProgress } from './state/ProgressContext'
import { buildRound, shuffle, type RoundOptions } from './lib/quiz'
import { dueMistakes } from './lib/learning'
import { useHashRoute } from './lib/useHashRoute'
import { Home, type HomeActions } from './components/Home'
import { PracticeSession, type PracticeConfig } from './components/PracticeSession'
import { ExamSession } from './components/ExamSession'
import { LessonList, LessonView } from './components/Lessons'
import { ParentArea } from './components/ParentArea'

/** จำนวนข้อสูงสุดต่อการทบทวนข้อที่ผิดหนึ่งรอบ */
const REVIEW_SIZE = 15

export default function App() {
  const { settings } = useSettings()
  const { progress } = useProgress()
  const [route, navigate] = useHashRoute()
  const [practice, setPractice] = useState<PracticeConfig | null>(null)
  const [practiceNo, setPracticeNo] = useState(0)
  const [notice, setNotice] = useState('')
  const lastMake = useRef<(() => PracticeConfig) | null>(null)

  const pool = useMemo(
    () => [...QUESTION_BANK, ...settings.customQuestions],
    [settings.customQuestions],
  )
  const due = dueMistakes(progress, pool)

  // ค่าล่าสุดสำหรับฟังก์ชันที่ถูกเรียกซ้ำภายหลัง (เช่น ปุ่ม "ฝึกอีกรอบ")
  const latest = useRef({ settings, progress, pool })
  latest.current = { settings, progress, pool }

  // เปิดหน้าเล่นโดยไม่มีรอบที่กำลังเล่น (เช่น รีเฟรชหน้า) → กลับหน้าแรก
  useEffect(() => {
    if (route === '/play' && !practice) navigate('/')
  }, [route, practice, navigate])

  useEffect(() => {
    if (!notice) return
    const t = setTimeout(() => setNotice(''), 4000)
    return () => clearTimeout(t)
  }, [notice])

  function launch(make: () => PracticeConfig) {
    const config = make()
    if (config.questions.length === 0) {
      setNotice('ยังไม่มีข้อสอบในหัวข้อนี้ เปิดทักษะเพิ่มได้ที่ส่วนของผู้ปกครอง')
      return
    }
    lastMake.current = make
    setPractice(config)
    setPracticeNo((n) => n + 1)
    navigate('/play')
  }

  /** สร้างชุดฝึกจากคลัง ค่าของชุดใช้เฉพาะรอบนี้ ไม่บันทึกทับค่าที่ผู้ปกครองตั้งไว้ */
  const fromBank =
    (title: string, patch: Partial<Settings>, options: RoundOptions = {}) =>
    (): PracticeConfig => {
      const s: Settings = { ...latest.current.settings, mode: 'practice', ...patch }
      return { title, settings: s, questions: buildRound(s, options) }
    }

  const fromList = (title: string, questions: () => Question[]) => (): PracticeConfig => ({
    title,
    settings: { ...latest.current.settings, mode: 'practice' },
    questions: questions(),
  })

  const startReview = () =>
    launch(
      fromList('ทบทวนข้อที่เคยผิด', () =>
        dueMistakes(latest.current.progress, latest.current.pool).slice(0, REVIEW_SIZE),
      ),
    )

  const actions: HomeActions = {
    openLessons: () => navigate('/learn'),
    openExam: () => navigate('/exam'),
    openParent: () => navigate('/parent'),
    startChapter: (ch: Chapter) =>
      launch(
        fromBank(
          `ฝึก${CHAPTER_NAMES[ch]}`,
          { questionsPerRound: 15, mix: 'balanced' },
          { chapters: [ch] },
        ),
      ),
    startMixed: () =>
      launch(fromBank('แบบฝึกรวม 40 ข้อ', { questionsPerRound: 40, mix: 'balanced' })),
    startTopic: (t: Topic) =>
      launch(
        fromBank(
          `ฝึก${TOPIC_NAMES[t]}`,
          { questionsPerRound: 10, mix: 'balanced' },
          { topics: [t] },
        ),
      ),
    startReview,
  }

  const startLessonPractice = (lesson: Lesson) =>
    launch(
      fromBank(
        `ลองทำ: ${lesson.title}`,
        { questionsPerRound: 5, mix: 'warmup' },
        { topics: lesson.practiceTopics },
      ),
    )

  const home = () => navigate('/')

  let screen
  if (route === '/play' && practice) {
    screen = (
      <PracticeSession
        key={practiceNo}
        config={practice}
        dueCount={due.length}
        onHome={home}
        onReplay={() => lastMake.current && launch(lastMake.current)}
        onReview={startReview}
      />
    )
  } else if (route === '/learn') {
    screen = <LessonList onOpen={(id) => navigate(`/learn/${id}`)} onBack={home} />
  } else if (route.startsWith('/learn/')) {
    const lesson = LESSONS.find((l) => l.id === route.slice('/learn/'.length))
    screen = lesson ? (
      <LessonView
        key={lesson.id}
        lesson={lesson}
        onBack={() => navigate('/learn')}
        onPractice={startLessonPractice}
      />
    ) : (
      <LessonList onOpen={(id) => navigate(`/learn/${id}`)} onBack={home} />
    )
  } else if (route === '/exam') {
    screen = (
      <ExamSession
        onHome={home}
        onPractice={(title, questions) => launch(fromList(title, () => shuffle(questions)))}
      />
    )
  } else if (route === '/parent') {
    screen = <ParentArea onBack={home} />
  } else {
    screen = <Home actions={actions} dueCount={due.length} />
  }

  return (
    <div className="app">
      {/* ใช้ปุ่มแทนลิงก์ # เพราะ # ใช้กับเส้นทางของแอป */}
      <button className="skipLink" onClick={() => document.getElementById('main-content')?.focus()}>
        ข้ามไปยังเนื้อหาหลัก
      </button>
      <div id="main-content" tabIndex={-1}>
        {screen}
      </div>
      <div className="toastRegion" role="status" aria-live="polite">
        {notice && <div className="toast">{notice}</div>}
      </div>
    </div>
  )
}
