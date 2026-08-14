import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'es2022',
  outDir: 'dist',
  clean: true,
  splitting: false,
  sourcemap: true,
  dts: false,
  noExternal: [/@workspace\//] // bundlea tus paquetes internos del monorepo (ui, etc. si los importas)
});
