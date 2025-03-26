import type { ResourcePoolWithSummaryResponse } from "../apiclient/types.gen";

export type Pool = {
  id: number;
  name: string;
  machines: ResourcePoolWithSummaryResponse;
  description: string;
  resource: ResourcePoolWithSummaryResponse;
};
