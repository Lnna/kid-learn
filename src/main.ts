import { createSSRApp } from "vue";
import App from "./App.vue";

export function createApp() {
  const app = createSSRApp(App);
  // #ifdef H5
  if (typeof window !== "undefined") {
    import("virtual:pwa-register")
      .then(({ registerSW }) => {
        // 发现新版本时自动刷新，避免微信/浏览器一直用旧缓存包
        const updateSW = registerSW({
          immediate: true,
          onNeedRefresh() {
            void updateSW(true);
          },
        });
      })
      .catch(() => {
        /* PWA plugin may be unavailable in some builds */
      });
  }
  // #endif
  return {
    app,
  };
}
