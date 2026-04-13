import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    allowedHosts: ['5norccm1ce-5173.cnb.run', '5norccm1ce-5175.cnb.run', 'azg36aslkk-5174.cnb.run']
  }
})
