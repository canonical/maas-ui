import type { BootResource } from "./types";

export const splitResourceName = (
  name: BootResource["name"]
): { os: string; release: string } => {
  const split = name.split("/");
  return split.length === 2
    ? { os: split[0], release: split[1] }
    : { os: "", release: "" };
};
