import { AnimatePresence, motion } from 'framer-motion'
import type { DragEvent } from 'react'
import { clothingColorHex, type ClothingColorId } from '../data/catalog'
import type { TryOnItem, TryOnSlot } from '../data/tryOnCart'
import type { MessageKey } from '../i18n/translations'

/** Visual drop order top→bottom on the figure (not paint order). */
const zoneOrder: TryOnSlot[] = ['outer', 'top', 'body', 'bottom']

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
  stiffness: 380,
  damping: 24,
  mass: 0.65,
}

const garmentVariants = {
  hidden: { opacity: 0, scale: 0.78, y: -36, rotate: -8, filter: 'blur(4px)' },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    rotate: 0,
    filter: 'blur(0px)',
    transition: garmentSpring,
  },
  exit: {
    opacity: 0,
    scale: 0.88,
    y: 22,
    rotate: 5,
    filter: 'blur(3px)',
    transition: { duration: 0.22, ease: 'easeIn' as const },
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
  const hasTop = Boolean(top)
  const hasBottom = Boolean(bottom)
  const hasOuter = Boolean(outer)

  return (
    <div className="tryon-baby" role="img" aria-label={t('tryOn.babyLabel')}>
      <motion.svg
        viewBox="0 0 280 420"
        className="tryon-baby__svg"
        initial={{ opacity: 0, y: 28, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 160, damping: 16 }}
      >
        <defs>
          <linearGradient id="tryon-skin" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fbe3cf" />
            <stop offset="100%" stopColor="#e8b896" />
          </linearGradient>
          <linearGradient id="tryon-room" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fff9fd" />
            <stop offset="45%" stopColor="#f8eef8" />
            <stop offset="100%" stopColor="#ebe3f5" />
          </linearGradient>
          <radialGradient id="tryon-glow" cx="50%" cy="28%" r="60%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="tryon-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d0178b" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#d0178b" stopOpacity="0" />
          </linearGradient>
          <filter id="tryon-soft" x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow
              dx="0"
              dy="12"
              stdDeviation="11"
              floodColor="#9b0f68"
              floodOpacity="0.16"
            />
          </filter>
          <filter id="tryon-cloth" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow
              dx="0"
              dy="3"
              stdDeviation="2.5"
              floodColor="#1a1a22"
              floodOpacity="0.18"
            />
          </filter>
          <clipPath id="tryon-body-clip">
            <rect x="70" y="130" width="140" height={hasBottom ? 118 : 220} rx="18" />
          </clipPath>
        </defs>

        <rect width="280" height="420" rx="32" fill="url(#tryon-room)" />
        <rect width="280" height="420" rx="32" fill="url(#tryon-glow)" />
        <ellipse cx="140" cy="400" rx="90" ry="28" fill="url(#tryon-floor)" />

        {[
          { cx: 36, cy: 64, r: 3.2, delay: 0 },
          { cx: 244, cy: 88, r: 2.4, delay: 0.5 },
          { cx: 40, cy: 200, r: 2, delay: 1 },
          { cx: 242, cy: 236, r: 3, delay: 1.4 },
          { cx: 52, cy: 330, r: 2.2, delay: 0.3 },
          { cx: 228, cy: 348, r: 2.6, delay: 0.9 },
        ].map((dot) => (
          <motion.circle
            key={`${dot.cx}-${dot.cy}`}
            cx={dot.cx}
            cy={dot.cy}
            r={dot.r}
            fill="#d0178b"
            animate={{ opacity: [0.12, 0.5, 0.12], y: [0, -12, 0] }}
            transition={{
              duration: 3.4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: dot.delay,
            }}
          />
        ))}

        <motion.ellipse
          cx="140"
          cy="392"
          rx="70"
          ry="11"
          fill="#d0178b"
          animate={{ opacity: [0.07, 0.14, 0.07], rx: [64, 78, 64] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.g
          style={{ originX: '140px', originY: '300px' }}
          animate={{ rotate: [0, 1.1, 0, -1.1, 0], y: [0, -3.5, 0, -2, 0] }}
          transition={{ duration: 5.8, repeat: Infinity, ease: 'easeInOut' }}
          filter="url(#tryon-soft)"
        >
          <motion.g
            animate={{ y: [0, -2.5, 0] }}
            transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <circle cx="140" cy="76" r="40" fill="url(#tryon-skin)" />
            <ellipse cx="140" cy="50" rx="38" ry="16" fill="#5a3d2b" opacity="0.9" />
            <motion.ellipse
              cx="125"
              cy="78"
              rx="3.8"
              ry="3.8"
              fill="#3a2a22"
              animate={{ ry: [3.8, 3.8, 0.35, 3.8, 3.8] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                times: [0, 0.74, 0.8, 0.86, 1],
                ease: 'easeInOut',
              }}
            />
            <motion.ellipse
              cx="155"
              cy="78"
              rx="3.8"
              ry="3.8"
              fill="#3a2a22"
              animate={{ ry: [3.8, 3.8, 0.35, 3.8, 3.8] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                times: [0, 0.74, 0.8, 0.86, 1],
                ease: 'easeInOut',
                delay: 0.04,
              }}
            />
            <motion.path
              d="M129 94c5 5 17 5 22 0"
              stroke="#c47a6a"
              strokeWidth="2.4"
              fill="none"
              strokeLinecap="round"
              animate={{
                d: ['M129 94c5 5 17 5 22 0', 'M129 95c6 4 16 4 22 0', 'M129 94c5 5 17 5 22 0'],
              }}
              transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <circle cx="114" cy="88" r="6" fill="#f0a090" opacity="0.42" />
            <circle cx="166" cy="88" r="6" fill="#f0a090" opacity="0.42" />
          </motion.g>

          <rect x="129" y="112" width="22" height="14" rx="6" fill="url(#tryon-skin)" />

          <motion.path
            d="M86 158c-14 26-18 66-12 92"
            stroke="url(#tryon-skin)"
            strokeWidth="20"
            strokeLinecap="round"
            fill="none"
            style={{ originX: '92px', originY: '158px' }}
            animate={{ rotate: [0, 5, 0, -3.5, 0] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.path
            d="M194 158c14 26 18 66 12 92"
            stroke="url(#tryon-skin)"
            strokeWidth="20"
            strokeLinecap="round"
            fill="none"
            style={{ originX: '188px', originY: '158px' }}
            animate={{ rotate: [0, -5, 0, 3.5, 0] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.path
            d="M120 278c-3 38-5 68-3 94"
            stroke="url(#tryon-skin)"
            strokeWidth="24"
            strokeLinecap="round"
            fill="none"
            style={{ originX: '120px', originY: '278px' }}
            animate={{ rotate: [0, -1.8, 0, 1.2, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.path
            d="M160 278c3 38 5 68 3 94"
            stroke="url(#tryon-skin)"
            strokeWidth="24"
            strokeLinecap="round"
            fill="none"
            style={{ originX: '160px', originY: '278px' }}
            animate={{ rotate: [0, 1.8, 0, -1.2, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.path
            d="M100 138c6-8 74-8 80 0l8 24v88c0 16-14 28-40 28h-16c-26 0-40-12-40-28v-88l8-24z"
            fill="url(#tryon-skin)"
            animate={{ scaleY: [1, 1.02, 1], scaleX: [1, 1.008, 1] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ originX: '140px', originY: '210px' }}
          />

          {/* Paint order: body → bottom → top → outer so layers nest cleanly */}
          <AnimatePresence mode="sync">
            {body ? (
              <motion.g
                key={`body-${body.id}`}
                variants={garmentVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                style={{ originX: '140px', originY: '200px' }}
                filter="url(#tryon-cloth)"
                clipPath={hasTop || hasBottom ? 'url(#tryon-body-clip)' : undefined}
              >
                {/* Full onesie when alone; short base layer when other pieces are on */}
                {hasTop || hasBottom ? (
                  <motion.path
                    d="M104 142c6-8 66-8 72 0l6 14v78c0 10-10 18-22 18h-40c-12 0-22-8-22-18v-78l6-14z"
                    animate={{ fill: fillFor(body.color) }}
                    transition={{ duration: 0.3 }}
                    stroke="#1f2230"
                    strokeOpacity="0.1"
                    strokeWidth="1.5"
                  />
                ) : (
                  <motion.path
                    d="M96 140c8-12 80-12 88 0l10 18 16 10c5 3 7 10 3 15l-10 14c-3 4-8 5-12 3l-5-3v118c0 12-10 20-20 20h-42c-10 0-20-8-20-20V197l-5 3c-4 2-9 1-12-3l-10-14c-4-5-2-12 3-15l16-10 10-18z"
                    animate={{ fill: fillFor(body.color) }}
                    transition={{ duration: 0.3 }}
                    stroke="#1f2230"
                    strokeOpacity="0.1"
                    strokeWidth="1.5"
                  />
                )}
                {!hasTop && !hasBottom ? (
                  <>
                    <circle cx="120" cy="205" r="3.2" fill="#1f2230" opacity="0.18" />
                    <circle cx="120" cy="228" r="3.2" fill="#1f2230" opacity="0.18" />
                    <circle cx="120" cy="251" r="3.2" fill="#1f2230" opacity="0.18" />
                  </>
                ) : null}
              </motion.g>
            ) : null}

            {bottom ? (
              <motion.g
                key={`bottom-${bottom.id}`}
                variants={garmentVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                style={{ originX: '140px', originY: '310px' }}
                filter="url(#tryon-cloth)"
              >
                <motion.path
                  d="M110 252h60c7 0 12 5 12 12v16c0 5-2 10-6 18l-8 66c-1.5 8-8 13-14 13h-5c-6 0-11-4-12.5-10l-6.5-40-6.5 40c-1.5 6-6.5 10-12.5 10h-5c-6 0-12.5-5-14-13l-8-66c-4-8-6-13-6-18v-16c0-7 5-12 12-12z"
                  animate={{ fill: fillFor(bottom.color) }}
                  transition={{ duration: 0.3 }}
                  stroke="#1f2230"
                  strokeOpacity="0.12"
                  strokeWidth="1.5"
                />
                <path
                  d="M140 252v48"
                  stroke="#fff"
                  strokeOpacity="0.25"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </motion.g>
            ) : null}

            {top ? (
              <motion.g
                key={`top-${top.id}`}
                variants={garmentVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                style={{ originX: '140px', originY: '175px' }}
                filter="url(#tryon-cloth)"
              >
                <motion.path
                  d="M102 144c7-10 69-10 76 0l7 14 14 8c5 3 6 9 3 14l-9 13c-2.5 4-8 5-11 2.5l-3-2v48c0 9-9 15-18 15h-32c-9 0-18-6-18-15v-48l-3 2c-3 2.5-8.5 1.5-11-2.5l-9-13c-3-5-2-11 3-14l14-8 7-14z"
                  animate={{ fill: fillFor(top.color) }}
                  transition={{ duration: 0.3 }}
                  stroke="#1f2230"
                  strokeOpacity="0.12"
                  strokeWidth="1.5"
                />
                <path
                  d="M140 148v72"
                  stroke="#fff"
                  strokeOpacity="0.22"
                  strokeWidth="2"
                  strokeLinecap="round"
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
                style={{ originX: '140px', originY: '185px' }}
                filter="url(#tryon-cloth)"
              >
                {/* Open jacket: left panel */}
                <motion.path
                  d="M96 146c8-14 28-18 40-18v168c-18 8-40 4-52-8v-92l-6 3c-4 2-9 1-11-3l-12-18c-3-5-2-11 3-14l18-10 20-16z"
                  animate={{ fill: fillFor(outer.color) }}
                  transition={{ duration: 0.3 }}
                  stroke="#1f2230"
                  strokeOpacity="0.14"
                  strokeWidth="1.5"
                  opacity={0.96}
                />
                {/* Open jacket: right panel */}
                <motion.path
                  d="M144 128c12 0 32 4 40 18l20 16 18 10c5 3 6 9 3 14l-12 18c-2 4-7 5-11 3l-6-3v92c-12 12-34 16-52 8V128z"
                  animate={{ fill: fillFor(outer.color) }}
                  transition={{ duration: 0.3 }}
                  stroke="#1f2230"
                  strokeOpacity="0.14"
                  strokeWidth="1.5"
                  opacity={0.96}
                />
                <path
                  d="M136 150v140M144 150v140"
                  stroke="#fff"
                  strokeOpacity="0.28"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </motion.g>
            ) : null}
          </AnimatePresence>

          {/* Soft sparkle when any garment is worn */}
          <AnimatePresence>
            {body || top || bottom || outer ? (
              <motion.g
                key="sparkle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {[
                  { x: 68, y: 150 },
                  { x: 208, y: 170 },
                  { x: 74, y: 290 },
                ].map((spark, index) => (
                  <motion.circle
                    key={`${spark.x}-${spark.y}`}
                    cx={spark.x}
                    cy={spark.y}
                    r="2.5"
                    fill="#fff"
                    animate={{ opacity: [0, 0.9, 0], scale: [0.5, 1.4, 0.5] }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      delay: index * 0.45,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </motion.g>
            ) : null}
          </AnimatePresence>
        </motion.g>

        {hasOuter || hasTop || hasBottom || body ? (
          <motion.text
            x="140"
            y="28"
            textAnchor="middle"
            fill="#d0178b"
            fontSize="11"
            fontWeight="700"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 0.75, y: 0 }}
          >
            ★
          </motion.text>
        ) : null}
      </motion.svg>

      <div className="tryon-zones">
        {zoneOrder.map((slot) => {
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
                  ? {
                      scale: 1.02,
                      backgroundColor: 'rgba(255,255,255,0.55)',
                      borderColor: 'rgba(208,23,139,0.55)',
                    }
                  : {
                      scale: 1,
                      backgroundColor: 'rgba(255,255,255,0)',
                      borderColor: 'rgba(208,23,139,0)',
                    }
              }
              transition={{ type: 'spring', stiffness: 420, damping: 26 }}
            >
              <span>{t(slotLabel[slot])}</span>
              {worn[slot] ? (
                <motion.button
                  type="button"
                  className="tryon-zone__clear"
                  onClick={() => onClearSlot(slot)}
                  aria-label={t('tryOn.clearSlot')}
                  whileHover={{ scale: 1.12, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
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
