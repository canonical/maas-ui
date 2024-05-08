import { extend, sequence } from "cooky-cutter";

import { timestampedModel } from "./model";

import type { ReservedIp } from "@/app/store/reservedip/types";
import type { TimestampedModel } from "@/app/store/types/model";

export const reservedIp = extend<TimestampedModel, ReservedIp>(
  timestampedModel,
  {
    id: sequence,
    comment: "Lorem ipsum dolor sit amet",
    ip: (i: number) => `192.168.1.${i}`,
    mac_address: (i: number) => `00:00:00:00:00:${i}`,
    subnet: 1,
  }
);
