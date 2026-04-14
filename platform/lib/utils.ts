/**
 * Prepend the BACKEND_URL to image paths if they are relative.
 */
export function formatImageUrl(imagePath: string | undefined): string | undefined {
  if (!imagePath) return imagePath;

  // If it's already an absolute URL, return it
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  const backendUrl = process.env.BACKEND_URL || "http://localhost:3000";
  
  // Ensure we don't end up with multiple slashes or missing slashes
  const baseUrl = backendUrl.endsWith("/") ? backendUrl.slice(0, -1) : backendUrl;
  const relativePath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;

  return `${baseUrl}${relativePath}`;
}
