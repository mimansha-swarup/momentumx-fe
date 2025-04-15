import { Button } from "@/components/ui/button";
import { IOnboardingFormProps } from "@/types/components/login";
import { PlusCircle } from "lucide-react";
import { FC } from "react";
import { renderUserForm } from "@/utils/onboarding";

const OnboardingForm: FC<IOnboardingFormProps> = ({
  addMultiValue,
  ...restProps
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">{renderUserForm(restProps)}</div>
      {addMultiValue && (
        <Button variant="outline" className="w-full" onClick={addMultiValue}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Another Competitor
        </Button>
      )}
    </div>
  );
};

export default OnboardingForm;
