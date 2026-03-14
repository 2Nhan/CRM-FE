"use client"
import React, { useEffect, useState } from 'react';
import { Search, Users, UserPlus, User } from 'lucide-react';
import PageNavigationComponent from '@/components/PageNavigationComponent';
import Image  from 'next/image';
import { useCustomer } from '@/providers/CustomerProvider';
import { useRouter } from 'next/navigation';
import FetchingLoadingStatus from '@/components/FetchingLoadingStatus';


  
const CustomerManagement = () => {
  // CUSTOMER PROVIDER
  const { customers, getAllCustomerLoading, totalPages, 
          getCustomersWithPageNo, searchTerm, setSearchTerm,
          handleSearchCustomer
        } = useCustomer();

  const router = useRouter();

  // STATE
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  /**
   * page number toggle - handle event if user change page number
   */
  useEffect( () => {
    getCustomersWithPageNo(currentPage);
  }, [currentPage]);

  if (getAllCustomerLoading){
    return (
      <FetchingLoadingStatus loading={true} fullScreen={true} color="#1890ff" />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Customers */}
        <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between h-40">
          <div>
            <p className="text-gray-500 text-sm font-medium mb-2">Total Customers</p>
            <p className="text-4xl font-bold text-gray-900">1,247</p>
            <p className="text-green-600 text-sm mt-2">+12% from last month</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-full">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        {/* New Customers This Month */}
        <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between h-40">
          <div>
            <p className="text-gray-500 text-sm font-medium mb-2">New This Month</p>
            <p className="text-4xl font-bold text-gray-900">143</p>
            <p className="text-green-600 text-sm mt-2">+8% from last month</p>
          </div>
          <div className="bg-green-100 p-4 rounded-full">
            <UserPlus className="w-8 h-8 text-green-600" />
          </div>
        </div>

        {/* Your Customers */}
        <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between h-40">
          <div>
            <p className="text-gray-500 text-sm font-medium mb-2">Your Customers</p>
            <p className="text-4xl font-bold text-gray-900">89</p>
            <p className="text-blue-600 text-sm mt-2">Assigned to you</p>
          </div>
          <div className="bg-purple-100 p-4 rounded-full">
            <User className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            onKeyDown={(e)=>{
              if(e.key === "Enter"){
                handleSearchCustomer(currentPage);
              }
            }}
            type="text"
            placeholder="Search by name, email, or company..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers && customers.map((customer) => (
                <tr key={customer.id} 
                    onClick={() => {
                      router.push(`/customers/${customer.id}`);
                      console.log("hello")
                    }}
                    className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Image
                        width={10}
                        height={10}
                        src={customer.avatarUrl || '/avatar.png'}
                        alt={customer.fullName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {customer.fullName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{customer.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{customer.phoneNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{customer.company}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < customer.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {customer.assignTo.firstName} {customer.assignTo.lastName}
                    </div>
                    <div className="text-xs text-gray-500">{customer.assignTo.email}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="h-[90px] flex items-center justify-center bg-white py-15">
            <PageNavigationComponent
              totalPages={totalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
    </div>
  );
};

export default CustomerManagement;