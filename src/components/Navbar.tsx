"use client"
import Image from "next/image";
import { role } from "@/lib/data";
import { useAuthentication } from "@/providers/AuthenticationProvider";

const newAnnouncement = [1, 2, 3, 4];

const Navbar = () => {
  const {userInfo} = useAuthentication();

  if (!userInfo){
    return;
  }

  return (
    <div className="border-none flex items-center p-4 bg-transparent">
      {/* Search bar */}

      {/* personal information side */}
      <div className="flex items-center gap-6 justify-end w-full">
        {/* Message icon */}
        <div className="rounded-full w-7 h-7 flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-110 hover:rotate-6">
          <Image
            src="/message.png"
            alt="message-icon"
            width={20}
            height={20}
          />
        </div>

        {/* Announcement icon with badge */}
        <div className="rounded-full w-7 h-7 flex items-center justify-center relative cursor-pointer transition-transform duration-300 hover:scale-110 hover:rotate-6">
          <Image
            src="/announcement.png"
            alt="announcement-icon"
            width={20}
            height={20}
          />
          {newAnnouncement.length > 0 && <div className="text-xs absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full animate-bounce">
            {newAnnouncement.length}
          </div>}
        </div>

        {/* User info */}
        <div className="flex flex-col text-right">
          <span className="text-xs leading-3 font-medium">
            {userInfo.data?.fullName}
          </span>
          <span className="text-[12px] text-gray-500">{userInfo.data?.role}</span>
        </div>

        {/* Avatar */}
        <div className="relative">
          <Image
            src="/avatar.png"
            width={36}
            height={36}
            alt="avatar-image"
            className="rounded-full cursor-pointer transition-transform duration-300 hover:scale-110 hover:shadow-md hover:shadow-purple-200 animate-pulse"
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
