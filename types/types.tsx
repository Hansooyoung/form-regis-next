export interface UserData {
    fullName: string;
    password: string;
    email: string;
    nik: string;
    phone: string;
    address: string;
    province: string;
    regency: string;
    district: string;
    village: string;
    rt: string;
    rw: string;
    postalCode?: string;
  }
  
  export interface Region {
    id: string;
    name: string;
  }