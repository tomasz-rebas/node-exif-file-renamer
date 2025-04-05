import { EXIFTags, exiftool } from "exiftool-vendored";
import { logToFile } from "./logToFile";

interface DateTime {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  subSecond: number;
}

export interface Metadata {
  dateTime: DateTime;
  fNumber: number;
  focalLength: string;
  exposure: string;
  iso: number;
}

export const getMetadata = async (
  filePath: string
): Promise<Metadata | undefined> => {
  try {
    const metadata: EXIFTags = await exiftool.read(filePath);

    if (metadata.DateTimeOriginal === undefined)
      throw new Error("Missing DateTimeOriginal property");

    if (typeof metadata.DateTimeOriginal === "string")
      throw new Error("Missing ExifDateTime properties of DateTimeOriginal");

    if (metadata.SubSecTimeOriginal === undefined)
      throw new Error("Missing SubSecTimeOriginal property");

    if (metadata.FNumber === undefined)
      throw new Error("Missing FNumber property");

    if (metadata.FocalLength === undefined)
      throw new Error("Missing FocalLength property");

    if (metadata.ExposureTime === undefined)
      throw new Error("Missing ExposureTime property");

    if (metadata.ISO === undefined) throw new Error("Missing ISO property");

    return {
      dateTime: {
        year: metadata.DateTimeOriginal.year,
        month: metadata.DateTimeOriginal.month,
        day: metadata.DateTimeOriginal.day,
        hour: metadata.DateTimeOriginal.hour,
        minute: metadata.DateTimeOriginal.minute,
        second: metadata.DateTimeOriginal.second,
        subSecond: metadata.SubSecTimeOriginal,
      },
      fNumber: metadata.FNumber,
      focalLength: metadata.FocalLength,
      exposure: metadata.ExposureTime.toString(),
      iso: metadata.ISO,
    };
  } catch (error) {
    logToFile("Error while extracting metadata", { error });
  }
};
