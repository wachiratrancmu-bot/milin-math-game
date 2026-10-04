import { useState } from 'react'
import type { Question, Settings } from './types'
import { Home, type StartConfig } from './components/Home'
import { Game } from './components/Game'
import { ParentSettings } from './components/ParentSettings'
import { useSettings } from './state/SettingsContext'
import { buildRound } from './lib/quiz'

export default function App() {
  const { settings } = useSettings()
  const [screen, setScreen] = useState<'home' | 'game'>('home')
  const [round, setRound] = useState<Question[]>([])
  // ค่าที่ใช้จริงในรอบนี้ (ค่าตั้งของพ่อแม่ + ค่าเฉพาะของภารกิจ)
  const [roundSettings, setRoundSettings] = useState<Settings>(settings)
  const [showParent, setShowParent] = useState(false)
  const [lastStart, setLastStart] = useState<StartConfig>({})
  const [roundNo, setRoundNo] = useState(0)

  function start(config: StartConfig = {}) {
    // ค่าของภารกิจใช้เฉพาะรอบนี้ ไม่บันทึกทับค่าที่พ่อแม่ตั้งไว้
    const effective: Settings = { ...settings, ...config.patch }
    const questions = buildRound(effective, config.options)
    if (questions.length === 0) {
      alert('ยังไม่มีข้อสอบในหัวข้อที่เลือก กรุณาเปิดหัวข้ออื่นในหน้าตั้งค่า')
      return
    }
    setLastStart(config)
    setRound(questions)
    setRoundSettings(effective)
    setRoundNo((n) => n + 1)
    setScreen('game')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function goHome() {
    setScreen('home')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app">
      {screen === 'home' ? (
        <Home onStart={start} onOpenParent={() => setShowParent(true)} />
      ) : (
        <Game
          // เปลี่ยน key ทุกครั้งที่เริ่มรอบใหม่ เพื่อล้างคะแนนและข้อปัจจุบันของรอบก่อน
          key={roundNo}
          questions={round}
          settings={roundSettings}
          onHome={goHome}
          onReplay={() => start(lastStart)}
        />
      )}

      {showParent && <ParentSettings onClose={() => setShowParent(false)} />}
    </div>
  )
}
