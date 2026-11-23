import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/bazaario/' : '/',
  resolve: {
    // "@/logic/cart" instead of "../../logic/cart"
    alias: { '@': '/src' },
  },
}));
