import { Route, Routes } from 'react-router-dom'
import AboutUsPage from './pages/AboutUsPage'
import AddressesPage from './pages/AddressesPage'
import BecomeFloristPage from './pages/BecomeFloristPage'
import CheckoutPage from './pages/CheckoutPage'
import ContentPage from './pages/ContentPage'
import ContactUsPage from './pages/ContactUsPage'
import FloristLoginPage from './pages/FloristLoginPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import OrdersPage from './pages/OrdersPage'
import PaymentMethodsPage from './pages/PaymentMethodsPage'
import ProductPage from './pages/ProductPage'
import ProfilePage from './pages/ProfilePage'
import ShopMenuPage from './pages/ShopMenuPage'
import SignupPage from './pages/SignupPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage key="guest" />} />
      <Route path="/home" element={<HomePage key="logged-in" loggedIn />} />
      <Route path="/product" element={<ProductPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/addresses" element={<AddressesPage />} />
      <Route path="/payment-methods" element={<PaymentMethodsPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/cart" element={<CheckoutPage />} />
      <Route path="/contact-us" element={<ContactUsPage />} />
      <Route path="/contact" element={<ContactUsPage />} />
      <Route path="/about-us" element={<AboutUsPage />} />
      <Route path="/about" element={<AboutUsPage />} />
      <Route path="/florist" element={<BecomeFloristPage />} />
      <Route path="/florist/login" element={<FloristLoginPage />} />
      <Route path="/flowers" element={<ShopMenuPage kind="flowers" />} />
      <Route path="/same-day" element={<ShopMenuPage kind="same-day" />} />
      <Route path="/next-day" element={<ShopMenuPage kind="next-day" />} />
      <Route path="/occasions" element={<ShopMenuPage kind="occasions" />} />
      <Route path="/sympathy" element={<ShopMenuPage kind="sympathy" />} />
      <Route path="/city" element={<ShopMenuPage kind="city" />} />
      <Route path="/blog" element={<ContentPage />} />
      <Route path="/news" element={<ContentPage />} />
      <Route path="/substitution-policy" element={<ContentPage />} />
      <Route path="/delivery-fees" element={<ContentPage />} />
      <Route path="/careers" element={<ContentPage />} />
      <Route path="/send-me-flowers" element={<ContentPage />} />
      <Route path="/events" element={<ContentPage />} />
      <Route path="/florists" element={<ContentPage />} />
      <Route path="/florists/near-me" element={<ContentPage />} />
      <Route path="/reviews" element={<ContentPage />} />
      <Route path="/floral-jobs" element={<ContentPage />} />
      <Route path="/help" element={<ContentPage />} />
      <Route path="/terms" element={<ContentPage />} />
      <Route path="/privacy" element={<ContentPage />} />
      <Route path="/cookies" element={<ContentPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}