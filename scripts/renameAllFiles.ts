import { join } from "path";
import { readdir } from "fs/promises";
import { processFile } from "./processFile";

interface FileCountByType {
  raw: number;
  jpg: number;
  skipped: number;
}

export const renameAllFiles = async (
  directory: string
): Promise<FileCountByType> => {
  const entries = await readdir(directory, { withFileTypes: true });

  let rawFilesRenamed = 0;
  let jpgFilesRenamed = 0;
  let filesSkipped = 0;

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const entryPath = join(directory, entry.name);
      const fileCountByType = await renameAllFiles(entryPath);

      rawFilesRenamed += fileCountByType.raw;
      jpgFilesRenamed += fileCountByType.jpg;
      filesSkipped += fileCountByType.skipped;

      continue;
    }

    if (entry.isFile()) {
      const processedFile = await processFile(entry);

      switch (processedFile) {
        case "RAW":
          rawFilesRenamed++;
        case "JPG":
          jpgFilesRenamed++;
        default:
          filesSkipped++;
      }
    }
  }

  return {
    raw: rawFilesRenamed,
    jpg: jpgFilesRenamed,
    skipped: filesSkipped,
  };
};
