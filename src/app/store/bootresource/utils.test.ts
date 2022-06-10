import { splitImageName, splitResourceName } from "./utils";

describe("bootresource utils", () => {
  describe("splitImageName", () => {
    it("correctly splits an image name into its separate parts", () => {
      expect(splitImageName("ubuntu/arm64/generic/focal")).toStrictEqual({
        arch: "arm64",
        os: "ubuntu",
        release: "focal",
        subArch: "generic",
      });
      expect(splitImageName("centos/amd64/generic/8")).toStrictEqual({
        arch: "amd64",
        os: "centos",
        release: "8",
        subArch: "generic",
      });
      expect(splitImageName("ubuntu/focal")).toStrictEqual({
        arch: "",
        os: "",
        release: "",
        subArch: "",
      });
      expect(splitImageName("")).toStrictEqual({
        arch: "",
        os: "",
        release: "",
        subArch: "",
      });
    });
  });

  describe("splitResourceName", () => {
    it("correctly splits a resource name into os and release", () => {
      expect(splitResourceName("ubuntu/focal")).toStrictEqual({
        os: "ubuntu",
        release: "focal",
      });
      expect(splitResourceName("centos/centos70")).toStrictEqual({
        os: "centos",
        release: "centos70",
      });
      expect(splitResourceName("ubuntu")).toStrictEqual({
        os: "",
        release: "",
      });
      expect(splitResourceName("ubuntu/focal/amd64/generic")).toStrictEqual({
        os: "",
        release: "",
      });
      expect(splitResourceName("")).toStrictEqual({ os: "", release: "" });
    });
  });
});
