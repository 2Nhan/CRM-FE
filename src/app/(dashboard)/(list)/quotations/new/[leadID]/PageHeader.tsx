import FetchingLoadingStatus from "@/components/FetchingLoadingStatus";

interface Props {
  validToSendEmail: boolean;
  saveQuotationLoading: boolean;
  title?: string;
  onChange?: (newTitle: string) => void;
  handleSaveQuotationToggle: () => void;
}

const PageHeader = ({
  title = "New quotation",
  onChange,
  validToSendEmail,
  handleSaveQuotationToggle,
  saveQuotationLoading,
}: Props) => {
  const isDisabled = !validToSendEmail || saveQuotationLoading;

  return (
    <div className="p-2 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 bg-white">
        <div className="flex items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={title}
              placeholder="New quotation"
              onChange={(e) => onChange?.(e.target.value)}
              className="text-lg font-semibold text-gray-800 bg-transparent outline-none min-w-[200px] max-w-[400px]"
            />

            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
              Draft
            </span>
          </div>

          {/* RIGHT */}
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm">
              Cancel
            </button>

            {saveQuotationLoading ? (
              <FetchingLoadingStatus loading color="blue" size={8} />
            ) : (
              <button
                onClick={handleSaveQuotationToggle}
                disabled={isDisabled}
                aria-disabled={isDisabled}
                className={`px-4 py-2 border rounded-lg text-sm flex items-center gap-1
                  ${
                    isDisabled
                      ? "border-gray-300 text-gray-400 cursor-not-allowed"
                      : "border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-500"
                  }`}
              >
                Save
              </button>
            )}

            {/* <button
              disabled={!validToSendEmail}
              aria-disabled={!validToSendEmail}
              className={`px-4 py-2 rounded-lg text-sm text-white
                ${
                  validToSendEmail
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
            >
              Send Email
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
