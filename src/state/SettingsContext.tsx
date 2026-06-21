import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Settings } from '../types'
import { DEFAULT_SETTINGS, loadSettings, saveSettings } from '../lib/storage'

interface SettingsCtx {
  settings: Settings
  update: (patch: Partial<Settings>) => void
  reset: () => void
}

const Ctx = createContext<SettingsCtx | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => loadSettings())

  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  const update = (patch: Partial<Settings>) => setSettings((s) => ({ ...s, ...patch }))
  const reset = () => setSettings({ ...DEFAULT_SETTINGS })

  return <Ctx.Provider value={{ settings, update, reset }}>{children}</Ctx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSettings(): SettingsCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useSettings ต้องอยู่ภายใน SettingsProvider')
  return ctx
}
