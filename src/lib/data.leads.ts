//---------------------------------------- SELECTOR OPTIONS ----------------------------------------

import { List } from "lucide-react";

// STATUS OPTIONS 
export const statusOptions = ["All status", "New", "Open", "In Progress", "Opend Deal"];
// COMPANY OPTIONS
export const companyOptions = ["All company", "Apple", "Xiaomi",];
export type leadSourceType = "Facebook" | "Website" | "LinkedIn" | "Form";


//---------------------------------------- LEADS ----------------------------------------
export interface leadType {
  leadID: string;
  avatarURL: string;
  name: string;
  createdDate: string;
  phone: string;
  email: string;
  rating: number;
  expectedRevenue: number;
  source: string;
  status: string;
}

//---------------------------------------- LEAD DETAIL ----------------------------------------
export interface LeadDetailType {
  leadID: string;
  avatarURL: string;
  name: string;
  expectedValue: number;
  company: string;
  nation: string;
  createdDate: string;
  phone: string;
  email: string;
  rating: number;
  note: string;
  source: string;
  status: string;
  assignTo: string;
}


//---------------------------------------- LEAD DETAIL SEQUENCE ACTIVITY TIMELINE ----------------------------------------
export interface LeadDetailActivityTimeline {
  title: string,
  assignTo: string,
  closingDate: string,
  rate: number;
}
export interface LeadDetailActivitySequenceTimeline {
  leadID: string,
  sequenceActivities: LeadDetailActivityTimeline[],
}


//---------------------------------------- LEAD KEY ---------------------------------------- 

// LEAD PROCESSING STATUS 
export interface leadStageType {
  id: string,
  status: string;
  color: string;
}

//---------------------------------------- GET LIST LEADS REQUEST ---------------------------------------- 
export interface AssignedUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface ApiResponseDataLeadType {
  id: string,
  fullName: string,
  expectedRevenue: number,
  rating: number,
  phoneNumber: string,
  email: string,
  source: string,
  avatarUrl: string,
  createdAt: string,
  updatedAt: string,
  responsibleBy: {
    id: string,
    firstName: string,
    lastName: string,
    email: string
  }
}

//---------------------------------------- LEAD ACTIVITY REPONSE ---------------------------------------- 
export interface ApiResponseDataLeadActivity {
  id: string;
  type: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  validUntil: string;
  status: string;
  completed: boolean;
}

export interface RequestAddNewLeadActivity {
  content: string,
  validUntil: string,
  type: string,
}

//---------------------------------------- REQUEST AND RESPONSE UPLOAD LEADS BY CSV ---------------------------------------- 
export interface ApiResponseUploadLeadByCSV {
  code: number,
  message: string,
  data?: {
    activities: null,
    assignTo: null,
    avatarUrl: string | null,
    company: string | null,
    createdAt: string | null
    dateOfBirth: string | null,
    email: string | null,
    expectedRevenue: number | null,
    fullName: string | null,
    id: string | null,
    note: string | null,
    phoneNumber: string | null,
    rating: number | null,
    source: string | null,
    stage: string | null,
    updatedAt: string | null,
  } [],
  error?: {
    code?: number;
    message?: string;
    [key: string]: any;
  }
}