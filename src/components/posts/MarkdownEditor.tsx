"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write your post content in markdown...",
  minHeight = "400px",
}: MarkdownEditorProps) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium">Content</label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowPreview(!showPreview)}
        >
          {showPreview ? "Edit" : "Preview"}
        </Button>
      </div>
      {showPreview ? (
        <div
          className="border rounded-md p-4 prose max-w-none"
          style={{ minHeight }}
        >
          <ReactMarkdown>{value}</ReactMarkdown>
        </div>
      ) : (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ minHeight }}
          className="font-mono text-sm"
        />
      )}
    </div>
  );
}
