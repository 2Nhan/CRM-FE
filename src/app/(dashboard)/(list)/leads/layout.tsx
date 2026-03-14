"use client";

import { LeadStageColumnProvider } from "@/providers/LeadStageColumnProvider";
import { LeadDetailSelectProvider } from "@/providers/LeadDetailSelectProvider";
import { LeadUploadCSVProvider } from "@/providers/leads/LeadUpLoadCSVPrivider";

export default function LeadsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LeadStageColumnProvider>
      <LeadDetailSelectProvider>
        <LeadUploadCSVProvider>
          {children}
        </LeadUploadCSVProvider>
      </LeadDetailSelectProvider>
    </LeadStageColumnProvider>
  );
}
