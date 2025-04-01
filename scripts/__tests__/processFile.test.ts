import { rename } from "fs/promises";
import { processFile } from "../processFile";
import { getMetadata } from "../getMetadata";

import testData1 from "./mocks/metadata1.json";

jest.mock("fs/promises", () => ({
  rename: jest.fn(),
}));

jest.mock("../getMetadata", () => ({
  getMetadata: jest.fn(),
}));

jest.spyOn(console, "log").mockImplementation(() => {});

const direntMockBase = {
  isFile: jest.fn(),
  isDirectory: jest.fn(),
  isBlockDevice: jest.fn(),
  isCharacterDevice: jest.fn(),
  isSymbolicLink: jest.fn(),
  isFIFO: jest.fn(),
  isSocket: jest.fn(),
  parentPath: "D:\\test",
  path: "D:\\test",
};

describe("processFile", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renames a RAW file", async () => {
    (getMetadata as jest.Mock).mockResolvedValue(testData1);

    expect(
      await processFile({
        name: "DSC_9372.nef",
        ...direntMockBase,
      })
    ).toEqual("RAW");

    expect(rename).toHaveBeenCalledTimes(1);
    expect(rename).toHaveBeenCalledWith(
      "D:\\test\\DSC_9372.nef",
      "D:\\test\\211225_17275943_200mm_1.3s_f8_ISO-400.nef"
    );
  });

  it("renames a JPG file", async () => {
    (getMetadata as jest.Mock).mockResolvedValue(testData1);

    expect(
      await processFile({
        name: "DSC_9372.jpg",
        ...direntMockBase,
      })
    ).toEqual("JPG");

    expect(rename).toHaveBeenCalledTimes(1);
    expect(rename).toHaveBeenCalledWith(
      "D:\\test\\DSC_9372.jpg",
      "D:\\test\\211225_17275943_200mm_1.3s_f8_ISO-400.jpg"
    );
  });

  it("skips already renamed file", async () => {
    (getMetadata as jest.Mock).mockResolvedValue(testData1);

    expect(
      await processFile({
        name: "211225_17275943_200mm_1.3s_f8_ISO-400.jpg",
        ...direntMockBase,
      })
    ).toEqual("SKIPPED");

    expect(rename).not.toHaveBeenCalled();
  });
});
