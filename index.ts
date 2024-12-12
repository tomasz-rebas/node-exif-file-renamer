const path = require("path");
const exifReader = require("./scripts/exifReader");

const testFilePath = path.join(__dirname, "test_images", "1.nef");

exifReader.getMetadata(testFilePath).then((data: any) => {
  console.log("selectedMetadata", data);
});
