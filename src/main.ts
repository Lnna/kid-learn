import { createSSRApp } from "vue";
import App from "./App.vue";

export function createApp() {
  const app = createSSRApp(App);
  // #ifdef H5
  if (typeof window !== "undefined") {
    import("virtual:pwa-register")
      .then(({ registerSW }) => {
        registerSW({ immediate: true });
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
