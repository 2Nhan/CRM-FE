//************************************************ USER PAGE ****************************************************/
// DECLARE USER SIGN UP INPUT DATA TYPE 
export interface UserSignUpType {
  firstName: string;
  lastName: string;
  userName: string;
  phone: string;
  email: string;
  password: string;
}
// DECLARE USER SIGN IN INPUT DATA TYPE 
export interface userLoginType {
  username: string;
  password: string;
}

//--------------------GET LIST USER REQUEST AND RESPONSE TYPE --------------------
export interface GetListUserResponseType{
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

//--------------------GET ASSIGNERS REQUEST AND RESPONSE TYPE --------------------
export interface ApiResponseGetAssignersType {
  id: string,
  fullName: string,
  avatarUrl: string,
  email: string,
}

//--------------------GET DETAIL USER REQUEST AND RESPONSE TYPE --------------------
export interface ApiResponseGetUserDetailType {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  avatarUrl: string | null;
  deleted: boolean;
  roleName: "USER" | "ADMIN" | string;

  statistics: {
    totalLeads: number;
    openLeads: number;
    convertedLeads: number;
    totalActivities: number;
    pendingActivities: number;
    completedActivities: number;
  };
  activities: {
    id: string;
    type: "SMS" | "EMAIL" | "MEETING" | "CALL" | string;
    content: string;
    validUntil: string; 
    status: "PENDING" | "DONE" | string;
    completed: boolean;
    createdAt: string;
    leadId: string;
    leadName: string;
    leadCompany: string;
  } [];
}

//--------------------GET USER SUMMARY REQUEST AND RESPONSE TYPE --------------------
export interface ApiResponseGetUserSummary{
  activeUsers: number,
  newThisMonth: number,
  totalUsers: number,
}