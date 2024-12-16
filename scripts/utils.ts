import { join, extname } from "path";
import { readdir } from "fs/promises";
import { getMetadata, Metadata } from "./exifReader";

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

const isJpgOrNef = (fileName: string): boolean =>
  [".nef", ".jpg"].includes(extname(fileName).toLowerCase());

const getNewFilename = (metadata: Metadata): string => {
  /**
   * TODO: Build the new name
   */

  console.log(metadata);

  return "";
};

export const renameFiles = async (directory: string) => {
  const entries = await readdir(directory, { withFileTypes: true });

  /**
   * TODO: Track renaming progress
   */

  for (const entry of entries) {
    const entryPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      await renameFiles(entryPath);
      continue;
    }

    if (entry.isFile() && isJpgOrNef(entry.name)) {
      const metadata = await getMetadata(entryPath);

      if (metadata === undefined) {
        console.error(
          "Couldn't retrieve metadata for the given file. Skipping."
        );

        continue;
      }

      const newFilename = getNewFilename(metadata);
    }
  }
};
