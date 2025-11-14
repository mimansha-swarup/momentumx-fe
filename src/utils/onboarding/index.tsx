import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { ONBOARDING_FORM_ID } from "@/constants/onboarding";
import { IOnboardingFormProps, OnboardingForm } from "@/types/components/login";
import {
  OnboardingConfigType,
  QuestionType,
} from "@/types/components/onboarding";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { errorStateType } from "@/hooks/useUserProfile";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const validateStep = (
  currentStep: OnboardingConfigType | OnboardingConfigType[],
  formData: OnboardingForm,
  errors: errorStateType,
  setErrors: (errors: errorStateType) => void
) => {
  const steps = Array.isArray(currentStep) ? currentStep : [currentStep];
  const newErrors = { ...errors };
  const isValid = true;

  const urlRegex =
    /^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/\S*)?$/;
  const youtubeRegex = /^https:\/\/www\.youtube\.com\/@[a-zA-Z0-9_-]+$/;

  // steps.forEach((step) => {
  //   const { isMandatory, id } = step;
  //   if (!isMandatory && !formData[id]) return;

  //   switch (id) {
  //     case ONBOARDING_FORM_ID.USER_NAME:
  //       newErrors.userName = !formData.userName
  //         ? "Channel url is required"
  //         : !youtubeRegex.test(formData.userName)
  //           ? "Please enter a valid YouTube Channel"
  //           : "";

  //       if (newErrors.userName) isValid = false;
  //       break;

  //     case ONBOARDING_FORM_ID.CHANNEL_PURPOSE:
  //       newErrors.purpose = formData.purpose?.map((blanks, idx) => {
  //         return !blanks ? `Please fill the blank  ${idx + 1}` : "";
  //       });

  //       if (newErrors.purpose?.some((val) => !!val)) isValid = false;
  //       break;

  //     case ONBOARDING_FORM_ID.WEBSITE:
  //       newErrors.website = !formData.website
  //         ? "Website URL is required"
  //         : !urlRegex.test(formData.website)
  //           ? "Please enter a valid website URL"
  //           : "";
  //       if (newErrors.website) isValid = false;
  //       break;

  //     case ONBOARDING_FORM_ID.NICHE:
  //       newErrors.niche = !formData.niche ? "Please select a niche" : "";
  //       if (newErrors.niche) isValid = false;
  //       break;

  //     case ONBOARDING_FORM_ID.COMPETITORS:
  //       newErrors.competitors = formData.competitors.map((competitor) => {
  //         const url =
  //           typeof competitor === "string" ? competitor : competitor.url;
  //         return !url
  //           ? ((isValid = false), "Competitor URL is required")
  //           : !youtubeRegex.test(url)
  //             ? ((isValid = false), "Please enter a valid YouTube URL")
  //             : "";
  //       });
  //       break;

  //     default:
  //       break;
  //   }
  // });

  console.log("newErrors: ", newErrors);
  setErrors(newErrors);
  return isValid;
};

// export const renderUserForm = ({
//   inputType,
//   placeholder,
//   label,
//   id,
//   value,
//   error,
//   onChange,
//   removeMultiValue,
//   onKeyPress = () => null,
//   valueFormatter,
//   className = "",
// }: IOnboardingFormProps) => {
//   const placeholderStr = typeof placeholder === "string" ? placeholder : "";
//   switch (inputType) {
//     case "multi-text":
//       if (!Array.isArray(value)) {
//         return <></>;
//       }
//       return value?.map((multiValue, index) => {
//         return (
//           <div key={index} className="flex items-start space-x-2">
//             <div className="flex-1 space-y-2 mb-4">
//               <div className="flex items-center justify-between">
//                 <Label htmlFor={`competitor-${index}`}>
//                   {index === 0
//                     ? "YouTube Competitor"
//                     : `YouTube Competitor ${index + 1}`}
//                 </Label>
//                 {value.length > 1 && (
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className=""
//                     onClick={removeMultiValue?.(index)}
//                   >
//                     <Trash2 className="h-5 w-5" />
//                   </Button>
//                 )}
//               </div>
//               <Input
//                 id={`competitor-${index}`}
//                 placeholder={placeholderStr}
//                 value={valueFormatter ? valueFormatter(multiValue) : multiValue}
//                 onChange={(e) => onChange(e, index)}
//                 className="mt-4"
//               />
//               {error[index] && (
//                 <p className="text-sm text-red-500">{error[index]}</p>
//               )}
//             </div>
//           </div>
//         );
//       });

//     case "fib": {
//       const mappedText = label.split("{blank}");
//       return (
//         <>
//           <div className="flex gap-1.5 flex-wrap items-end text-base ">
//             {mappedText?.map((text, idx) => (
//               <>
//                 <p className="inline-block">{text}</p>
//                 {mappedText.length - 1 !== idx && (
//                   <Input
//                     value={value[idx]}
//                     className=" inline-block w-[7.5rem] h-6 p-1.5"
//                     onChange={(e) => onChange(e, idx)}
//                     placeholder={placeholder[idx]}
//                   />
//                 )}
//               </>
//             ))}
//           </div>
//           {Array.isArray(error) &&
//             error?.map((err) => (
//               <p className="my-0 text-sm text-[12px] text-red-500">{err}</p>
//             ))}
//         </>
//       );
//     }
//     case "text":
//     default:
//       return (
//         <div className={cn("space-y-2", className)}>
//           <Label htmlFor={id}>{label}</Label>
//           <Input
//             className="mt-4"
//             id={id}
//             name={id}
//             placeholder={placeholderStr}
//             value={valueFormatter ? valueFormatter(value) : value}
//             onChange={onChange}
//             onKeyDown={onKeyPress}
//           />
//           {error && <p className="text-sm text-red-500">{error}</p>}
//         </div>
//       );
//   }
// };

const getValueByPath = (obj: Record<string, unknown>, path: string) => {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
};
export const renderUserForm = ({
  question,
  value,
  updateField,
  formState,
  errors,
}: {
  question: QuestionType;
  value: unknown;
  updateField: (path: string, value: unknown) => void;
  formState: any;
  errors: Record<string, string>;
}) => {
  const renderInput = () => {
    switch (question.type) {
      case "text":
        return (
          <Input
            type="text"
            value={value || ""}
            onChange={(e) => updateField(question.path, e.target.value)}
            placeholder={question.placeholder || ""}
            className="w-full border p-2 rounded-md"
            required={question.required}
          />
        );

      case "textarea":
        return (
          <Textarea
            value={value || ""}
            onChange={(e) => updateField(question.path, e.target.value)}
            className="w-full border p-2 rounded-md"
            rows={question.rows || 4}
            placeholder={question.placeholder || ""}
            required={question.required}
          />
        );

      case "radio":
        return (
          <RadioGroup
            className="gap-1.5"
            value={value}
            onValueChange={(e) => updateField(question.path, e)}
          >
            {question.options.map((opt: any) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 cursor-pointer"
              >
                <RadioGroupItem id={opt.value} value={opt.value} />
                <span>{opt.label}</span>
              </label>
            ))}
          </RadioGroup>
        );

      case "checkbox":
        return (
          <div className="space-y-1.5">
            {question.options.map((opt: any) => (
              <label key={opt.value} className="flex items-center gap-2">
                <Checkbox
                  checked={value?.includes(opt.value)}
                  onCheckedChange={(e) => {
                    console.log(e);
                    const newArr = e
                      ? [...(value || []), opt.value]
                      : (value || []).filter((v) => v !== opt.value);
                    updateField(question.path, newArr);
                  }}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        );

      case "dropdown":
        return (
          <Select
            value={value || ""}
            onValueChange={(e) => updateField(question.path, e)}
            required={question.required}
          >
            <SelectTrigger className="w-full border p-2 rounded-md">
              <SelectValue placeholder={question.placeholder || ""} />
            </SelectTrigger>
            <SelectContent>
              {question.options.map((opt: { value: string; label: string }) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      default:
        return null;
    }
  };

  // Helper to get subfield value

  return (
    <div key={question.id} className="mb-6">
      <label className="block font-medium text-gray-800 mb-2">
        {question.required && (
          <span className="text-red-500 relative -top-1 right-1">*</span>
        )}
        {question.label}
      </label>

      {renderInput()}

      {/* Conditional sub-fields */}
      {question.conditional &&
        value === question.conditional.triggerValue &&
        question.conditional.fields.map((sub: any) => (
          <div key={sub.id} className="ml-4 mt-3">
            {console.log("asdasdasdas", sub)}
            <label className="block text-sm text-gray-700 mb-1">
              {sub.label}
            </label>
            <input
              type="text"
              value={getValueByPath(formState, sub.path || question.path) || ""}
              onChange={(e) =>
                updateField(sub.path || question.path, e.target.value)
              }
              className="w-full border p-2 rounded-md"
            />
          </div>
        ))}

      {/* Validation error */}
      {errors[question.id] && (
        <p className="text-red-500 text-sm mt-1">{errors[question.id]}</p>
      )}

      {/* Helper Text */}
      {question.helperText && (
        <p className="text-sm text-gray-500 mt-2 whitespace-pre-line">
          {question.helperText}
        </p>
      )}

      {/* Example */}
      {question.example && (
        <p className="text-xs italic text-gray-400 mt-1">
          Example: {question.example}
        </p>
      )}
    </div>
  );
};

export function extractYouTubeHandle(url: string) {
  const regex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/@([a-zA-Z0-9._-]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}
