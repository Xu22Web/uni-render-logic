import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  target: 'esnext',
  outDir: 'dist',
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  minify: true,
  splitting: true,
  clean: true,
  treeshake: true,
  platform: 'browser',
  external: ['vue']
})
