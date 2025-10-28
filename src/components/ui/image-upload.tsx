"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadImage, validateImageFile } from "@/lib/supabase/storage";
import { toast } from "react-hot-toast";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  folder?: string;
  label?: string;
  description?: string;
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  folder = "uploads",
  label = "Image",
  description = "Upload an image (JPEG, PNG, GIF, or WebP, max 5MB)",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    // Validate file
    const error = validateImageFile(file);
    if (error) {
      toast.error(error);
      return;
    }

    // Upload file
    setUploading(true);
    try {
      const url = await uploadImage(file, folder);
      if (url) {
        onChange(url);
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Failed to upload image. Please try again.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    } else {
      onChange("");
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-foreground">
        {label}
      </label>

      {value ? (
        // Preview uploaded image
        <div className="relative w-full">
          <img
            src={value}
            alt="Uploaded"
            className="w-full h-48 object-cover rounded-lg border border-border"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleRemove}
            className="absolute top-2 right-2"
          >
            <X className="h-4 w-4 mr-1" />
            Remove
          </Button>
        </div>
      ) : (
        // Upload area
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${dragActive ? "border-primary bg-primary/5" : "border-border bg-muted/20"}
            ${uploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-primary hover:bg-primary/5"}
          `}
          onClick={() => !uploading && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            disabled={uploading}
            className="hidden"
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              {dragActive ? (
                <>
                  <Upload className="h-10 w-10 text-primary" />
                  <p className="text-sm font-medium text-primary">
                    Drop image here
                  </p>
                </>
              ) : (
                <>
                  <ImageIcon className="h-10 w-10 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {description}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
