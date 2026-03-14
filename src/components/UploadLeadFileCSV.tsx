import { useLeadUploadCSV } from "@/providers/leads/LeadUpLoadCSVPrivider";
import { useRef, ChangeEvent } from "react";

const UploadLeadFileCSV = () => {
  const { handleUploadCSV } = useLeadUploadCSV();
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Trigger hidden file input
   */
  const handleClickUpload = () => {
    inputRef.current?.click();
  };

  /**
   * Handle CSV file selection
   */
  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleUploadCSV(file);
  };

  return (
    <div
      onClick={handleClickUpload}
      className="
        cursor-pointer text-xs bg-blue-500/80 text-white px-3 py-1.5 rounded-lg
        hover:bg-blue-500 hover:shadow-md hover:scale-[1.03]
        transition-all duration-300
      "
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleUploadFile}
      />
      Upload file CSV
    </div>
  );
};

export default UploadLeadFileCSV;
