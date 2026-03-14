import Image from "next/image"
import { useEffect, useState } from "react";
import AddingLeadActivityTimeline from "./AddingLeadActivityTimeline";
import { useLeadDetailSelect } from "@/providers/LeadDetailSelectProvider";
import LeadActivityTimelineSequence from "./LeadActivityTimelineSequence";
import UpLoadAvatar from "@/components/UpLoadAvatar";
import { useLeadStageColumn } from "@/providers/LeadStageColumnProvider";
import { LeadDetailType } from "@/lib/data.leads";
import LeadProcessingBar from "@/components/LeadProcessingBar";
import { moneyFormat } from "@/util/moneyFormat";
import { useRouter } from "next/navigation";
import { Divide } from "lucide-react";
import LeadNote from "./LeadNote";

const LeadDetailWindow = () => {
  // LEAD DETAIL PROVIDER 
  const { 
    removeSelectedLeadDetail, leadDetailInfo, leadSequenceActivity, 
    updateALeadDetail, loadingGetLeadDetail, updateLeadStage
  } = useLeadDetailSelect();
  // ROUTER 
  const router = useRouter();

  // LEAD STAGE PROVIDER 
  const { leadStage } = useLeadStageColumn();

  // UPDATE STATE 
  const [updateAvatar, setUpdateAvatar] = useState("");
  const [updateCompany, setUpdateCompany] = useState("");
  const [updateEmail, setUpdateEmail] = useState("");
  const [updateExpectedValue, setUpdateExpectedValue] = useState(0);
  const [updateName, setUpdateName] = useState("");
  const [updatePhone, setUpdatePhone] = useState("");
  const [updateRating, setUpdateRating] = useState(1);
  const [updateSource, setUpdateSource] = useState("");
  const [updateStatus, setUpdateStatus] = useState<string | null>(null);
  const [updateNote, setUpdateNote] = useState("");
  const [forwardStageID, setForwardStageID] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | undefined>();

  // UPDATED FLAG
  const [isUpdated, setIsUpdated] = useState(false);

  // HANDLE CLICK CONFIRM CHANGE BUTTON
  const handleConfirmChangeToggle = () => {
    if (!leadDetailInfo) return;

    if (forwardStageID){
      updateLeadStage(leadDetailInfo.leadID, forwardStageID);
      leadDetailInfo.status = updateStatus || "";
      console.log(leadDetailInfo);
      setIsUpdated(false);
      const changed = 
        updateAvatar !== (leadDetailInfo.avatarURL || "") ||
        updateCompany !== (leadDetailInfo.company || "") ||
        updateEmail !== (leadDetailInfo.email || "") ||
        updateExpectedValue !== (leadDetailInfo.expectedValue || "") ||
        updateName !== (leadDetailInfo.name || "") ||
        updatePhone !== (leadDetailInfo.phone || "") ||
        updateRating !== (Number(leadDetailInfo.rating) || 1) ||
        updateSource !== (leadDetailInfo.source || "") ||
        updateStatus !== (leadDetailInfo.status || null) ||
        updateNote !== (leadDetailInfo.note || "");
      
      if (!changed){
        return;
      }
    }

    const newLeadDetail: LeadDetailType = {
      leadID: leadDetailInfo.leadID ?? "",
      avatarURL: updateAvatar  === leadDetailInfo.avatarURL ? "" : updateAvatar,
      name: updateName === leadDetailInfo.name ? "" : updateName,
      expectedValue: leadDetailInfo.expectedValue,
      company: updateCompany === leadDetailInfo.company ? "" : updateCompany,
      phone: updatePhone === leadDetailInfo.phone ? "" : updatePhone,
      email: updateEmail === leadDetailInfo.email ? "" : updateEmail,
      status: "",
      source: updateSource  ===  leadDetailInfo.source ? "" : updateSource,
      nation: "",
      createdDate: "",
      rating: updateRating === leadDetailInfo.rating ? 0 : updateRating,
      note: updateNote === leadDetailInfo.note ? "" : updateNote,
      assignTo: "",
    };  

    updateALeadDetail(newLeadDetail, avatarFile);
    resetAllUpdatestate();
  };

  // RESET ALL UPDATE STATE
  const resetAllUpdatestate = () => {
    setUpdateAvatar(leadDetailInfo?.avatarURL || "");
    setUpdateCompany(leadDetailInfo?.company || "");
    setUpdateEmail(leadDetailInfo?.email || "");
    setUpdateExpectedValue(leadDetailInfo?.expectedValue || 0);
    setUpdatePhone(leadDetailInfo?.phone || "");
    setUpdateStatus(leadDetailInfo?.status || "");
    setUpdateNote(leadDetailInfo?.note || "");
    setIsUpdated(false);
  };

  // SYNC EDIT STATE WITH LEAD DETAIL
  useEffect(() => {
    if (!leadDetailInfo) {
      setUpdateAvatar("");
      setUpdateCompany("");
      setUpdateEmail("");
      setUpdateExpectedValue(0);
      setUpdateName("");
      setUpdatePhone("");
      setUpdateRating(1);
      setUpdateSource("");
      setUpdateStatus(null);
      setUpdateNote("");
      setIsUpdated(false);
      return;
    }

    setUpdateAvatar(leadDetailInfo.avatarURL || "");
    setUpdateCompany(leadDetailInfo.company || "");
    setUpdateEmail(leadDetailInfo.email || "");
    setUpdateExpectedValue(leadDetailInfo.expectedValue || 0);
    setUpdateName(leadDetailInfo.name || "");
    setUpdatePhone(leadDetailInfo.phone || "");
    setUpdateRating(Number(leadDetailInfo.rating) || 1);
    setUpdateSource(leadDetailInfo.source || "");
    setUpdateStatus(leadDetailInfo.status || null);
    setUpdateNote(leadDetailInfo.note || "");

    setIsUpdated(false);
  }, [leadDetailInfo]);

  // DETECT CHANGES AND UPDATE isUpdated
  useEffect(() => {
    if (!leadDetailInfo) {
      setIsUpdated(false);
      return;
    }

    const changed =
      updateAvatar !== (leadDetailInfo.avatarURL || "") ||
      updateCompany !== (leadDetailInfo.company || "") ||
      updateEmail !== (leadDetailInfo.email || "") ||
      updateExpectedValue !== (leadDetailInfo.expectedValue || "") ||
      updateName !== (leadDetailInfo.name || "") ||
      updatePhone !== (leadDetailInfo.phone || "") ||
      updateRating !== (Number(leadDetailInfo.rating) || 1) ||
      updateSource !== (leadDetailInfo.source || "") ||
      updateStatus !== (leadDetailInfo.status || null) ||
      updateNote !== (leadDetailInfo.note || "");

    setIsUpdated(changed);
  }, [
    updateAvatar,
    updateCompany,
    updateEmail,
    updateExpectedValue,
    updateName,
    updatePhone,
    updateRating,
    updateSource,
    updateStatus,
    updateNote,
    leadDetailInfo
  ]);


  // PROCESSING BAR INITIALIZATION
  const [processingStatusBar, setProcessingStatusBar] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    leadStage.forEach((stage) => {
      initial[stage.status] = false;
    });
    return initial;
  });

  // PROCESSING BAR SYNC
  useEffect(() => {
    setProcessingStatusBar((prev) => {
      const newState = { ...prev };
      if (!updateStatus) return newState;

      let active = true;
      leadStage.forEach((stage) => {
        newState[stage.status] = active;
        if (stage.status === updateStatus) active = false;
      });

      return newState;
    });
  }, [updateStatus, leadStage]);

  // UPDATE LEAD DETAIL SYNC 
  useEffect(() => {
    if (!leadDetailInfo) return;

    setUpdateAvatar(leadDetailInfo.avatarURL || "");
    setUpdateCompany(leadDetailInfo.company || "");
    setUpdateEmail(leadDetailInfo.email || "");
    setUpdateExpectedValue(leadDetailInfo.expectedValue || 0);
    setUpdateName(leadDetailInfo.name || "");
    setUpdatePhone(leadDetailInfo.phone || "");
    setUpdateRating(Number(leadDetailInfo.rating) || 1);
    setUpdateSource(leadDetailInfo.source || "");
    setUpdateStatus(leadDetailInfo.status || null);
    setUpdateNote(leadDetailInfo.note || "");

    setIsUpdated(false);
  }, [leadDetailInfo]);


  // HEADER SECTION
  const sectionHeader = ["Activity Timeline", "Note"];
  const [selectedSectionHeader, setSelectedSectionHeader] =
    useState("Activity Timeline");


  return (
    <div className='w-full h-full bg-white pt-5 rounded-xl flex flex-col'>
      {/* LEAD GENERAL INFORMATION  */}
      <div className="w-full h-fit flex justify-between px-4 pb-4 border-gray-300/80">
        {/* AVATAR AND NAME  */}
        <div className="flex items-center gap-2">
          <div
            onClick={() => removeSelectedLeadDetail()}
            className="h-full rounded-xl flex items-center px-1 hover:bg-blue-500/80 hover:text-white/80 transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </div>
          <div className="w-[50px] h-[50px] flex justify-center items-center rounded-full overflow-hidden">
            <UpLoadAvatar avatar={updateAvatar ? updateAvatar : leadDetailInfo?.avatarURL} setAvatar={setUpdateAvatar} setAvatarFile={setAvatarFile}/>
          </div>
          <div>
            {/* LEAD NAME  */}
            <p className="text-[18px] font-semibold">{leadDetailInfo?.name}</p>
            {/* LEAD COMPANY  */}
            <p className="text-[12px] text-gray-500/80">{leadDetailInfo?.company}</p>
          </div>
          <div>
            
          </div>
        </div>

        {/* PHONE AND EMAIL BUTTON  */}
        <div className="flex gap-2 items-center">
          <div 
            onClick={() => {
              router.push(`/quotations/new/${leadDetailInfo?.leadID}`)
            }}
            className="px-1 py-1 rounded-full border-blue-600/80 border-[1px] w-fit h-fit text-blue-600 hover:scale-[1.15] transition-all duration-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
          </div>

          <div className="px-1 py-1 rounded-full border-blue-600/80 border-[1px] w-fit h-fit text-blue-600 hover:scale-[1.15] transition-all duration-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
            </svg>
          </div>
          {
            isUpdated && (
              <>
                <div
                  onClick={() => handleConfirmChangeToggle()}
                  className={`cursor-pointer px-1 py-1 rounded-full border-blue-600/80 border-[1px] w-fit h-fit text-blue-600 hover:scale-[1.15] transition-all duration-500 ${isUpdated ? "text-green-500 border-green-500" : ""}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <div
                  onClick={() => resetAllUpdatestate()}
                  className={`cursor-pointer px-1 py-1 rounded-full border-blue-600/80 border-[1px] w-fit h-fit text-blue-600 hover:scale-[1.15] transition-all duration-500 ${isUpdated ? "text-red-500 border-red-500" : ""}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </div>
              </>
            )
          }
        </div>
      </div>
      {/* LEAD CONTACT INFORMATION  */}
      <div className="flex h-[80px] border-t-[1px] border-b-[1px] px-4 w-full justify-evenly">
        {/* JOB TITLE */}
        <div className="w-fit h-full flex flex-col justify-center items-start">
          <div className="text-[12px] text-gray-500/90">Expected value</div>
          <div className="text-[14px] w-full h-fit font-semibold"> {moneyFormat(leadDetailInfo?.expectedValue || 0)}đ</div>
        </div>

        {/* EMAIL */}
        <div className="w-1/6 h-full flex flex-col justify-center items-start">
          <div className="text-[12px] text-gray-500/90">Email</div>
          <input className="text-[14px] w-full h-fit font-semibold outline-none" type="text" value={updateEmail} onChange={(e) => setUpdateEmail(e.target.value)} />
        </div>

        {/* PHONE */}
        <div className="w-fit h-full flex flex-col justify-center items-start">
          <div className="text-[12px] text-gray-500/90">Phone</div>
          <input className="text-[14px] w-full h-fit font-semibold outline-none" type="text" value={updatePhone} onChange={(e) => setUpdatePhone(e.target.value)} />
        </div>

        {/* COMPANY */}
        <div className="w-fit h-full flex flex-col justify-center items-start">
          <div className="text-[12px] text-gray-500/90">Company</div>
          <input className="text-[14px] w-full h-fit font-semibold outline-none" type="text" value={updateCompany} onChange={(e) => setUpdateCompany(e.target.value)} />
        </div>

        {/* CREATED DATE */}
        <div className="w-1/6 h-full flex flex-col justify-center items-start">
          <div className="text-[12px] text-gray-500/90">Created at</div>
          <div className="text-[14px] font-semibold">
            {leadDetailInfo?.createdDate
              ? new Date(leadDetailInfo.createdDate).toLocaleString("vi-VN")
              : "-"}
          </div>
        </div>
        {/* ASSIGN TO */}
        <div className="w-fit h-full flex flex-col justify-center items-start">
          <div className="text-[12px] text-gray-500/90">Assign to</div>
          <div className="text-[14px] font-semibold">{leadDetailInfo && leadDetailInfo.assignTo}</div>
        </div>
      </div>
      {/* LEAD PROCESSING BAR  */}
      <div className="w-full h-fit py-4 px-4 flex flex-col gap-2">
        <LeadProcessingBar currentStage={updateStatus || ""} setCurrentStage={setUpdateStatus} setForwardStageId={setForwardStageID}/>
      </div>
      {/* LEAD ACTIVITY AND RECENT DEALS */}
      <div className="w-full flex-1 flex px-4 py-4 gap-2 min-h-0">
        <div className="w-[70%] border border-gray-200 rounded-xl px-4 py-3 flex flex-col shadow-sm bg-white">

          {/* HEADER SECTION (tabs) */}
          <div className="w-full h-[35px] flex gap-4 border-b border-gray-200">
            {sectionHeader.map((section, index) => {
              const isActive = selectedSectionHeader === section;

              return (
                <div
                  key={index}
                  onClick={() => setSelectedSectionHeader(section)}
                  className={`
                    relative text-[12px] h-full font-semibold
                    flex justify-center items-center px-3 cursor-pointer
                    transition-all duration-300 select-none
                    ${isActive ? "text-[#0A66A3]" : "text-gray-600 hover:text-[#0582D2]"}
                  `}
                >
                  {section}

                  {/* Active underline */}
                  <span
                    className={`
                      absolute bottom-0 left-0 h-[3px] rounded-full
                      bg-gradient-to-r from-[#3BAEF0] to-[#0582D2]
                      transition-all duration-300
                      ${isActive ? "w-full" : "w-0"}
                    `}
                  ></span>

                  {/* Homer hover animation (when inactive) */}
                  {!isActive && (
                    <span
                      className="
                        absolute bottom-0 left-0 h-[3px] bg-[#AEE3FF] rounded-full
                        scale-x-0 origin-left transition-transform duration-300
                        hover:scale-x-100
                      "
                    ></span>
                  )}
                </div>
              );
            })}
          </div>

          {/* ACTIVITY TIME LINE */}
          { selectedSectionHeader === "Activity Timeline" ? <AddingLeadActivityTimeline /> : <LeadNote note={updateNote} onChange={setUpdateNote} editable={true} />}
        </div>
        {/* LeadActivityTimeLineSequence  */}
        <LeadActivityTimelineSequence sequenceActivity={leadSequenceActivity ? leadSequenceActivity : null} />

      </div>
    </div>
  )
}

export default LeadDetailWindow