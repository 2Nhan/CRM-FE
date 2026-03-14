// ------------------- GET ALL CUSTOMERS RESPONSE -------------------- 
export interface getAllCustomersResponse {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  company: string;
  rating: number;
  avatarUrl: string;
  assignTo: {
    firstName: string;
    lastName: string;
    email: string;
  };
}