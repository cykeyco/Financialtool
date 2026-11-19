import type { ReactNode } from 'react'

/**
 * The flow visual language.
 * Gradient means money in motion or AI at work — never decoration on data.
 */

/** Grainy, slowly drifting gradient field. Place inside a `relative overflow-hidden` card. */
export function FlowField({ phase = 0, settled = false }: { phase?: number; settled?: boolean }) {
  return (
    <div aria-hidden="true" className={`flow-field ${settled ? 'flow-settled' : `flow-p${phase}`}`}>
      <div className="flow-blob flow-b4" />
      <div className="flow-blob flow-b1" />
      <div className="flow-blob flow-b2" />
      <div className="flow-blob flow-b3" />
      <div className="flow-fade" />
      <div className="flow-grain" />
    </div>
  )
}

/** Marks anything the agent says or suggests. */
export function AiOrb({ size = 14, spinning = false }: { size?: number; spinning?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`flow-conic inline-block shrink-0 rounded-full ${spinning ? 'animate-spin [animation-duration:2.4s]' : ''}`}
      style={{
        width: size,
        height: size,
        boxShadow: `inset 0 0 0 1px rgb(255 255 255 / 0.5), 0 0 ${spinning ? 10 : 8}px rgb(94 154 128 / ${spinning ? 0.55 : 0.35})`,
      }}
    />
  )
}

/** The agent's reasoning, set apart by a small orb. */
export function AgentNote({ children }: { children: ReactNode }) {
  return (
    <p className="flex gap-2 text-[13px] text-ink-2">
      <span className="mt-[5px]">
        <AiOrb size={9} />
      </span>
      <span>{children}</span>
    </p>
  )
}
