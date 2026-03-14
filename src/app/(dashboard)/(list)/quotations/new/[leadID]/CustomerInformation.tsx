
interface Props {
  leadDetailInfo: any,
  quotation: any,
  setQuotation: React.Dispatch<React.SetStateAction<any>>,
}
const CustomerInformation = ({leadDetailInfo, quotation, setQuotation}: Props) => {
  return (
     <div className="max-w-7xl mx-auto px-2 py-2">
        <div className="bg-white rounded-lg shadow-sm">
          {/* CUSTOMER INFO */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-2 gap-6">
              {/* CUSTOMER */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer ID
                </label>
                <input
                  type="text"
                  value={leadDetailInfo?.leadID || "loading..."}
                  className="
                    w-full px-4 py-2
                    text-sm
                    border border-gray-300 rounded-lg
                    focus:ring-2 focus:ring-purple-500 focus:border-transparent
                  "
                  placeholder="Customer ID"
                />
              </div>

              {/* SALES */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={leadDetailInfo?.name || "Loading..."}
                  className="
                    w-full px-4 py-2
                    border border-gray-300 rounded-lg
                    text-sm
                    focus:ring-2 focus:ring-purple-500 focus:border-transparent
                  "
                  placeholder="Customer name..."
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={leadDetailInfo?.email || "Loading..."}
                  className="
                    w-full px-4 py-2
                    border border-gray-300 rounded-lg
                    text-sm
                    focus:ring-2 focus:ring-purple-500 focus:border-transparent
                  "
                  placeholder=""
                />
              </div>

              {/* PHONE */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={leadDetailInfo?.phone || "Loading..."}
                  className="
                    w-full px-4 py-2
                    border border-gray-300 rounded-lg
                    text-sm
                    focus:ring-2 focus:ring-purple-500 focus:border-transparent
                  "
                  placeholder=""
                />
              </div>

              {/* ADDRESS */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  rows={2}
                  value={quotation.content}
                  onChange={(e) => setQuotation((prev: any) => ({ ...prev, content: e.target.value }))}
                  className="
                    w-full px-4 py-2
                    text-sm
                    border border-gray-300 rounded-lg
                    focus:ring-2 focus:ring-purple-500 focus:border-transparent
                  "
                  placeholder="Type a quotation content here..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default CustomerInformation