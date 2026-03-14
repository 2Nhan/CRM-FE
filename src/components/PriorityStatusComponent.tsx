const priorityType: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  hard: "High",
};
const styles: Record<string, string> = {
  low: "bg-green-100 text-green-700 border-green-300",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
  hard: "bg-red-100 text-red-700 border-red-300",
};


interface PriorityProps {
  priority: string;
}

const PriorityStatusComponent = ({ priority }: PriorityProps) => {
  const priorityStatus = priorityType[priority] || "Unknown";

  return (
    <div className={`px-2 py-[3px] rounded-full border w-fit ${styles[priority]} text-center`}>
      {priorityStatus}
    </div>
  );
};

export default PriorityStatusComponent;
