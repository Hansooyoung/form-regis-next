'use client';

import { useEffect, useState } from 'react';
import { getUserData } from '@/utils/storage';
import AuthLayout from '@/components/auth/AuthLayout';

export default function DashboardPage() {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const data = getUserData();
    setUserData(data);
  }, []);

  if (!userData) {
    return (
      <AuthLayout title="Data Tidak Ditemukan">
        <p className="text-center">Silakan registrasi terlebih dahulu</p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Data Pendaftaran">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Informasi Pendaftaran</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Detail data yang telah Anda submit</p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            {Object.entries(userData).map(([key, value]) => (
              <div key={key} className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {value || '-'}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </AuthLayout>
  );
}