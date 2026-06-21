import { useState } from 'react'
import type { Question, Settings, Mode } from './types'
import { Home } from './components/Home'
import { Game } from './components/Game'
import { ParentSettings } from './components/ParentSettings'
import { useSettings } from './state/SettingsContext'
import { buildRound } from './lib/quiz'

export default function App() {
  const { settings, update } = useSettings()
  const [screen, setScreen] = useState<'home' | 'game'>('home')
  const [round, setRound] = useState<Question[]>([])
  const [mode, setMode] = useState<Mode>('practice')
  const [showParent, setShowParent] = useState(false)
  const [lastOverride, setLastOverride] = useState<Partial<Settings> | undefined>(undefined)

  function start(override?: Partial<Settings>) {
    const effective: Settings = { ...settings, ...override }
    const questions = buildRound(effective)
    if (questions.length === 0) {
      alert('ยังไม่มีข้อสอบในหัวข้อที่เลือก กรุณาเปิดหัวข้ออื่นในหน้าตั้งค่า')
      return
    }
    // จดจำ preset ไว้ใช้ตอน "เล่นอีกรอบ" และบันทึกค่าเป็นค่าตั้งต้นถัดไป
    if (override) update(override)
    setLastOverride(override)
    setRound(questions)
    setMode(effective.mode)
    setScreen('game')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function replay() {
    start(lastOverride)
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
        <Game questions={round} mode={mode} onHome={goHome} onReplay={replay} />
      )}

      {showParent && <ParentSettings onClose={() => setShowParent(false)} />}
    </div>
  )
}
