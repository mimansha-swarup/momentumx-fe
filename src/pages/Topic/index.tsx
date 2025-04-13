import Header from "@/components/shared/header";
import RootLayout from "@/components/shared/rootLayout";
import React from "react";

const TitlePage = () => {
  return (
    <RootLayout>
      <div className="w-[90%] mx-auto pt-4 pb-20">
        <Header title={"Titles"} />
      </div>
    </RootLayout>
  );
};

export default TitlePage;
