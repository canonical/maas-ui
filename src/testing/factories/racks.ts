import { Factory } from "fishery";
import {
  adjectives,
  animals,
  uniqueNamesGenerator,
} from "unique-names-generator";

import type { RackResponse } from "@/app/apiclient";

export const rackFactory = Factory.define<RackResponse>(({ sequence }) => {
  const name = uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    separator: "_",
    style: "lowerCase",
    seed: sequence,
  });
  return {
    id: sequence,
    name,
  };
});
