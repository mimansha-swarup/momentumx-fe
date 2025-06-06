import Header from "@/components/shared/header";
import RootLayout from "@/components/shared/rootLayout";
// import { useSearchParams } from "react-router-dom";
// import React from "react";
// import { Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/shared/glassCard";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { FileText } from "lucide-react";
import EmptyState from "@/components/shared/emptyState";
import { useEffect } from "react";
import { rootScripts } from "@/utils/feature/scripts/script.slice";
import { retrieveScripts } from "@/utils/feature/scripts/script.thunk";
import { useNavigate } from "react-router-dom";
import { stripMarkdown } from "@/utils/scripts";

const ScriptPage = () => {
  const navigate = useNavigate();
  const { data: scripts } = useAppSelector(rootScripts);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!scripts || !scripts?.length) {
      dispatch(retrieveScripts());
    }
  }, []);

  return (
    <RootLayout>
      <div className="md:w-[90%] mx-auto pt-4 pb-20">
        <Header title={"Script"} />
        {/* <div className="flex">
          <Button className="ml-auto" variant={"outline"}>
            <Download className="mr-2" />
            Download Script
          </Button>
        </div> */}

        {!scripts?.length && (
          <EmptyState
            description="No generated content available"
            className="mt-4"
          />
        )}

        <div className="grid gap-6 sm:grid-cols-2 md:grid-rows-3">
          {scripts?.map((item) => (
            <GlassCard
              key={item.id}
              className=" flex justify-between flex-wrap gap-4 items-center border-l- border-l--primary"
            >
              <div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-gray-600 text-xs">
                  created on: {item.createdAt}
                </p>
                <p className="text-gray-600 line-clamp-4 mt-2">
                  {stripMarkdown(item.script || "")}
                </p>
              </div>
              <div className="w-full px-6">
                <Button
                  size={"sm"}
                  variant={"outline"}
                  className="hover:scale-110  w-full"
                  onClick={() => navigate(`/app/script/${item.id}`)}
                >
                  <FileText /> View{" "}
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </RootLayout>
  );
};

export default ScriptPage;
