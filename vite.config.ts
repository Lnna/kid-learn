import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import { VitePWA } from "vite-plugin-pwa";
import { kidlearnTtsProxyPlugin } from "./scripts/ttsProxyMiddleware";

export default defineConfig({
  plugins: [
    uni(),
    kidlearnTtsProxyPlugin(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["static/icons/*.png", "static/manifest.webmanifest"],
      manifest: false,
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,json,woff2,webmanifest}"],
        navigateFallback: "index.html",
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === "document",
            handler: "NetworkFirst",
            options: {
              cacheName: "pages",
            },
          },
          {
            // 发音 MP3：优先用本地缓存，断网也能复读已听过的句子
            urlPattern: ({ url }) =>
              url.pathname === "/api/tts" || url.pathname.endsWith("/kidlearnTts"),
            handler: "CacheFirst",
            options: {
              cacheName: "kidlearn-tts-v1",
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
              cacheableResponse: {
                statuses: [200],
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
});
