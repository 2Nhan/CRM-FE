import { useRef, useState } from "react";

interface Props {
  selectedColor: string,
  setSelectedColor: React.Dispatch<React.SetStateAction<string>>,
}

const InputColorComponent = ({selectedColor, setSelectedColor}: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => inputRef.current?.click();

  return (
    <div 
      onClick={handleClick}
      style={{ backgroundColor: selectedColor }}
      className="w-6 h-6 rounded-xl flex items-center justify-center cursor-pointer"
    >
      <input
        type="color"
        ref={inputRef}
        value={selectedColor}
        onChange={(e) => setSelectedColor(e.target.value)}
        className="absolute bottom-0 right-0 opacity-0 cursor-pointer"
      />
    </div>
  );
};

export default InputColorComponent;
