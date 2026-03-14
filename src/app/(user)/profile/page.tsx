import FetchingLoadingStatus from "@/components/FetchingLoadingStatus";
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Shield,
  Edit,
  LogOut,
  Save,
  X
} from "lucide-react";
import Link from "next/link";
import useGetInfo from "@/fetching/profile/getInfo";
import { useCallback, useEffect, useState } from "react";
import { GetInfoResponse } from "@/lib/data.authentication";
import { useRouter } from "next/navigation";
import { useAuthentication } from "@/providers/AuthenticationProvider";
import useUpdateInfo from "@/fetching/profile/updateInfo";
import { useNotification } from "@/providers/NotificationProvider";
import { isValidEmail } from "@/util/emailValidation";
import { isValidPhoneNumber } from "@/util/phoneNumberValidation";
import UpLoadAvatar from "@/components/UpLoadAvatar";
import useUpdateInfoAvatar from "@/fetching/profile/updateInfoAvatar";


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const roleConvert = (role: string) => {
  if (role === "ADMIN") {
    return "Administrator"
  }
  if (role === "USER") {
    return "User"
  }
  return "Unidentified";
}

const Page = () => {
  const router = useRouter();

  const { loading: getInfoLoading, getInfo } = useGetInfo();
  const { loading: updateInfoLoading, updateInfo } = useUpdateInfo();
  const { loading: updateInfoAvatarLoading, updateInfoAvatar} = useUpdateInfoAvatar();


  const { showNotification } = useNotification();
  const { userInfo: info } = useAuthentication();

  const [userInfo, setUserInfo] = useState<GetInfoResponse | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<any>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [updateAvatar, setUpdateAvatar] = useState<string>("");
  const [avatarFile, setAvatarFile] = useState<File>();

  const getUserInfo = useCallback(async () => {
    try {
      const info = await getInfo();
      setUserInfo(info);
      setEditedData({
        firstName: info.firstName,
        lastName: info.lastName,
        email: info.email,
        phoneNumber: info.phoneNumber,
        address: info.address,
        username: info.username,
      });
      setHasChanges(false);
    } catch {
      router.push("/");
    }
  }, []);

  const checkForChanges = useCallback(() => {
    if (!userInfo) return false;

    return (
      editedData.firstName !== userInfo.firstName ||
      editedData.lastName !== userInfo.lastName ||
      editedData.email !== userInfo.email ||
      editedData.phoneNumber !== userInfo.phoneNumber ||
      editedData.address !== userInfo.address ||
      editedData.username !== userInfo.username
    );
  }, [editedData, userInfo]);

  useEffect(() => {
    getUserInfo()
  }, []);

  useEffect(() => {
    if (userInfo) {
      setHasChanges(checkForChanges());
      if (updateAvatar){
        setHasChanges(true);
      }
    }
  }, [editedData, userInfo, checkForChanges, avatarFile, updateAvatar]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({
      firstName: userInfo?.firstName,
      lastName: userInfo?.lastName,
      email: userInfo?.email,
      phoneNumber: userInfo?.phoneNumber,
      username: userInfo?.username,
      address: userInfo?.address,
    });
    setUpdateAvatar("");
    setAvatarFile(undefined);
    setHasChanges(false);
  };

  const handleSave = async () => {
    if (!userInfo || !hasChanges) return;

    const changedData: any = {};

    if (editedData.firstName !== userInfo.firstName) changedData.firstName = editedData.firstName;
    if (editedData.lastName !== userInfo.lastName) changedData.lastName = editedData.lastName;
    if (editedData.email !== userInfo.email) changedData.email = editedData.email;
    if (editedData.phoneNumber !== userInfo.phoneNumber) changedData.phoneNumber = editedData.phoneNumber;
    if (editedData.address !== userInfo.address) changedData.address = editedData.address;
    if (editedData.username !== userInfo.username) changedData.username = editedData.username;

    if (changedData.email && !isValidEmail(changedData.email)) {
      showNotification("Your update email is not valid", true);
      return;
    }

    if (changedData.phoneNumber && !isValidPhoneNumber(changedData.phoneNumber)) {
      showNotification("Your update phone number is not valid", true);
      return;
    }

    if (avatarFile){
      try {
        const success = await updateInfoAvatar(avatarFile);

        if (success && !changedData){
          showNotification("Successfully update info avatar");
          return;
        }
      } catch (error) {
        showNotification(String(error), true);
      }
    }

    try {
      if (!changedData){ return;}
      const success = await updateInfo(changedData);

      if (success) {
        showNotification("Successfully update info");
        setUserInfo((prev: any) => ({
          ...prev,
          ...changedData
        }));

        setIsEditing(false);
        setHasChanges(false);
      }
    } catch (error) {
      showNotification(String(error), true);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  if (getInfoLoading && !userInfo) {
    return <FetchingLoadingStatus loading={true} fullScreen={true} color="#1890ff" />
  }

  return (
    <div className="min-h-screen bg-[#f4f7ff] text-gray-900">
      {/* ================= HEADER ================= */}
      <header className="bg-white/80 backdrop-blur-md shadow-md flex">
        <div className="flex items-center pl-4">
          <Link
            href="/sale-report"
            className="p-2 rounded-full hover:bg-gray-100 transition duration-150 ease-in-out text-gray-600 hover:text-[#1e88e5]"
            aria-label="Go to Dashboard"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
            </svg>
          </Link>
        </div>

        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-extrabold text-[#1e88e5]">
            Vera CRM
          </h1>

          <button className="flex items-center text-gray-600 hover:text-[#1e88e5] transition">
            <LogOut className="w-5 h-5 mr-1" />
            Logout
          </button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid lg:grid-cols-3 gap-8"
        >
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="flex justify-center mt-12">
              <UpLoadAvatar 
                setAvatar={setUpdateAvatar} 
                disabled={!isEditing}
                setAvatarFile={setAvatarFile} 
                avatar={updateAvatar ? updateAvatar : userInfo?.avatarUrl || ""} 
                width={80} 
                height={80}
              />
            </div>

            <h2 className="text-2xl font-bold mt-4 text-gray-800">
              {userInfo?.lastName} {userInfo?.firstName}
            </h2>

            <p className="text-[#1e88e5] font-medium mt-1">
              CRM {roleConvert(info?.data?.role || "")}
            </p>

            <p className="text-gray-600 text-sm mt-4">
              Passionate about building scalable CRM systems
              and improving customer experience.
            </p>

            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="mt-6 inline-flex items-center justify-center gap-2 bg-[#1e88e5] text-white px-6 py-2 rounded-full font-medium hover:bg-[#1565c0] transition shadow-md"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <div className="mt-6 flex gap-2 justify-center">
                <button
                  onClick={handleSave}
                  disabled={!hasChanges || updateInfoLoading}
                  className={`inline-flex items-center justify-center gap-2 px-6 py-2 rounded-full font-medium transition shadow-md ${hasChanges && !updateInfoLoading
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                  {updateInfoLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  className="inline-flex items-center justify-center gap-2 bg-gray-500 text-white px-6 py-2 rounded-full font-medium hover:bg-gray-600 transition shadow-md"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            )}
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 space-y-8"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <User className="w-5 h-5 mr-2 text-[#1e88e5]" />
                Personal Information
              </h3>

              <div className="grid md:grid-cols-2 gap-6 text-sm">
                {/* First Name */}
                <EditableInfoItem
                  icon={User}
                  label="First Name"
                  value={editedData.firstName}
                  isEditing={isEditing}
                  onChange={(value: any) => handleInputChange('firstName', value)}
                />

                {/* Last Name */}
                <EditableInfoItem
                  icon={User}
                  label="Last Name"
                  value={editedData.lastName}
                  isEditing={isEditing}
                  onChange={(value: any) => handleInputChange('lastName', value)}
                />

                {/* Email */}
                <EditableInfoItem
                  icon={Mail}
                  label="Email"
                  value={editedData.email || "update soon"}
                  isEditing={isEditing}
                  onChange={(value: any) => handleInputChange('email', value)}
                  type="email"
                />

                {/* Phone */}
                <EditableInfoItem
                  icon={Phone}
                  label="Phone"
                  value={editedData.phoneNumber || "update soon"}
                  isEditing={isEditing}
                  onChange={(value: any) => handleInputChange('phoneNumber', value)}
                  type="tel"
                />

                {/* Address */}
                <div className="md:col-span-2">
                  <EditableInfoItem
                    icon={MapPin}
                    label="Address"
                    value={editedData.address || "update soon"}
                    isEditing={isEditing}
                    onChange={(value: any) => handleInputChange('address', value)}
                  />
                </div>

                {/* Date of Birth - Non-editable */}
                <InfoItem icon={Calendar} label="Date of Birth" value={"update soon"} />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-[#1e88e5]" />
                Account Information
              </h3>

              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <InfoItem label="Username" value={userInfo?.username} />
                <InfoItem label="Role" value={roleConvert(info?.data?.role || "")} />
                <InfoItem label="Account Status" value={userInfo?.deleted ? "Disabled" : "Active"} />
                <InfoItem label="Created At" value={userInfo?.createdAt} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

const InfoItem = ({ icon: Icon, label, value }: any) => (
  <div className="flex items-start gap-3">
    {Icon && <Icon className="w-5 h-5 text-[#1e88e5] mt-0.5" />}
    <div>
      <p className="text-gray-500">{label}</p>
      <p className="font-medium text-gray-800">{value}</p>
    </div>
  </div>
);

const EditableInfoItem = ({
  icon: Icon,
  label,
  value,
  isEditing,
  onChange,
  type = "text"
}: any) => (
  <div className="flex items-start gap-3">
    {Icon && <Icon className="w-5 h-5 text-[#1e88e5] mt-0.5" />}
    <div className="flex-1">
      <p className="text-gray-500 mb-1">{label}</p>
      {isEditing ? (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e88e5] font-medium text-gray-800"
        />
      ) : (
        <p className="font-medium text-gray-800">{value}</p>
      )}
    </div>
  </div>
);

export default Page;