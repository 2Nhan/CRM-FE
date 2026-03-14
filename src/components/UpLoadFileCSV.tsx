"use client";
import Image from "next/image";
import { useRef, useState } from "react";

interface Props {
  setSelectedCSVFile: React.Dispatch<React.SetStateAction<File | null>>,
}
const UploadFileCSV = ({setSelectedCSVFile}: Props) => {
  // STATE
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState(""); 

  // HANDLE CLICK EVENT 
  const handleClick = () => inputRef.current?.click();
  // HANDLE FILE CHANGE
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file){
      setFileName(file.name);
      setSelectedCSVFile(file);
    }
  }
  // HANDLE DROP EVENT
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file){
      setFileName(file.name);
      setSelectedCSVFile(file);
    }
  }
  // HANDLE DRAG OVER EVENT
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }
  // HANDLE DRAG LEAVE EVENT
  const handleDragLeave = () => setIsDragging(false);
  

  return (
    <div className="w-full h-full">
      {/* HIDDEN INPUT */}
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* UPLOAD AREA */}
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`w-full h-full border-2 border-dashed rounded-xl opacity-[70%] hover:opacity-[100%] flex flex-col justify-center items-center gap-2 text-center cursor-pointer transition-all duration-300 
        ${isDragging ? "border-blue-400 bg-blue-50 text-blue-600 scale-[1.01]" : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"}`}
      >
        {/* UPLOAD AREA */}
       <Image src={"/upload_file.png"} alt={""} width={40} height={40}/>

        {/* TEXT */}
        {fileName ? (
          <div className="text-sm text-gray-800">
            <strong>{fileName}</strong> uploaded
          </div>
        ) : (
          <>
            <h3 className="font-medium text-gray-800">
              Click to upload or drag & drop
            </h3>
            <h5 className="text-sm text-gray-500">Only .csv files are accepted</h5>
          </>
        )}
      </div>
    </div>
  );
};

export default UploadFileCSV;
