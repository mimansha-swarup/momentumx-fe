import DashboardCard from "@/components/dashboard/card";
import RootLayout from "@/components/shared/rootLayout";
import GeneratedContent from "@/components/dashboard/generatedContent";
import Greetings from "@/components/dashboard/greetings";
import { DASHBOARD_CARD } from "@/constants/dashboard";
import Header from "@/components/shared/header";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { getTitlesData } from "@/utils/feature/titles/titles.slice";
import { retrieveTitles } from "@/utils/feature/titles/titles.thunk";
import { useEffect } from "react";

const Dashboard = () => {
  const titles = useAppSelector(getTitlesData);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!titles) {
      dispatch(retrieveTitles());
    }
  }, []);

  const recentTitles = titles ? [...titles]?.slice(-5) : [];
  return (
    <RootLayout>
      <div className="md:w-[90%] mx-auto pt-4 pb-20">
        <Header title={"Dashboard"} />

        <Greetings />

        <div className=" animate-fade-in grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 md:gap-6 mb-12 ">
          {DASHBOARD_CARD((titles?.length ?? 0).toString(), "0", "FREE")?.map(
            (card) => <DashboardCard key={card.id} {...card} />
          )}
        </div>

        <div>
          <GeneratedContent
            heading={"Recently Generated"}
            list={recentTitles}
          />
        </div>
      </div>
    </RootLayout>
  );
};

export default Dashboard;
