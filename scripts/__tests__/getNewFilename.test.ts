import { getNewFilename } from "../getNewFilename";

import testData1 from "./mocks/230119_21374374.json";
import testData2 from "./mocks/240224_16274955.json";
import testData3 from "./mocks/240810_07312319.json";
import testData4 from "./mocks/211225_17275943.json";
import testData5 from "./mocks/231228_14381636.json";

describe("getNewFilename", () => {
  it.each([
    {
      input: {
        metadata: testData1,
        extension: ".nef",
      },
      output: "230119_21374374_500mm_1-100s_f5.6_ISO-9000.nef",
    },
    {
      input: {
        metadata: testData2,
        extension: ".nef",
      },
      output: "240224_16274955_500mm_1-250s_f8_ISO-160.nef",
    },
    {
      input: {
        metadata: testData3,
        extension: ".nef",
      },
      output: "240810_07312319_390mm_1-125s_f6.3_ISO-280.nef",
    },
    {
      input: {
        metadata: testData4,
        extension: ".jpg",
      },
      output: "211225_17275943_200mm_1.3s_f8_ISO-400.jpg",
    },
    {
      input: {
        metadata: testData5,
        extension: ".jpg",
      },
      output: "231228_14381636_50mm_0.3s_f5_ISO-100.jpg",
    },
  ])(
    "builds proper filename based on metadata and extension",
    ({ input, output }) => {
      const { metadata, extension } = input;
      expect(getNewFilename(metadata, extension)).toEqual(output);
    }
  );
});
