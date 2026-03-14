"use client"

import FetchingLoadingStatus from "@/components/FetchingLoadingStatus";
import React, { useEffect, useState } from 'react';
import { Search, Users, UserPlus, User } from 'lucide-react';
import PageNavigationComponent from '@/components/PageNavigationComponent';
import Image from 'next/image';
import { useUser } from '@/providers/UserProvider';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle } from "lucide-react";

const Active = () => {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 text-green-700 border border-green-200">
      <CheckCircle size={16} />
      <span className="text-sm font-medium">Active</span>
    </div>
  );
};

const Disabled = () => {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
      <XCircle size={16} />
      <span className="text-sm font-medium">Disabled</span>
    </div>
  );
};

const UserManagement = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  // USER PROVIDER
  const { users, getListUserLoading, getUsers, getUsersWithPageNo,
    totalPage, setSearchTerm, searchTerm, handleSearchUser, userSummaryStatistic } = useUser();

  const router = useRouter();


  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    const getUserPageNo = async () => {
      getUsersWithPageNo(currentPage);
    }

    getUserPageNo();
  }, [currentPage]);

  if (getListUserLoading || !userSummaryStatistic) {
    return (
      <FetchingLoadingStatus loading={true} fullScreen={true} color="#1890ff" />
    )
  }

  // Filter users based on search term

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Users */}
        <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between h-40">
          <div>
            <p className="text-gray-500 text-sm font-medium mb-2">Total Users</p>
            <p className="text-4xl font-bold text-gray-900">{userSummaryStatistic.totalUsers || 0}</p>
            <p className="text-green-600 text-sm mt-2">Active users</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-full">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        {/* New Users This Month */}
        <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between h-40">
          <div>
            <p className="text-gray-500 text-sm font-medium mb-2">New This Month</p>
            <p className="text-4xl font-bold text-gray-900">
              {userSummaryStatistic.newThisMonth || 0}
            </p>
            <p className="text-green-600 text-sm mt-2">Recently joined</p>
          </div>
          <div className="bg-green-100 p-4 rounded-full">
            <UserPlus className="w-8 h-8 text-green-600" />
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between h-40">
          <div>
            <p className="text-gray-500 text-sm font-medium mb-2">Active Users</p>
            <p className="text-4xl font-bold text-gray-900">{userSummaryStatistic.activeUsers || 0}</p>
            <p className="text-blue-600 text-sm mt-2">Currently active</p>
          </div>
          <div className="bg-purple-100 p-4 rounded-full">
            <User className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchUser(currentPage);
              }
            }}
            type="text"
            placeholder={`Search by name, email, or username...`}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  STATUS
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users && users.map((user) => (
                <tr
                  onClick={() => {
                    router.push(`/users/${user.id}`)
                  }}
                  key={user.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Image
                        width={10}
                        height={10}
                        src={user.avatarUrl || '/avatar.png'}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.username}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.phoneNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {
                      user.deleted ? <Disabled /> : <Active />
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <PageNavigationComponent currentPage={currentPage} totalPages={totalPage} setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default UserManagement;