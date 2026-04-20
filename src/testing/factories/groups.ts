import { define, random } from "cooky-cutter";
import { Factory } from "fishery";

import type {
  EntitlementResponse,
  UserGroupMemberResponse,
  UserGroupResponse,
  UserGroupStatisticsResponse,
} from "@/app/apiclient";
import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import { user as userFactory } from "@/testing/factories/user";

export const group = define<UserGroupResponse>({
  id: random,
  name: (i: number) => `group-${i}`,
  description: "A sample group",
});

export const groupStatistics = define<UserGroupStatisticsResponse>({
  id: random,
  user_count: random,
});

export const groupEntitlements = define<EntitlementResponse>({
  entitlement: Entitlement.CAN_DEPLOY_MACHINES,
  resource_id: 0,
  resource_type: "maas",
});

export const groupMember = Factory.define<UserGroupMemberResponse>(() => {
  const user = userFactory();
  return {
    email: user.email ?? "",
    user_id: user.id,
    username: user.username,
  };
});
