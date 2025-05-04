export const saveUserData = (data: any) => {
    localStorage.setItem('userData', JSON.stringify(data));
  };
  
  export const getUserData = () => {
    const data = localStorage.getItem('userData');
    return data ? JSON.parse(data) : null;
  };