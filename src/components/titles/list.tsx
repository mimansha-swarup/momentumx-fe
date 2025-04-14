import React from "react";
import GeneratedContent from "../dashboard/generatedContent";
import { sampleTopics } from "@/pages/Dashboard";

const TitleList = () => {
  console.log("Hello World");
  // GeneratedConten
  return (
    <div>
      <div className="flex flex-col gap-6">
        <GeneratedContent
          heading="April 15, 2024"
          list={sampleTopics}
          headingClassName="text-lg font-medium text-gray-600 dark:text-gray-300"
        />
        <GeneratedContent
          heading="April 15, 2024"
          list={sampleTopics}
          headingClassName="text-lg font-medium text-gray-600 dark:text-gray-300"
        />
      </div>
    </div>
  );
};

export default TitleList;
