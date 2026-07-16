import { define, random } from "cooky-cutter";

import type {
  EntitlementResponse,
  UserResponse,
  UserStatisticsResponse,
} from "@/app/apiclient";
import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import { timestamp } from "@/testing/factories/general";

export const entitlement = define<EntitlementResponse>({
  entitlement: Entitlement.CAN_VIEW_GLOBAL_ENTITIES,
  resource_id: 0,
  resource_type: "maas",
});

export const user = define<UserResponse>({
  id: random,
  email: (i: number) => `email${i}@example.com`,
  groups: (i: number) => [
    {
      id: 1,
      name: `testgroup-${i}`,
    },
  ],
  last_name: "MAAS",
  first_name: "John",
  date_joined: () => timestamp("Fri, 23 Oct. 2020 00:00:00"),
  last_login: () => timestamp("Fri, 23 Oct. 2020 00:00:00"),
  username: (i: number) => `user${i}`,
});

export const userEntitlements = (): EntitlementResponse[] =>
  Object.values(Entitlement).map((entitlement) => ({
    entitlement,
    resource_id: 0,
    resource_type: "maas",
  }));

export const userStatistics = define<UserStatisticsResponse>({
  id: random,
  completed_intro: true,
  is_local: true,
  machines_count: random,
  sshkeys_count: random,
});
