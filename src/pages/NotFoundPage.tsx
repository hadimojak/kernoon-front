import { Link } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'

export default function NotFoundPage() {
  return (
    <AuthLayout title="Page not found" subtitle="The page you are looking for does not exist">
      <div className="auth-links">
        <Link to="/login">Back to login</Link>
        <Link to="/signup">Create an account</Link>
      </div>
    </AuthLayout>
  )
}