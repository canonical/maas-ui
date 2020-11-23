import { generateBaseSelectors } from "app/store/utils";

import type { Controller, ControllerState } from "app/store/controller/types";

const searchFunction = (controller: Controller, term: string) =>
  controller.fqdn.includes(term);

const selectors = generateBaseSelectors<
  ControllerState,
  Controller,
  "system_id"
>("controller", "system_id", searchFunction);

export default selectors;
