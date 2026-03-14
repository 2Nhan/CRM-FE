"use client";

import { useLeadUploadCSV } from "@/providers/leads/LeadUpLoadCSVPrivider";
import { useEffect, useState } from "react";

const availableProperties = [
  { id: "fullName", label: "Full Name", type: "text" },
  { id: "dateOfBirth", label: "Date of birth", type: "text" },
  { id: "email", label: "Email", type: "email" },
  { id: "phoneNumber", label: "Phone number", type: "phone" },
  { id: "company", label: "Company", type: "text" },
  { id: "rating", label: "Rating", type: "text" },
  { id: "expectedRevenue", label: "Expected revenue", type: "text" },
  { id: "note", label: "Note", type: "text" },
  { id: "source", label: "Source", type: "text" },
  { id: "avatarUrl", label: "Avatar url", type: "text" },
  { id: "skip", label: "Do not import", type: "skip" }
];

const LeadCSVMatching = () => {
  const { fileRow, cancelUploadFile, confirmUploadFile } = useLeadUploadCSV();

  const [fileHeaders, setFileHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [ignoredColumns, setIgnoredColumns] = useState<string[]>([]);

  useEffect(() => {
    setFileHeaders(fileRow?.headers || []);
  }, [fileRow]);

  const allMapping = fileHeaders.length > 0 && fileHeaders.every(
    (header) => mapping[header] || ignoredColumns.includes(header)
  );

  const mappedCount = Object.keys(mapping).length;

  /**
   * mapping property - matching user selector with defind property to mapping file header and business options
   * @param header file header row
   * @param value user's selector
   */
  const handlePropertySelectorChange = (header: string, value: string) => {
    const isSkip = value === "skip";

    setMapping((prev) => {
      const next = { ...prev };
      if (isSkip || !value) {
        delete next[header];
      } else {
        next[header] = value;
      }
      return next;
    });

    setIgnoredColumns((prev) => {
      if (isSkip) return [...prev.filter(h => h !== header), header];
      return prev.filter(h => h !== header);
    });
  };

  const isOpen = !!fileRow && fileHeaders.length > 0;

  return (
    <div
      className={`fixed inset-0 z-[100] transition-all duration-300
        ${isOpen ? "bg-black/40 backdrop-blur-sm visible opacity-100" : "invisible opacity-0"}
      `}
    >
      <div className="w-full h-full relative">
        <div
          className={`absolute w-1/2 h-full right-0 bg-white flex flex-col transition-all duration-500
            ${isOpen ? "translate-x-0" : "translate-x-full"}
          `}
        >
          {/* HEADER */}
          <div className="px-6 py-5 border-b">
            <div className="flex justify-between">
              <div>
                <h1 className="text-2xl font-semibold">Map Properties</h1>
                <p className="text-sm text-gray-500">
                  Match CSV columns to lead properties
                </p>
              </div>
              <button onClick={cancelUploadFile} className="text-gray-400 hover:text-red-500">
                ✕
              </button>
            </div>
          </div>

          {/* BODY */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
            {fileHeaders.map((column) => {
              const selected = mapping[column];
              const isSkipped = ignoredColumns.includes(column);
              const isMapped = !!selected;

              return (
                <div key={column} className="flex items-center gap-4">
                  {/* COLUMN */}
                  <div className="flex-1 bg-gray-50 border rounded-lg px-4 py-3 text-sm font-medium">
                    {column}
                  </div>

                  {/* ARROW */}
                  <div className="w-8 flex justify-center">
                    <svg
                      className={`w-5 h-5 ${isMapped ? "text-green-500" : isSkipped && "text-red-500"
                        }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </div>

                  {/* SELECT */}
                  <div className="flex-1 relative">
                    <select
                      value={selected || (isSkipped ? "skip" : "")}
                      onChange={(e) => handlePropertySelectorChange(column, e.target.value)}
                      className={`w-full py-3 px-4 pr-10 rounded-lg border text-sm font-medium appearance-none
                        ${isMapped
                          ? "bg-green-50 border-green-300 text-green-700"
                          : isSkipped
                           && "bg-red-100 border-red-300 text-red-500"
                          }
                      `}
                    >
                      <option value="">Select a property...</option>
                      {availableProperties.map((prop) => (
                        <option key={prop.id} value={prop.id}>
                          {prop.label}
                        </option>
                      ))}
                    </select>

                    {/* STATUS ICON */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {isMapped ?
                        (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-green-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                        )
                        : isSkipped &&
                        (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-red-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                        )
                      }
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* FOOTER */}
          <div className="px-6 py-4 border-t flex justify-between items-center">
            <div className="text-sm">
              <span className="font-semibold">{mappedCount}</span> of{" "}
              <span className="font-semibold">{fileHeaders.length}</span> columns mapped
            </div>

            <div className="flex gap-3">
              <button
                onClick={cancelUploadFile}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                disabled={!allMapping}
                onClick={() => confirmUploadFile(mapping)}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition
                  ${allMapping
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"}
                `}
              >
                Import
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadCSVMatching;
