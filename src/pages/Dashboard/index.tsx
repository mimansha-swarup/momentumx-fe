import DashboardCard from "@/components/dashboard/card";
import GeneratedContent from "@/components/dashboard/generatedContent";
import Greetings from "@/components/dashboard/greetings";
import { DASHBOARD_CARD } from "@/constants/dashboard";
import Header from "@/components/shared/header";
import { useAppSelector } from "@/hooks/useRedux";
import { getTitlesData } from "@/utils/feature/titles/titles.slice";
import { currentUser } from "@/utils/feature/user/user.slice";

const Dashboard = () => {
  const titles = useAppSelector(getTitlesData);
  const { stats = { topics: 0, scripts: 0, credits: 0 } } =
    useAppSelector(currentUser) ?? {};

  const recentTitles = titles?.lists
    ? [...(titles?.lists ?? [])]?.slice(0, 5)
    : [];

  return (
    <div className="md:w-[90%] mx-auto pb-20">
      <Header title={"Dashboard"} />

      <Greetings />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 md:gap-6 mb-12">
        {DASHBOARD_CARD(
          (stats?.topics ?? 0).toString(),
          (stats?.scripts ?? 0).toString(),
          stats?.credits?.toString() ?? "FREE"
        )?.map((card, index) => (
          <div
            key={card.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <DashboardCard {...card} />
          </div>
        ))}
      </div>

      <div className="animate-fade-in" style={{ animationDelay: "300ms" }}>
        <GeneratedContent
          heading={"Recently Generated Titles"}
          list={recentTitles}
        />
      </div>
    </div>
  );
};

export default Dashboard;
