// Full redesigned LeadStageColumn with delete column button, improved UI

"use client";

import Image from "next/image";
import { leadType, leadSourceType } from "@/lib/data.leads";
import { useEffect, useState } from "react";
import Rating from "@mui/material/Rating";
import LeadSourceComponent from "@/components/LeadSourceComponent";
import { useLeadDetailSelect } from "@/providers/LeadDetailSelectProvider";
import FetchingLoadingStatus from "@/components/FetchingLoadingStatus";
import useDeleteStage from "@/fetching/stage/deleteStage";
import { useLeadStageColumn } from "@/providers/LeadStageColumnProvider";
import { useNotification } from "@/providers/NotificationProvider";
import { isValidPhoneNumber } from "@/util/phoneNumberValidation";
import { isValidEmail } from "@/util/emailValidation";

interface Props {
  stageID: string;
  leadStage: string;
  leadColor: string;
  leadItems: leadType[];
  addLeadLoading: boolean;
  dragStartEvent: (e: React.DragEvent<HTMLDivElement>, leadID: string) => void;
  dropEvent: (statusColumnName: string) => void;
  dragOverEvent: (e: React.DragEvent<HTMLDivElement>) => void;
  handleAddingNewLead: (newLead: leadType, targetColumn: string, stageID: string) => void;
}

const LeadStageColumn = ({
  stageID,
  leadStage,
  leadColor,
  leadItems,
  addLeadLoading,
  dragStartEvent,
  dropEvent,
  dragOverEvent,
  handleAddingNewLead,
}: Props) => {
  // LEAD STAGE PROVIDER
  const { deleteALead, deleteLeadLoading, updateDropStageLoading } = useLeadStageColumn();
  const { showNotification } = useNotification();

  const [isBeingDragged, setIsBeingDragged] = useState(false);
  const [addingLeadToggle, setAddingLeadToggle] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadSource, setLeadSource] = useState("");
  const [leadRate, setLeadRate] = useState("");
  const [leadExpectedRevenue, setLeadExpectedRevenue] = useState<number>(0);
  const [selectedDeleteStageID, setSelectedDeleteStageID] = useState<string>("");

  const resetAllState = () => {
    setLeadName("");
    setLeadPhone("");
    setLeadEmail("");
    setLeadRate("");
    setLeadSource("");
    setLeadExpectedRevenue(0);
  };

  const handleSaveButtonToggle = async () => {
    const newLead: leadType = {
      leadID: crypto.randomUUID(),
      avatarURL: "",
      name: leadName,
      createdDate: new Date().toISOString(),
      phone: leadPhone,
      email: leadEmail,
      expectedRevenue: leadExpectedRevenue,
      rating: Number(leadRate),
      source: leadSource as leadSourceType,
      status: leadStage,
    };

    if (!isValidPhoneNumber(leadPhone) || !isValidEmail(leadEmail)){
      showNotification("Your phone number is not satisfied 10 number or email is not valid", true);
      return;
    }
    handleAddingNewLead(newLead, leadStage, stageID);
  };


  const { deleteStageLoading, deleteLeadColumn } = useLeadStageColumn();

  const handleDeleteStage = async (stageID: string) => {
    deleteLeadColumn(stageID);
  }

  useEffect(() => {
    if (addLeadLoading) { return; }

    setAddingLeadToggle(false);
    resetAllState();
  }, [addLeadLoading])

  const { selectLeadDetail } = useLeadDetailSelect();

  return (
    <div
      style={{
        backgroundColor: isBeingDragged ? `${leadColor}20` : undefined,
        borderColor: isBeingDragged ? `${leadColor}` : "transparent",
      }}
      className={`
        min-w-[360px] w-[360px] flex-shrink-0
        flex flex-col gap-5
        bg-white shadow-[0_4px_14px_rgba(0,0,0,0.07)]
        rounded-xl border border-gray-200 p-4
        ${isBeingDragged ? "ring-4 ring-blue-300/30 scale-[1.02]" : ""}
        transition-all duration-200
      `}
      onDrop={(e) => {
        e.preventDefault();
        setIsBeingDragged(false);
        dropEvent(leadStage);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsBeingDragged(true);
        dragOverEvent(e);
      }}
      onDragLeave={() => setIsBeingDragged(false)}
    >
      {/* HEADER */}
      <div
        className="
          w-full h-[48px] px-4 flex justify-between items-center
          bg-gradient-to-r from-blue-50 to-white border border-gray-200
          rounded-xl shadow-sm
        "
      >
        <div className="flex gap-2 items-center text-blue-700 font-semibold text-sm">
          <div
            className="w-[14px] h-[14px] rounded-full shadow-sm"
            style={{ backgroundColor: leadColor }}
          />
          {leadStage}
        </div>

        <div className="flex items-center gap-3">
          <div
            className="bg-gray-200 px-2 py-[3px] rounded-md shadow-sm text-gray-700 text-xs"
          >
            {leadItems?.length ?? 0} leads
          </div>

          {/* DELETE COLUMN */}
          {
            deleteStageLoading && selectedDeleteStageID === stageID ?
              (
                <FetchingLoadingStatus loading={deleteStageLoading} color={"#FF0000"} size={8}/>
              )
              :
              (
                <button
                  onClick={() => {
                    handleDeleteStage(stageID);
                    setSelectedDeleteStageID(stageID);
                  }
                  }
                  className="
              p-1.5 rounded-md
              text-gray-400 transition-all duration-150
              hover:text-red-600 hover:bg-red-100 active:scale-[0.95]
            "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.7}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 7h12m-9 4v6m6-6v6m1-10V5a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v2M4 7h16"
                    />
                  </svg>
                </button>
              )
          }

        </div>
      </div>

      {/* LEAD CARDS */}
      <div className="flex flex-col gap-4 flex-1 min-h-0">
        {leadItems?.map((leadItem) => (
          <div
            key={leadItem.leadID}
            draggable
            onClick={() => selectLeadDetail(leadItem.leadID)}
            onDragStart={(e) => dragStartEvent(e, leadItem.leadID)}
            className="
              w-full bg-white rounded-xl px-4 py-3 shadow-md
              hover:shadow-lg hover:-translate-y-[2px]
              transition-all duration-200 cursor-pointer
            "
          >
            {/* PERSONAL INFO */}
            <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
              <Image
                src={!leadItem.avatarURL ? "/profile.png" : leadItem.avatarURL}
                width={42}
                height={42}
                alt="Profile image"
                className="rounded-full shadow-sm"
              />

              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700 text-sm">
                    {leadItem.name}
                  </span>
                </div>

                <span className="text-xs text-gray-400">
                  {new Date(leadItem.createdDate).toLocaleString("vi-VN")}
                </span>
              </div>

              <div className="hover:opacity-100 opacity-0 transition-all duration-500">
                {/* DELETE BUTTON */}
                {
                  deleteLeadLoading ?
                    (<FetchingLoadingStatus loading={deleteLeadLoading} color={"#FF0000"} />)
                    :
                    (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteALead(leadItem.leadID);
                        }}
                        className="
                    p-1 rounded-md 
                    active:scale-95
                    transition duration-500
                  "
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                          className="size-5 hover:text-red-400 transition duration-500"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                      </button>
                    )
                }
              </div>
            </div>

            {/* CONTACT */}
            <div className="pt-3 flex flex-col gap-2 text-sm text-gray-600">
              {/* PHONE */}
              <div className="flex gap-2 items-center hover:text-blue-600 transition-colors">
                📞 {leadItem.phone}
              </div>

              {/* EMAIL */}
              <div className="flex gap-2 items-center hover:text-blue-600 transition-colors">
                ✉️ {leadItem.email}
              </div>

              {/* SOURCE + RATING */}
              <div className="w-full flex gap-1 items-center justify-between">
                <LeadSourceComponent leadSource={leadItem.source} />
                <Rating size="small" readOnly value={leadItem.rating} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD NEW LEAD FORM */}
      {addingLeadToggle ? (
        <div className="w-full flex flex-col gap-2">
          <input
            placeholder="Lead name"
            value={leadName}
            onChange={(e) => setLeadName(e.target.value)}
            className="border border-blue-300 rounded-md px-2 py-1 text-sm"
          />

          <input
            placeholder="Phone"
            value={leadPhone}
            onChange={(e) => setLeadPhone(e.target.value)}
            className="border border-blue-300 rounded-md px-2 py-1 text-sm"
          />

          <input
            placeholder="Email"
            value={leadEmail}
            onChange={(e) => setLeadEmail(e.target.value)}
            className="border border-blue-300 rounded-md px-2 py-1 text-sm"
          />

          <input
            placeholder="Expected revenue"
            value={leadExpectedRevenue}
            onChange={(e) => setLeadExpectedRevenue(Number(e.target.value))}
            className="border border-blue-300 rounded-md px-2 py-1 text-sm"
          />

          <div className="flex gap-2">
            <select
              value={leadSource}
              onChange={(e) => setLeadSource(e.target.value)}
              className="border border-blue-300 rounded-md px-2 py-1 text-sm w-full"
            >
              <option value="">Lead Source</option>
              <option value="Facebook">Facebook</option>
              <option value="Website">Website</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Form">Form</option>
            </select>

            <select
              value={leadRate}
              onChange={(e) => setLeadRate(e.target.value)}
              className="border border-blue-300 rounded-md px-2 py-1 text-sm w-full"
            >
              <option value="">Rate</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>

          <div className="flex gap-2 w-full">

            {addLeadLoading ?
              <FetchingLoadingStatus loading={addLeadLoading} color="#3366CC" />
              :
              <button
                disabled={!leadName || !leadPhone || !leadEmail || !leadRate || leadExpectedRevenue === 0}
                onClick={() => {
                  handleSaveButtonToggle();
                }}
                className={`
                px-3 py-1.5 rounded-md text-xs font-medium w-1/2 transition-all
                ${!leadName || !leadPhone || !leadEmail || !leadRate || leadExpectedRevenue === 0
                    ? "bg-blue-300 text-white cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"}
              `}
              >
                Save
              </button>
            }

            <button
              disabled={addLeadLoading}
              className="px-3 py-1.5 bg-blue-300/50 text-xs font-medium rounded-md w-1/2"
              onClick={() => {
                setAddingLeadToggle(false);
                resetAllState();
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div
          className="
            flex justify-center items-center gap-1 px-3 py-2
            border border-gray-300 bg-white
            text-xs font-medium text-gray-700
            rounded-full cursor-pointer select-none
            hover:bg-blue-400 hover:text-white hover:shadow-md hover:scale-[1.03]
            transition-all active:scale-95
          "
          onClick={() => setAddingLeadToggle(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New
        </div>
      )}
    </div>
  );
};

export default LeadStageColumn;
