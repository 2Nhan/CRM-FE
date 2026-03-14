"use client";

import { useLeadStageColumn } from "@/providers/LeadStageColumnProvider";
import { useState, useEffect } from "react";

interface Props {
  currentStage: string;
  setCurrentStage: React.Dispatch<React.SetStateAction<string | null>>;
  setForwardStageId: React.Dispatch<React.SetStateAction<string | null>>;
}

const LeadProcessingBar = ({
  currentStage,
  setCurrentStage,
  setForwardStageId,
}: Props) => {
  const { leadStage } = useLeadStageColumn();

  const [stagePreprocessingBar, setStagePreprocessingBar] = useState<
    Record<string, boolean>
  >({});
  const [isWonStage, setIsWonStage] = useState<boolean>(false);
  const [isLostStage, setIsLostStage] = useState<boolean>(false);

  useEffect(() => {
    if (!leadStage || leadStage.length === 0) return;

    const bar: Record<string, boolean> = {};
    let active = true;

    leadStage.forEach((stage) => {
      bar[stage.status] = active;
      if (stage.status === currentStage) active = false;
    });

    setIsWonStage(currentStage === "Won");
    setIsLostStage(currentStage === "Lost");
    setStagePreprocessingBar(bar);
  }, [leadStage, currentStage]);

  return (
    <div className="w-full h-fit py-4 px-4 flex flex-col gap-2">
      <div className="text-[12px] font-semibold py-1">Lead Details</div>

      <div className="w-full h-[40px] flex gap-2">
        {leadStage?.map((stage, index) => {
          const isActive = stagePreprocessingBar[stage.status];
          const isCurrent = currentStage === stage.status;

          // Base CSS
          const base =
            "flex-1 h-full flex justify-center items-center text-[13px] font-medium transition-all duration-300 cursor-pointer gap-2 select-none";

          // Shape for first / last element
          const shape =
            index === 0
              ? "rounded-tl-3xl rounded-bl-3xl"
              : index === leadStage.length - 1
              ? "rounded-tr-3xl rounded-br-3xl"
              : "";

          if (isWonStage && stage.status === "Lost") {
            return (
              <div
                key={stage.status}
                onClick={() => {
                  setCurrentStage(stage.status);
                  setForwardStageId(stage.id);
                }}
                className={`${base} ${shape} 
                  bg-red-500/80
                  text-white
                  active:scale-[0.98]
                `}
              >
                {/* X icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>

                {stage.status}
              </div>
            );
          }

          if (isLostStage && stage.status === "Lost"){
            return (
              <div
                key={stage.status}
                onClick={() => {
                  setCurrentStage(stage.status);
                  setForwardStageId(stage.id);
                }}
                className={`${base} ${shape} 
                  bg-red-500
                  text-white 
                  active:scale-[0.98]
                `}
              >
                {/* X icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>

                {stage.status}
              </div>
            );
          }

          // Normal color logic
          const color = isActive
            ? isCurrent
              ? "bg-[#4CCB56] hover:bg-[#35B440] text-white"
              : "bg-[#C8F6CD] hover:bg-[#B1EDB7] text-[#2CA544]"
            : "bg-gray-300/70 hover:bg-gray-300/90 text-gray-600/70";

          return (
            <div
              key={stage.status}
              onClick={() => {
                setCurrentStage(stage.status);
                setForwardStageId(stage.id);
              }}
              className={`${base} ${color} ${shape}`}
            >
              {isActive && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
              )}
              {stage.status}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeadProcessingBar;
