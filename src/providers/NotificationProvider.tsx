"use client";
import { ProductDetailRequestType, ProductDetailResponseType } from "@/lib/data.product";
import { createContext, useContext, useState, useCallback } from "react";

interface NotificationContextType {
  showNotification: (msg: string, error?: boolean) => void;
  showCSVNotification: (msg: ProductDetailResponseType[], error?: boolean) => void;
  showNotificationLeadCSV: (errorLead: any) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotification = () => useContext(NotificationContext)!;

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [csvMessage, setCSVMessage] = useState<ProductDetailResponseType[]>([]);
  const [leadCSVMessage, setLeadCSVMessage] = useState<any[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);

  const showCSVNotification = useCallback((msg: ProductDetailResponseType[], error = false) => {
    setCSVMessage(msg);
    setIsError(error);

    if (error === true) {
      const timer = setTimeout(() => {
        setCSVMessage([]);
        setIsError(true);
        clearInterval(timer);
      }, 4000);
    }
    else {
      const timer = setTimeout(() => {
        setCSVMessage([]);
        setIsError(false);
        clearInterval(timer);
      }, 12000);
    }
  }, []);

  const showNotificationLeadCSV = useCallback((errorLead: any) => {
    setLeadCSVMessage(Array.isArray(errorLead) ? errorLead : [errorLead]);
    setIsError(true);

    const timer = setTimeout(() => {
      setLeadCSVMessage([]);
      setIsError(false);
      clearTimeout(timer);
    }, 12000);
  }, []);

  const showNotification = useCallback((msg: string, error = false) => {
    setMessage(msg);
    setIsError(error);

    const timer = setTimeout(() => {
      setMessage(null);
      setIsError(false);
      clearTimeout(timer);
    }, 4000);
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification, showCSVNotification, showNotificationLeadCSV }}>
      {children}

      {/* UI Notification */}
      {message && (
        <div
          className={`
            fixed top-5 right-5
            z-[99999]
            px-4 py-3 
            rounded-md 
            shadow-sm 
            text-white text-xs
            border 
            animate-slide-in
            ${isError
              ? "bg-red-500 border-red-600"
              : "bg-blue-500 border-blue-600"
            }
          `}
          style={{
            position: "fixed",
            inset: "auto",
            top: "30px",
            right: "20px",
            maxWidth: "300px",
            pointerEvents: "auto",
          }}
        >
          {message}
        </div>
      )}

      {/* UI CSV NOTIFICATION */}
      {csvMessage.length > 0 && (
        <div
          className={`
            fixed top-6 right-6 
            z-[100000]
            px-4 py-4
            rounded-xl
            shadow-xl
            text-white text-sm
            border
            w-full max-w-sm
            animate-slide-in
            ${isError
                ? "bg-red-500 border-red-600"
                : "bg-blue-500 border-blue-600"
              }
          `}
          style={{
            position: "fixed",
            inset: "auto",
            top: "30px",
            right: "20px",
            maxWidth: "300px",
            pointerEvents: "auto",
          }}
        >
          {/* Header */}
          <div className="font-bold mb-3 border-b border-white/40 pb-2">
            {isError
              ? `CSV Import Failed — ${csvMessage.length} item(s) could not be processed`
              : `CSV Import Completed — ${csvMessage.length} conflicts detected`
            }
          </div>

          {/* Scrollable list */}
          <div className="max-h-60 overflow-y-auto pr-2 space-y-3">
            {csvMessage.map((item, index) => {
              const identifier =
                item.productName || item.sku || `Row #${index + 1}`;

              return (
                <div key={index} className="p-3 bg-white/10 rounded-lg">
                  <p className="font-semibold text-white/90 truncate">
                    {identifier}
                  </p>

                  {(item.sku || item.productId) && (
                    <p className="text-xs text-white/70 mt-1">
                      <span className="font-medium">SKU/ID:</span>{" "}
                      {item.sku || item.productId}
                    </p>
                  )}

                  <p className="mt-2 text-xs text-yellow-200 italic">
                    Reason: This item already exists in the system (duplicate SKU/ID).
                  </p>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <p className="text-white/80 mt-4 text-xs pt-2 border-t border-white/40">
            Please review the items above and correct them in your CSV file before trying again.
          </p>
        </div>
      )}

      {/* UI LEAD CSV NOTIFICATION */}
      {leadCSVMessage.length > 0 && (
        <div
          className="
            fixed top-6 right-6 
            z-[100000]
            px-4 py-4
            rounded-xl
            shadow-xl
            text-white text-sm
            border
            w-full max-w-sm
            animate-slide-in
            bg-red-500 border-red-600
          "
          style={{
            position: "fixed",
            inset: "auto",
            top: "30px",
            right: "20px",
            maxWidth: "300px",
            pointerEvents: "auto",
          }}
        >
          {/* Header */}
          <div className="font-bold mb-3 border-b border-white/40 pb-2">
            Lead CSV Import Failed — {leadCSVMessage.length} item(s) could not be processed
          </div>

          {/* Scrollable list */}
          <div className="max-h-60 overflow-y-auto pr-2 space-y-3">
            {leadCSVMessage.map((item, index) => {
              const identifier =
                item.fullName || item.email || item.phoneNumber || `Row #${index + 1}`;

              return (
                <div key={index} className="p-3 bg-white/10 rounded-lg">
                  <p className="font-semibold text-white/90 truncate">
                    {identifier}
                  </p>

                  {item.phoneNumber && (
                    <p className="text-xs text-white/70 mt-1">
                      <span className="font-medium">Phone:</span>{" "}
                      {item.phoneNumber}
                    </p>
                  )}

                  {item.company && item.company !== "Unknown" && (
                    <p className="text-xs text-white/70">
                      <span className="font-medium">Company:</span>{" "}
                      {item.company}
                    </p>
                  )}

                  {item.note && (
                    <p className="mt-2 text-xs text-yellow-200 italic">
                      Reason: {item.note}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <p className="text-white/80 mt-4 text-xs pt-2 border-t border-white/40">
            Please review the items above and correct them in your CSV file before trying again.
          </p>
        </div>
      )}
    </NotificationContext.Provider>
  );
};