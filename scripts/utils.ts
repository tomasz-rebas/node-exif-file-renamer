import { join, extname } from "path";
import { readdir } from "fs/promises";

export const getFileCount = async (directory: string): Promise<number> => {
  let fileCount = 0;

  try {
    const entries = await readdir(directory, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const entryPath = join(directory, entry.name);
        fileCount += await getFileCount(entryPath);
      } else if (entry.isFile()) {
        fileCount++;
      }
    }
  } catch (error) {
    console.error("Error occured when trying to count files:", error);

    return 0;
  }

  return fileCount;
};

export const isJpgOrNef = (fileName: string): boolean =>
  [".nef", ".jpg"].includes(extname(fileName).toLowerCase());

export const renameFiles = async (directory: string) => {
  const entries = await readdir(directory, { withFileTypes: true });

  /**
   * TODO: Track renaming progress
   */

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const entryPath = join(directory, entry.name);
      await renameFiles(entryPath);
    } else if (entry.isFile() && isJpgOrNef(entry.name)) {
      console.log(entry.name, "- skipping");
    }
  }
};
