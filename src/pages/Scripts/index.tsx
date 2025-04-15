import Header from "@/components/shared/header";
import RootLayout from "@/components/shared/rootLayout";
import { useSearchParams } from "react-router-dom";
import React from "react";
// import { Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/shared/glassCard";
import { generateRandomScript } from "@/utils/onboarding";
import { useAppSelector } from "@/hooks/useRedux";
import { getTitlesData } from "@/utils/feature/titles/titles.slice";
import { IGeneratedTopic } from "@/types/components/dashboard";
import { FileText } from "lucide-react";

const scripts = (sampleTopics: IGeneratedTopic[]) =>
  sampleTopics?.map((topic) => ({
    ...topic,
    script: generateRandomScript(topic.title),
  }));
const ScriptPage = () => {
  const [urlSearchParams] = useSearchParams();
  const titles = useAppSelector(getTitlesData);
  const scriptId = urlSearchParams.get("scriptId") || "0";
  console.log(scriptId);
  return (
    <RootLayout>
      <div className="w-[90%] mx-auto pt-4 pb-20">
        <Header title={"Script"} />
        {/* <div className="flex">
          <Button className="ml-auto" variant={"outline"}>
            <Download className="mr-2" />
            Download Script
          </Button>
        </div> */}

        <div className="grid gap-6 sm:grid-cols-2 md:grid-rows-3">
          {scripts((titles ?? [])?.slice(-5))?.map((item, index) => (
            <GlassCard
              key={index}
              className=" flex justify-between flex-wrap gap-4 items-center border-l- border-l--primary"
            >
              <div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-gray-600 text-xs">
                  created on: {item.createdAt}
                </p>
                <p className="text-gray-600 line-clamp-4 mt-2">{item.script}</p>
              </div>
              <div className="w-full px-6">
                <Button
                  size={"sm"}
                  variant={"outline"}
                  className="hover:scale-110  w-full"
                  // onClick={() => navigate(`/script?scriptId=23543564`)}
                >
                  <FileText /> View{" "}
                </Button>
                {/* )} */}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </RootLayout>
  );
};

export default ScriptPage;
