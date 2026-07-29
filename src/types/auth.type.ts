/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ISendOtp {
  email: string;
}

export interface IRegister {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}
export interface ILogin {
  email: string;
  password: string;
}

export interface IVerifyOtp {
  email: string;
  otp: string;
}
