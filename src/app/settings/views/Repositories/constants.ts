import type { ValueOf } from "@canonical/react-components";

import type { PackageRepositoryResponse } from "@/app/apiclient";
import type { SidePanelContent } from "@/app/base/types";

export const RepositoryActionSidePanelViews = {
  ADD_PPA: ["repositoryForm", "addPpa"],
  ADD_REPOSITORY: ["repositoryForm", "addRepository"],
  EDIT_REPOSITORY: ["repositoryForm", "editRepository"],
  DELETE_REPOSITORY: ["repositoryForm", "deleteRepository"],
} as const;

export type RepositorySidePanelContent = SidePanelContent<
  ValueOf<typeof RepositoryActionSidePanelViews>,
  {
    repositoryId: PackageRepositoryResponse["id"];
    type?: "ppa" | "repository";
  }
>;
