import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
// import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  resolve: {
    alias: {
      // util: 'rollup-plugin-node-polyfills/polyfills/util',
    },
  },
  // optimizeDeps: {
  //   esbuildOptions: {
  //     plugins: [
  //       NodeGlobalsPolyfillPlugin({
  //         process: true,
  //         buffer: true,
  //       }),
  //     ],
  //   },
  // },
  // build: {
  //   rollupOptions: {
  //     plugins: [NodePolyfillPlugin()],
  //   },
  // },
});
