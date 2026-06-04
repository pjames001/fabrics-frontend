import AdminLoginClient from '@/components/admin/AdminLoginClient'

export const metadata = {
  title: 'Admin Login — Fabric Store',
  description: 'Sign in to manage your Fabric Store catalog.',
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return <AdminLoginClient />
}
