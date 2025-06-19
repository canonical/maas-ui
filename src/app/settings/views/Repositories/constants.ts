import type { ValueOf } from "@canonical/react-components";
import * as Yup from "yup";

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

const commaSeparated = Yup.string()
  .transform((value) =>
    value
      .split(",")
      .map((s: string) => s.trim())
      .join(", ")
  )
  .matches(/^(?:[^,\s]+(?:,\s*[^,\s]+)*)?$/, "Must be comma-separated.");

export const repositorySchema = Yup.object().shape({
  arches: Yup.array(),
  components: commaSeparated,
  default: Yup.boolean().required(),
  disable_sources: Yup.boolean().required(),
  disabled_components: Yup.array(),
  disabled_pockets: Yup.array(),
  distributions: commaSeparated,
  enabled: Yup.boolean().required(),
  key: Yup.string(),
  name: Yup.string().required("Name field required."),
  url: Yup.string().required("URL field required."),
});
