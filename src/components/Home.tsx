import type { Settings } from '../types'
import { useSettings } from '../state/SettingsContext'
import { useProgress } from '../state/ProgressContext'
import { TOPIC_NAMES, TOPIC_ICONS } from '../data/questions'

interface Props {
  onStart: (override?: Partial<Settings>) => void
  onOpenParent: () => void
}

const PRESETS: { key: string; icon: string; title: string; desc: string; cls: string; patch: Partial<Settings> }[] = [
  { key: 'rainbow', icon: '🌈', title: 'ภารกิจสายรุ้ง', desc: 'เริ่มแบบสบาย ๆ มีคำใบ้ช่วยทุกข้อ', cls: 'secondary', patch: { mode: 'practice', mix: 'warmup' } },
  { key: 'star', icon: '⭐', title: 'ภารกิจดวงดาว', desc: 'ฝึกจริงจังขึ้น เพื่อเก็บดาวให้มากกว่าเดิม', cls: 'primary', patch: { mode: 'practice', mix: 'balanced' } },
  { key: 'crown', icon: '👑', title: 'ภารกิจมงกุฎ', desc: 'ท้าทายแบบทดสอบ พร้อมเป็นแชมป์คณิต', cls: 'green', patch: { mode: 'exam', mix: 'challenge' } },
]

export function Home({ onStart, onOpenParent }: Props) {
  const { settings } = useSettings()
  const { progress, pendingTickets } = useProgress()

  const pct = Math.min(100, Math.round((progress.starBalance / settings.rewardThreshold) * 100))
  const toNext = Math.max(0, settings.rewardThreshold - progress.starBalance)

  return (
    <main>
      <header className="top">
        <div className="brand">
          <div className="mark">⭐</div>
          <div>
            <h1>ผจญภัยดาวคณิตของ{settings.playerName}</h1>
            <div className="caption">เล่นสนุก คิดเป็นขั้นตอน เก็บดาวแลกรางวัล</div>
          </div>
        </div>
        <div className="btnRow" style={{ marginTop: 0 }}>
          {pendingTickets > 0 && (
            <div className="pill" style={{ background: '#eafff3', color: 'var(--green2)' }}>
              {settings.rewardEmoji} รางวัลรอรับ {pendingTickets}
            </div>
          )}
          <button className="ghost smallBtn" onClick={onOpenParent}>👨‍👩‍👧 ตั้งค่าผู้ปกครอง</button>
        </div>
      </header>

      <section className="grid2">
        <div className="card hero">
          <div className="mascotRow">
            <div className="mascot">🐰</div>
            <div className="speech">เลือกภารกิจที่ต้องการ แล้วเริ่มเก็บดาวได้เลย</div>
          </div>

          <div className="heroTitle">วันนี้{settings.playerName}จะเก็บดาวได้กี่ดวง</div>
          <p className="heroText">เลือกภารกิจที่ต้องการแล้วเริ่มเล่นได้ทันที ทุกข้อช่วยฝึกให้คิดเลขได้อย่างมั่นใจขึ้น</p>

          <div className="missionGrid">
            {PRESETS.map((p) => (
              <div className="missionCard" key={p.key}>
                <div>
                  <div className="missionIcon">{p.icon}</div>
                  <b>{p.title}</b>
                  <span>{p.desc}</span>
                </div>
                <button className={`${p.cls} smallBtn`} onClick={() => onStart(p.patch)}>เริ่มภารกิจ</button>
              </div>
            ))}
          </div>

          <div className="btnRow">
            <button className="primary" onClick={() => onStart()}>▶ เริ่มเล่นด้วยค่าที่ตั้งไว้</button>
          </div>
        </div>

        <aside className="card rewardCard">
          <h2 style={{ margin: '0 0 4px' }}>กล่องเก็บดาว</h2>
          <div className="rewardBig">{settings.rewardEmoji}</div>
          <b style={{ fontSize: 18 }}>
            เหลืออีก {toNext} ดวง ได้ {settings.rewardName}!
          </b>
          <div className="rewardProgress">
            <div className="rewardProgressInner" style={{ width: `${pct}%` }} />
          </div>
          <div className="mini">{progress.starBalance} / {settings.rewardThreshold} ดวง</div>

          <div className="statRow">
            <div className="statBox"><div className="num">{progress.totalCorrect}</div><span>ตอบถูกสะสม</span></div>
            <div className="statBox"><div className="num">{progress.ticketsEarned}</div><span>รางวัลที่ได้</span></div>
            <div className="statBox"><div className="num">{progress.bestStreak}</div><span>ตอบถูกติดกันสูงสุด</span></div>
            <div className="statBox"><div className="num">{progress.perfectRounds}</div><span>รอบที่ทำเต็ม</span></div>
          </div>

          <div className="topicList">
            <h3 style={{ margin: '14px 0 6px', fontSize: 16 }}>ด่านที่จะได้เจอ</h3>
            {settings.enabledTopics.map((t) => (
              <div className="topic" key={t}>
                <div className="topicIcon">{TOPIC_ICONS[t]}</div>
                <div><b>{TOPIC_NAMES[t]}</b></div>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </main>
  )
}
