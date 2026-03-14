import { useRef, useState } from "react";
import Image from "next/image";

interface Props {
  setFileImage: React.Dispatch<React.SetStateAction<File | null>>;
  setImage?: React.Dispatch<React.SetStateAction<string>>;
  image?: string;
}

const UploadImageIcon = ({ setFileImage, image, setImage }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleClick = () => inputRef.current?.click();

  const handleFile = (file: File) => {
    if (!file || file.type !== "image/png") return;

    setFileImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      if (setImage) setImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  return (
    <div className="w-full h-full">
      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept=".png, .jpg"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload area */}
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative w-full h-full border-1 rounded-xl flex flex-col justify-center items-center gap-2 text-center cursor-pointer transition-all duration-300 
          ${isDragging ? "border-blue-400 bg-blue-50 text-blue-600 scale-[1.01]" : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"}`}
      >
        {image ? (
          <div className="absolute inset-0">
            <Image
              src={image}
              alt="Preview"
              fill
              className="object-cover rounded-lg transition-transform duration-300 hover:scale-[1.02]"
            />
          </div>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5 text-gray-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 
                1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 
                3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 
                1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 
                0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
            <h3 className="font-medium text-xs text-gray-800">
              Drop your image here
            </h3>
            <h5 className="text-[10px] text-gray-500">
              Only .png files are accepted
            </h5>
          </>
        )}
      </div>
    </div>
  );
};

export default UploadImageIcon;
