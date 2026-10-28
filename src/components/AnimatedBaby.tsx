import { AnimatePresence, motion } from 'framer-motion'
import type { DragEvent } from 'react'
import { clothingColorHex, type ClothingColorId } from '../data/catalog'
import type { TryOnItem, TryOnSlot } from '../data/tryOnCart'
import type { MessageKey } from '../i18n/translations'

const slots: TryOnSlot[] = ['body', 'top', 'bottom', 'outer']

const slotLabel: Record<TryOnSlot, MessageKey> = {
  body: 'tryOn.slot.body',
  top: 'tryOn.slot.top',
  bottom: 'tryOn.slot.bottom',
  outer: 'tryOn.slot.outer',
}

function fillFor(color: ClothingColorId) {
  if (color === 'multi') return '#e8a0b5'
  const value = clothingColorHex[color] || clothingColorHex.white
  return value.startsWith('#') ? value : clothingColorHex.white
}

const garmentSpring = {
  type: 'spring' as const,
  stiffness: 320,
  damping: 22,
  mass: 0.7,
}

const garmentVariants = {
  hidden: { opacity: 0, scale: 0.72, y: -28, rotate: -6 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    rotate: 0,
    transition: garmentSpring,
  },
  exit: {
    opacity: 0,
    scale: 0.85,
    y: 18,
    rotate: 4,
    transition: { duration: 0.28, ease: 'easeIn' as const },
  },
}

type AnimatedBabyProps = {
  worn: Partial<Record<TryOnSlot, TryOnItem>>
  dropSlot: TryOnSlot | null
  onDragOverSlot: (slot: TryOnSlot) => void
  onDragLeave: () => void
  onDropSlot: (slot: TryOnSlot) => void
  onClearSlot: (slot: TryOnSlot) => void
  t: (key: MessageKey) => string
}

export function AnimatedBaby({
  worn,
  dropSlot,
  onDragOverSlot,
  onDragLeave,
  onDropSlot,
  onClearSlot,
  t,
}: AnimatedBabyProps) {
  function zoneProps(slot: TryOnSlot) {
    return {
      className: `tryon-zone tryon-zone--${slot}${dropSlot === slot ? ' is-target' : ''}${
        worn[slot] ? ' is-filled' : ''
      }`,
      onDragOver: (event: DragEvent) => {
        event.preventDefault()
        onDragOverSlot(slot)
      },
      onDragLeave,
      onDrop: (event: DragEvent) => {
        event.preventDefault()
        onDropSlot(slot)
      },
    }
  }

  const body = worn.body
  const top = worn.top
  const bottom = worn.bottom
  const outer = worn.outer

  return (
    <div className="tryon-baby" role="img" aria-label={t('tryOn.babyLabel')}>
      <motion.svg
        viewBox="0 0 280 420"
        className="tryon-baby__svg"
        initial={{ opacity: 0, y: 24, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 18 }}
      >
        <defs>
          <linearGradient id="tryon-skin" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f8dcc4" />
            <stop offset="100%" stopColor="#e8b896" />
          </linearGradient>
          <linearGradient id="tryon-room" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fff8fc" />
            <stop offset="55%" stopColor="#f7eef8" />
            <stop offset="100%" stopColor="#ebe4f4" />
          </linearGradient>
          <radialGradient id="tryon-glow" cx="50%" cy="35%" r="55%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <filter id="tryon-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="10"
              stdDeviation="10"
              floodColor="#d0178b"
              floodOpacity="0.12"
            />
          </filter>
        </defs>

        <rect width="280" height="420" rx="28" fill="url(#tryon-room)" />
        <rect width="280" height="420" rx="28" fill="url(#tryon-glow)" />

        {/* ambient floating dots */}
        {[
          { cx: 42, cy: 70, r: 3, delay: 0 },
          { cx: 238, cy: 96, r: 2.5, delay: 0.4 },
          { cx: 48, cy: 220, r: 2, delay: 0.8 },
          { cx: 232, cy: 250, r: 3, delay: 1.2 },
          { cx: 56, cy: 340, r: 2.2, delay: 0.2 },
        ].map((dot) => (
          <motion.circle
            key={`${dot.cx}-${dot.cy}`}
            cx={dot.cx}
            cy={dot.cy}
            r={dot.r}
            fill="#d0178b"
            animate={{
              opacity: [0.15, 0.45, 0.15],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: dot.delay,
            }}
          />
        ))}

        <motion.ellipse
          cx="140"
          cy="392"
          rx="72"
          ry="12"
          fill="#d0178b"
          animate={{ opacity: [0.06, 0.12, 0.06], rx: [68, 76, 68] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* whole body: breath + gentle sway */}
        <motion.g
          style={{ originX: '140px', originY: '300px', transformBox: 'fill-box' }}
          animate={{
            rotate: [0, 1.2, 0, -1.2, 0],
            y: [0, -3, 0, -2, 0],
          }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          filter="url(#tryon-soft)"
        >
          {/* head */}
          <motion.g
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <circle cx="140" cy="78" r="42" fill="url(#tryon-skin)" />
            <ellipse cx="140" cy="52" rx="40" ry="18" fill="#5a3d2b" opacity="0.88" />
            {/* blink */}
            <motion.ellipse
              cx="124"
              cy="80"
              rx="4.2"
              ry="4.2"
              fill="#3a2a22"
              animate={{ ry: [4.2, 4.2, 0.4, 4.2, 4.2] }}
              transition={{
                duration: 4.8,
                repeat: Infinity,
                times: [0, 0.72, 0.78, 0.84, 1],
                ease: 'easeInOut',
              }}
            />
            <motion.ellipse
              cx="156"
              cy="80"
              rx="4.2"
              ry="4.2"
              fill="#3a2a22"
              animate={{ ry: [4.2, 4.2, 0.4, 4.2, 4.2] }}
              transition={{
                duration: 4.8,
                repeat: Infinity,
                times: [0, 0.72, 0.78, 0.84, 1],
                ease: 'easeInOut',
                delay: 0.05,
              }}
            />
            <motion.path
              d="M128 96c6 6 18 6 24 0"
              stroke="#c47a6a"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              animate={{ d: ['M128 96c6 6 18 6 24 0', 'M128 97c7 5 17 5 24 0', 'M128 96c6 6 18 6 24 0'] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <circle cx="112" cy="90" r="7" fill="#f0a090" opacity="0.45" />
            <circle cx="168" cy="90" r="7" fill="#f0a090" opacity="0.45" />
          </motion.g>

          <rect x="128" y="116" width="24" height="16" rx="6" fill="url(#tryon-skin)" />

          {/* arms sway */}
          <motion.path
            d="M78 160c-18 28-22 70-14 98"
            stroke="url(#tryon-skin)"
            strokeWidth="22"
            strokeLinecap="round"
            fill="none"
            style={{ originX: '90px', originY: '160px' }}
            animate={{ rotate: [0, 4, 0, -3, 0] }}
            transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.path
            d="M202 160c18 28 22 70 14 98"
            stroke="url(#tryon-skin)"
            strokeWidth="22"
            strokeLinecap="round"
            fill="none"
            style={{ originX: '190px', originY: '160px' }}
            animate={{ rotate: [0, -4, 0, 3, 0] }}
            transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* legs bounce lightly */}
          <motion.path
            d="M118 280c-4 40-6 70-4 96"
            stroke="url(#tryon-skin)"
            strokeWidth="26"
            strokeLinecap="round"
            fill="none"
            animate={{ rotate: [0, -1.5, 0, 1, 0] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ originX: '118px', originY: '280px' }}
          />
          <motion.path
            d="M162 280c4 40 6 70 4 96"
            stroke="url(#tryon-skin)"
            strokeWidth="26"
            strokeLinecap="round"
            fill="none"
            animate={{ rotate: [0, 1.5, 0, -1, 0] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ originX: '162px', originY: '280px' }}
          />

          {/* breath torso */}
          <motion.path
            d="M96 140c8-10 80-10 88 0l10 28v96c0 18-16 32-44 32h-20c-28 0-44-14-44-32v-96l10-28z"
            fill="url(#tryon-skin)"
            animate={{ scaleY: [1, 1.025, 1], scaleX: [1, 1.01, 1] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ originX: '140px', originY: '220px' }}
          />

          <AnimatePresence mode="sync">
            {body ? (
              <motion.g
                key={`body-${body.id}`}
                variants={garmentVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                style={{ originX: '140px', originY: '200px' }}
              >
                <motion.path
                  d="M90 138c10-16 90-16 100 0l12 22 22 14c8 5 10 16 4 24l-16 22c-4 6-12 8-18 4l-6-4v130c0 14-12 24-24 24h-48c-12 0-24-10-24-24V220l-6 4c-6 4-14 2-18-4l-16-22c-6-8-4-19 4-24l22-14 12-22z"
                  animate={{ fill: fillFor(body.color) }}
                  transition={{ duration: 0.35 }}
                  stroke="#282a35"
                  strokeOpacity="0.12"
                  strokeWidth="2"
                  opacity={0.96}
                />
                <circle cx="118" cy="210" r="4" fill="#282a35" opacity="0.2" />
                <circle cx="118" cy="236" r="4" fill="#282a35" opacity="0.2" />
                <circle cx="118" cy="262" r="4" fill="#282a35" opacity="0.2" />
              </motion.g>
            ) : null}

            {top ? (
              <motion.g
                key={`top-${top.id}`}
                variants={garmentVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                style={{ originX: '140px', originY: '180px' }}
              >
                <motion.path
                  d="M98 145c8-12 76-12 84 0l8 18 18 10c6 4 8 12 4 18l-12 18c-3 5-10 6-14 3l-4-2v58c0 10-10 18-22 18h-36c-12 0-22-8-22-18v-58l-4 2c-4 3-11 2-14-3L72 191c-4-6-2-14 4-18l18-10 8-18z"
                  animate={{ fill: fillFor(top.color) }}
                  transition={{ duration: 0.35 }}
                  stroke="#282a35"
                  strokeOpacity="0.12"
                  strokeWidth="2"
                  opacity={0.97}
                />
              </motion.g>
            ) : null}

            {bottom ? (
              <motion.g
                key={`bottom-${bottom.id}`}
                variants={garmentVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                style={{ originX: '140px', originY: '300px' }}
              >
                <motion.path
                  d="M108 248h64c8 0 14 6 14 14v20c0 6-2 12-8 22l-10 70c-2 10-10 16-18 16h-6c-8 0-14-6-16-14l-8-48-8 48c-2 8-8 14-16 14h-6c-8 0-16-6-18-16l-10-70c-6-10-8-16-8-22v-20c0-8 6-14 14-14z"
                  animate={{ fill: fillFor(bottom.color) }}
                  transition={{ duration: 0.35 }}
                  stroke="#282a35"
                  strokeOpacity="0.12"
                  strokeWidth="2"
                  opacity={0.97}
                />
              </motion.g>
            ) : null}

            {outer ? (
              <motion.g
                key={`outer-${outer.id}`}
                variants={garmentVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                style={{ originX: '140px', originY: '190px' }}
              >
                <motion.path
                  d="M88 148c12-18 92-18 104 0l14 28 20 12c7 4 9 14 4 21l-18 26c-4 6-12 7-17 3l-7-4v78c-18 10-50 12-72 0v-78l-7 4c-5 4-13 3-17-3l-18-26c-5-7-3-17 4-21l20-12 14-28z"
                  animate={{ fill: fillFor(outer.color) }}
                  transition={{ duration: 0.35 }}
                  stroke="#282a35"
                  strokeOpacity="0.15"
                  strokeWidth="2"
                  opacity={0.92}
                />
                <path
                  d="M140 155v168"
                  stroke="#fff"
                  strokeOpacity="0.35"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </motion.g>
            ) : null}
          </AnimatePresence>
        </motion.g>
      </motion.svg>

      <div className="tryon-zones">
        {slots.map((slot) => {
          const props = zoneProps(slot)
          return (
            <motion.div
              key={slot}
              className={props.className}
              onDragOver={props.onDragOver}
              onDragLeave={props.onDragLeave}
              onDrop={props.onDrop}
              animate={
                dropSlot === slot
                  ? { scale: 1.03, backgroundColor: 'rgba(255,255,255,0.42)' }
                  : { scale: 1, backgroundColor: 'rgba(255,255,255,0)' }
              }
              transition={{ type: 'spring', stiffness: 400, damping: 24 }}
            >
              <span>{t(slotLabel[slot])}</span>
              {worn[slot] ? (
                <motion.button
                  type="button"
                  className="tryon-zone__clear"
                  onClick={() => onClearSlot(slot)}
                  aria-label={t('tryOn.clearSlot')}
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.92 }}
                >
                  ×
                </motion.button>
              ) : null}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
