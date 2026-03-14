import FetchingLoadingStatus from "@/components/FetchingLoadingStatus";
import InputColorComponent from "@/components/InputColorComponent";
import SelectorComponent from "@/components/SelectorComponent";
import UploadLeadFileCSV from "@/components/UploadLeadFileCSV";
import { useLeadStageColumn } from "@/providers/LeadStageColumnProvider";
import { useNotification } from "@/providers/NotificationProvider";
import { useState } from "react";
import LeadCSVMatching from "./LeadCSVMatching";

interface Props {
  selectedStatus: string,
  setSelectedStatus: React.Dispatch<React.SetStateAction<string>>,
  selectedCompany: string,
  setSelectedCompany: React.Dispatch<React.SetStateAction<string>>,
}
const LeadsPageHeader = ({ selectedStatus, setSelectedStatus, setSelectedCompany, selectedCompany }: Props) => {
  const { addingNewLeadColum, addStageLoading, searchLeadLoading, searchLead } = useLeadStageColumn();
  const { showNotification } = useNotification();

  // ADDING NEW COLUMN STATE 
  const [selectedColor, setSelectedColor] = useState<string>("#000000");
  const [newColumnTitle, setNewColumnTitle] = useState<string>("");
  const [isOpenAddingNewColumnWindow, setIsOpenAddingNewColumnWindow] = useState<boolean>(false);



  const resetAllState = () => {
    setSelectedColor("#000000");
    setNewColumnTitle("");
  }

  const handleAddingNewColumn = () => {
    try {
      addingNewLeadColum(newColumnTitle, selectedColor);
    } catch (error: any) {
      showNotification(error.message, true);
    }
    finally {
      resetAllState();
      setIsOpenAddingNewColumnWindow(prev => !prev);
    }
  }

  return (
    <div className="w-full h-[15%] px-4 py-4 bg-white relative">
      <div className="w-full h-1/2 flex justify-between items-center">
        <div className="text-xl font-bold tracking-wide">
          Leads
        </div>
        <div className="relative inline-block">
          {/* ADD NEW COLUMN BUTTON */}
          {
            addStageLoading ?
              (
                <div className="bg-blue-500 px-2 py-1.5 rounded-xl shadow-sm">
                  <FetchingLoadingStatus loading={addStageLoading} color={"#ffffff"} size={8} />
                </div>
              )
              :
              (
                <div className="flex gap-3">
                  <UploadLeadFileCSV />
                  <button
                    onClick={() => setIsOpenAddingNewColumnWindow(prev => !prev)}
                    className="
              text-xs bg-blue-500/80 text-white px-3 py-1.5 rounded-lg 
              hover:bg-blue-500 hover:shadow-md hover:scale-[1.03]
              transition-all duration-300
            "
                  >
                    New Stage
                  </button>
                </div>
              )
          }
          {/* Popup panel */}
          {
            <>
              <div
                className={`
                  absolute top-full right-0 mt-2 w-52 p-3 bg-white rounded-xl shadow-lg border 
                  flex flex-col gap-2 z-20 transform transition-all duration-5000
                  ${isOpenAddingNewColumnWindow ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"}
                `}
              >
                <input
                  value={newColumnTitle ? newColumnTitle : ""}
                  type="text"
                  placeholder="Column name..."
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  className="
                    w-full px-3 py-1.5 text-sm rounded-lg border 
                    focus:ring-2 focus:ring-blue-400 outline-none
                  "
                />

                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-600">Color</div>
                  <InputColorComponent selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
                </div>

                <div className="flex w-full items-center gap-2">
                  <button
                    onClick={() => handleAddingNewColumn()}
                    className="
                      w-1/2
                      bg-blue-500 text-white text-xs px-3 py-1.5 rounded-lg 
                      hover:bg-blue-600 transition-all duration-300
                    "
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setIsOpenAddingNewColumnWindow(prev => !prev)}
                    className="
                      w-1/2
                      bg-gray-300 text-white text-xs px-3 py-1.5 rounded-lg 
                      hover:bg-gray-400 transition-all duration-300
                    "
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </>
          }
        </div>
      </div>

      <div className="w-full h-1/2 mt-2 flex justify-between items-center">
        <div className="w-1/3 flex gap-3">
          <div className="w-1/3 min-w-[260px] flex">
            <div
              className={`
                    flex items-center gap-2
                    w-full h-[36px]
                    px-3
                    rounded-xl
                    border
                    bg-white
                    transition
                    ${searchLeadLoading
                  ? `border-[${"#3B82F6"}] ring-2 ring-[${"#3B82F6"}]/20`
                  : "border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20"
                }
                `}
            >
              {/* Icon / Loading */}
              {searchLeadLoading ? (
                <FetchingLoadingStatus
                  loading={true}
                  color={"#3B82F6"}
                  size={8}
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5 text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              )}

              {/* Input */}
              <input
                type="text"
                placeholder={searchLeadLoading ? "" : "Search lead name..."}
                disabled={searchLeadLoading}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    searchLead(e.currentTarget.value);
                    e.currentTarget.value = "";
                  }
                }}
                className="
                  w-full h-full
                  text-sm text-gray-700
                  placeholder:text-gray-400
                  outline-none bg-transparent
                  disabled:cursor-not-allowed
                  disabled:opacity-70
                "
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 text-sm px-2 text-gray-500 hover:text-blue-600 transition-colors duration-200 cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
            />
          </svg>
          Filter
        </div>
      </div>

      <LeadCSVMatching />
    </div>
  )
}

export default LeadsPageHeader