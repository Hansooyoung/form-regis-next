import { UserData } from '@/types/types';

export const saveUserData = (data: UserData): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('userData', JSON.stringify(data));
  }
};

export const getUserData = (): UserData | null => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem('userData');
    return data ? JSON.parse(data) as UserData : null;
  }
  return null;
};