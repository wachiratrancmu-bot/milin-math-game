import type { RoundResult } from '../types'
import { TOPIC_NAMES } from '../data/questions'
import { useSettings } from '../state/SettingsContext'
import { useProgress } from '../state/ProgressContext'

interface Props {
  result: RoundResult
  onReplay: () => void
  onHome: () => void
}

export function ResultModal({ result, onReplay, onHome }: Props) {
  const { settings } = useSettings()
  const { progress } = useProgress()
  const percent = result.total > 0 ? result.score / result.total : 0

  const medal =
    percent === 1
      ? 'ยอดเยี่ยมมาก ทำคะแนนได้เต็ม 👑'
      : percent >= 0.9
        ? 'เกือบเต็มแล้ว ทำได้ดีมาก 🏆'
        : percent >= 0.75
          ? 'ทำได้ดี ฝึกเพิ่มอีกเล็กน้อยจะมั่นใจขึ้น ⭐'
          : 'ไม่เป็นไร ค่อย ๆ ฝึกฝน คะแนนจะดีขึ้นแน่นอน 🌱'

  const weak = Object.entries(result.perTopic)
    .filter(([, v]) => v.total > 0 && v.right < v.total)
    .map(([t]) => TOPIC_NAMES[t as keyof typeof TOPIC_NAMES])

  const toNext = Math.max(0, settings.rewardThreshold - progress.starBalance)

  return (
    <div className="overlay">
      <div className="modal">
        <h2 style={{ margin: '0 0 4px' }}>สรุปผลของ{settings.playerName}</h2>
        <div className="scoreNum">
          {result.score}/{result.total}
        </div>
        <div className="medal">{medal}</div>

        <div className="note" style={{ textAlign: 'center' }}>
          ได้ดาวรอบนี้ <b>+{result.starsGained}</b> ดวง ⭐
          {result.starsGained > result.score && <> (รวมโบนัสทำเต็ม!)</>}
          <br />
          เหลืออีก <b>{toNext}</b> ดวง ก็จะได้ {settings.rewardEmoji} {settings.rewardName}
        </div>

        <div className="report">
          {Object.entries(result.perTopic).map(([topic, v]) => {
            const good = v.right >= v.total
            return (
              <div key={topic}>
                <b>{TOPIC_NAMES[topic as keyof typeof TOPIC_NAMES]}</b>
                <br />
                {v.right}/{v.total} ข้อ{' '}
                <span style={{ color: good ? 'var(--green2)' : 'var(--red)', fontWeight: 900 }}>
                  {good ? 'ทำได้ดี' : 'ควรฝึกเพิ่ม'}
                </span>
              </div>
            )
          })}
        </div>

        {weak.length > 0 && (
          <div className="note" style={{ textAlign: 'left' }}>
            <b>หัวข้อที่ควรฝึกซ้ำ</b>
            <br />
            {weak.join(' · ')}
          </div>
        )}

        <div className="btnRow" style={{ justifyContent: 'center' }}>
          <button className="primary" onClick={onReplay}>
            เล่นอีกรอบ
          </button>
          <button className="ghost" onClick={onHome}>
            กลับหน้าแรก
          </button>
        </div>
      </div>
    </div>
  )
}
