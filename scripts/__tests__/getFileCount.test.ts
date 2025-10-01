import { readdir } from "fs/promises";
import { getFileCount } from "../getFileCount";
import { join } from "path";

jest.mock("fs/promises", () => ({
  readdir: jest.fn(),
}));

describe("getFileCount", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("counts files in nested directories", async () => {
    (readdir as jest.Mock)
      .mockReturnValueOnce([
        { name: "file1.txt", isFile: () => true, isDirectory: () => false },
        { name: "subdir", isFile: () => false, isDirectory: () => true },
      ])
      .mockReturnValueOnce([
        { name: "file2.txt", isFile: () => true, isDirectory: () => false },
        { name: "file3.txt", isFile: () => true, isDirectory: () => false },
        { name: "innerdir", isFile: () => false, isDirectory: () => true },
      ])
      .mockReturnValueOnce([
        { name: "file4.txt", isFile: () => true, isDirectory: () => false },
      ]);

    const result = await getFileCount("/root");

    expect(result).toBe(4);

    expect(readdir).toHaveBeenCalledTimes(3);
    expect(readdir).toHaveBeenCalledWith("/root", {
      withFileTypes: true,
    });
    expect(readdir).toHaveBeenCalledWith(join("/root", "subdir"), {
      withFileTypes: true,
    });
    expect(readdir).toHaveBeenCalledWith(join("/root", "subdir", "innerdir"), {
      withFileTypes: true,
    });
  });

  it("counts files in a single directory", async () => {
    (readdir as jest.Mock).mockReturnValueOnce([
      { name: "file1.txt", isFile: () => true, isDirectory: () => false },
      { name: "file2.txt", isFile: () => true, isDirectory: () => false },
      { name: "file3.txt", isFile: () => true, isDirectory: () => false },
      { name: "file4.txt", isFile: () => true, isDirectory: () => false },
    ]);

    const result = await getFileCount("/root");

    expect(result).toBe(4);

    expect(readdir).toHaveBeenCalledTimes(1);
    expect(readdir).toHaveBeenCalledWith("/root", {
      withFileTypes: true,
    });
  });

  it("returns 0 for an empty directory", async () => {
    (readdir as jest.Mock).mockReturnValueOnce([]);

    const result = await getFileCount("/root");

    expect(result).toBe(0);

    expect(readdir).toHaveBeenCalledTimes(1);
    expect(readdir).toHaveBeenCalledWith("/root", {
      withFileTypes: true,
    });
  });

  it("returns 0 for an empty subdirectory", async () => {
    (readdir as jest.Mock)
      .mockReturnValueOnce([
        { name: "file1.txt", isFile: () => true, isDirectory: () => false },
        { name: "file2.txt", isFile: () => true, isDirectory: () => false },
        { name: "subdir", isFile: () => false, isDirectory: () => true },
      ])
      .mockReturnValueOnce([]);

    const result = await getFileCount("/root");

    expect(result).toBe(2);

    expect(readdir).toHaveBeenCalledTimes(2);
    expect(readdir).toHaveBeenCalledWith("/root", {
      withFileTypes: true,
    });
    expect(readdir).toHaveBeenCalledWith(join("/root", "subdir"), {
      withFileTypes: true,
    });
  });

  it("handles errors when readdir fails", async () => {
    (readdir as jest.Mock).mockRejectedValueOnce(
      new Error("Unable to read directory")
    );

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const processExitSpy = jest.spyOn(process, "exit").mockImplementation();

    const result = await getFileCount("/root");

    expect(result).toBe(0);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error occured when trying to count files",
      "Unable to read directory"
    );

    expect(processExitSpy).toHaveBeenCalledWith(0);

    consoleErrorSpy.mockRestore();
    processExitSpy.mockRestore();
  });
});
