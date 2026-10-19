import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const port = Number(env.PORT) || 5000

  return {
    plugins: [react()],
    server: { port },
    preview: { port },
    define: {
      'import.meta.env.PORT': JSON.stringify(String(port)),
    },
  }
})