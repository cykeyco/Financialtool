import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect } from 'react'

/** A number that counts smoothly to its new value when it changes. */
export function AnimatedNumber({ value }: { value: number }) {
  const mv = useMotionValue(value)
  const text = useTransform(mv, (v) => Math.round(v).toLocaleString('en-US'))

  useEffect(() => {
    const controls = animate(mv, value, { duration: 0.4, ease: 'easeOut' })
    return () => controls.stop()
  }, [mv, value])

  return <motion.span>{text}</motion.span>
}
