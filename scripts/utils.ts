import { join } from "path";
import { readdir } from "fs/promises";

export const getFileCount = async (directory: string): Promise<number> => {
  let fileCount = 0;

  try {
    const entries = await readdir(directory, { withFileTypes: true });

    for (const entry of entries) {
      const entryPath = join(directory, entry.name);

      if (entry.isDirectory()) {
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

export const renameFiles = () => {
  console.log("Renaming...");
};
