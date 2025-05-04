// components/regions/RegionSelect.tsx
import { Region } from '@/types/types';
import { useEffect, useState, memo } from 'react';



interface RegionSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  fetchData: () => Promise<Region[]>;
  disabled?: boolean;
  required?: boolean;
}

function RegionSelectComponent({
  label,
  value,
  onChange,
  fetchData,
  disabled = false,
  required = false,
}: RegionSelectProps) {
  const [options, setOptions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRegions = async () => {
      if (!disabled) {
        setLoading(true);
        setError(null);
        try {
          const data = await fetchData();
          setOptions(Array.isArray(data) ? data : []);
        } catch (err) {
          setError('Gagal memuat data. Silakan coba lagi.');
          console.error(`Error loading ${label}:`, err);
          setOptions([]);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchRegions();
  }, [disabled, fetchData, label]);

  return (
    <div className="mb-4">
      <label htmlFor={label.toLowerCase()} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <select
        id={label.toLowerCase()}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || loading}
        required={required}
        className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-700`}
      >
        <option value="">Pilih {label}</option>
        {loading ? (
          <option value="" disabled>Memuat data...</option>
        ) : error ? (
          <option value="" disabled>Gagal memuat data</option>
        ) : (
          options.map((option) => (
            <option key={option.code} value={option.code}>
              {option.name}
            </option>
          ))
        )}
      </select>

      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error} {!loading && (
            <button 
              type="button" 
              onClick={() => window.location.reload()}
              className="text-indigo-600 hover:text-indigo-800"
            >
              Coba lagi
            </button>
          )}
        </p>
      )}
    </div>
  );
}

export const RegionSelect = memo(RegionSelectComponent);