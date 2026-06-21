import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}
interface State {
  hasError: boolean
  message?: string
}

/** กันจอขาว: ถ้ามี error ระหว่าง render จะแสดงหน้าขอโทษแทน */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // บันทึกไว้ดูภายหลัง (ดูได้ใน console ของเบราว์เซอร์)
    console.error('เกิดข้อผิดพลาดในแอป:', error, info)
  }

  handleReset = () => {
    this.setState({ hasError: false, message: undefined })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="app">
          <div className="card" style={{ textAlign: 'center', maxWidth: 520, margin: '40px auto' }}>
            <div style={{ fontSize: 64 }}>🛠️</div>
            <h2>ขออภัย เกมสะดุดเล็กน้อย</h2>
            <p style={{ color: 'var(--soft)', lineHeight: 1.6 }}>
              ลองกดปุ่มด้านล่างเพื่อเริ่มใหม่ ความคืบหน้าและดาวสะสมยังอยู่ครบ
            </p>
            <div className="btnRow" style={{ justifyContent: 'center' }}>
              <button className="primary" onClick={() => window.location.reload()}>
                เริ่มใหม่
              </button>
              <button className="ghost" onClick={this.handleReset}>
                ลองต่อ
              </button>
            </div>
            {this.state.message && (
              <div className="mini" style={{ marginTop: 10 }}>
                ({this.state.message})
              </div>
            )}
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
