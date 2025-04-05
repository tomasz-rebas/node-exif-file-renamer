import { join, extname, basename } from "path";
import { rename } from "fs/promises";
import { getMetadata } from "./getMetadata";
import { getNewFilename } from "./getNewFilename";
import { Dirent } from "fs";
import { logToFile } from "./logToFile";

const isJpg = (fileName: string): boolean =>
  extname(fileName).toLowerCase() === ".jpg";

const isRaw = (fileName: string): boolean =>
  extname(fileName).toLowerCase() === ".nef";

const renameFile = async (oldPath: string, newPath: string): Promise<void> => {
  try {
    await rename(oldPath, newPath);
    logToFile(`Renamed ${basename(oldPath)} to ${basename(newPath)}`, {});
  } catch (error) {
    logToFile(`Error occurred when renaming the file ${oldPath}`, {
      error,
    });
  }
};

type ProcessedFile = "JPG" | "RAW" | "SKIPPED";

export const processFile = async (entry: Dirent): Promise<ProcessedFile> => {
  const { parentPath, name } = entry;
  const path = join(parentPath, name);

  const isJpgOrRaw = isJpg(name) || isRaw(name);

  if (!isJpgOrRaw) {
    return "SKIPPED";
  }

  const metadata = await getMetadata(path);

  if (metadata === undefined) {
    logToFile(`Couldn't retrieve metadata for ${name}`, {});

    return "SKIPPED";
  }

  const newFilename = getNewFilename(metadata, extname(path));

  if (!newFilename) {
    return "SKIPPED";
  }

  if (name === newFilename) {
    logToFile(`Skipping ${name} since it's already renamed`, {});

    return "SKIPPED";
  }

  await renameFile(path, join(parentPath, newFilename));

  if (isRaw(name)) {
    return "RAW";
  }

  return "JPG";
};
