"use client";

import {
  ApiResponseDataLeadActivity,
  LeadDetailActivityTimeline,
  LeadDetailType,
  RequestAddNewLeadActivity
} from "@/lib/data.leads";
import { createContext, useCallback, useContext, useState, useEffect } from "react";
import { useNotification } from "./NotificationProvider";
import useGetLeadDetail from "@/fetching/lead/getLeadDetail";
import useUpdateLeadStage from "@/fetching/lead/updateLeadStage";
import useUpdateLeadDetail from "@/fetching/lead/updateLeadDetail";
import { useLeadStageColumn } from "./LeadStageColumnProvider";
import useAddLeadActivity from "@/fetching/lead/addLeadActivity";
import useCompleteActivity from "@/fetching/lead/completeActivity";
import useDeleteActivity from "@/fetching/lead/deleteActivity";
import { isValidPhoneNumber } from "@/util/phoneNumberValidation";
import { isValidEmail } from "@/util/emailValidation";

interface LeadDetailSelectContextType {
  selectedLeadId: string | null;
  leadDetailInfo: LeadDetailType | null;
  leadSequenceActivity: ApiResponseDataLeadActivity[] | null;
  loadingGetLeadDetail: boolean;
  loadingCompleteLeadActivity: boolean;
  loadingDeleteActivity: boolean,
  selectLeadDetail: (leadID: string) => void;
  removeSelectedLeadDetail: () => void;
  addingNewLeadActivity: (newLead: RequestAddNewLeadActivity) => void;
  updateALeadDetail: (newLeadDetail: LeadDetailType, avatarFile: File | undefined) => void;
  updateLeadStage: (leadID: string, forwardStageID: string) => void;
  completeLeadActivity: (activityID: string) => void;
  deleteLeadActivity: (activityID: string) => void;
}

const LeadDetailSelectContext = createContext<LeadDetailSelectContextType | null>(null);

export const useLeadDetailSelect = () => {
  const context = useContext(LeadDetailSelectContext);
  if (!context) {
    throw new Error("useLeadDetailSelect must be used within LeadDetailSelectProvider");
  }
  return context;
};

interface LeadDetailSelectProviderProps {
  children: React.ReactNode;
}

export const LeadDetailSelectProvider = ({ children }: LeadDetailSelectProviderProps) => {
  const [listLeadDetail, setListLeadDetail] = useState<Record<string, LeadDetailType>>({});
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [leadDetailInfo, setLeadDetailInfo] = useState<LeadDetailType | null>(null);
  const [leadSequenceActivity, setLeadSequenceActivity] = useState<ApiResponseDataLeadActivity[] | null>(null);
  const { showNotification } = useNotification();

  const { loading: loadingUpdateLeadDetail, updateLeadDetail } = useUpdateLeadDetail();
  const { loading: loadingGetLeadDetail, getLeadDetailInformation } = useGetLeadDetail();
  const { loading: loadingUpdateLeadStage, updateLeadStage: updateStage } = useUpdateLeadStage();
  const { loading: loadingAddLeadActivity, addLeadActivity } = useAddLeadActivity();
  const { loading: loadingCompleteLeadActivity, completeActivity } = useCompleteActivity();
  const { loading: loadingDeleteActivity, deleteActivity } = useDeleteActivity();
  // HANDLE CLICK ON A LEAD
  const selectLeadDetail = (leadID: string) => {
    setSelectedLeadId(leadID);
  };

  // HANDLE CLOSE LEAD DETAIL
  const removeSelectedLeadDetail = () => {
    setSelectedLeadId(null);
    setLeadDetailInfo(null);
    setLeadSequenceActivity(null);
  };

  // ASYNC FETCH LEAD DETAIL WHEN selectedLeadId CHANGES
  const fetchLeadDetail = useCallback(async (leadID: string) => {
    if (!leadID) return;

    try {
      const { leadDetail, leadActivity } = await getLeadDetailInformation(leadID);

      if (!leadDetail) return;

      setLeadDetailInfo(leadDetail);

      // // Map sequence activities from local sample or API if exists
      const sequenceActivity: ApiResponseDataLeadActivity[] = leadActivity || [];
      setLeadSequenceActivity(sequenceActivity);

    } catch (err) {
      showNotification("Failed to get lead detail", true);
    }
  }, [getLeadDetailInformation, showNotification]);

  useEffect(() => {
    if (selectedLeadId) {
      fetchLeadDetail(selectedLeadId);
    } else {
      setLeadDetailInfo(null);
      setLeadSequenceActivity(null);
    }
  }, [selectedLeadId]);

  // ADD NEW LEAD ACTIVITY
  const addingNewLeadActivity = async (newLeadActivity: RequestAddNewLeadActivity) => {
    try {
      if (!selectedLeadId) { return; }

      const response = await addLeadActivity(selectedLeadId, newLeadActivity);

      if (response && response.code === 200) {
        setLeadSequenceActivity(prev => {
          if (!prev) return prev;
          return [response.data, ...prev];
        });
        showNotification("Successfully added a new lead activity");
      }
    } catch (error) {
      showNotification(String(error), true);
    }
  };


  // UPDATE LEAD DETAIL
  const { syncLeadDetail } = useLeadStageColumn();

  const updateALeadDetail = async (newLeadDetail: LeadDetailType, avatarFile: File | undefined) => {
    try {
      if (
        (newLeadDetail.phone?.length && !isValidPhoneNumber(newLeadDetail.phone))
        ||
        (newLeadDetail.email?.length && !isValidEmail(newLeadDetail.email))
      ) {
        showNotification("Your update phone number or email is not valid", true);
        return;
      }


      const { resData, updatedLead } =
        await updateLeadDetail(newLeadDetail, avatarFile);

      if (resData.code === 200) {
        setLeadDetailInfo(updatedLead);
        syncLeadDetail(updatedLead);
        showNotification("Lead updated successfully");
      }
    } catch (err) {
      showNotification(String(err), true);
    }
  };


  // UPDATE LEAD STAGE 
  const { syncLeadStage } = useLeadStageColumn();

  const updateLeadStage = async (leadID: string, forwardStageID: string) => {
    try {
      const success = await updateStage(leadID, forwardStageID);

      if (success) {
        syncLeadStage(leadID, forwardStageID);
        showNotification("Lead stage updated");
      }
    } catch (err) {
      showNotification(String(err), true);
    }
  };

  // COMPLETE LEAD ACTIVITY
  const completeLeadActivity = async (activityID: string) => {
    try {
      if (!selectedLeadId) return;

      const success = await completeActivity(selectedLeadId, activityID);

      if (!success) {
        showNotification("There is error in complete an activity", true);
        return;
      }

      showNotification("Successfully complete an activity");

      setLeadSequenceActivity(prev => {
        if (!prev) return prev;

        const index = prev.findIndex(item => item.id === activityID);
        if (index === -1) {
          showNotification(
            "There is error in async with UI when complete an activity",
            true
          );
          return prev;
        }

        const newList = [...prev];
        newList[index] = {
          ...newList[index],
          status: "DONE",
          completed: true,
        };

        return newList;
      });

    } catch (err) {
      showNotification(String(err), true);
    }
  };

  const deleteLeadActivity = async (activityID: string) => {
    try {
      if (!selectedLeadId) return;

      const success = await deleteActivity(selectedLeadId, activityID);

      if (!success) {
        showNotification("There is error in delete an activity", true);
        return;
      }

      showNotification("Successfully delete an activity");

      setLeadSequenceActivity(prev => {
        if (!prev) return prev;

        const newList = prev.filter(item => item.id !== activityID);

        return newList
      });

    } catch (err) {
      showNotification(String(err), true);
    }
  }



  const value: LeadDetailSelectContextType = {
    selectedLeadId,
    leadDetailInfo,
    leadSequenceActivity,
    loadingGetLeadDetail,
    loadingCompleteLeadActivity,
    loadingDeleteActivity,
    selectLeadDetail,
    removeSelectedLeadDetail,
    addingNewLeadActivity,
    updateALeadDetail,
    updateLeadStage,
    completeLeadActivity,
    deleteLeadActivity,
  };

  return (
    <LeadDetailSelectContext.Provider value={value}>
      {children}
    </LeadDetailSelectContext.Provider>
  );
};
