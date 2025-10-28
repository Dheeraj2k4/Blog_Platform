import { createClient } from "./client";

const BUCKET_NAME = "blog-images";

/**
 * Upload an image to Supabase Storage
 * @param file - The image file to upload
 * @param folder - Optional folder path (e.g., 'posts', 'categories')
 * @returns Public URL of the uploaded image or null if failed
 */
export async function uploadImage(
  file: File,
  folder: string = "uploads"
): Promise<string | null> {
  try {
    const supabase = createClient();

    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Upload file
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      return null;
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
}

/**
 * Delete an image from Supabase Storage
 * @param imageUrl - The public URL of the image to delete
 * @returns true if successful, false otherwise
 */
export async function deleteImage(imageUrl: string): Promise<boolean> {
  try {
    const supabase = createClient();

    // Extract file path from URL
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split(`${BUCKET_NAME}/`);
    if (pathParts.length < 2) return false;

    const filePath = pathParts[1];

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error("Delete error:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error deleting image:", error);
    return false;
  }
}

/**
 * Validate image file
 * @param file - File to validate
 * @returns Error message or null if valid
 */
export function validateImageFile(file: File): string | null {
  // Check file type
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
  if (!validTypes.includes(file.type)) {
    return "Please upload a valid image file (JPEG, PNG, GIF, or WebP)";
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    return "Image size must be less than 5MB";
  }

  return null;
}
