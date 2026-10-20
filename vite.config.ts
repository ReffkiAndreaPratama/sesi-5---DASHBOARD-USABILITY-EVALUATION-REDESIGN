import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  // @ts-ignore — vitest extends vite config
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test-setup.ts',
    css: false,
    include: ['tests/**/*.test.{ts,tsx}'],
    tsconfig: './tsconfig.test.json',
  },
})
