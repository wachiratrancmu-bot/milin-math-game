import { useEffect, useState } from 'react'
import type { Chapter } from '../types'
import { CHAPTER_NAMES } from '../data/curriculum'
import { LESSONS, type Lesson } from '../data/lessons'
import { useProgress } from '../state/ProgressContext'
import { useSettings } from '../state/SettingsContext'
import { canSpeak, speak, stopSpeaking } from '../lib/speech'
import { ModelView } from './ModelView'
import { NumberLine } from './NumberLine'
import { ThaiText } from './ThaiText'
import { ProgressBar, TopBar } from './ui'

// ──────────────────────────────────────────────────────────────
// บทเรียนสั้น: สอนทีละขั้น มีตัวอย่าง แล้วให้ลองทำ (Rosenshine, 2012)
// ──────────────────────────────────────────────────────────────

export function LessonList({
  onOpen,
  onBack,
}: {
  onOpen: (id: string) => void
  onBack: () => void
}) {
  const { progress } = useProgress()
  const chapters = [...new Set(LESSONS.map((l) => l.chapter))] as Chapter[]
  return (
    <main className="screen">
      <TopBar title="บทเรียนสั้น" onBack={onBack} backLabel="หน้าแรก" />
      <p className="lead">
        เรียนทีละเรื่อง เรื่องละประมาณ 2 นาที แล้วลองทำโจทย์ 5 ข้อ (เรียนแล้ว{' '}
        {progress.lessonsDone.length} จาก {LESSONS.length} บท)
      </p>
      {chapters.map((ch) => (
        <section key={ch} className="section">
          <h2 className="sectionTitle">{CHAPTER_NAMES[ch]}</h2>
          <div className="cardGrid">
            {LESSONS.filter((l) => l.chapter === ch).map((l) => {
              const done = progress.lessonsDone.includes(l.id)
              return (
                <button key={l.id} className="card lessonCard" onClick={() => onOpen(l.id)}>
                  <span className="lessonIcon" aria-hidden="true">
                    {l.icon}
                  </span>
                  <span className="lessonBody">
                    <span className="lessonTitle">{l.title}</span>
                    <span className="lessonGoal">{l.goal}</span>
                    <span className="lessonMeta">
                      {l.indicators.join(' · ')}
                      {done && <span className="badge badge-good">เรียนแล้ว</span>}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </section>
      ))}
    </main>
  )
}

export function LessonView({
  lesson,
  onBack,
  onPractice,
}: {
  lesson: Lesson
  onBack: () => void
  onPractice: (lesson: Lesson) => void
}) {
  const { settings } = useSettings()
  const { markLessonDone } = useProgress()
  const [step, setStep] = useState(0)
  const slide = lesson.slides[step]
  const isLast = step === lesson.slides.length - 1

  useEffect(() => {
    if (isLast) markLessonDone(lesson.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLast, lesson.id])

  useEffect(() => () => stopSpeaking(), [step])

  return (
    <main className="screen">
      <TopBar title={lesson.title} onBack={onBack} backLabel="บทเรียน" />
      <div className="sessionProgress">
        <span className="sessionCount">
          ขั้นที่ {step + 1} จาก {lesson.slides.length}
        </span>
        <ProgressBar
          value={step + 1}
          max={lesson.slides.length}
          label={`ขั้นที่ ${step + 1} จาก ${lesson.slides.length}`}
        />
      </div>

      <article className="card slide" aria-live="polite">
        {step === 0 && (
          <p className="slideGoal">
            <b>เรียนจบแล้วจะ:</b> {lesson.goal}
          </p>
        )}
        <div className="slideHead">
          <h2 className="slideTitle">{slide.title}</h2>
          {settings.readAloud && canSpeak() && (
            <button
              className="btn btnGhost btnSmall"
              onClick={() => speak([slide.title, ...slide.body, slide.big ?? ''].join(' '))}
            >
              <span aria-hidden="true">🔊</span> ฟัง
            </button>
          )}
        </div>
        {slide.big && <p className="slideBig">{slide.big}</p>}
        {slide.model && <ModelView model={slide.model} />}
        {slide.line && <NumberLine spec={slide.line} showJumps />}
        <ul className="slideBody">
          {slide.body.map((b) => (
            <li key={b}>
              <ThaiText text={b} />
            </li>
          ))}
        </ul>
      </article>

      <div className="examNav">
        <button
          className="btn btnGhost"
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
        >
          <span aria-hidden="true">←</span> ย้อนกลับ
        </button>
        {!isLast ? (
          <button className="btn btnPrimary" onClick={() => setStep((s) => s + 1)}>
            ถัดไป <span aria-hidden="true">→</span>
          </button>
        ) : (
          <button className="btn btnPrimary" onClick={() => onPractice(lesson)}>
            ลองทำ 5 ข้อ <span aria-hidden="true">→</span>
          </button>
        )}
      </div>
    </main>
  )
}
