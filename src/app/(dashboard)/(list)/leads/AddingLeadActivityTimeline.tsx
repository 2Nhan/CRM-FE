import { RequestAddNewLeadActivity } from "@/lib/data.leads";
import { useLeadDetailSelect } from "@/providers/LeadDetailSelectProvider";
import { useNotification } from "@/providers/NotificationProvider";
import { useState } from "react"

// CREATE A NEW LEAD ACTIVITY 
const createLeadActivity = (
  inputContent: string,
  inputType: string,
  inputClosingDate: string
): RequestAddNewLeadActivity => {
  const content = inputContent.trim();
  const type = inputType.trim();
  const validUntil = inputClosingDate.trim();

  if (!content) throw new Error("Please enter a content");
  if (!type) throw new Error("Please select activity type");
  const selectedDate = new Date(validUntil);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (selectedDate <= today) {
    throw new Error("Closing date must be in the future (tomorrow or later)");
  }
  return {
    content,
    type,
    validUntil,
  };
};

const AddingLeadActivityTimeline = () => {
  const resetAllState = () => {
    setInputContent("");
    setInputClosingDate("");
    setInputType("");
  }
  // STATE
  const { showNotification } = useNotification();
  const [inputContent, setInputContent] = useState<string>("");
  const [inputClosingDate, setInputClosingDate] = useState<string>("");
  const [inputType, setInputType] = useState<string>("");

  const { addingNewLeadActivity } = useLeadDetailSelect();

  const handleAddingNewLead = () => {
    try {
      const newActivity = createLeadActivity(inputContent, inputType, inputClosingDate);
      addingNewLeadActivity(newActivity);
      resetAllState();
    } catch (error) {
      showNotification(String(error), true);
    }

  };
  return (
    <div className="w-full flex-1 px-2 pt-4 flex flex-col gap-4 text-[13px]">

      {/* TEXTAREA */}
      <div className="w-full h-[200px] rounded-lg px-3 py-2 bg-gray-100 border border-gray-200">
        <textarea
          onChange={(e) => setInputContent(e.target.value)}
          value={inputContent ? inputContent : ""}
          className="w-full h-full bg-transparent resize-none outline-none text-gray-700"
          placeholder="Type new activities..."
        ></textarea>
      </div>

      {/* FORM ROW */}
      <div className="w-full flex flex-1 gap-6 items-start">

        {/* Closing date */}
        <div className="flex flex-col gap-1 w-[30%]">
          <label className="text-gray-500 text-[12px]">Closing date</label>
          <input
            type="date"
            value={inputClosingDate ? inputClosingDate : ""}
            onChange={(e) => setInputClosingDate(e.target.value)}
            className="
                    border border-gray-300 rounded-lg px-2 py-1 h-[35px] bg-white text-sm
                    focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all 
                    outline-none text-gray-700
                  "
          />
        </div>

        {/* Rate */}
        <div className="flex flex-col gap-1 w-[20%]">
          <label className="text-gray-500 text-[12px]">Type</label>
          <select
            value={inputType ? inputType : ""}
            onChange={(e) => setInputType(e.target.value)}
            className="
                    border border-gray-300 rounded-lg px-2 py-1 h-[35px] bg-white text-sm
                    focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all outline-none
                  "
          >
            <option value="">Select</option>
            <option value="SMS">SMS</option>
            <option value="Email">Email</option>
            <option value="Call">Call</option>
            <option value="To Do">To Do</option>
            <option value="Meeting">Meeting</option>
          </select>
        </div>

      </div>

      <div className="h-[30px] w-full flex justify-between">
        {/* RESET BUTTON */}
        <button
          onClick={() => resetAllState()}
          className="
                  w-fit h-fit px-3 py-1
                  border border-gray-300 text-gray-600
                  rounded-xl text-[12px]
                  transition-all duration-300
                  hover:bg-gray-100 hover:text-gray-700
                  active:scale-[0.97]
                "
        >
          Reset
        </button>

        {/* SAVE BUTTON */}
        <button
          onClick={() => handleAddingNewLead()}
          className={`
            w-fit h-fit px-3 py-1
            rounded-xl text-white text-[12px]
            bg-blue-500/70
            shadow-sm
            transition-all duration-300
            hover:bg-blue-500 hover:shadow-md
            active:scale-[0.97]
          `}
        >
          Save
        </button>
      </div>
    </div>
  )
}

export default AddingLeadActivityTimeline