import { Metadata } from "./getMetadata";
import { logToFile } from "./logToFile";

// Ensure the number is always 2-digit e.g. 02 instead of 2
const padded = (time: number) => time.toString().padStart(2, "0");

export const getNewFilename = (
  metadata: Metadata,
  extension: string
): string | null => {
  try {
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
  } catch (error) {
    logToFile("Error occured when building new filename", { error });

    return null;
  }
};
