import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OnboardingFormProps } from "@/types/components/login";
import { Label } from "@radix-ui/react-label";
import { PlusCircle, Trash2 } from "lucide-react";
import { FC } from "react";

const OnboardingForm: FC<OnboardingFormProps> = ({
  value,
  onChange,
  error,
  label,
  id,
  inputType,
  removeMultiValue,
  addMultiValue,
  placeholder,
  onKeyPress,
}) => {
  const renderInput = () => {
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
                {error[index] && (
                  <p className="text-sm text-red-500">{error[index]}</p>
                )}
              </div>
              {value.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="mt-8"
                  onClick={removeMultiValue?.(index)}
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
              onKeyDown={onKeyPress}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );
    }
  };
  return (
    <div className="space-y-4">
      <div className="space-y-2">{renderInput()}</div>
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
