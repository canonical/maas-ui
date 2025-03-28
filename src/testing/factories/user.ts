import { define, random } from "cooky-cutter";

import type { UserWithSummaryResponse } from "@/app/apiclient";
import type { UserEventError, UserStatuses } from "@/app/store/user/types/base";
import { timestamp } from "@/testing/factories/general";

export const userEventError = define<UserEventError>({
  error: "Uh oh",
  event: "markIntroComplete",
});

export const userStatuses = define<UserStatuses>({
  markingIntroComplete: false,
});

export const user = define<UserWithSummaryResponse>({
  id: random,
  completed_intro: true,
  email: (i: number) => `email${i}@example.com`,
  is_local: true,
  is_superuser: true,
  last_name: "MAAS",
  last_login: () => timestamp("Fri, 23 Oct. 2020 00:00:00"),
  machines_count: random,
  sshkeys_count: random,
  username: (i: number) => `user${i}`,
});
