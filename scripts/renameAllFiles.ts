import { join, extname, basename } from "path";
import { readdir, rename } from "fs/promises";
import { getMetadata } from "./getMetadata";
import { getNewFilename } from "./getNewFilename";
import { Dirent } from "fs";

const isJpgOrNef = (fileName: string): boolean =>
  [".nef", ".jpg"].includes(extname(fileName).toLowerCase());

const renameFile = async (oldPath: string, newPath: string): Promise<void> => {
  try {
    await rename(oldPath, newPath);
    console.log(`Renamed ${basename(oldPath)} to ${basename(newPath)}`);
  } catch (error) {
    console.error(`Error occurred when renaming the file ${oldPath}:`, error);
  }
};

type ProcessedFile = "JPG" | "RAW" | "SKIPPED";

const processFile = async (entry: Dirent): Promise<ProcessedFile> => {
  const { parentPath, name } = entry;
  const path = join(parentPath, name);

  if (!isJpgOrNef(name)) {
    return "SKIPPED";
  }

  const metadata = await getMetadata(path);

  if (metadata === undefined) {
    console.error(`Couldn't retrieve metadata for ${name}`);

    return "SKIPPED";
  }

  const newFilename = getNewFilename(metadata, extname(path));

  if (name !== newFilename) {
    await renameFile(path, join(parentPath, newFilename));

    return "RAW";
  }

  return "SKIPPED";
};

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
