import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    uni(),
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
