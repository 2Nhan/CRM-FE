"use client";

import useGetAssigners from "@/fetching/user/getAssigners";
import { useEffect, useState } from "react";
import FetchingLoadingStatus from "./FetchingLoadingStatus";
import { ApiResponseGetAssignersType } from "@/lib/data.user";
import { ChevronDown, User } from "lucide-react";

interface AssignerSelectorProps {
  value?: string;
  onChange?: (assigner: ApiResponseGetAssignersType | null) => void;
  disabled?: boolean;
}

const AssignerSelectorComponent = ({
  value,
  onChange,
  disabled = false,
}: AssignerSelectorProps) => {
  const { loading: getAssignersLoading, getAssigners } = useGetAssigners();

  const [assigners, setAssigners] = useState<ApiResponseGetAssignersType[]>([]);
  const [selectedId, setSelectedId] = useState<string>(value || "");

  useEffect(() => {
    const fetching = async () => {
      try {
        const result = await getAssigners();
        setAssigners(result);
      } catch (e) {
        console.error("Failed to fetch assigners", e);
      }
    };

    fetching();
  }, []);

  const handleChange = (id: string) => {
    setSelectedId(id);

    const selectedUser = assigners.find((u) => u.id === id) || null;
    onChange?.(selectedUser);
  };

  if (getAssignersLoading) {
    return (
      <FetchingLoadingStatus loading color="blue" size={20} />
    );
  }

  if (!assigners.length) {
    return (
      <div className="text-sm text-gray-500 italic">
        No assigners available
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Icon */}
      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />

      <select
        value={selectedId}
        disabled={disabled}
        onChange={(e) => handleChange(e.target.value)}
        className={`
          w-full appearance-none rounded-lg border px-10 py-2.5 text-sm
          bg-white shadow-sm transition
          focus:outline-none focus:ring-2 focus:ring-blue-500
          ${disabled ? "bg-gray-100 cursor-not-allowed" : "hover:border-gray-400"}
        `}
      >
        <option value="" disabled>
          Select an assigner
        </option>

        {assigners.map((user) => (
          <option key={user.id} value={user.id}>
            {user.fullName}
          </option>
        ))}
      </select>

      {/* Dropdown Icon */}
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  );
};

export default AssignerSelectorComponent;
