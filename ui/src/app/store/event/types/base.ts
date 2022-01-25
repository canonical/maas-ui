import type { EventTypeLevel } from "./enum";

import type { TimestampedModel } from "app/store/types/model";
import type { BaseNode } from "app/store/types/node";
import type { GenericState } from "app/store/types/state";
import type { User } from "app/store/user/types";

export type EventType = {
  description: string;
  level: EventTypeLevel;
  name: string;
};

// This is named `EventRecord` as there is already a DOM `Event` type. "Event
// record" is the verbose_name in the MAAS code.
export type EventRecord = TimestampedModel & {
  action: string;
  description: string;
  endpoint: number;
  ip_address: string | null;
  node_hostname: BaseNode["hostname"];
  node_id: BaseNode["id"] | null;
  node_system_id: BaseNode["system_id"] | null;
  type: EventType;
  user_agent: string;
  user_id: User["id"] | null;
  username: User["username"];
};

export type EventState = GenericState<EventRecord, string | null>;
