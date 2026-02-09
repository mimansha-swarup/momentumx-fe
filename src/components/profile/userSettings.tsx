import React, { useState } from "react";
import { Button } from "../ui/button";
import { IUserDetailsProps } from "@/types/components/profile";
import { LoaderCircle } from "lucide-react";

const UserSettings: React.FC<IUserDetailsProps> = () => {
  const [isLoading] = useState(false);

  // const handleSubmit = async () => {
  //   const isValid = validate(onboardingConfig);
  //   if (!isValid) {
  //     return;
  //   }
  //   setIsLoading(true);
  //   await onboardingServiceInstance.updateProfile(userSettings);
  //   setIsLoading(false);
  // };

  return (
    <div>
     {/* TODO:  Reimplement this part */}
      <Button
        className="w-full mt-8"
        disabled={isLoading}
        // onClick={handleSubmit}
      >
        {isLoading && <LoaderCircle className="animate-spin" />}
        Update Profile
      </Button>
    </div>
  );
};

export default UserSettings;
