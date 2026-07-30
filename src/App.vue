<script setup lang="ts">
import { onLaunch } from "@dcloudio/uni-app";
import { loadProgress } from "./engine/progress";
import { setSfxEnabled } from "./utils/sfx";

onLaunch(() => {
  const settings = loadProgress().settings;
  setSfxEnabled(settings.sfxEnabled);
});
</script>

<style lang="scss">
@use "./styles/tokens.scss";

page {
  font-family: var(--font-round);
  background: var(--color-cream);
  color: var(--color-ink);
  box-sizing: border-box;
}

view,
text {
  box-sizing: border-box;
}
</style>
