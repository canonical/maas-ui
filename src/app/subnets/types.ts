import type { ValueOf } from "@canonical/react-components";

import type { GroupByKey } from "./views/SubnetsList/SubnetsTable/types";

import type { SidePanelContent } from "app/base/types";
import { SubnetForms } from "app/subnets/constants";

export type SubnetForm = keyof typeof SubnetForms;

export const SubnetHeaderViews = {
  [SubnetForms.Fabric]: ["addForm", SubnetForms.Fabric],
  [SubnetForms.VLAN]: ["addForm", SubnetForms.VLAN],
  [SubnetForms.Space]: ["addForm", SubnetForms.Space],
  [SubnetForms.Subnet]: ["addForm", SubnetForms.Subnet],
} as const;

export type SubnetSidePanelContent = SidePanelContent<
  ValueOf<typeof SubnetHeaderViews>
>;
export type SubnetsUrlParams = { by?: GroupByKey; q?: string };
