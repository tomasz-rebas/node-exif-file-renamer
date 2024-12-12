import { EXIFTags, exiftool } from "exiftool-vendored";

export const getMetadata = async (
  filePath: string
): Promise<EXIFTags | undefined> => {
  try {
    const metadata: EXIFTags = await exiftool.read(filePath);

    const {
      DateTimeOriginal,
      FNumber,
      FocalLength,
      SubSecTimeOriginal,
      ExposureTime,
      ISO,
    } = metadata;

    return {
      DateTimeOriginal,
      FNumber,
      FocalLength,
      SubSecTimeOriginal,
      ExposureTime,
      ISO,
    };
  } catch (error) {
    console.error("Error while extracting metadata:", error);
  }
};
