import React from "react";

const statusStyle: Record<string, string> = {
  "Active": "bg-green-100 text-green-700 border border-green-300",
  "Low Stock": "bg-yellow-100 text-yellow-700 border border-yellow-300",
  "Preorder": "bg-blue-100 text-blue-700 border border-blue-300",
  "Out of Stock": "bg-red-100 text-red-700 border border-red-300",
};

interface StatusProps {
  status: string;
}

const StatusComponent: React.FC<StatusProps> = ({ status }) => {
  const iconSize = "size-4";

  const renderIcon = () => {
    switch (status) {
      case "Active":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            strokeWidth={2} stroke="currentColor" className={iconSize}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        );
      case "Low Stock":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            strokeWidth={2} stroke="currentColor" className={iconSize}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M12 9v4m0 4h.01M12 4.5a8.5 8.5 0 1 1 0 17 8.5 8.5 0 0 1 0-17Z" />
          </svg>
        );
      case "Preorder":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            strokeWidth={2} stroke="currentColor" className={iconSize}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M12 6v6l4 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        );
      case "Out of Stock":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            strokeWidth={2} stroke="currentColor" className={iconSize}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M18.364 5.636a9 9 0 1 0 0 12.728A9 9 0 0 0 18.364 5.636ZM9.879 9.879l4.242 4.242m0-4.242-4.242 4.242" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`flex items-center gap-1 w-fit rounded-full px-2 py-1 ${statusStyle[status] || "bg-gray-100 text-gray-600 border border-gray-300"}`}
    >
      {renderIcon()}
      <span className="text-xs font-semibold">{status}</span>
    </div>
  );
};

export default StatusComponent;
