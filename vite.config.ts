import react from '@vitejs/plugin-react'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, loadEnv } from 'vite'

function parseEnvFile(path: string, env: Record<string, string>) {
  if (!existsSync(path)) return env

  for (const line of readFileSync(path, 'utf-8').split('\n')) {
    const entry = line.trim()
    if (!entry || entry.startsWith('#')) continue

    const separator = entry.indexOf('=')
    if (separator === -1) continue

    const key = entry.slice(0, separator).trim()
    const value = entry.slice(separator + 1).trim().replace(/^["']|["']$/g, '')
    if (key) env[key] = value
  }

  return env
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const envDir = process.cwd()

  const env: Record<string, string> = {
    ...loadEnv(mode, envDir, ''),
    ...parseEnvFile(resolve(envDir, '.dev.env'), {}),
  }

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