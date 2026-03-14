"use client";

const STATUS_MAP: Record<string, string> = {
  PENDING: "bg-blue-500/60",
  DONE: "bg-green-500/60",
  EXPIRED: "bg-red-500/60",
};

interface Props {
  status: string;
}

const LeadActivityStatus = ({ status }: Props) => {
  const style = STATUS_MAP[status] ?? "bg-gray-400/60";

  return (
    <div
      className={`
        inline-flex items-center
        px-2 py-1 rounded-xl
        text-[11px] font-medium text-white
        ${style}
      `}
    >
      {status}
    </div>
  );
};

export default LeadActivityStatus;
