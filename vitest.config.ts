import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['packages/*/src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['packages/*/src/**/*.ts'],
      exclude: ['packages/*/src/**/*.test.ts', 'packages/*/src/**/index.ts'],
    },
  },
  resolve: {
    alias: {
      '@lark-kit/core': new URL('./packages/core/src/index.ts', import.meta.url).pathname,
      '@lark-kit/shared': new URL('./packages/shared/src/index.ts', import.meta.url).pathname,
      '@lark-kit/base': new URL('./packages/base/src/index.ts', import.meta.url).pathname,
      '@lark-kit/chat': new URL('./packages/chat/src/index.ts', import.meta.url).pathname,
      'lark-kit': new URL('./packages/lark-kit/src/index.ts', import.meta.url).pathname,
    },
  },
})
