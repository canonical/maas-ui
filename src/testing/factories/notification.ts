import { define } from "cooky-cutter";

import type { NotificationResponse } from "@/app/apiclient";

export const notificationFactoryV3 = define<NotificationResponse>({
  id: (i: number) => i + 1,
  users: true,
  admins: true,
  message: "This is a test notification",
  context: {},
  category: "info",
  dismissable: true,
});
