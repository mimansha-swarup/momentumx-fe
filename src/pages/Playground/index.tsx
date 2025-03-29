/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { PlusCircle, Trash2 } from "lucide-react";
import React, { ChangeEvent, useState } from "react";

const INITIAL_STATE = {
  website: "https://www.youtube.com/@CHRISHERIA/featured",
  brandName: "Chris Heria",
  niche: "Fitness",
  competitors: ["Athlean-X", "ThenX"],
  targetAudience:
    "Fitness enthusiasts looking for bodyweight workouts, calisthenics training, and healthy lifestyle tips.",
  userName: "Chris",
};
const form = [
  {
    id: "userName",
    label: "User Name",
    type: "text",
  },
  {
    id: "brandName",
    label: "Brand Name",
    type: "text",
  },
  {
    id: "niche",
    label: "Your Niche",
    type: "text",
  },
  {
    id: "website",
    label: "Website URL",
    type: "text",
  },
  {
    id: "targetAudience",
    label: "Target Audience",
    type: "text",
  },
  {
    id: "competitors",
    label: "YouTube Competitor",
    type: "multi-text",
  },
];

const Playground = () => {
  const [input, setInput] = useState(INITIAL_STATE);
  const [output, setOutput] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateData = async () => {
    setIsLoading(true);
    const res = await fetch(
      "https://momentumx-be.onrender.com/v1/content/topics",
      {
        method: "POST",
        body: JSON.stringify(input),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await res.json();
    console.log("data: ", data);

    setOutput(JSON.parse(data.data).items);
    setIsLoading(false);
  };
  const handleChange =
    (fieldName: string) =>
    (e: ChangeEvent<HTMLInputElement>, index?: number) => {
      setInput((prev) => {
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

  const removeCompetitors = (index: number) => () => {
    setInput((prev) => {
      const newCompetitors = [...prev.competitors];
      newCompetitors.splice(index, 1);
      return { ...prev, competitors: newCompetitors };
    });
  };

  const addCompetitors = () => {
    setInput((prev) => {
      return { ...prev, competitors: [...prev.competitors, ""] };
    });
  };

  const renderInput = (inputType: string, value, obj, onChange) => {
    const { id, label } = obj;
    switch (inputType) {
      case "multi-text":
        if (!Array.isArray(value)) {
          return <></>;
        }
        return (
          <div>
            {value?.map((multiValue, index) => {
              return (
                <div key={index} className="flex items-start mt-2 ">
                  <div className="flex-1 ">
                    <Label htmlFor={`competitor-${index}`}>
                      {index === 0
                        ? "YouTube Competitor"
                        : `YouTube Competitor ${index + 1}`}
                    </Label>
                    <Input
                      id={`competitor-${index}`}
                      // placeholder={placeholder}
                      value={multiValue}
                      onChange={(e) => onChange(e, index)}
                      className="mt-4"
                    />
                  </div>
                  {value.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="mt-8"
                      onClick={removeCompetitors?.(index)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              );
            })}
            <Button
              variant="outline"
              className="w-full"
              onClick={addCompetitors}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Another Competitor
            </Button>
          </div>
        );
      case "text":
      default:
        return (
          <div className="mt-2">
            <Label htmlFor={id}>{label}</Label>
            <Input
              className=""
              id={id}
              name={id}
              value={value}
              onChange={onChange}
            />
          </div>
        );
    }
  };

  return (
    <div className=" flex p-6">
      <div className="flex-1">
        {form?.map((obj) =>
          renderInput(obj.type, input[obj.id], obj, handleChange(obj.id))
        )}
        <Button onClick={generateData}>Generate</Button>
      </div>
      <div className="mt-4 flex-1">
        <h2 className="text-lg font-bold">Output</h2>
        <pre className="bg-gray-100 p-4 rounded-md">
          {isLoading && (
            <div className="flex items-center justify-center h-full w-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}
          {output?.map((item, index) => {
            return (
              <div className="p-2 py-0.5" key={item.id}>
                {index + 1}. {item}
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
};

export default Playground;
