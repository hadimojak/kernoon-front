import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { listProducts, type ShopProduct } from '../api/shop'
import { AnimatedBaby } from '../components/AnimatedBaby'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import {
  clothingColorHex,
  type ClothingColorId,
} from '../data/catalog'
import {
  makeTryOnId,
  normalizeColors,
  readTryOnCart,
  slotForCategory,
  tryOnSamples,
  writeTryOnCart,
  type TryOnItem,
  type TryOnSlot,
} from '../data/tryOnCart'
import { useI18n } from '../i18n/useI18n'
import type { MessageKey } from '../i18n/translations'
import '../styles/pages/TryOnPage.css'

const slots: TryOnSlot[] = ['body', 'top', 'bottom', 'outer']

const slotLabel: Record<TryOnSlot, MessageKey> = {
  body: 'tryOn.slot.body',
  top: 'tryOn.slot.top',
  bottom: 'tryOn.slot.bottom',
  outer: 'tryOn.slot.outer',
}

type RackItem = {
  productId: string
  name: string
  nameFa: string
  image: string
  category: string
  colors: ClothingColorId[]
  slot: TryOnSlot
  sample?: boolean
}

function productToRack(product: ShopProduct): RackItem {
  return {
    productId: product.id,
    name: product.name,
    nameFa: product.nameFa,
    image: product.image,
    category: product.category,
    colors: normalizeColors(product.colors),
    slot: slotForCategory(product.category, product.name),
  }
}

function fillFor(color: ClothingColorId) {
  if (color === 'multi') return '#e8a0b5'
  const value = clothingColorHex[color] || clothingColorHex.white
  return value.startsWith('#') ? value : clothingColorHex.white
}

export default function TryOnPage() {
  const { t, lang } = useI18n()
  const [rack, setRack] = useState<RackItem[]>([])
  const [cart, setCart] = useState<TryOnItem[]>(() => readTryOnCart())
  const [worn, setWorn] = useState<Partial<Record<TryOnSlot, string>>>({})
  const [dragId, setDragId] = useState<string | null>(null)
  const [dropSlot, setDropSlot] = useState<TryOnSlot | null>(null)

  useEffect(() => {
    document.title = t('tryOn.title')
  }, [t])

  useEffect(() => {
    let alive = true
    listProducts()
      .then((rows) => {
        if (!alive) return
        if (rows.length) {
          setRack(rows.map(productToRack))
        } else {
          setRack(tryOnSamples.map((item) => ({ ...item, sample: true })))
        }
      })
      .catch(() => {
        if (alive) {
          setRack(tryOnSamples.map((item) => ({ ...item, sample: true })))
        }
      })
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    writeTryOnCart(cart)
  }, [cart])

  const wornItems = useMemo(() => {
    const map: Partial<Record<TryOnSlot, TryOnItem>> = {}
    for (const slot of slots) {
      const id = worn[slot]
      if (!id) continue
      const item = cart.find((row) => row.id === id)
      if (item) map[slot] = item
    }
    return map
  }, [cart, worn])

  const palette = useMemo(() => {
    const colors = new Set<ClothingColorId>()
    for (const item of Object.values(wornItems)) {
      if (item) colors.add(item.color)
    }
    return [...colors]
  }, [wornItems])

  function addToTempCart(item: RackItem) {
    const color = item.colors[0] ?? 'white'
    const next: TryOnItem = {
      id: makeTryOnId(),
      productId: item.productId,
      name: item.name,
      nameFa: item.nameFa,
      image: item.image,
      category: item.category,
      colors: item.colors,
      color,
      slot: item.slot,
    }
    setCart((current) => [...current, next])
  }

  function removeFromCart(id: string) {
    setCart((current) => current.filter((item) => item.id !== id))
    setWorn((current) => {
      const next = { ...current }
      for (const slot of slots) {
        if (next[slot] === id) delete next[slot]
      }
      return next
    })
  }

  function wearItem(item: TryOnItem, slot: TryOnSlot = item.slot) {
    setWorn((current) => ({ ...current, [slot]: item.id }))
  }

  function clearSlot(slot: TryOnSlot) {
    setWorn((current) => {
      const next = { ...current }
      delete next[slot]
      return next
    })
  }

  function setItemColor(id: string, color: ClothingColorId) {
    setCart((current) =>
      current.map((item) => (item.id === id ? { ...item, color } : item)),
    )
  }

  function onDrop(slot: TryOnSlot) {
    if (!dragId) return
    const item = cart.find((row) => row.id === dragId)
    if (item) wearItem(item, slot)
    setDragId(null)
    setDropSlot(null)
  }

  function labelOf(item: { name: string; nameFa: string }) {
    return lang === 'fa' ? item.nameFa : item.name
  }

  return (
    <div className="tryon-page">
      <Header />

      <main className="tryon">
        <motion.header
          className="tryon__intro"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <p className="tryon__eyebrow">{t('tryOn.eyebrow')}</p>
          <h1>{t('tryOn.heading')}</h1>
          <p>{t('tryOn.lead')}</p>
        </motion.header>

        <div className="tryon__layout">
          <section className="tryon__rack" aria-labelledby="tryon-rack">
            <div className="tryon__panel-head">
              <h2 id="tryon-rack">{t('tryOn.rack')}</h2>
              <p>{t('tryOn.rackHint')}</p>
            </div>
            <ul className="tryon__rack-list">
              {rack.map((item, index) => (
                <motion.li
                  key={item.productId}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, type: 'spring', stiffness: 260, damping: 22 }}
                >
                  <article className="tryon__card">
                    <img src={item.image} alt="" />
                    <div>
                      <h3>{labelOf(item)}</h3>
                      <p>{t(slotLabel[item.slot])}</p>
                      <div className="tryon__swatches" aria-hidden>
                        {item.colors.map((color) => (
                          <span
                            key={color}
                            className="tryon__swatch"
                            style={{ background: fillFor(color) }}
                          />
                        ))}
                      </div>
                    </div>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => addToTempCart(item)}
                    >
                      {t('tryOn.addTemp')}
                    </motion.button>
                  </article>
                </motion.li>
              ))}
            </ul>
          </section>

          <section className="tryon__stage" aria-labelledby="tryon-stage">
            <div className="tryon__panel-head tryon__panel-head--center">
              <h2 id="tryon-stage">{t('tryOn.stage')}</h2>
              <p>{t('tryOn.stageHint')}</p>
            </div>

            <motion.div
              className="tryon__baby-wrap"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 180, damping: 18, delay: 0.08 }}
            >
              <AnimatedBaby
                worn={wornItems}
                dropSlot={dropSlot}
                onDragOverSlot={(slot) => setDropSlot(slot)}
                onDragLeave={() => setDropSlot(null)}
                onDropSlot={onDrop}
                onClearSlot={clearSlot}
                t={t}
              />
            </motion.div>

            <AnimatePresence mode="wait">
              {palette.length ? (
                <motion.div
                  key="combo"
                  className="tryon__combo"
                  aria-live="polite"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                >
                  <h3>{t('tryOn.combo')}</h3>
                  <ul>
                    {slots.map((slot) => {
                      const item = wornItems[slot]
                      if (!item) return null
                      return (
                        <motion.li
                          key={slot}
                          layout
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                        >
                          <motion.span
                            className="tryon__swatch tryon__swatch--lg"
                            animate={{ backgroundColor: fillFor(item.color) }}
                            transition={{ duration: 0.3 }}
                          />
                          <span>
                            {t(slotLabel[slot])} ·{' '}
                            {t(`color.${item.color}` as MessageKey)}
                          </span>
                        </motion.li>
                      )
                    })}
                  </ul>
                </motion.div>
              ) : (
                <motion.p
                  key="empty"
                  className="tryon__empty-hint"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {t('tryOn.emptyStage')}
                </motion.p>
              )}
            </AnimatePresence>
          </section>

          <section className="tryon__temp" aria-labelledby="tryon-temp">
            <div className="tryon__panel-head">
              <h2 id="tryon-temp">{t('tryOn.tempCart')}</h2>
              <p>{t('tryOn.tempHint')}</p>
            </div>

            {cart.length === 0 ? (
              <p className="tryon__empty">{t('tryOn.tempEmpty')}</p>
            ) : (
              <ul className="tryon__temp-list">
                <AnimatePresence initial={false}>
                  {cart.map((item) => {
                    const isWorn = Object.values(worn).includes(item.id)
                    return (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.92, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, x: 24 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                      >
                        <motion.article
                          className={`tryon__temp-card${isWorn ? ' is-worn' : ''}`}
                          drag
                          dragSnapToOrigin
                          dragElastic={0.2}
                          dragMomentum={false}
                          whileHover={{ y: -2 }}
                          whileDrag={{
                            scale: 1.08,
                            rotate: 2,
                            zIndex: 40,
                            boxShadow: '0 20px 48px rgba(208,23,139,0.28)',
                          }}
                          onDragStart={() => setDragId(item.id)}
                          onDragEnd={(_event, info) => {
                            const elements = document.elementsFromPoint(
                              info.point.x,
                              info.point.y,
                            )
                            const zone = elements.find((el) =>
                              el.classList.contains('tryon-zone'),
                            ) as HTMLElement | undefined
                            if (zone) {
                              const slot = slots.find((name) =>
                                zone.classList.contains(`tryon-zone--${name}`),
                              )
                              if (slot) wearItem(item, slot)
                            }
                            setDragId(null)
                            setDropSlot(null)
                          }}
                          onDrag={(_event, info) => {
                            const elements = document.elementsFromPoint(
                              info.point.x,
                              info.point.y,
                            )
                            const zone = elements.find((el) =>
                              el.classList.contains('tryon-zone'),
                            ) as HTMLElement | undefined
                            if (!zone) {
                              setDropSlot(null)
                              return
                            }
                            const slot = slots.find((name) =>
                              zone.classList.contains(`tryon-zone--${name}`),
                            )
                            setDropSlot(slot ?? null)
                          }}
                        >
                          <img src={item.image} alt="" draggable={false} />
                          <div className="tryon__temp-body">
                            <h3>{labelOf(item)}</h3>
                            <p>{t(slotLabel[item.slot])}</p>
                            <div
                              className="tryon__swatches"
                              role="group"
                              aria-label={t('tryOn.pickColor')}
                            >
                              {item.colors.map((color) => (
                                <motion.button
                                  key={color}
                                  type="button"
                                  className={`tryon__swatch tryon__swatch--btn${
                                    item.color === color ? ' is-active' : ''
                                  }`}
                                  style={{ background: fillFor(color) }}
                                  aria-label={t(`color.${color}` as MessageKey)}
                                  aria-pressed={item.color === color}
                                  whileTap={{ scale: 0.88 }}
                                  onClick={() => setItemColor(item.id, color)}
                                />
                              ))}
                            </div>
                            <div className="tryon__temp-actions">
                              <motion.button
                                type="button"
                                whileTap={{ scale: 0.96 }}
                                onClick={() => wearItem(item)}
                              >
                                {isWorn ? t('tryOn.wearing') : t('tryOn.wear')}
                              </motion.button>
                              <motion.button
                                type="button"
                                className="tryon__ghost"
                                whileTap={{ scale: 0.96 }}
                                onClick={() => removeFromCart(item.id)}
                              >
                                {t('tryOn.remove')}
                              </motion.button>
                            </div>
                          </div>
                        </motion.article>
                      </motion.li>
                    )
                  })}
                </AnimatePresence>
              </ul>
            )}

            <Link className="tryon__shop-link" to="/all">
              {t('tryOn.shopMore')}
            </Link>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
