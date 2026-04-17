import { define, random } from "cooky-cutter";

import type {
  UserGroupResponse,
  UserGroupStatisticsResponse,
} from "@/app/apiclient";

export const group = define<UserGroupResponse>({
  id: random,
  name: (i: number) => `group-${i}`,
  description: "A sample group",
});

export const groupStatistics = define<UserGroupStatisticsResponse>({
  id: random,
  user_count: random,
});
