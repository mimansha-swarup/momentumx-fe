import { useEffect } from "react";
import { Lightbulb, Loader2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DashboardCard, Greetings, ProjectList } from "@/components/dashboard";
import { DASHBOARD_CARD } from "@/constants/dashboard";
import Header from "@/components/shared/header";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { currentUser } from "@/utils/feature/user/user.slice";
import { listProjects } from "@/utils/feature/videoProject/videoProject.thunk";
import {
  selectProjects,
  selectProjectsLoaded,
  selectError,
} from "@/utils/feature/videoProject/videoProject.slice";

const Dashboard = () => {
  // The user/profile is loaded once by the Firebase auth listener (useAuth) — do
  // NOT refetch it here (getUser's pending flips user.isLoading, which the route
  // guard reacts to → mount/unmount loop). Projects are safe to fetch here.
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { stats = { topics: 0, scripts: 0, credits: 0 } } =
    useAppSelector(currentUser) ?? {};
  const projects = useAppSelector(selectProjects);
  const hasLoaded = useAppSelector(selectProjectsLoaded);
  const error = useAppSelector(selectError);

  // Own the initial project fetch so the adaptive landing can branch on project
  // count (§5.4). ProjectList skips its own fetch when projects are already loaded.
  useEffect(() => {
    if (!hasLoaded) dispatch(listProjects());
  }, [dispatch, hasLoaded]);

  if (!hasLoaded) {
    return (
      <div className="md:w-[90%] mx-auto pb-20">
        <Header title="Dashboard" />
        <div
          className="flex items-center justify-center py-24"
          role="status"
          aria-label="Loading dashboard"
        >
          <Loader2
            className="size-6 motion-safe:animate-spin text-muted-foreground"
            aria-hidden="true"
          />
        </div>
      </div>
    );
  }

  // Adaptive landing (product doc §5.4): no projects → Idea door front-and-center,
  // not a wall of zero-value stats. A failed fetch also yields 0 projects — guard
  // on !error so a returning user isn't shown the new-user hero; the normal branch's
  // ProjectList surfaces the error + retry instead.
  if (projects.length === 0 && !error) {
    return (
      <div className="md:w-[90%] mx-auto pb-20">
        <Header title="Dashboard" />
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="icon-container mb-4">
            <Lightbulb className="size-6" />
          </div>
          <h2 className="text-heading-xl mb-2">
            <span className="gradient-text">Let&apos;s make your first video</span>
          </h2>
          <p className="text-label max-w-md mb-6">
            Start with an idea — we&apos;ll analyze trends in your niche and
            suggest concepts tailored to your channel.
          </p>
          <Button
            className="btn-primary-glow"
            onClick={() => navigate("/app/research")}
          >
            <Sparkles className="size-4" /> Generate your first idea
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="md:w-[90%] mx-auto pb-20">
      <Header title={"Dashboard"} />

      <Greetings />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 md:gap-6 mb-12">
        {DASHBOARD_CARD(
          (stats?.topics ?? 0).toString(),
          (stats?.scripts ?? 0).toString(),
          stats?.credits?.toString() ?? "FREE",
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
        <ProjectList />
      </div>
    </div>
  );
};

export default Dashboard;
