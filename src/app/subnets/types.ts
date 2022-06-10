import type { GroupByKey } from "./views/SubnetsList/SubnetsTable/types";

import type { SubnetForms } from "app/subnets/enum";

export type SubnetForm = keyof typeof SubnetForms;
export type SubnetsUrlParams = { by?: GroupByKey; q?: string };
