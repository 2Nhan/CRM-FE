//------------------- USER LOGIN API RESQUEST AND RESPONSE -------------------//
export interface loginRequestType {
  username: string,
  password: string,
}

export interface loginResponseType {
  code: number,
  message: string,
  error?: {
    code: string,
    message: string,
  }
  data?: {
    accessToken: string,
    refreshToken: string,
    fullName: string,
    avatarUrl: string,
    role: string,
  }
}

//------------------- USER SIGN UP API RESQUEST AND RESPONSE -------------------//
export interface signUpRequestType {
  username: string,
  password: string,
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  address?: string,
}

export interface signUpResponseType {
  code: number;
  message: string;
  data?: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    avatarUrl: string;
    createdAt: string; 
    updatedAt: string; 
  };
  error?: {
    code: number;
    errorField: string;
    message: string;
  }
}

//------------------- GET INFO API RESQUEST AND RESPONSE -------------------//
export interface GetInfoResponse {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  deleted: boolean;
  address: string;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}