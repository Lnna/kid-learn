/** 课中小精灵情绪反馈：对/错都可通知 Companion */

export type SpiritReactKind = 'hit' | 'miss'

type ReactHandler = (kind: SpiritReactKind) => void
const handlers = new Set<ReactHandler>()

export function onSpiritReact(handler: ReactHandler): () => void {
  handlers.add(handler)
  return () => handlers.delete(handler)
}

export function emitSpiritReact(kind: SpiritReactKind): void {
  handlers.forEach((h) => {
    try {
      h(kind)
    } catch {
      /* ignore */
    }
  })
  try {
    uni.$emit?.('spirit-react', kind)
  } catch {
    /* ignore */
  }
  // #ifdef H5
  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('spirit-react', { detail: kind }))
    }
  } catch {
    /* ignore */
  }
  // #endif
}

/** @deprecated 用 emitSpiritReact('miss') */
export function emitSpiritMiss(): void {
  emitSpiritReact('miss')
}

/** @deprecated 用 onSpiritReact */
export function onSpiritMiss(handler: () => void): () => void {
  return onSpiritReact((kind) => {
    if (kind === 'miss') handler()
  })
}
