import React, { useState } from "react";
import { onboardingConfig } from "@/constants/onboarding";
import { Button } from "../ui/button";
import { IUserDetailsProps } from "@/types/components/profile";
import { renderUserForm } from "@/utils/onboarding";
import useUserProfile from "@/hooks/useUserProfile";
import { LoaderCircle, PlusCircle } from "lucide-react";
import { onboardingService } from "@/service/onboarding";

const inputList = [...onboardingConfig];
const multipleTextInput = inputList.pop();

const onboardingServiceInstance = new onboardingService();

const UserSettings: React.FC<IUserDetailsProps> = ({ user }) => {
  const {
    handleInputChange,
    removeCompetitors,
    addCompetitors,
    validate,
    formData: userSettings,
    errors: error,
  } = useUserProfile(user);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    const isValid = validate(onboardingConfig);
    if (!isValid) {
      return;
    }
    setIsLoading(true);
    await onboardingServiceInstance.saveOnboardingData(userSettings);
    setIsLoading(false);
  };

  return (
    <div>
      <div className="grid gap-6  md:grid-cols-2 items-start">
        {inputList?.map((record) =>
          renderUserForm({
            ...record,
            onChange: handleInputChange(record.id),
            removeMultiValue: removeCompetitors,
            value: userSettings[record.id],
            error: error[record.id],
          })
        )}
        <div className="col-span-2 width-1/2">
          {multipleTextInput?.inputType === "multi-text" &&
            renderUserForm({
              ...multipleTextInput,
              onChange: handleInputChange(multipleTextInput.id),
              removeMultiValue: removeCompetitors,
              value: userSettings[multipleTextInput.id],
              error: error[multipleTextInput.id],
            })}
          <Button
            variant="outline"
            className="w-1/2 min-w-fit"
            onClick={addCompetitors}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Another Competitor
          </Button>
        </div>
      </div>
      <Button
        className="w-full mt-8"
        disabled={isLoading}
        onClick={handleSubmit}
      >
        {isLoading && <LoaderCircle className="animate-spin" />}
        Update Profile
      </Button>
    </div>
  );
};

export default UserSettings;
