import { join, extname, basename } from "path";
import { rename } from "fs/promises";
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

export const processFile = async (entry: Dirent): Promise<ProcessedFile> => {
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
