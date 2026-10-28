import { Navigate, Route, Routes } from 'react-router-dom'
import { RequireAccount } from './auth/RequireAccount'
import { canOpenSellerPanel } from './auth/session'
import AboutUsPage from './pages/AboutUsPage'
import AddressFormPage from './pages/AddressFormPage'
import AddressesPage from './pages/AddressesPage'
import SellPage from './pages/SellPage'
import CheckoutPage from './pages/CheckoutPage'
import ContentPage from './pages/ContentPage'
import ContactUsPage from './pages/ContactUsPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import SellerLoginPage from './pages/SellerLoginPage'
import SellerPanelPage from './pages/SellerPanelPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import OrdersPage from './pages/OrdersPage'
import PaymentFormPage from './pages/PaymentFormPage'
import PaymentMethodsPage from './pages/PaymentMethodsPage'
import ProductPage from './pages/ProductPage'
import ProfilePage from './pages/ProfilePage'
import ShopMenuPage from './pages/ShopMenuPage'
import SignupPage from './pages/SignupPage'

function SellerPanelRoute() {
  if (!canOpenSellerPanel()) return <Navigate to="/sell/login" replace />
  return <SellerPanelPage />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/product" element={<ProductPage />} />
      <Route
        path="/profile"
        element={
          <RequireAccount>
            <ProfilePage />
          </RequireAccount>
        }
      />
      <Route
        path="/orders"
        element={
          <RequireAccount>
            <OrdersPage />
          </RequireAccount>
        }
      />
      <Route
        path="/addresses"
        element={
          <RequireAccount>
            <AddressesPage />
          </RequireAccount>
        }
      />
      <Route
        path="/addresses/new"
        element={
          <RequireAccount>
            <AddressFormPage />
          </RequireAccount>
        }
      />
      <Route
        path="/payment-methods"
        element={
          <RequireAccount>
            <PaymentMethodsPage />
          </RequireAccount>
        }
      />
      <Route
        path="/payment-methods/new"
        element={
          <RequireAccount>
            <PaymentFormPage />
          </RequireAccount>
        }
      />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/cart" element={<CheckoutPage />} />
      <Route path="/contact-us" element={<ContactUsPage />} />
      <Route path="/contact" element={<ContactUsPage />} />
      <Route path="/about-us" element={<AboutUsPage />} />
      <Route path="/about" element={<AboutUsPage />} />
      <Route path="/sell" element={<SellPage />} />
      <Route path="/sell/login" element={<SellerLoginPage />} />
      <Route path="/seller-panel" element={<SellerPanelRoute />} />
      <Route path="/newborn" element={<ShopMenuPage kind="newborn" />} />
      <Route path="/toddler" element={<ShopMenuPage kind="toddler" />} />
      <Route path="/kids" element={<ShopMenuPage kind="kids" />} />
      <Route path="/sleepwear" element={<ShopMenuPage kind="sleepwear" />} />
      <Route path="/outerwear" element={<ShopMenuPage kind="outerwear" />} />
      <Route path="/sizes" element={<ShopMenuPage kind="sizes" />} />
      <Route path="/flowers" element={<Navigate to="/newborn" replace />} />
      <Route path="/same-day" element={<Navigate to="/toddler" replace />} />
      <Route path="/next-day" element={<Navigate to="/kids" replace />} />
      <Route path="/occasions" element={<Navigate to="/sleepwear" replace />} />
      <Route path="/sympathy" element={<Navigate to="/outerwear" replace />} />
      <Route path="/city" element={<Navigate to="/sizes" replace />} />
      <Route path="/blog" element={<ContentPage />} />
      <Route path="/news" element={<ContentPage />} />
      <Route path="/careers" element={<ContentPage />} />
      <Route path="/substitution-policy" element={<ContentPage />} />
      <Route path="/delivery-fees" element={<ContentPage />} />
      <Route
        path="/clothes-for-me"
        element={
          <RequireAccount>
            <ContentPage />
          </RequireAccount>
        }
      />
      <Route path="/send-me-flowers" element={<Navigate to="/clothes-for-me" replace />} />
      <Route
        path="/events"
        element={
          <RequireAccount>
            <ContentPage />
          </RequireAccount>
        }
      />
      <Route path="/shops" element={<ContentPage />} />
      <Route path="/shops/near-me" element={<ContentPage />} />
      <Route path="/reviews" element={<ContentPage />} />
      <Route path="/clothes-jobs" element={<ContentPage />} />
      <Route path="/floral-jobs" element={<Navigate to="/clothes-jobs" replace />} />
      <Route path="/help" element={<ContentPage />} />
      <Route path="/terms" element={<ContentPage />} />
      <Route path="/privacy" element={<ContentPage />} />
      <Route path="/cookies" element={<ContentPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}