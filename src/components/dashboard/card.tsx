import  { FC } from "react";
import GlassCard from "../shared/glassCard";
import { IDashboardCard } from "@/types/components/dashboard";

const DashboardCard: FC<IDashboardCard> = ({ label, value, icon }) => {
  return (
    <GlassCard className="group hover-scale-sm">
      <div className="flex-row-gap">
        <div className="icon-container">{icon}</div>
        <div>
          <p className="text-label">{label}</p>
          <h2 className="text-heading-lg">{value}</h2>
        </div>
      </div>
    </GlassCard>
  );
};

export default DashboardCard;
