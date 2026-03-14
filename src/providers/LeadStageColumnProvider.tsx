"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from "react";
import { leadType, leadStageType, LeadDetailType } from "@/lib/data.leads";
import useGetListLeads from "@/fetching/lead/getListLeads";
import useAddLead from "@/fetching/lead/addLead";
import { useNotification } from "./NotificationProvider";
import useDeleteLead from "@/fetching/lead/deleteLead";
import useUpdateLeadStage from "@/fetching/lead/updateLeadStage";
import useAddStage from "@/fetching/stage/addStage";
import useDeleteStage from "@/fetching/stage/deleteStage";
import useSearchLead from "@/fetching/lead/searchLead";

// CONTEXT VALUE TYPE
interface LeadStageColumnContextType {
  leadStage: leadStageType[],
  getListLeadLoading: boolean,
  addLeadLoading: boolean,
  deleteLeadLoading: boolean,
  updateDropStageLoading: boolean,
  addStageLoading: boolean,
  deleteStageLoading: boolean,
  searchLeadLoading: boolean,
  leadItemsInStage: Record<string, leadType[]>,
  updateLeadStage: (leadId: string, newStage: string) => void,
  addingNewLead: (newLead: leadType, targetColumn: string, stageID: string) => void,
  addingNewLeadColum: (columnName: string, columnColor: string) => void,
  deleteALead: (leadID: string) => void,
  syncLeadDetail: (lead: LeadDetailType) => void;
  syncLeadStage: (leadID: string, stage: string) => void;
  deleteLeadColumn: (stageID: string) => void;
  searchLead: (query: string) => void;
}

// CREATE CONTEXT
const LeadStageColumnContext = createContext<LeadStageColumnContextType | null>(null);

// CUSTOM HOOK
export const useLeadStageColumn = () => {
  const context = useContext(LeadStageColumnContext);
  if (!context) {
    throw new Error("useLeadStageColumn must be used within LeadStageColumnProvider");
  }
  return context;
};

// PROVIDER PROPS
interface LeadStageColumnProviderProps {
  children: ReactNode;
}

export const LeadStageColumnProvider: React.FC<LeadStageColumnProviderProps> = ({ children }) => {
  const { showNotification } = useNotification();
  // INITIALIZE GET LIST LEADS REQUEST
  const { loading: deleteLeadLoading, deleteLead } = useDeleteLead();
  const { loading: getListLeadLoading, requestGetListLeads } = useGetListLeads();
  const { loading: addLeadLoading, addLead } = useAddLead();
  const { loading: updateDropStageLoading, updateLeadStage: fetchUpdateLeadStage } = useUpdateLeadStage();
  const { loading: addStageLoading, addStage } = useAddStage();
  const { loading: deleteStageLoading, deleteStage } = useDeleteStage();
  const { loading: searchLeadLoading, searchListLead } = useSearchLead();
  // LEAD ITEMS IN SPECIFIC COLUMN INITIALIZE
  const [leadItemsInStage, setLeadItemsInStage] = useState<Record<string, leadType[]>>({});
  const [leadStage, setLeadStage] = useState<leadStageType[]>([]);

  // GET LIST LEAD REQUEST
  const getListLeads = useCallback(async () => {
    try {
      const { data, leadStage } = await requestGetListLeads();

      if (!data || !leadStage) {
        setLeadStage([]);
        setLeadItemsInStage({});
        return;
      }

      setLeadStage(leadStage);

      const initial: Record<string, leadType[]> = {};

      leadStage.forEach((stageColumn) => {
        const stageData = data.find(item => item.id === stageColumn.id);

        const leadsInThisStage: leadType[] = stageData?.leads.map((item) => ({
          leadID: item.id,
          avatarURL: item.avatarUrl || "",
          name: item.fullName,
          createdDate: item.createdAt,
          phone: item.phoneNumber || "",
          email: item.email || "",
          rating: item.rating ?? 0,
          source: item.source || "Facebook",
          status: stageColumn.status,
          expectedRevenue: item.expectedRevenue,
        })) ?? [];

        initial[stageColumn.status] = leadsInThisStage;
      });

      setLeadItemsInStage(initial);
    } catch (err) {
      console.error("Error fetching leads:", err);
      setLeadItemsInStage({});
      setLeadStage([]);
    }
  }, [requestGetListLeads]);

  const didFetch = useRef(false);

  useEffect(() => {
    if (!didFetch.current) {
      getListLeads();
      didFetch.current = true;
    }
  }, []);

  // UPDATE LEAD IN STAGE WHEN DRAG AND DROP
  const updateLeadStage = async (leadId: string, newStage: string) => {
    let forwardStageID = leadStage.find(stage => stage.status === newStage)?.id || "";

    const currentStage = Object.keys(leadItemsInStage).find(stage =>
      leadItemsInStage[stage].some(lead => lead.leadID === leadId)
    ) || "";

    if (!currentStage) {
      showNotification("Current stage not found", true);
      return;
    }

    if (currentStage === newStage) {
      showNotification("The same stage");
      return;
    }

    if (!forwardStageID) {
      showNotification("The forward stage does not exist", true);
      return;
    }
    try {
      const response = await fetchUpdateLeadStage(leadId, forwardStageID);

      if (response) {
        showNotification("Successfully stage change");
        setLeadItemsInStage((prev) => {
          let leadToMove: leadType | undefined = undefined;
          let fromStage: string | null = null;

          for (const stage in prev) {
            const index = prev[stage].findIndex((item) => item.leadID === leadId);
            if (index !== -1) {
              leadToMove = prev[stage][index];
              fromStage = stage;
              break;
            }
          }

          if (!leadToMove || !fromStage || fromStage === newStage) {
            return prev;
          }

          const newColumns: Record<string, leadType[]> = { ...prev };

          newColumns[fromStage] = prev[fromStage].filter((item) => item.leadID !== leadId);

          newColumns[newStage] = [
            ...(prev[newStage] || []),
            { ...leadToMove, status: newStage }
          ];

          return newColumns;
        });
      } else {
        showNotification("There is error in drag drop stage changing", true);
      }
    } catch (err) {
      showNotification(String(err), true);
    }
  };

  // ADDING A NEW LEAD 
  const addingNewLead = async (newLead: leadType, targetColumn: string, stageID: string) => {
    try {
      const response = await addLead(newLead, stageID);

      if (!response) {
        showNotification("Failed to add lead", true);
        return false;
      }

      const lead: leadType = {
        leadID: response.id,
        avatarURL: response.avatarUrl,
        name: response.fullName,
        createdDate: response.createdAt,
        phone: response.phoneNumber,
        email: response.email,
        rating: response.rating,
        expectedRevenue: response.expectedRevenue,
        source: response.source,
        status: response.stage.name,
      }

      setLeadItemsInStage((prev) => ({
        ...prev,
        [targetColumn]: [...prev[targetColumn], lead]
      }));
      showNotification("Successfully add a new lead");
      return true;
    } catch (err) {
      showNotification(String(err), true);
    }
  }

  // DELETE A LEAD
  const deleteALead = async (leadID: string) => {
    try {
      const success: boolean = await deleteLead(leadID);

      if (success) {
        setLeadItemsInStage(prev => {
          const newLead: Record<string, leadType[]> = prev;
          for (const stage in newLead) {
            newLead[stage] = newLead[stage].filter((item) => item.leadID !== leadID)
          }

          return newLead;
        })
        showNotification("Successfully delete a lead")
      } else {
        showNotification("There is error in delete lead", true);
      }
    } catch (err) {
      showNotification(String(err), true);
    }
  }

  // SEARCH LEAD
  const searchLead = async (query: string) => {
    try {
      const { data, leadStage } = await searchListLead(query);

      if (!data || !leadStage) {
        setLeadStage([]);
        setLeadItemsInStage({});
        return;
      }

      setLeadStage(leadStage);

      const initial: Record<string, leadType[]> = {};

      leadStage.forEach((stageColumn) => {
        const stageData = data.find(item => item.id === stageColumn.id);

        const leadsInThisStage: leadType[] = stageData?.leads.map((item) => ({
          leadID: item.id,
          avatarURL: item.avatarUrl || "",
          name: item.fullName,
          createdDate: item.createdAt,
          phone: item.phoneNumber || "",
          email: item.email || "",
          rating: item.rating ?? 0,
          source: item.source || "Facebook",
          status: stageColumn.status,
          expectedRevenue: item.expectedRevenue,
        })) ?? [];

        initial[stageColumn.status] = leadsInThisStage;
      });

      setLeadItemsInStage(initial);
    } catch (err) {
      console.error("Error fetching leads:", err);
      setLeadItemsInStage({});
      setLeadStage([]);
    }
  }

  // ADDING NEW STAGE COLUMN 
  const addingNewLeadColum = async (columnName: string, columnColor: string) => {
    if (!columnName.trim()) {
      showNotification("Fill in column name", true);
      return;
    }

    try {
      const response = await addStage(columnName, columnColor);

      if (!response || response.code !== 200) {
        showNotification("There is error in add a new stage", true);
        return;
      }

      const newStage = response.data;

      setLeadStage((prev) => {
        const lostIndex = prev.findIndex(stage => stage.status === "Lost");
        const wonIndex = prev.findIndex(stage => stage.status === "Won");

        const newStageItem = {
          id: newStage.id,
          status: newStage.name,
          color: newStage.color,
        };

        if (lostIndex === -1 || wonIndex === -1) {
          return [...prev, newStageItem];
        }

        const filtered = prev.filter(
          s => s.status !== "Lost" && s.status !== "Won"
        );

        return [
          ...filtered,
          newStageItem,
          prev[lostIndex],
          prev[wonIndex],
        ];
      });

      setLeadItemsInStage((prev) => ({
        ...prev,
        [newStage.status]: [],
      }));

      showNotification("Successfully add a new stage");

    } catch (error) {
      showNotification(String(error), true);
    }
  };

  // DELETE A STAGE COLUMN
  const deleteLeadColumn = async (stageID: string) => {
    try {
      const success = await deleteStage(stageID);

      if (success) {
        showNotification("Delete stage successfully");
        setLeadStage(prev => {
          const newLeadStage = prev.filter(stage => stage.id !== stageID);
          return newLeadStage;
        })
      } else {
        showNotification("There is errror in delete a stage", true)
      }
    } catch (error) {
      showNotification(String(error), true);
    }
  }

  // MAKE ASYNC WHEN UPDATE LEAD DETAIL 
  const syncLeadDetail = (updatedLead: LeadDetailType) => {
    setLeadItemsInStage(prev => {
      const newStage = updatedLead.status;
      if (!newStage) return prev;

      const newColumns = { ...prev };

      for (const stage in prev) {
        newColumns[stage] = prev[stage].map(lead =>
          lead.leadID === updatedLead.leadID
            ? {
              ...lead,
              avatarURL: updatedLead.avatarURL,
              name: updatedLead.name,
              phone: updatedLead.phone,
              email: updatedLead.email,
              rating: updatedLead.rating,
              expectedRevenue: updatedLead.expectedValue,
            }
            : lead
        );
      }

      return newColumns;
    });
  };

  // MAKE ASYNC WHEN LEAD STAGE CHANGE
  const syncLeadStage = (leadID: string, forwardStageID: string) => {
    setLeadItemsInStage(prev => {
      let movingLead: leadType | null = null;
      let fromStage: string | null = null;

      const stageObj = leadStage.find(stage => stage.id === forwardStageID);
      const newStage = stageObj?.status;

      if (!newStage) return prev;

      for (const stage in prev) {
        const found = prev[stage].find(l => l.leadID === leadID);
        if (found) {
          movingLead = found;
          movingLead.status = newStage;
          fromStage = stage;
          break;
        }
      }

      if (!movingLead || !fromStage || fromStage === newStage) {
        return prev;
      }

      return {
        ...prev,
        [fromStage]: prev[fromStage].filter(l => l.leadID !== leadID),
        [newStage]: [
          ...(prev[newStage] || []),
          { ...movingLead, status: newStage }
        ],
      };
    });
  };



  return (
    <LeadStageColumnContext.Provider value={{
      getListLeadLoading,
      addLeadLoading,
      deleteLeadLoading,
      deleteStageLoading,
      updateDropStageLoading,
      searchLeadLoading,
      addStageLoading,
      leadStage,
      leadItemsInStage,
      updateLeadStage,
      addingNewLead,
      addingNewLeadColum,
      deleteALead,
      syncLeadDetail,
      syncLeadStage,
      deleteLeadColumn,
      searchLead,
    }}>
      {children}
    </LeadStageColumnContext.Provider>
  );
};