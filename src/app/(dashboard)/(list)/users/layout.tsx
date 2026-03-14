"use client";

import { UserProvider } from "@/providers/UserProvider";

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      {children}
    </UserProvider>
  );
}