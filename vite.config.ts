import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';
import { svelteTesting } from '@testing-library/svelte/vite'
import { resolve } from 'path';

// Define custom preprocess options if needed
const preprocessOptions = {
  typescript: {
    tsconfigFile: './tsconfig.json', // Adjust the path to your tsconfig.json
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelteTesting(),
    svelte({
      preprocess: sveltePreprocess(preprocessOptions),
    }),
  ],
  
  resolve: {
    alias: {
      // Define any custom aliases here
      '@': resolve(__dirname, 'src'),
    },
  }
});
