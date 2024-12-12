import { EXIFTags, exiftool } from "exiftool-vendored";

export const getMetadata = async (
  filePath: string
): Promise<EXIFTags | undefined> => {
  try {
    const metadata: EXIFTags = await exiftool.read(filePath);

    return {
      DateTimeOriginal: metadata.DateTimeOriginal,
      FNumber: metadata.FNumber,
      FocalLength: metadata.FocalLength,
      SubSecTimeOriginal: metadata.SubSecTimeOriginal,
      ExposureTime: metadata.ExposureTime,
      ISO: metadata.ISO,
    };
  } catch (error) {
    console.error("Error while extracting metadata:", error);
  }
};
