'use client';

import AuthLayout from '@/components/auth/AuthLayout';
import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <AuthLayout title="Daftar Akun Baru" description="Silakan isi form berikut untuk mendaftar">
      <RegisterForm />
    </AuthLayout>
  );
}