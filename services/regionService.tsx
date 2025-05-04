import axios from 'axios';

const API_BASE = '/api/wilayah';

export const getProvinces = async () => {
  const response = await axios.get(`${API_BASE}/provinces`);
  return response.data.data;
};

export const getRegencies = async (provinceCode: string) => {
  const response = await axios.get(`${API_BASE}/regencies/${provinceCode}`);
  return response.data.data;
};

export const getDistricts = async (regencyCode: string) => {
  const response = await axios.get(`${API_BASE}/districts/${regencyCode}`);
  return response.data.data;
};

export const getVillages = async (districtCode: string) => {
  const response = await axios.get(`${API_BASE}/villages/${districtCode}`);
  return response.data.data;
};