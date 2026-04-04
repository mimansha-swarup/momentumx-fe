import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/useRedux";
import { selectCurrentProject } from "@/utils/feature/videoProject/videoProject.slice";
import type { StepName } from "@/types/feature/videoProject";

// Parent ProjectPipelineLayout handles loading/error states
// TODO(phase-5): update when research route is added — research currently falls through to script
const STEP_REDIRECT_MAP: Record<StepName, string> = {
  research: "script",
  script: "script",
  hooks: "hooks",
  packaging: "packaging",
};

export const ProjectDetailRedirect: React.FC = () => {
  const currentProject = useAppSelector(selectCurrentProject);

  if (!currentProject) {
    return null;
  }

  const targetStep = STEP_REDIRECT_MAP[currentProject.currentStep];
  return (
    <Navigate to={`/app/project/${currentProject.id}/${targetStep}`} replace />
  );
};
