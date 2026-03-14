"use client"
import useLogin from "@/fetching/authentication/login";
import { loginRequestType, loginResponseType } from "@/lib/data.authentication";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useNotification } from "./NotificationProvider";
import useSignUp from "@/fetching/authentication/signUp";

interface AuthenticationConTextType {
  // FETCHING STATUS
  loginLoading: boolean,
  signUpLoading: boolean,

  // ACTIONS
  userLogin: (username: string, password: string) => Promise<any>,
  userSignUp: (username: string, password: string, firstName: string, lastName: string, email: string, phoneNumber: string, address?: string) => Promise<boolean>,
  userLogOut: () => void,

  // STATE
  userInfo: loginResponseType | undefined,
}

const AuthenticationContext = createContext<AuthenticationConTextType | null>(null);

export const useAuthentication = () => {
  const context = useContext(AuthenticationContext)

  if (!context) {
    throw new Error("useAuthentication must be used with in AuthenticationProvider");
  }

  return context;
}

interface AuthenticationProviderProps {
  children: React.ReactNode;
}

// LocalStorage utility functions
const USER_INFO_KEY = 'userInfo';

const getStoredUserInfo = (): loginResponseType | undefined => {
  if (typeof window === 'undefined') return undefined;
  
  try {
    const stored = localStorage.getItem(USER_INFO_KEY);
    return stored ? JSON.parse(stored) : undefined;
  } catch (error) {
    console.error('Error reading userInfo from localStorage:', error);
    return undefined;
  }
};

const setStoredUserInfo = (userInfo: loginResponseType | undefined): void => {
  if (typeof window === 'undefined') return;
  
  try {
    if (userInfo) {
      localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
    } else {
      localStorage.removeItem(USER_INFO_KEY);
    }
  } catch (error) {
    console.error('Error saving userInfo to localStorage:', error);
  }
};

/**
 * Authentication Provider provide the ability to handle all authentication action in program, such as login, sign up, store accessToken or refreshToken
 * @param children ability to access context by its child component
 * @returns 
 */
export const AuthenticationProvider = ({ children }: AuthenticationProviderProps) => {
  // PROVIDER
  const { showNotification } = useNotification();

  // API HOOK 
  const { loading: loginLoading, login } = useLogin();
  const { loading: signUpLoading, signUp } = useSignUp();

  // STATE 
  const [userInfo, setUserInfoState] = useState<loginResponseType | undefined>(getStoredUserInfo);

  // Custom setter that also updates localStorage
  const updateUserInfo = useCallback((userInfo: loginResponseType | undefined) => {
    setUserInfoState(userInfo);
    setStoredUserInfo(userInfo);
  }, []);

  /**
   * login - used to handle the client side when want to send the request to checking login status as well as receive user's token
   * @param username registered username
   * @param password registered password
   * @returns checking validation of username and password is true or not
   */
  const userLogin = async (username: string, password: string) => {
    try {
      const result = await login({ username, password } as loginRequestType);


      if (result.code !== 200) {
        showNotification(result.error?.message || "Login failed");
        return false;
      }

      // STORE ACCESSTOKEN
      await fetch("api/set-token", {
        method: "POST",
        body: JSON.stringify({ token: result.data?.accessToken })
      })

      updateUserInfo(result);
      
      showNotification(`Welcome ${result.data?.fullName}`);
      return result?.data;
    } catch (error) {
      showNotification(String(error), true);
    }
  }

  /**
   * sign up - used to handle user sign up action
   * @returns status of sign up action
   */
  const userSignUp = async (
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    address?: string
  ): Promise<boolean> => {
    try {
      const result = await signUp({
        username,
        password,
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
      });

      if (result.code !== 200) {
        showNotification(result.message, true);
        return false;
      }

      showNotification("Sign up successful");
      return true;
    } catch {
      showNotification("Network or server error", true);
      return false;
    }
  };

  /**
   * log out - used to handle the log out action to send request to delete the user active status
   */
  const userLogOut = async () => {
    try{
      const resBackend = await fetch("api/authentication/logout", {method: "POST", credentials: "include"});
      const result = await resBackend.json();
      if (result.code !== 200){
        showNotification("Failed to log out", true);
      } else {
        // Clear user info from state and localStorage
        updateUserInfo(undefined);
        showNotification("Logged out successfully");
      }
    }catch{
      showNotification("Internal connection failed", true);
    }
  }


  const value: AuthenticationConTextType = {
    // FETCHING STATUS
    loginLoading,
    signUpLoading,

    // ACTIONS
    userLogin,
    userSignUp,
    userLogOut,

    // STATE
    userInfo
  }

  return (
    <AuthenticationContext.Provider value={value}>
      {children}
    </AuthenticationContext.Provider>
  )
}