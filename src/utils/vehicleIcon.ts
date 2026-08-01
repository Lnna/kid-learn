/** 工程车车种 id —— 活动 icon 字段与图鉴共用 */
export const VEHICLE_TYPE_IDS = [
  'excavator',
  'bulldozer',
  'crane',
  'dumptruck',
  'mixer',
  'roller',
  'loader',
  'forklift',
] as const

export type VehicleTypeId = (typeof VEHICLE_TYPE_IDS)[number]

export const VEHICLE_COLORS: Record<VehicleTypeId, string> = {
  excavator: '#F5A623',
  bulldozer: '#E67E22',
  crane: '#E74C3C',
  dumptruck: '#3498DB',
  mixer: '#9B59B6',
  roller: '#7F8C8D',
  loader: '#27AE60',
  forklift: '#D4AC0D',
}

const VEHICLE_SET = new Set<string>(VEHICLE_TYPE_IDS)

/** icon 是否为工程车车种 id（非 emoji） */
export function isVehicleIcon(icon?: string | null): icon is VehicleTypeId {
  return !!icon && VEHICLE_SET.has(icon)
}

export function normalizeVehicleType(icon?: string | null): VehicleTypeId | null {
  return isVehicleIcon(icon) ? icon : null
}
