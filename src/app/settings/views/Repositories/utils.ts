import type { RepositoryType } from "./components/types";

export const getRepositoryTypeString = (type: RepositoryType) => {
  return type === "ppa" ? "PPA" : "repository";
};
