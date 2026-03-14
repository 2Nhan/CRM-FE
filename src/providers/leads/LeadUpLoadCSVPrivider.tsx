import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import Papa from 'papaparse';
import useUploadCSV from "@/fetching/lead/uploadCSV";
import { useNotification } from "../NotificationProvider";

interface LeadUploadCSVContextType {
  // API HOOKS
  uploadCSVLoading: boolean,
  // STATE
  fileRow: Record<string, string[]> | null,

  // AcTIONS 
  handleUploadCSV: (leadInCSV: File) => void,
  cancelUploadFile: () => void,
  confirmUploadFile: (matching: Record<string, string>) => void,
}

const LeadUploadCSVcontext = createContext<LeadUploadCSVContextType | null>(null);

export const useLeadUploadCSV = () => {
  const context = useContext(LeadUploadCSVcontext);
  if (!context) {
    throw new Error("useLeadUploadCSV must be used within LeadUploadCSVProvider");
  }

  return context;
}

interface useLeadUploadCSVProviderProps {
  children: ReactNode
}
/**
 * Lead upload by CSV - handle all action relates with upload lead by csv
 */
export const LeadUploadCSVProvider = ({ children }: useLeadUploadCSVProviderProps) => {
  // API HOOKS
  const { loading: uploadCSVLoading, uploadCSV } = useUploadCSV();

  // STATE
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [fileRow, setFileRow] = useState<Record<string, string[]> | null>(null)
  const { showNotification, showNotificationLeadCSV } = useNotification();

  /**
   * set the file csv of user to selected CSV file
   * @param leadInCSV leads in CSV
   */
  const handleUploadCSV = (leadInCSV: File) => {
    setUploadFile(leadInCSV);
  }

  /**
   * complie the header of upload lead file to string array
   * @returns headers of file (string datatype)
   */
  const compileFileHeader = () => {
    if (uploadFile) {
      Papa.parse(uploadFile, {
        header: false,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data && results.data.length > 0) {
            const firstRow = results.data[0] as string[];
            const secondRow = results.data[1] as string[];
            const data = {
              "headers": firstRow,
              "secondRow": secondRow,
            }

            setFileRow(data);
          }
        }
      });
    }
  }

  /**
   * confirm upload lead file - take action to send to server 
   * @param matching user's file header and business property matching
   */
  const confirmUploadFile = async (matching: Record<string, string>) => {

    if (!uploadFile) {
      showNotification("Cannot read file", true);
      return;
    }

    const response = await uploadCSV(matching, uploadFile);

    if (response.code !== 200) {
      const msg =
        typeof response.error === "object"
          ? response.error.message || "Upload failed"
          : "Upload failed";

      showNotification(msg, true);
      return;
    }

    if (response.error?.length !== 0){
      showNotificationLeadCSV(response.error);
      resetAllState();
      return;
    }

    resetAllState();
    showNotification("Successfully import leads by CSV");
  };


  /**
   * cancel upload leads by CSV - reset all fields into null
   */
  const cancelUploadFile = () => {
    setUploadFile(null);
    setFileRow(null)
  }

  /**
   * reset uplaod leads upload by CSV state - reset all fields into null whenever successful
   */
  const resetAllState = () => {
    setUploadFile(null);
    setFileRow(null);
  }

  /**
   * Initialize action - whenever have the upload file CSV (leads)
   */
  useEffect(() => {
    compileFileHeader();
  }, [uploadFile]);


  const value: LeadUploadCSVContextType = {
    // API HOOK
    uploadCSVLoading,
    // STATE
    fileRow,


    // ACTIOn
    handleUploadCSV,
    cancelUploadFile,
    confirmUploadFile
  }
  return (
    <LeadUploadCSVcontext.Provider value={value}>
      {children}
    </LeadUploadCSVcontext.Provider>
  )
}