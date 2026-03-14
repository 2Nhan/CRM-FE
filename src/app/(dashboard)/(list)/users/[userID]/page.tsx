"use client"
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Activity,
  Calendar,
  CheckCircle,
  Clock,
} from "lucide-react";
import { ApiResponseGetUserDetailType } from "@/lib/data.user";
import { useParams } from "next/navigation";
import useGetUserDetail from "@/fetching/user/getUserDetail";
import { useNotification } from "@/providers/NotificationProvider";
import Image from "next/image";
import { useUser } from "@/providers/UserProvider";
import FetchingLoadingStatus from "@/components/FetchingLoadingStatus";


const getStatusColor = (status: string) =>
  status === "DONE"
    ? "bg-green-100 text-green-800"
    : "bg-yellow-100 text-yellow-800";

const UserManagementPage = () => {
  const { loading: getUserDetailLoading, getUserDetail } = useGetUserDetail();
  const { showNotification } = useNotification();

  const { handleEnableUser, enableUserLoading, handleDisableUser, disableUserLoading} = useUser();

  const [userData, setUserData] = useState<ApiResponseGetUserDetailType>();
  const params = useParams();
  const userID = params.userID as string;

  const fetching = useCallback(async () => {
    if (!userID) { return; }
    try {
      const user = await getUserDetail(userID);
      setUserData(user);
    } catch (error) {
      showNotification(String(error), true);
    }
  }, []);

  const didFetch = useRef<boolean>(false);
  useEffect(() => {
    if (didFetch.current) { return; }
    didFetch.current = true;
    fetching();
  }, [userID]);


  if (!userData || getUserDetailLoading) {
    return (
      <FetchingLoadingStatus loading={true} fullScreen={true} color="#1890ff" />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex justify-between">
          <div className="flex items-center gap-4">
            <Image width={60} height={60} src={userData.avatarUrl || ""} alt="UserAvatar" className="rounded-full" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {userData.firstName} {userData.lastName}
              </h1>
              <p className="text-gray-500">@{userData.username}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {userData.roleName}
              </span>
            </div>
          </div>
          <div>
            { 
              disableUserLoading ? 
                  <FetchingLoadingStatus loading={disableUserLoading} size={20} color="red"/>
              :
              !userData.deleted ? (
                <button
                  onClick={() =>  {
                    const action = async () => {
                      const success = await handleDisableUser(userData.id);
                      if (success){
                        setUserData(prev => prev ? { ...prev, deleted: true } : prev);
                      }
                    }
                    action();
                  }}
                  className="
                    flex items-center justify-center gap-2
                    px-4 py-2
                    rounded-lg
                    bg-red-500
                    text-white
                    text-sm font-medium
                    border border-red-300
                    shadow-sm
                  "
                >
                  Disabled
                </button>
              ) : (
                enableUserLoading ? 
                  <FetchingLoadingStatus loading={enableUserLoading} size={20} color="green"/>
                :
                <button
                  onClick={() =>  {
                    const action = async () => {
                      const success = await handleEnableUser(userData.id);
                      if (success){
                        setUserData(prev => prev ? { ...prev, deleted: false } : prev);
                      }
                    }
                    action();
                  }}
                  className="
                    flex items-center justify-center gap-2
                    px-4 py-2
                    rounded-lg
                    bg-green-500
                    text-white
                    text-sm font-medium
                    border border-green-300
                    shadow-sm
                  "
                >
                  Active
                </button>
              )
            }
          </div>

        </div>

        {/* User Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <User size={22} />
            User Information
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">First Name</label>
              <p className="font-medium">{userData.firstName}</p>
            </div>

            <div>
              <label className="text-sm text-gray-600">Last Name</label>
              <p className="font-medium">{userData.lastName}</p>
            </div>

            <div>
              <label className="text-sm text-gray-600 flex items-center gap-1">
                <Mail size={14} /> Email
              </label>
              <p className="font-medium">{userData.email}</p>
            </div>

            <div>
              <label className="text-sm text-gray-600 flex items-center gap-1">
                <Phone size={14} /> Phone
              </label>
              <p className="font-medium">{userData.phoneNumber}</p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Briefcase size={22} />
            Statistics
          </h2>

          <div className="grid grid-cols-3 gap-4">
            {Object.entries(userData.statistics).map(([key, value]) => (
              <div
                key={key}
                className="bg-blue-50 p-4 rounded-lg text-center"
              >
                <p className="text-sm text-gray-600">{key}</p>
                <p className="text-2xl font-bold text-blue-600">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Activities */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Activity size={22} />
            Recent Activities
          </h2>

          <div className="space-y-4">
            {userData.activities.map((activity) => (
              <div
                key={activity.id}
                className="border rounded-lg p-4 hover:shadow transition"
              >
                <div className="flex justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{activity.type}</h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                          activity.status
                        )}`}
                      >
                        {activity.status}
                      </span>
                    </div>

                    <p className="text-gray-600">{activity.content}</p>

                    <div className="text-sm text-gray-500 flex gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <Briefcase size={14} />
                        {activity.leadName} - {activity.leadCompany}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {activity.validUntil}
                      </span>
                    </div>
                  </div>

                  {activity.completed ? (
                    <CheckCircle className="text-green-500" />
                  ) : (
                    <Clock className="text-yellow-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;
