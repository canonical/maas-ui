import { Factory } from "fishery";
import {
  adjectives,
  animals,
  uniqueNamesGenerator,
} from "unique-names-generator";

import type { SwitchResponse } from "@/app/apiclient";

type SwitchItem = SwitchResponse & {
  name?: string;
  mac_address?: string;
  status?: string;
  ztp_enabled?: boolean;
};

export const switchFactory = Factory.define<SwitchItem>(({ sequence }) => {
  const name = uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    separator: "-",
    style: "lowerCase",
    seed: sequence,
  });

  return {
    id: sequence,
    name,
    mac_address: `00:00:00:00:00:${sequence}`,
    status: "Ready",
    ztp_enabled: sequence % 2 !== 0,
  };
});
