import React, { FC } from "react";
import GlassCard from "../shared/glassCard";
import { IDashboardCard } from "@/types/components/dashboard";

const DashboardCard: FC<IDashboardCard> = ({ label, value, icon }) => {
  return (
    <GlassCard>
      <div className="flex gap-4 items-center">
        <div className="size-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-foreground">
          {icon}
        </div>
        <div>
          <p className=" text-gray-600 text-sm">{label}</p>
          <h2 className="text-2xl font-semibold">{value}</h2>
        </div>
      </div>
    </GlassCard>
  );
};

export default DashboardCard;
