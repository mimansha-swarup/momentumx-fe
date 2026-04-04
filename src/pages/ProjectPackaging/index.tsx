import { Package } from "lucide-react";

const ProjectPackagingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="icon-container mb-4">
        <Package className="size-6" aria-hidden="true" />
      </div>
      <h2 className="text-title text-xl mb-2">Packaging Step</h2>
      <p className="text-label max-w-md">
        Title, description, thumbnail, and shorts generation will be available
        here.
      </p>
    </div>
  );
};

export default ProjectPackagingPage;
