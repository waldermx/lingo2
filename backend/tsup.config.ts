import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/main.ts'],
  format: ['esm'],
  dts: false,
  sourcemap: true,
  outDir: 'dist',
  // Bundle @lingo2/shared inline so the compiled dist/main.js is fully
  // self-contained — no runtime dependency on the workspace TypeScript source.
  noExternal: ['@lingo2/shared'],
});
