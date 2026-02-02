import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Accordion,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import onboardingConfig from "@/constants/onboarding/config.json";
import { IS_NEW_USER } from "@/constants/root";
import { SUBMIT_SUCCESS_DELAY_MS } from "@/constants/app";
import { useAppDispatch } from "@/hooks/useRedux";
import { onboardingService } from "@/service/onboarding";
import { getUser } from "@/utils/feature/user/user.thunk";
import { getValueByPath, renderUserForm } from "@/utils/onboarding";
import { Loader } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IOnboardingPayload, QuestionBase } from "@/types/components/onboarding";

interface ReviewProps {
  formState: IOnboardingPayload;
  updateField: (path: string, value: unknown) => void;
  errors: Record<string, string>;
}

const onboardingServiceInstance = new onboardingService();

const Review = ({ formState, updateField, errors }: ReviewProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const disptach = useAppDispatch();

  const onSubmitClick = async () => {
    setIsLoading(true);
    // const { purpose, ...payload } = formState;
    // payload.targetAudience = purpose[0];
    // payload.purpose = purpose[1];

    const payload = { ...formState, isOnboardingCompleted: true };
    const res = await onboardingServiceInstance.saveOnboardingData(payload);
    if (res.success) {
      setTimeout(async () => {
        localStorage.removeItem(IS_NEW_USER);
        await disptach(getUser());
        navigate("/app/dashboard");
        setIsLoading(false);
      }, SUBMIT_SUCCESS_DELAY_MS);
    }
  };
  return (
    <div className="p-6 w-full ">
      <h1 className="text-2xl font-bold mb-6">Review Screen</h1>
      <Accordion
        type="single"
        collapsible
        className="w-full bg-white p-2 rounded-lg  px-5 py-4 "
        defaultValue="item-1"
      >
        {onboardingConfig.sections?.map((section) => (
          <AccordionItem key={section.id} id={section.id} value={section.id}>
            <AccordionTrigger className=" text-lg font-semibold text-gray-800">
              {section.title}
            </AccordionTrigger>
            <AccordionContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {section?.questions?.map((q) => {
                const { helperText: _helperText, ...restQus } = q;
                return renderUserForm({
                  question: restQus as QuestionBase,
                  value: getValueByPath(formState, q.path),
                  formState,
                  updateField,
                  errors,
                });
              })}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="flex justify-end mt-4">
        <Button size={"lg"} onClick={onSubmitClick} disabled={isLoading}>
          {isLoading ? <Loader className="spin" /> : "Submit"}
        </Button>
      </div>
    </div>
  );
};

export default Review;
