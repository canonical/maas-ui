import { buildSourcesByImageKey } from "./utils";

import { availableImageFactory, imageSourceFactory } from "@/testing/factories";

describe("buildSourcesByImageKey", () => {
  it("returns an empty object when availableImages is empty", () => {
    const source = imageSourceFactory.build({ id: 1 });
    expect(buildSourcesByImageKey([source], [])).toEqual({});
  });

  it("returns an empty object when sources is empty", () => {
    const img = availableImageFactory.build({ source_id: 1 });
    expect(buildSourcesByImageKey([], [img])).toEqual({});
  });

  it("maps each image to its source using 'os/release/architecture' as the key", () => {
    const source = imageSourceFactory.build({ id: 1 });
    const img = availableImageFactory.build({
      os: "ubuntu",
      release: "noble",
      architecture: "amd64",
      source_id: 1,
    });
    const result = buildSourcesByImageKey([source], [img]);
    expect(result["ubuntu/noble/amd64"]).toEqual([source]);
  });

  it("deduplicates sources that appear for the same image key", () => {
    const source = imageSourceFactory.build({ id: 1 });
    const img1 = availableImageFactory.build({
      os: "ubuntu",
      release: "noble",
      architecture: "amd64",
      source_id: 1,
    });
    const img2 = availableImageFactory.build({
      os: "ubuntu",
      release: "noble",
      architecture: "amd64",
      source_id: 2,
    });
    const result = buildSourcesByImageKey([source], [img1, img2]);
    expect(result["ubuntu/noble/amd64"]).toHaveLength(1);
  });

  it("restricts the result to filterKeys when a Set is provided", () => {
    const source = imageSourceFactory.build({ id: 1 });
    const ubuntuImg = availableImageFactory.build({
      os: "ubuntu",
      release: "noble",
      architecture: "amd64",
      source_id: 1,
    });
    const centosImg = availableImageFactory.build({
      os: "centos",
      release: "centos7",
      architecture: "amd64",
      source_id: 1,
    });
    const filterKeys = new Set(["ubuntu/noble/amd64"]);
    const result = buildSourcesByImageKey(
      [source],
      [ubuntuImg, centosImg],
      filterKeys
    );
    expect(result["ubuntu/noble/amd64"]).toBeDefined();
    expect(result["centos/centos7/amd64"]).toBeUndefined();
  });

  it("skips images whose source_id does not match any source", () => {
    const source = imageSourceFactory.build({ id: 99 });
    const img = availableImageFactory.build({
      os: "ubuntu",
      release: "noble",
      architecture: "amd64",
      source_id: 1,
    });
    expect(buildSourcesByImageKey([source], [img])).toEqual({});
  });
});
