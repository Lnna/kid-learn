<template>
  <VehicleIcon v-if="vehicle" :type="vehicle" :size="size" />
  <text v-else-if="name" class="ai__emoji">{{ name }}</text>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import VehicleIcon from '../theme/VehicleIcon.vue'
import { normalizeVehicleType } from '../../utils/vehicleIcon'

const props = withDefaults(
  defineProps<{
    name?: string
    size?: number
  }>(),
  { size: 72 }
)

const vehicle = computed(() => normalizeVehicleType(props.name))
</script>

<style scoped>
.ai__emoji {
  font-size: inherit;
  line-height: 1;
}
</style>
