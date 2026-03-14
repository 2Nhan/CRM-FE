"use client"

import useGetListUser from "@/fetching/user/getListUsers";
import useSearchUsers from "@/fetching/user/searchUsers";
import { ApiResponseGetUserSummary, GetListUserResponseType } from "@/lib/data.user";
import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react"
import { useNotification } from "./NotificationProvider";
import useUserSummary from "@/fetching/user/userSummary";
import useEnableUser from "@/fetching/user/enableUser";
import useDisableUser from "@/fetching/user/disabledUser";

interface UserProviderContextType {
  // LOADING 
  getListUserLoading: boolean,
  enableUserLoading: boolean,
  disableUserLoading: boolean,

  // STATE
  users: GetListUserResponseType[] | null,
  totalPage: number,
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>,
  searchTerm: string,
  userSummaryStatistic: ApiResponseGetUserSummary | undefined,

  // FUNCTION 
  getUsers: () => void,
  getUsersWithPageNo: (pageNo: number) => void,
  handleSearchUser: (pageNo: number) => void,
  handleEnableUser: (userID: string) => Promise<boolean>,
  handleDisableUser: (userID: string) => Promise<boolean>,
};

const UserContext = createContext<UserProviderContextType | null>(null);


export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }

  return context;
}

interface UserProviderProps {
  children: ReactNode,
}

export const UserProvider: React.FC<UserProviderProps> = ({children}) => {
  const { showNotification } = useNotification();

  // STATE 
  const [users, setUsers] = useState<GetListUserResponseType[] | null>(null);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [userSummaryStatistic, setUserSummaryStatistic] = useState<ApiResponseGetUserSummary>();

  // API HOOK
  const {loading: getListUserLoading, getListUser} = useGetListUser();
  const {loading: searchUserLoading, searchUsers} = useSearchUsers();
  const {loading: getUserSummaryLoading, userSummary} = useUserSummary();
  const {loading: enableUserLoading, enableUser} = useEnableUser();
  const {loading: disableUserLoading, disableUser} = useDisableUser();

  /**
   * get users - initialize to take all users from backend, and then set to 'users' state
   */
  const getUsers = useCallback( async() => {
    try {
      const {users, pagination} = await getListUser(1);
      const userStatistic = await userSummary();
      console.log(userStatistic);
      setUserSummaryStatistic(userStatistic);
      setTotalPage(pagination.totalPages);
      setUsers(users || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]); 
    }
  }, []);
  const didFetch = useRef<boolean>(false);
  useEffect( () => {
    if (didFetch.current){ return; }
    didFetch.current = true;
    getUsers();
  }, []);

  /**
   * get users with page number - handle the action when user want to change page to view more user
   * @param pageNo current pgae number
   */
  const getUsersWithPageNo = async (pageNo: number) => {
    if (searchTerm){ handleSearchUser(pageNo); return; }
    try {
      const {users, pagination} = await getListUser(pageNo);
      setUsers(users || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]); 
    }
  }

  const handleSearchUser = async (pageNo: number) => {
    try {
      const {users, pagination} = await searchUsers(searchTerm, pageNo);
      
      if (users.length !== 0){
        setTotalPage(pagination.totalPages);
        setUsers(users || []);
      }
    } catch (error) {
      showNotification(String(error) || "Processed failed", true);
    }
  }

  const handleEnableUser = async (userID: string): Promise<boolean> => {
    try {
      const success = await enableUser(userID);
      
      if (success){
        showNotification("Successfully enable user");
        return true;
      }

      return false;
    } catch (error) {
      showNotification(String(error) || "Processed failed", true);
      return false;
    }
  }

  const handleDisableUser = async (userID: string): Promise<boolean> => {
    try {
      const success = await disableUser(userID);
      
      if (success){
        showNotification("Successfully enable user");
        return true;
      }

      return false;
    } catch (error) {
      showNotification(String(error) || "Processed failed", true);
      return false;
    }
  }


  const value: UserProviderContextType = {
    getListUserLoading,
    enableUserLoading,
    disableUserLoading,

    users,
    totalPage,
    setSearchTerm,
    searchTerm,
    userSummaryStatistic,

    getUsers,
    getUsersWithPageNo,
    handleSearchUser,
    handleEnableUser,
    handleDisableUser,
  }
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}