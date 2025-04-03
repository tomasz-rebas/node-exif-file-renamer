import { join } from "path";
import { readdir } from "fs/promises";
import { processFile } from "./processFile";
import { getFileCount } from "./getFileCount";
import { SingleBar, Presets } from "cli-progress";

interface FileCountByType {
  raw: number;
  jpg: number;
  skipped: number;
}

export const renameAllFiles = async (
  directory: string,
  fileCount: number,
  bar?: SingleBar
): Promise<FileCountByType> => {
  const entries = await readdir(directory, { withFileTypes: true });

  let rawFilesRenamed = 0;
  let jpgFilesRenamed = 0;
  let filesSkipped = 0;

  // Initialize progress bar only on the first function call
  let isRootCall = false;
  if (!bar) {
    isRootCall = true;
    fileCount = await getFileCount(directory);
    bar = new SingleBar(
      {
        format: "[{bar}] {percentage}% | {value}/{total} | {filename}",
        hideCursor: true,
      },
      Presets.shades_classic
    );
    bar.start(fileCount, 0, { filename: "Starting..." });
  }

  for (let i = 0; i < entries.length; i++) {
    if (entries[i].isDirectory()) {
      const entryPath = join(directory, entries[i].name);
      const { raw, jpg, skipped } = await renameAllFiles(
        entryPath,
        fileCount,
        bar
      );

      rawFilesRenamed += raw;
      jpgFilesRenamed += jpg;
      filesSkipped += skipped;

      continue;
    }

    if (entries[i].isFile()) {
      const processedFile = await processFile(entries[i]);

      switch (processedFile) {
        case "RAW":
          rawFilesRenamed++;
          break;
        case "JPG":
          jpgFilesRenamed++;
          break;
        default:
          filesSkipped++;
          break;
      }

      bar.update(bar.getProgress() * fileCount + 1, {
        filename: entries[i].name,
      });
    }
  }

  if (isRootCall) {
    bar.stop();
  }

  return {
    raw: rawFilesRenamed,
    jpg: jpgFilesRenamed,
    skipped: filesSkipped,
  };
};
