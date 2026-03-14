"use client";
import { Listbox } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import React from "react";

interface SelectorProps {
  width?: string; // e.g. "w-56"
  height?: string; // 🆕 e.g. "h-10" or "h-[42px]"
  label?: string; // e.g. "Show:" or "Sort by:"
  options: string[];
  optionSelector: string;
  setOptionSelector: React.Dispatch<React.SetStateAction<string>>;

  bgColor?: string;
  hoverBgColor?: string;
  textColor?: string;
  borderColor?: string;
  rounded?: string;
  fontSize?: string;
  fontWeight?: string;
  showIcon?: boolean;
  customIcon?: React.ReactNode;
}

const SelectorComponent: React.FC<SelectorProps> = ({
  width = "w-56",
  height = "h-9", 
  label = "Show:",
  options,
  optionSelector,
  setOptionSelector,

  bgColor = "bg-gray-100",
  hoverBgColor = "hover:bg-white/70",
  textColor = "text-gray-700",
  borderColor = "border-gray-200",
  rounded = "rounded-xl",
  fontSize = "text-sm",
  fontWeight = "font-semibold",
  showIcon = true,
  customIcon,
}) => {
  return (
    <div className={`relative ${width} ${height}`}>
      <Listbox value={optionSelector} onChange={setOptionSelector}>
        <div className="relative">
          {/* --- Dropdown Button --- */}
          <Listbox.Button
            className={`
              ${bgColor} ${hoverBgColor} ${borderColor}
              transition-all duration-300 w-full ${height}
              flex justify-between items-center
              backdrop-blur-md border ${rounded}
              px-4 ${textColor} shadow-sm
            `}
          >
            <div className="flex items-center gap-1">
              {label && (
                <span className="block text-xs text-gray-500 whitespace-nowrap">
                  {label}
                </span>
              )}
              <span className={`${fontWeight} ${fontSize} truncate`}>
                {optionSelector}
              </span>
            </div>

            {/* Icon */}
            {showIcon &&
              (customIcon ? (
                customIcon
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ))}
          </Listbox.Button>

          {/* --- Dropdown Options --- */}
          <Listbox.Options className="absolute z-10 mt-2 w-full bg-white rounded-xl shadow-lg ring-1 ring-gray-200">
            {options.map((option) => (
              <Listbox.Option
                key={option}
                value={option}
                className="cursor-pointer px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 transition-all duration-200"
              >
                {option}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
};

export default SelectorComponent;
