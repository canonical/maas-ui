import type { BootResource } from "./types";

export const splitResourceName = (
  name: BootResource["name"]
): { os: string; release: string } => {
  const split = name.split("/");
  return split.length === 2
    ? { os: split[0], release: split[1] }
    : { os: "", release: "" };
};

export const splitImageName = (
  name: string
): { os: string; arch: string; subArch: string; release: string } => {
  const split = name.split("/");
  return split.length === 4
    ? { arch: split[1], os: split[0], release: split[3], subArch: split[2] }
    : { arch: "", os: "", release: "", subArch: "" };
};
