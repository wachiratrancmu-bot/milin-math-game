import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' ทำให้ build แล้ววางที่ไหนก็ได้ — ทั้ง GitHub Pages (โปรเจกต์ย่อย),
// เปิดจากไฟล์โดยตรง หรือโฮสต์อื่น ๆ โดยไม่ต้องแก้ค่า
export default defineConfig({
  plugins: [react()],
  base: './',
})
