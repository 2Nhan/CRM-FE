"use client"

import useGetAllCustomer from "@/fetching/customer/getAllCustomer";
import useSearchCustomer from "@/fetching/customer/searchCustomer";
import { getAllCustomersResponse } from "@/lib/data.customers";
import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react"
import { useNotification } from "./NotificationProvider";

interface CustomerProviderContextType {
  // LOADING 
  getAllCustomerLoading: boolean,

  // STATE
  customers: getAllCustomersResponse[] | null,
  totalPages: number,
  searchTerm: string,
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>,

  // FUNCTION 
  getCustomersWithPageNo: (pageNo: number) => void,
  handleSearchCustomer: (pageNo: number) => void,
};

const CustomerContext = createContext<CustomerProviderContextType | null>(null);


export const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error("useCustomer must be used within CustomerProvider");
  }

  return context;
}

interface CustomerProviderProps {
  children: ReactNode,
}

export const CustomerProvider: React.FC<CustomerProviderProps> = ({children}) => {
  // STATE 
  const [customers, setCustomers] = useState<getAllCustomersResponse[] | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { showNotification } = useNotification();

  // API HOOK
  const {loading: getAllCustomerLoading, getAllCustomer} = useGetAllCustomer();
  const {loading: searchCustomerLoading, searchCustomer} = useSearchCustomer();

  /**
   * get customer with page no - handle the action when user change page or pagination action
   * @param pageNo current page
   */
  const getCustomersWithPageNo = async (pageNo: number) => {
    try {
      if (searchTerm){ handleSearchCustomer(pageNo); return;}
      const result = await getAllCustomer(pageNo);
      setCustomers(result.data);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
      setCustomers([]); 
    }
  }

  /**
   * get customers - initialize to take all customer from backend, and then set to 'customers' state
   */
  const getCustomers = useCallback( async() => {
    try {
      const result = await getAllCustomer();
      setCustomers(result.data);
      setTotalPages(result.pagination.totalPages);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
      setCustomers([]); 
    }
  }, [getAllCustomer]);

  const didFetch = useRef<boolean>(false);
  useEffect( () => {
    if (didFetch.current){ return; }
    didFetch.current = true;
    getCustomers();
  }, [getCustomers]);


  const handleSearchCustomer = async (pageNo: number) => {
    try{
      const result = await searchCustomer(searchTerm, pageNo);
      setCustomers(result.data);
      setTotalPages(result.pagination.totalPages);
    }catch(error){
      showNotification(String(error), true);
    }
  }

  const value: CustomerProviderContextType = {
    getAllCustomerLoading,

    customers,
    totalPages,
    searchTerm,
    setSearchTerm,

    getCustomersWithPageNo,
    handleSearchCustomer,
  }
  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  )
}