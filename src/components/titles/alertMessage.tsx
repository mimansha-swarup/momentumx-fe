import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "../ui/button";

export function AlertDestructive() {
  return (
    <Alert className="my-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Your session has expired. Please log in again.
        <Button>Re-generate Script</Button>
      </AlertDescription>
    </Alert>
  );
}
