import { onboardingConfig } from "@/constants/onboarding";
import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { IUserDetailsProps } from "@/types/components/profile";
import { OnboardingConfigType } from "@/types/components/onboarding";
import { validateStep } from "@/utils/onboarding";
import { IUserProfile } from "@/types/feature/user";
import { OnboardingForm } from "@/types/components/login";

const inputList = [...onboardingConfig];
const multipleTextInput = inputList.pop();

const getInitialState = (user: IUserProfile | null) => ({
  website: user?.website || "",
  brandName: user?.brandName || "",
  niche: user?.niche || "",
  competitors: user?.competitors || [""],
  targetAudience: user?.targetAudience || "",
  userName: user?.userName || "",
});
const UserSettings: React.FC<IUserDetailsProps> = ({ user }) => {
  const [userSettings, setUserSettings] = useState(getInitialState(user));
  const [error, setError] = useState({});

  const handleChange =
    (fieldName: string) =>
    (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
      setUserSettings((prev) => {
        if (
          fieldName === "competitors" &&
          Number.isInteger(index) &&
          index !== undefined
        ) {
          const newCompetitors = [...prev.competitors];
          newCompetitors[index] = e.target.value;
          return { ...prev, competitors: newCompetitors };
        }
        return { ...prev, [fieldName]: e.target.value };
      });
    };

  const handleSubmit = () => {
    const validList = onboardingConfig?.map((val) =>
      validateStep(val, userSettings, error as OnboardingForm, setError)
    );
    const isValid = validList?.every((val) => val === true);
    if (!isValid) {
      console.log("Here", error);
      return;
    }
  };

  const renderInput = (
    inputData: OnboardingConfigType,
    value: string | string[],
    onChange: (e: React.ChangeEvent<HTMLInputElement>, index?: number) => void
  ) => {
    const { inputType, placeholder, id, label } = inputData;
    switch (inputType) {
      case "multi-text":
        if (!Array.isArray(value)) {
          return <></>;
        }
        return value?.map((multiValue, index) => {
          return (
            <div key={index} className="flex items-start space-x-2">
              <div className="flex-1 space-y-2 mb-4">
                <Label htmlFor={`competitor-${index}`}>
                  {index === 0
                    ? "YouTube Competitor"
                    : `YouTube Competitor ${index + 1}`}
                </Label>
                <Input
                  id={`competitor-${index}`}
                  placeholder={placeholder}
                  value={multiValue}
                  onChange={(e) => onChange(e, index)}
                  className="mt-4"
                />
                {/* {error[index] && (
                  <p className="text-sm text-red-500">{error[index]}</p>
                )} */}
              </div>
              {value.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="mt-8"
                  // onClick={removeMultiValue?.(index)}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              )}
            </div>
          );
        });
      case "text":
      default:
        return (
          <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <Input
              className="mt-4"
              id={id}
              name={id}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              // onKeyDown={onKeyPress}
            />
            {/* {error && <p className="text-sm text-red-500">{error}</p>} */}
          </div>
        );
    }
  };
  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-rows-3">
        {inputList?.map((record) =>
          renderInput(record, userSettings[record.id], handleChange(record.id))
        )}
      </div>
      {multipleTextInput?.inputType === "multi-text" &&
        renderInput(
          multipleTextInput,
          userSettings[multipleTextInput.id],
          handleChange(multipleTextInput.id)
        )}
      <Button className="w-full mt-8" onClick={handleSubmit}>
        Update Profile
      </Button>
    </div>
  );
};

export default UserSettings;
