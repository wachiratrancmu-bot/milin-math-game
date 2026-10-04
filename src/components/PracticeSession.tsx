import { useRef, useState } from 'react'
import type { Question, RoundResult, Settings, Topic } from '../types'
import { TOPIC_ICONS, TOPIC_NAMES } from '../data/curriculum'
import { useProgress } from '../state/ProgressContext'
import { mastery, MASTERY_LABEL } from '../lib/learning'
import { QuestionView } from './QuestionView'
import { RewardModal } from './RewardModal'
import { ProgressBar, TopBar } from './ui'

export interface PracticeConfig {
  title: string
  questions: Question[]
  settings: Settings
}

interface Props {
  config: PracticeConfig
  onHome: () => void
  onReplay: () => void
  onReview: () => void
  dueCount: number
}

export function PracticeSession({ config, onHome, onReplay, onReview, dueCount }: Props) {
  const { questions, settings, title } = config
  const { recordAnswer, finishRound } = useProgress()

  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [firstTryRight, setFirstTryRight] = useState(0)
  const streakRef = useRef(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [perTopic, setPerTopic] = useState<Record<string, { right: number; total: number }>>({})
  const [result, setResult] = useState<RoundResult | null>(null)
  const [showReward, setShowReward] = useState(false)
  const finishedRef = useRef(false)

  const total = questions.length
  const current = questions[index]

  function handleAnswered(correct: boolean, firstTry: boolean) {
    recordAnswer(current, correct && firstTry)
    setPerTopic((p) => {
      const cur = p[current.topic] ?? { right: 0, total: 0 }
      return {
        ...p,
        [current.topic]: { right: cur.right + (correct ? 1 : 0), total: cur.total + 1 },
      }
    })
    if (correct) {
      setScore((s) => s + 1)
      if (firstTry) setFirstTryRight((n) => n + 1)
      streakRef.current += 1
      setMaxStreak((m) => Math.max(m, streakRef.current))
    } else {
      streakRef.current = 0
    }
  }

  function handleNext() {
    if (index + 1 < total) {
      setIndex((i) => i + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    if (finishedRef.current) return // กันสรุปผลซ้ำ
    finishedRef.current = true
    const r = finishRound({ score, total, mode: settings.mode, perTopic, maxStreak })
    setResult(r)
    if (r.newTickets > 0) setShowReward(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (result) {
    return (
      <PracticeResult
        title={title}
        result={result}
        firstTryRight={firstTryRight}
        onHome={onHome}
        onReplay={onReplay}
        onReview={onReview}
        dueCount={dueCount}
        rewardOpen={showReward}
        onCloseReward={() => setShowReward(false)}
      />
    )
  }

  return (
    <main className="screen">
      <TopBar title={title} onBack={onHome} backLabel="หน้าแรก" />
      <div className="sessionProgress">
        <span className="sessionCount">
          ข้อ {index + 1} จาก {total}
        </span>
        <ProgressBar value={index} max={total} label={`ทำไปแล้ว ${index} จาก ${total} ข้อ`} />
        <span className="sessionScore" aria-label={`ตอบถูก ${score} ข้อ`}>
          <span aria-hidden="true">⭐</span> {score}
        </span>
      </div>
      {current && (
        <QuestionView
          key={`${index}-${current.id}`}
          question={current}
          sound={settings.sound}
          readAloud={settings.readAloud}
          autoAdvanceSeconds={settings.autoAdvanceSeconds}
          maxTries={settings.maxTries}
          onAnswered={handleAnswered}
          onNext={handleNext}
          isLast={index + 1 >= total}
        />
      )}
    </main>
  )
}

function resultMessage(ratio: number) {
  if (ratio === 1) return 'ทำได้ถูกทุกข้อ ตั้งใจมาก'
  if (ratio >= 0.8) return 'ทำได้ดีมาก ฝึกข้อที่ผิดอีกนิดจะมั่นใจยิ่งขึ้น'
  if (ratio >= 0.6) return 'ทำได้ดี ลองดูวิธีคิดของข้อที่ผิด แล้วฝึกอีกรอบนะ'
  return 'ไม่เป็นไร ทุกครั้งที่ฝึกจะเก่งขึ้นทีละนิด ลองเรียนบทเรียนสั้นก่อนแล้วฝึกใหม่นะ'
}

function PracticeResult({
  title,
  result,
  firstTryRight,
  onHome,
  onReplay,
  onReview,
  dueCount,
  rewardOpen,
  onCloseReward,
}: {
  title: string
  result: RoundResult
  firstTryRight: number
  onHome: () => void
  onReplay: () => void
  onReview: () => void
  dueCount: number
  rewardOpen: boolean
  onCloseReward: () => void
}) {
  const { progress } = useProgress()
  const ratio = result.total ? result.score / result.total : 0
  const topics = Object.entries(result.perTopic) as [Topic, { right: number; total: number }][]

  return (
    <main className="screen">
      <TopBar title="สรุปผลการฝึก" onBack={onHome} backLabel="หน้าแรก" />
      <section className="card resultHero">
        <p className="eyebrow">{title}</p>
        <p className="resultScore">
          ตอบถูก <b>{result.score}</b> จาก {result.total} ข้อ
        </p>
        <p className="resultSub">ถูกตั้งแต่ครั้งแรก {firstTryRight} ข้อ</p>
        <p className="resultMessage">{resultMessage(ratio)}</p>
        <p className="resultStars">
          <span aria-hidden="true">⭐</span> ได้รับดาว +{result.starsGained} ดวง
          {result.starsGained > result.score && ' (รวมดาวโบนัสจากการทำได้ถูกทุกข้อ)'}
        </p>
      </section>

      <section className="card">
        <h2 className="sectionTitle">ผลรายทักษะ</h2>
        <ul className="topicResults">
          {topics.map(([t, v]) => {
            const m = mastery(progress.topicStats[t])
            return (
              <li key={t} className="topicResult">
                <span className="topicResultIcon" aria-hidden="true">
                  {TOPIC_ICONS[t]}
                </span>
                <span className="topicResultName">{TOPIC_NAMES[t]}</span>
                <span className={`badge badge-${v.right === v.total ? 'good' : 'todo'}`}>
                  {v.right}/{v.total}
                </span>
                <span className={`mastery mastery-${m.level}`}>{MASTERY_LABEL[m.level]}</span>
              </li>
            )
          })}
        </ul>
        {dueCount > 0 && (
          <p className="note">
            ข้อที่ตอบผิดถูกเก็บไว้ใน “กล่องทบทวน” แล้ว ทบทวนอีกครั้งจะช่วยให้จำได้ดีขึ้น
          </p>
        )}
      </section>

      <div className="actions">
        {dueCount > 0 && (
          <button className="btn btnPrimary btnLarge" onClick={onReview}>
            ทบทวนข้อที่ผิด ({dueCount} ข้อ)
          </button>
        )}
        <button
          className={`btn ${dueCount > 0 ? 'btnSecondary' : 'btnPrimary'} btnLarge`}
          onClick={onReplay}
        >
          ฝึกอีกรอบ
        </button>
        <button className="btn btnGhost btnLarge" onClick={onHome}>
          กลับหน้าแรก
        </button>
      </div>

      {rewardOpen && <RewardModal count={result.newTickets} onClose={onCloseReward} />}
    </main>
  )
}
