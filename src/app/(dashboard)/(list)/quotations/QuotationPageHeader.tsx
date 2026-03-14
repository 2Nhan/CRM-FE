const HEX_BLUE = "#3B82F6";

const QuotationPageHeader = () => {
  return (
    <div
      className="
        w-full h-[100px]
        flex items-center justify-between
        px-5 shadow-md
        rounded-xl
        bg-white
        border
      "
      style={{ borderColor: `${HEX_BLUE}20` }}
    >
      {/* LEFT: TITLE */}
      <div className="flex flex-col justify-center">
        <span className="text-[20px] font-semibold text-gray-800">
          Quotation List
        </span>
        <span className="text-[12px] text-gray-500">
          View and manage all listed quotations easily
        </span>
      </div>
    </div>
  );
};

export default QuotationPageHeader;
