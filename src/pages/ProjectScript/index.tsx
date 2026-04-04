import { FileText } from "lucide-react";

const ProjectScriptPage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="icon-container mb-4">
        <FileText className="size-6" aria-hidden="true" />
      </div>
      <h2 className="text-title text-xl mb-2">Script Step</h2>
      <p className="text-label max-w-md">
        Script generation and editing will be available here.
      </p>
    </div>
  );
};

export default ProjectScriptPage;
