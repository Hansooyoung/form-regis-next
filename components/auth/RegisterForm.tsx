"use client";

import { useState, useCallback, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  getProvinces,
  getRegencies,
  getDistricts,
  getVillages,
} from "@/services/regionService";
import { saveUserData } from "@/utils/storage";
import AuthForm from "@/components/auth/AuthForm";
import { RegionSelect } from "@/components/regions/RegionSelect";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    password: "",
    email: "",
    nik: "",
    phone: "",
    address: "",
    province: "",
    regency: "",
    district: "",
    village: "",
    rt: "",
    rw: "",
    postalCode: "",
  });
  const [dataValid, setDataValid] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleNumberInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      if (/^\d*$/.test(value) || value === "") {
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (errors[name]) {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
          });
        }
      }
    },
    [errors]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const handleRegionChange = useCallback((name: string, value: string) => {
    setFormData((prev) => {
      if (name === "province") {
        return {
          ...prev,
          province: value,
          regency: "",
          district: "",
          village: "",
        };
      }
      if (name === "regency") {
        return { ...prev, regency: value, district: "", village: "" };
      }
      if (name === "district") {
        return { ...prev, district: value, village: "" };
      }
      return { ...prev, [name]: value };
    });
  }, []);

  const getRegenciesMemoized = useCallback(
    () => getRegencies(formData.province),
    [formData.province]
  );

  const getDistrictsMemoized = useCallback(
    () => getDistricts(formData.regency),
    [formData.regency]
  );

  const getVillagesMemoized = useCallback(
    () => getVillages(formData.district),
    [formData.district]
  );

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const requiredFields = [
      "fullName",
      "password",
      "email",
      "nik",
      "phone",
      "address",
      "province",
      "regency",
      "district",
      "village",
      "rt",
      "rw",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = "Field ini wajib diisi";
      }
    });

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email tidak valid";
    }

    if (formData.phone && !/^[0-9]{10,13}$/.test(formData.phone)) {
      newErrors.phone = "Nomor handphone tidak valid";
    }

    if (formData.nik && !/^[0-9]{16}$/.test(formData.nik)) {
      newErrors.nik = "NIK harus 16 digit angka";
    }

    if (formData.password && formData.password.length < 8) {
      newErrors.password = "Password harus minimal 8 karakter";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dataValid) {
      Swal.fire({
        icon: 'error',
        title: 'Validasi Gagal',
        text: 'Anda harus menyetujui bahwa data yang dimasukkan valid',
      });
      return;
    }

    if (!validateForm()) {
      Swal.fire({
        icon: 'error',
        title: 'Form Tidak Valid',
        text: 'Harap perbaiki error pada form sebelum submit',
      });
      return;
    }

    try {
      saveUserData(formData);
      await Swal.fire({
        icon: 'success',
        title: 'Pendaftaran Berhasil!',
        text: 'Anda akan diarahkan ke dashboard',
        timer: 2000,
        showConfirmButton: false
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Pendaftaran Gagal',
        text: 'Terjadi kesalahan saat mendaftar. Silakan coba lagi.',
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <AuthForm onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="fullName"
          className="block text-sm font-medium text-gray-700"
        >
          Nama Lengkap <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          placeholder="Nama Lengkap"
          onChange={handleChange}
          className={`mt-1 block w-full border ${
            errors.fullName ? "border-red-500" : "border-gray-300"
          }  text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
        )}
      </div>

      <div className="relative">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            placeholder="Password Minimal 8 Karakter"
            value={formData.password}
            onChange={handleChange}
            className={`mt-1 block w-full border ${
              errors.password ? "border-red-500" : "border-gray-300"
            }  text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center mt-1"
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5 text-gray-500" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className={`mt-1 block w-full border ${
            errors.email ? "border-red-500" : "border-gray-300"
          }  text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="nik"
          className="block text-sm font-medium text-gray-700"
        >
          NIK <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="nik"
          name="nik"
          placeholder="NIK 16 Digit"
          value={formData.nik}
          onChange={handleNumberInputChange}
          className={`mt-1 block w-full border ${
            errors.nik ? "border-red-500" : "border-gray-300"
          }  text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
        />
        {errors.nik && (
          <p className="mt-1 text-sm text-red-600">{errors.nik}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700"
        >
          No Handphone <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          placeholder="No Handphone"
          value={formData.phone}
          onChange={handleNumberInputChange}
          className={`mt-1 block w-full border ${
            errors.phone ? "border-red-500" : "border-gray-300"
          }  text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="address"
          className="block text-sm font-medium text-gray-700"
        >
          Alamat <span className="text-red-500">*</span>
        </label>
        <textarea
          id="address"
          name="address"
          placeholder="Alamat Lengkap"
          value={formData.address}
          onChange={handleChange}
          rows={3}
          className={`mt-1 block w-full border ${
            errors.address ? "border-red-500" : "border-gray-300"
          }  text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address}</p>
        )}
      </div>

      <RegionSelect
        label="Provinsi"
        value={formData.province}
        onChange={(value) => handleRegionChange("province", value)}
        fetchData={getProvinces}
        required
      />
      {errors.province && (
        <p className="mt-1 text-sm text-red-600">{errors.province}</p>
      )}

      <RegionSelect
        label="Kabupaten/Kota"
        value={formData.regency}
        onChange={(value) => handleRegionChange("regency", value)}
        fetchData={getRegenciesMemoized}
        disabled={!formData.province}
        required
      />
      {errors.regency && (
        <p className="mt-1 text-sm text-red-600">{errors.regency}</p>
      )}

      <RegionSelect
        label="Kecamatan"
        value={formData.district}
        onChange={(value) => handleRegionChange("district", value)}
        fetchData={getDistrictsMemoized}
        disabled={!formData.regency}
        required
      />
      {errors.district && (
        <p className="mt-1 text-sm text-red-600">{errors.district}</p>
      )}

      <RegionSelect
        label="Kelurahan"
        value={formData.village}
        onChange={(value) => handleRegionChange("village", value)}
        fetchData={getVillagesMemoized}
        disabled={!formData.district}
        required
      />
      {errors.village && (
        <p className="mt-1 text-sm text-red-600">{errors.village}</p>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="rt"
            className="block text-sm font-medium text-gray-700"
          >
            RT <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="rt"
            name="rt"
            placeholder="RT"
            value={formData.rt}
            onChange={handleNumberInputChange}
            className={`mt-1 block w-full border ${
              errors.rt ? "border-red-500" : "border-gray-300"
            }  text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          />
          {errors.rt && (
            <p className="mt-1 text-sm text-red-600">{errors.rt}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="rw"
            className="block text-sm font-medium text-gray-700"
          >
            RW <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="rw"
            name="rw"
            placeholder="RW"
            value={formData.rw}
            onChange={handleNumberInputChange}
            className={`mt-1 block w-full border ${
              errors.rw ? "border-red-500" : "border-gray-300"
            }  text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          />
          {errors.rw && (
            <p className="mt-1 text-sm text-red-600">{errors.rw}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="postalCode"
          className="block text-sm font-medium text-gray-700"
        >
          Kode Pos
        </label>
        <input
          type="text"
          id="postalCode"
          name="postalCode"
          placeholder="Kode Pos Opsional"
          value={formData.postalCode}
          onChange={handleNumberInputChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm  text-gray-700"
        />
      </div>

      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="dataValid"
            name="dataValid"
            type="checkbox"
            checked={dataValid}
            onChange={(e) => setDataValid(e.target.checked)}
            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="dataValid" className="font-medium text-gray-700">
            Saya menyatakan bahwa data yang dimasukkan adalah valid
          </label>
          <p className="text-gray-500">
            Data yang tidak valid akan berakibat pada pembatalan pendaftaran
          </p>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={!dataValid}
          className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            dataValid 
              ? 'bg-indigo-600 hover:bg-indigo-700' 
              : 'bg-gray-400 cursor-not-allowed'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
          Daftar
        </button>
      </div>
    </AuthForm>
  );
}
