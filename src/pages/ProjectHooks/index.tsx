import { Anchor } from "lucide-react";

const ProjectHooksPage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="icon-container mb-4">
        <Anchor className="size-6" aria-hidden="true" />
      </div>
      <h2 className="text-title text-xl mb-2">Hooks Step</h2>
      <p className="text-label max-w-md">
        Hook generation and selection will be available here.
      </p>
    </div>
  );
};

export default ProjectHooksPage;
