import { splitResourceName } from "./utils";

describe("bootresource utils", () => {
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
