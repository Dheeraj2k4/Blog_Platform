import { useState } from "react";

interface UsePostEditorReturn {
  content: string;
  setContent: (content: string) => void;
  preview: boolean;
  togglePreview: () => void;
}

export function usePostEditor(initialContent = ""): UsePostEditorReturn {
  const [content, setContent] = useState(initialContent);
  const [preview, setPreview] = useState(false);

  const togglePreview = () => setPreview((prev) => !prev);

  return {
    content,
    setContent,
    preview,
    togglePreview,
  };
}
