import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  addPanelProduct,
  panelCustomers,
  panelDashboard,
  panelOrders,
  panelProducts,
  removePanelProduct,
  updatePanelProduct,
  type PanelCustomer,
  type PanelDashboard,
  type PanelProduct,
  type SizeGuideRow,
} from '../api/panel'
import { clothingColorIds } from '../data/catalog'
import { mergeSizeGuide } from '../data/sizeGuide'
import { useI18n } from '../i18n/useI18n'
import type { MessageKey } from '../i18n/translations'
import '../styles/pages/SellerPanelPage.css'

type Section = 'dashboard' | 'products' | 'orders' | 'customers'

const menu: { id: Section; label: MessageKey }[] = [
  { id: 'dashboard', label: 'panel.dashboard' },
  { id: 'products', label: 'panel.products' },
  { id: 'orders', label: 'panel.orders' },
  { id: 'customers', label: 'panel.customers' },
]

const categories = ['newborn', 'toddler', 'kids', 'sleepwear', 'outerwear'] as const
const sizeOptions = ['0-3', '3-6', '6-12', '1-2', '2-3', '3-4'] as const

const countryOptions = ['Iran', 'Turkey', 'China', 'Bangladesh', 'India', 'Other'] as const

const emptyForm = {
  name: '',
  nameFa: '',
  description: '',
  price: '',
  stock: '10',
  category: 'kids' as (typeof categories)[number],
  sizes: ['2-3'] as string[],
  sizeGuide: mergeSizeGuide(['2-3']) as SizeGuideRow[],
  colors: ['white'] as string[],
  countryOfOrigin: 'Iran',
  images: [] as string[],
}

export default function SellerPanelPage() {
  const { t, lang } = useI18n()
  const [section, setSection] = useState<Section>('dashboard')
  const [stats, setStats] = useState<PanelDashboard | null>(null)
  const [products, setProducts] = useState<PanelProduct[]>([])
  const [customers, setCustomers] = useState<PanelCustomer[]>([])
  const [orderCount, setOrderCount] = useState(0)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editorOpen, setEditorOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  useEffect(() => {
    document.title = `${t('panel.title')} | ${t('brand.name')}`
  }, [t])

  useEffect(() => {
    let alive = true
    Promise.all([panelDashboard(), panelProducts(), panelCustomers(), panelOrders()])
      .then(([dashboard, listing, shopCustomers, orders]) => {
        if (!alive) return
        setStats(dashboard)
        setProducts(listing)
        setCustomers(shopCustomers)
        setOrderCount(orders.length)
      })
      .catch((caught) => {
        if (alive) {
          setError(caught instanceof Error ? caught.message : t('account.loadError'))
        }
      })
    return () => {
      alive = false
    }
  }, [t])

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setEditorOpen(true)
    setNotice('')
    setError('')
  }

  function openEdit(product: PanelProduct) {
    setEditingId(product.id)
    setForm({
      name: product.name,
      nameFa: product.nameFa,
      description: product.description || '',
      price: String(product.toman),
      stock: String(product.stock),
      category: (categories.includes(product.category as (typeof categories)[number])
        ? product.category
        : 'kids') as (typeof categories)[number],
      sizes: product.sizes?.length ? [...product.sizes] : ['2-3'],
      sizeGuide: mergeSizeGuide(
        product.sizes?.length ? product.sizes : ['2-3'],
        product.sizeGuide,
      ),
      colors: product.colors?.length ? [...product.colors] : ['white'],
      countryOfOrigin: product.countryOfOrigin || 'Iran',
      images: product.images?.length
        ? [...product.images]
        : product.image
          ? [product.image]
          : [],
    })
    setEditorOpen(true)
    setNotice('')
    setError('')
  }

  function toggleSize(size: string) {
    setForm((current) => {
      const has = current.sizes.includes(size)
      const sizes = has
        ? current.sizes.filter((item) => item !== size)
        : [...current.sizes, size]
      const nextSizes = sizes.length ? sizes : current.sizes
      return {
        ...current,
        sizes: nextSizes,
        sizeGuide: mergeSizeGuide(nextSizes, current.sizeGuide),
      }
    })
  }

  function toggleColor(color: string) {
    setForm((current) => {
      const has = current.colors.includes(color)
      const colors = has
        ? current.colors.filter((item) => item !== color)
        : [...current.colors, color]
      return { ...current, colors: colors.length ? colors : current.colors }
    })
  }

  function updateGuideField(
    size: string,
    field: 'heightCm' | 'chestCm' | 'waistCm' | 'note',
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      sizeGuide: current.sizeGuide.map((row) =>
        row.size === size ? { ...row, [field]: value } : row,
      ),
    }))
  }

  async function onAlbumPick(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ''
    if (!files.length) return
    const remaining = Math.max(0, 8 - form.images.length)
    const selected = files.slice(0, remaining)
    const loaded = await Promise.all(
      selected.map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            if (!file.type.startsWith('image/')) {
              reject(new Error(t('panel.imageType')))
              return
            }
            if (file.size > 1_500_000) {
              reject(new Error(t('panel.imageSize')))
              return
            }
            const reader = new FileReader()
            reader.onload = () => resolve(String(reader.result || ''))
            reader.onerror = () => reject(new Error(t('account.saveError')))
            reader.readAsDataURL(file)
          }),
      ),
    )
    setForm((current) => ({
      ...current,
      images: [...current.images, ...loaded].slice(0, 8),
    }))
  }

  function removeImage(index: number) {
    setForm((current) => ({
      ...current,
      images: current.images.filter((_, i) => i !== index),
    }))
  }

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const toman = Number(form.price)
    const stock = Number(form.stock)
    if (!form.name.trim() || !form.nameFa.trim() || !Number.isFinite(toman) || toman < 1000) {
      setError(t('panel.formInvalid'))
      return
    }
    if (!form.sizes.length) {
      setError(t('panel.sizesRequired'))
      return
    }
    if (!form.colors.length) {
      setError(t('panel.colorsRequired'))
      return
    }
    if (!form.countryOfOrigin.trim()) {
      setError(t('panel.countryRequired'))
      return
    }
    setPending(true)
    setError('')
    setNotice('')
    const body = {
      name: form.name.trim(),
      nameFa: form.nameFa.trim(),
      toman: Math.round(toman),
      category: form.category,
      sizes: form.sizes,
      sizeGuide: mergeSizeGuide(form.sizes, form.sizeGuide),
      colors: form.colors,
      countryOfOrigin: form.countryOfOrigin.trim(),
      stock: Number.isFinite(stock) ? Math.max(0, Math.round(stock)) : 0,
      description: form.description.trim() || t('panel.defaultDescription'),
      image: form.images[0],
      images: form.images,
    }
    try {
      if (editingId) {
        const updated = await updatePanelProduct(editingId, body)
        setProducts((current) =>
          current.map((item) => (item.id === editingId ? updated : item)),
        )
        setNotice(t('panel.updated'))
      } else {
        const created = await addPanelProduct(body)
        setProducts((current) => [created, ...current])
        setStats((current) =>
          current ? { ...current, products: current.products + 1 } : current,
        )
        setNotice(t('panel.saved'))
      }
      setEditorOpen(false)
      setEditingId(null)
      setForm(emptyForm)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('account.saveError'))
    } finally {
      setPending(false)
    }
  }

  async function deleteProduct(id: string) {
    if (!window.confirm(t('panel.deleteConfirm'))) return
    try {
      await removePanelProduct(id)
      setProducts((current) => current.filter((item) => item.id !== id))
      setStats((current) =>
        current
          ? { ...current, products: Math.max(0, current.products - 1) }
          : current,
      )
      if (editingId === id) {
        setEditorOpen(false)
        setEditingId(null)
      }
      setNotice(t('panel.deleted'))
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('account.saveError'))
    }
  }

  return (
    <div className="seller-panel">
      <aside className="seller-panel__nav">
        <p className="seller-panel__brand">{t('panel.title')}</p>
        <nav aria-label={t('panel.title')}>
          {menu.map((item) => (
            <button
              key={item.id}
              type="button"
              className={item.id === section ? 'is-active' : undefined}
              onClick={() => setSection(item.id)}
            >
              {t(item.label)}
            </button>
          ))}
        </nav>
        <Link className="seller-panel__shop" to="/home">
          {t('panel.shop')}
        </Link>
      </aside>

      <main className="seller-panel__main">
        <header className="seller-panel__top">
          <h1>{t(menu.find((item) => item.id === section)?.label ?? 'panel.title')}</h1>
          {section === 'products' ? (
            <button className="seller-panel__primary" type="button" onClick={openCreate}>
              {t('panel.addNew')}
            </button>
          ) : null}
        </header>

        {error ? <p className="account-form__error">{error}</p> : null}
        {notice ? <p className="seller-panel__notice">{notice}</p> : null}

        {section === 'dashboard' ? (
          <section className="seller-panel__stats" aria-label={t('panel.dashboard')}>
            <article>
              <span>{t('panel.revenue')}</span>
              <strong>
                {lang === 'fa'
                  ? `${(stats?.revenueToman ?? 0).toLocaleString('fa-IR')} تومان`
                  : `${(stats?.revenueToman ?? 0).toLocaleString('en-US')} IRR`}
              </strong>
            </article>
            <article>
              <span>{t('panel.ordersStat')}</span>
              <strong>{stats?.orders ?? orderCount}</strong>
            </article>
            <article>
              <span>{t('panel.productsStat')}</span>
              <strong>{products.length}</strong>
            </article>
            <article>
              <span>{t('panel.customersStat')}</span>
              <strong>{stats?.customers ?? customers.length}</strong>
            </article>
          </section>
        ) : null}

        {section === 'products' ? (
          <section className="seller-panel__card">
            {editorOpen ? (
              <form className="wp-editor" onSubmit={saveProduct}>
                <div className="wp-editor__main">
                  <label>
                    {t('panel.name')}
                    <input
                      value={form.name}
                      onChange={(event) => setForm({ ...form, name: event.target.value })}
                      required
                    />
                  </label>
                  <label>
                    {t('panel.nameFa')}
                    <input
                      value={form.nameFa}
                      onChange={(event) => setForm({ ...form, nameFa: event.target.value })}
                      required
                    />
                  </label>
                  <label>
                    {t('panel.description')}
                    <textarea
                      rows={6}
                      value={form.description}
                      onChange={(event) =>
                        setForm({ ...form, description: event.target.value })
                      }
                    />
                  </label>
                  <fieldset className="wp-editor__album">
                    <legend>{t('panel.album')}</legend>
                    <p className="wp-editor__hint">{t('panel.albumHint')}</p>
                    <div className="wp-editor__thumbs">
                      {form.images.map((src, index) => (
                        <figure key={`${index}-${src.slice(0, 24)}`}>
                          <img src={src} alt="" />
                          <button type="button" onClick={() => removeImage(index)}>
                            {t('account.remove')}
                          </button>
                        </figure>
                      ))}
                    </div>
                    <label className="wp-editor__upload">
                      <span>{t('panel.addPhotos')}</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(event) => {
                          onAlbumPick(event).catch((caught) => {
                            setError(
                              caught instanceof Error
                                ? caught.message
                                : t('account.saveError'),
                            )
                          })
                        }}
                      />
                    </label>
                  </fieldset>
                </div>

                <aside className="wp-editor__side">
                  <div className="wp-box">
                    <h2>{t('panel.publish')}</h2>
                    <button className="seller-panel__primary" type="submit" disabled={pending}>
                      {pending
                        ? t('account.saving')
                        : editingId
                          ? t('panel.update')
                          : t('panel.publishProduct')}
                    </button>
                    <button
                      className="seller-panel__ghost"
                      type="button"
                      onClick={() => {
                        setEditorOpen(false)
                        setEditingId(null)
                      }}
                    >
                      {t('account.back')}
                    </button>
                  </div>

                  <div className="wp-box">
                    <h2>{t('panel.category')}</h2>
                    <select
                      value={form.category}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          category: event.target.value as (typeof categories)[number],
                        })
                      }
                    >
                      {categories.map((id) => (
                        <option key={id} value={id}>
                          {t(`nav.${id}` as MessageKey)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="wp-box">
                    <h2>{t('panel.price')}</h2>
                    <input
                      value={form.price}
                      onChange={(event) => setForm({ ...form, price: event.target.value })}
                      inputMode="numeric"
                      required
                    />
                    <label className="wp-box__stock">
                      {t('panel.stock')}
                      <input
                        value={form.stock}
                        onChange={(event) => setForm({ ...form, stock: event.target.value })}
                        inputMode="numeric"
                      />
                    </label>
                  </div>

                  <div className="wp-box">
                    <h2>{t('panel.sizes')}</h2>
                    <div className="wp-editor__sizes">
                      {sizeOptions.map((size) => (
                        <label key={size}>
                          <input
                            type="checkbox"
                            checked={form.sizes.includes(size)}
                            onChange={() => toggleSize(size)}
                          />
                          {t(`size.${size}` as MessageKey)}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="wp-box">
                    <h2>{t('panel.colors')}</h2>
                    <div className="wp-editor__sizes">
                      {clothingColorIds.map((color) => (
                        <label key={color}>
                          <input
                            type="checkbox"
                            checked={form.colors.includes(color)}
                            onChange={() => toggleColor(color)}
                          />
                          {t(`color.${color}` as MessageKey)}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="wp-box">
                    <h2>{t('panel.country')}</h2>
                    <label className="wp-box__stock">
                      {t('panel.country')}
                      <select
                        value={form.countryOfOrigin}
                        onChange={(event) =>
                          setForm({ ...form, countryOfOrigin: event.target.value })
                        }
                      >
                        {countryOptions.map((country) => (
                          <option key={country} value={country}>
                            {t(`country.${country}` as MessageKey)}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="wp-box">
                    <h2>{t('panel.sizeGuide')}</h2>
                    <p className="wp-editor__hint">{t('panel.sizeGuideHint')}</p>
                    <div className="wp-editor__guide">
                      {form.sizeGuide.map((row) => (
                        <fieldset key={row.size} className="wp-editor__guide-row">
                          <legend>{t(`size.${row.size}` as MessageKey)}</legend>
                          <label>
                            {t('panel.guideHeight')}
                            <input
                              value={row.heightCm}
                              onChange={(event) =>
                                updateGuideField(row.size, 'heightCm', event.target.value)
                              }
                              placeholder="86–98"
                            />
                          </label>
                          <label>
                            {t('panel.guideChest')}
                            <input
                              value={row.chestCm}
                              onChange={(event) =>
                                updateGuideField(row.size, 'chestCm', event.target.value)
                              }
                              placeholder="51–54"
                            />
                          </label>
                          <label>
                            {t('panel.guideWaist')}
                            <input
                              value={row.waistCm}
                              onChange={(event) =>
                                updateGuideField(row.size, 'waistCm', event.target.value)
                              }
                              placeholder="50–53"
                            />
                          </label>
                          <label className="wp-editor__guide-note">
                            {t('panel.guideNote')}
                            <input
                              value={row.note ?? ''}
                              onChange={(event) =>
                                updateGuideField(row.size, 'note', event.target.value)
                              }
                              placeholder={t('panel.guideNotePlaceholder')}
                            />
                          </label>
                        </fieldset>
                      ))}
                    </div>
                  </div>
                </aside>
              </form>
            ) : null}

            <table>
              <thead>
                <tr>
                  <th>{t('panel.product')}</th>
                  <th>{t('panel.price')}</th>
                  <th>{t('panel.category')}</th>
                  <th>{t('panel.status')}</th>
                  <th>{t('panel.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={5}>{t('panel.noProducts')}</td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id}>
                      <td data-label={t('panel.product')}>
                        <span className="seller-panel__product">
                          <img src={product.image || product.images?.[0]} alt="" />
                          {lang === 'fa' ? product.nameFa || product.name : product.name}
                        </span>
                      </td>
                      <td data-label={t('panel.price')}>
                        {lang === 'fa'
                          ? `${product.toman.toLocaleString('fa-IR')} تومان`
                          : `${product.toman.toLocaleString('en-US')} IRR`}
                      </td>
                      <td data-label={t('panel.category')}>
                        {t(`nav.${product.category}` as MessageKey)}
                      </td>
                      <td data-label={t('panel.status')}>
                        {product.stock > 0 ? t('panel.inStock') : t('panel.outOfStock')}
                      </td>
                      <td data-label={t('panel.actions')}>
                        <div className="seller-panel__row-actions">
                          <button type="button" onClick={() => openEdit(product)}>
                            {t('panel.edit')}
                          </button>
                          <button type="button" onClick={() => deleteProduct(product.id)}>
                            {t('account.remove')}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>
        ) : null}

        {section === 'orders' ? (
          <section className="seller-panel__card">
            <p>{orderCount === 0 ? t('panel.emptyOrders') : `${orderCount}`}</p>
          </section>
        ) : null}

        {section === 'customers' ? (
          <section className="seller-panel__card">
            {customers.length === 0 ? (
              <p>{t('panel.emptyCustomers')}</p>
            ) : (
              <ul className="account-list">
                {customers.map((customer) => (
                  <li key={customer.id} className="account-list__item">
                    <div>
                      <strong>{customer.name}</strong>
                      <p>{customer.phone}</p>
                      <p>
                        {customer.province}، {customer.city}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ) : null}
      </main>
    </div>
  )
}
