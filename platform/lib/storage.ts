import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

/**
 * Ensures a directory exists.
 */
async function ensureDir(dir: string) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (err) {
    if ((err as any).code !== "EEXIST") throw err;
  }
}

/**
 * Saves an uploaded file to a specific sub-directory in public/uploads.
 * Returns the relative URL path.
 */
export async function saveFile(file: File, subDir: string): Promise<string> {
  const uploadRoot = path.join(process.cwd(), "public", "uploads", subDir);
  await ensureDir(uploadRoot);

  const buffer = Buffer.from(await file.arrayBuffer());
  
  const hash = crypto.createHash("sha256")
    .update(buffer)
    .update(file.name)
    .update(Date.now().toString())
    .digest("hex")
    .substring(0, 16);

  const ext = path.extname(file.name) || ".png";
  const filename = `${hash}${ext}`;
  const filepath = path.join(uploadRoot, filename);

  await fs.writeFile(filepath, buffer);

  return `/uploads/${subDir}/${filename}`;
}

/**
 * Deletes a file given its relative URL path.
 */
export async function deleteFile(relativeUrl: string) {
  if (!relativeUrl.startsWith("/uploads/")) return;

  const filepath = path.join(process.cwd(), "public", relativeUrl);

  try {
    await fs.unlink(filepath);
  } catch (err) {
    console.error(`Failed to delete file: ${filepath}`, err);
  }
}
