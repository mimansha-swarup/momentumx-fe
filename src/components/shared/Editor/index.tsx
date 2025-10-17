import { Button } from "@/components/ui/button";
import { markdownToHtml } from "@/utils/markdown";
import React, { FC, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { LoaderCircle } from "lucide-react";

interface IEditorProps {
  toEditText: string;
  onSave: (val: string) => void;
  onCancel: () => void;
  loading: boolean;
}
const MyEditor: FC<IEditorProps> = ({
  toEditText = "",
  onSave,
  onCancel,
  loading,
}) => {
  const [text, setText] = useState(markdownToHtml(toEditText));
  return (
    <div>
      <ReactQuill theme="snow" value={text} onChange={setText} />
      <div className="flex justify-end gap-3 mt-4">
        <Button variant="destructive" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={() => onSave(text)} disabled={loading}>
          {loading ? <LoaderCircle /> : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default MyEditor;
