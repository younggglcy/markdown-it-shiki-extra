import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/worker.ts'],
  dts: true,
  format: ['cjs', 'esm'],
  target: 'node16',
})
