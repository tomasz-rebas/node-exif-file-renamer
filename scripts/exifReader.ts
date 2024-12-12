const { exiftool } = require("exiftool-vendored");

interface DateTimeOriginal {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  [key: string]: any;
}

interface SelectedMetadata {
  DateTimeOriginal: DateTimeOriginal;
  FNumber: number;
  FocalLength: string;
  SubSecTimeOriginal: number;
  ExposureTime: string;
  ISO: number;
}

interface AllMetadata extends SelectedMetadata {
  [key: string]: any;
}

const getMetadata = async (
  filePath: string
): Promise<SelectedMetadata | undefined> => {
  try {
    const metadata: AllMetadata = await exiftool.read(filePath);

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
    console.error("Error while extracting metadata.", error);
  }
};

module.exports = { getMetadata };
