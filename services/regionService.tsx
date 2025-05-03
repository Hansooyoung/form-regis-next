import api from './api';

export const getProvinces = async () => {
  const response = await api.get('/provinces.json');
  return response.data;
};

export const getRegencies = async (provinceCode: string) => {
  const response = await api.get(`/regencies/${provinceCode}.json`);
  return response.data;
};

export const getDistricts = async (regencyCode: string) => {
  const response = await api.get(`/districts/${regencyCode}.json`);
  return response.data;
};

export const getVillages = async (districtCode: string) => {
  const response = await api.get(`/villages/${districtCode}.json`);
  return response.data;
};