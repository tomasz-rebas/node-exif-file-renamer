import { join } from "path";
import { readdir } from "fs/promises";
import { logToFile } from "./logToFile";

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
    logToFile("Error occured when trying to count files", {
      error,
      logToConsole: true,
    });
    process.exit(0);
  }

  return fileCount;
};
