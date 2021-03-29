import type { notificationTypes } from "@canonical/react-components";

import type { Model } from "app/store/types/model";

export type Message = Model & {
  message: string;
  status?: string;
  temporary: boolean;
  type: notificationTypes;
};

export type MessageState = {
  items: Message[];
};
