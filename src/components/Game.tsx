import { useMemo, useRef, useState } from 'react'
import type { Question, RoundResult, Mode } from '../types'
import { QuestionView } from './QuestionView'
import { ResultModal } from './ResultModal'
import { RewardModal } from './RewardModal'
import { useProgress } from '../state/ProgressContext'
import { useSettings } from '../state/SettingsContext'

interface Props {
  questions: Question[]
  mode: Mode
  onHome: () => void
  onReplay: () => void
}

export function Game({ questions, mode, onHome, onReplay }: Props) {
  const { settings } = useSettings()
  const { finishRound } = useProgress()

  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const streakRef = useRef(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [perTopic, setPerTopic] = useState<Record<string, { right: number; total: number }>>({})
  const [result, setResult] = useState<RoundResult | null>(null)
  const [showReward, setShowReward] = useState(false)

  const total = questions.length
  const current = questions[index]

  const starsDisplay = useMemo(() => {
    const done = Math.max(1, index)
    let s = index === 0 ? 0 : Math.round((score / done) * 5)
    s = Math.max(0, Math.min(5, s))
    return '★★★★★'.slice(0, s) + '☆☆☆☆☆'.slice(0, 5 - s)
  }, [score, index])

  function handleAnswered(correct: boolean) {
    const topic = current.topic
    setPerTopic((p) => {
      const cur = p[topic] ?? { right: 0, total: 0 }
      return { ...p, [topic]: { right: cur.right + (correct ? 1 : 0), total: cur.total + 1 } }
    })
    if (correct) {
      setScore((s) => s + 1)
      streakRef.current += 1
      setMaxStreak((m) => Math.max(m, streakRef.current))
    } else {
      streakRef.current = 0
    }
  }

  function handleNext() {
    if (index + 1 >= total) {
      const r = finishRound({ score, total, mode, perTopic, maxStreak })
      setResult(r)
      if (r.newTickets > 0) setShowReward(true)
    } else {
      setIndex((i) => i + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <main>
      <section className="card">
        <div className="gameTop">
          <button className="ghost smallBtn" onClick={onHome}>← กลับหน้าแรก</button>
          <div className="progressOuter">
            <div className="progressInner" style={{ width: `${((index + (result ? 1 : 0)) / total) * 100}%` }} />
          </div>
          <div className="pill">ข้อ {Math.min(index + 1, total)}/{total}</div>
          <div className="pill hideMobile">{mode === 'practice' ? 'โหมดฝึก' : 'โหมดสอบ'}</div>
          <div className="stars">{starsDisplay}</div>
        </div>
      </section>

      {current && (
        <QuestionView
          key={current.id}
          question={current}
          index={index}
          total={total}
          showHints={settings.showHints && mode === 'practice'}
          sound={settings.sound}
          onAnswered={handleAnswered}
          onNext={handleNext}
          isLast={index + 1 >= total}
        />
      )}

      {result && !showReward && (
        <ResultModal
          result={result}
          onReplay={onReplay}
          onHome={onHome}
        />
      )}

      {result && showReward && (
        <RewardModal
          count={result.newTickets}
          onClose={() => setShowReward(false)}
        />
      )}
    </main>
  )
}
