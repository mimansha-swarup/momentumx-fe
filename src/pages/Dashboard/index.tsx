import DashboardCard from "@/components/dashboard/card";
import RootLayout from "@/components/shared/rootLayout";
import GeneratedContent from "@/components/dashboard/generatedContent";
import Greetings from "@/components/dashboard/greetings";
import { DASHBOARD_CARD } from "@/constants/dashboard";

const sampleTopics = [
  {
    id: "1",
    title: "Productivity Mastery",
    description:
      "A comprehensive course on improving productivity through time blocking, note-taking systems, and building effective routines.",
    created: "2023-10-15",
  },
  {
    id: "2",
    title: "Digital Note-Taking Systems",
    description:
      "Learn how to create a comprehensive note-taking system that helps you capture and organize information effectively.",
    created: "2023-09-28",
  },
  {
    id: "3",
    title: "Building a Second Brain",
    description:
      "Implement a personal knowledge management system to store and retrieve important information and boost your creativity.",
    created: "2023-08-12",
  },
];
const Dashboard = () => {
  return (
    <RootLayout>
      <div className="w-[90%] mx-auto pt-4 pb-20">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
        </div>

        <Greetings />

        <div className=" animate-fade-in grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 md:gap-6 mb-12 ">
          {DASHBOARD_CARD?.map((card) => (
            <DashboardCard key={card.id} {...card} />
          ))}
        </div>

        <div>
          <GeneratedContent
            heading={"Recently Generated"}
            list={sampleTopics}
          />
        </div>
      </div>
    </RootLayout>
  );
};

export default Dashboard;
