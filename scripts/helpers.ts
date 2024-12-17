import { join, extname, basename } from "path";
import { readdir, rename } from "fs/promises";
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

// Ensure the number is always 2-digit e.g. 02 instead of 2
const padded = (time: number) => time.toString().padStart(2, "0");

const getNewFilename = (metadata: Metadata, extension: string): string => {
  const { dateTime, fNumber, focalLength, exposure, iso } = metadata;
  const { year, month, day, hour, minute, second, subSecond } = dateTime;

  let segments: string[] = [
    year.toString().slice(2) + padded(month) + padded(day),
    padded(hour) + padded(minute) + padded(second) + padded(subSecond),
    `${focalLength.split(".")[0]}mm`,
    `${exposure.replace(/\//g, "-")}s`,
    `f${fNumber}`,
    `ISO-${iso}`,
  ];

  return segments.join("_") + extension;
};

const renameFile = async (oldPath: string, newPath: string): Promise<void> => {
  try {
    await rename(oldPath, newPath);
    console.log(`Renamed ${basename(oldPath)} to ${basename(newPath)}`);
  } catch (error) {
    console.error(`Error occurred when renaming the file ${oldPath}:`, error);
  }
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
        console.error(`Couldn't retrieve metadata for ${entry.name}`);

        continue;
      }

      const newFilename = getNewFilename(metadata, extname(entryPath));

      console.log("-----------------------------------");
      console.log("current name\n", entry.name);
      console.log("new name\n", newFilename);

      if (entry.name !== newFilename) {
        await renameFile(
          join(directory, entry.name),
          join(directory, newFilename)
        );
      } else {
        console.log("These files have the same name. Skipping.");
      }
    }
  }
};
