import { ApiResponseDataLeadActivity, LeadDetailActivityTimeline } from "@/lib/data.leads";
import { PackageOpen } from "lucide-react";
import LeadActivityStatus from "@/components/LeadActivityStatus";
import { useLeadDetailSelect } from "@/providers/LeadDetailSelectProvider";
import FetchingLoadingStatus from "@/components/FetchingLoadingStatus";
import { useState } from "react";
interface Props {
  sequenceActivity: ApiResponseDataLeadActivity[] | null;
}

const isAvailable = (activity: any) => {
  const currentDate = new Date();
  const validDate = new Date(activity.validUntil);

  return currentDate < validDate;
};

const LeadActivityTimelineSequence = ({ sequenceActivity }: Props) => {
  const { completeLeadActivity, loadingCompleteLeadActivity, deleteLeadActivity, loadingDeleteActivity } = useLeadDetailSelect();
  const [selectedActivity, setSelectedActivity] = useState<string>("");
  const hasActivities = sequenceActivity && sequenceActivity.length > 0;
  const current = new Date();

  return (
    <div className="flex-1 border border-gray-200 rounded-xl px-5 py-4 h-full
                    flex flex-col shadow-sm bg-white">

      {/* HEADER */}
      <div className="flex items-center gap-2 text-[14px] font-semibold text-gray-700 mb-4">
        Recent Activities
      </div>

      {/* EMPTY STATE – PROFESSIONAL & CLEAN */}
      {!hasActivities ? (
        <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-100 
                            rounded-full flex items-center justify-center">
              <PackageOpen className="w-11 h-11 text-blue-500 opacity-80" />
            </div>
          </div>

          <h3 className="text-[13px] font-semibold text-gray-800 mb-2">
            No activities yet
          </h3>
        </div>
      ) : (
        /* ACTIVITIES LIST */
        <div className="space-y-3 overflow-y-auto flex-1 pr-1 -mr-1">
          {sequenceActivity.map((activity, index) => (
            <div
              key={index}
              className="h-fit w-full border border-gray-200 rounded-xl px-4 py-3
                         bg-gradient-to-r from-gray-50/80 to-gray-50 
                         hover:from-blue-50/90 hover:to-indigo-50/40 
                         hover:border-blue-200 hover:shadow-md
                         transition-all duration-300 cursor-default
                         flex flex-col justify-between"
            >
              {/* CLOSING DATE */}
              <div className="flex items-center justify-between">
                <div className="flex">
                  <div className="text-[11.5px] font-medium text-gray-500">
                    Expected Close:
                  </div>
                  <div className="text-[11px] font-semibold text-blue-600 bg-blue-50 
                                 px-2.5 py-0.5 rounded-full">
                    {activity.validUntil}
                  </div>
                  {/* COMPLETE AN ACTIVITY  */}
                  {!activity.completed && (
                    (loadingCompleteLeadActivity && selectedActivity === activity.id) ? (
                      <FetchingLoadingStatus
                        loading
                        color="#90EE90"
                        size={6}
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          completeLeadActivity(activity.id);
                          setSelectedActivity(activity.id)
                        }}
                        className="
                          flex items-center justify-center
                          cursor-pointer
                          transition-all duration-300
                          text-gray-500 hover:text-green-500
                          hover:scale-[1.15]
                        "
                        aria-label="Complete activity"
                      >
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
                            d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                          />
                        </svg>
                      </button>
                    )
                  )}
                </div>
                {
                  selectedActivity === activity.id && loadingDeleteActivity ?
                    (
                      <FetchingLoadingStatus loading={loadingDeleteActivity} color="#FF0000" size={6} />
                    )
                    :
                    (<div
                      onClick={() => {
                        deleteLeadActivity(activity.id);
                        setSelectedActivity(activity.id);
                      }}
                      className="hover:opacity-100 opacity-0 transition-all duration-500 cursor-pointer flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-red-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                    </div>)
                }


              </div>

              {/* ACTIVITY TITLE */}
              <div className="text-[13.5px] font-semibold text-gray-800 line-clamp-2 leading-tight py-2 my-2">
                {activity.content}
              </div>

              {/* FOOTER: Assign + Rate */}
              <div className="flex items-center justify-between text-[11.5px]">
                <div className="flex items-center gap-2">

                  <LeadActivityStatus status={activity.status} />
                </div>

                <div className="flex items-center gap-1.5 ">
                  <div className="text-green-500">
                    {activity.type}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeadActivityTimelineSequence;