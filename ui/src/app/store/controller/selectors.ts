import { ControllerMeta } from "app/store/controller/types";
import type { Controller, ControllerState } from "app/store/controller/types";
import { generateBaseSelectors } from "app/store/utils";

const searchFunction = (controller: Controller, term: string) =>
  controller.fqdn.includes(term);

const selectors = generateBaseSelectors<
  ControllerState,
  Controller,
  ControllerMeta.PK
>(ControllerMeta.MODEL, ControllerMeta.PK, searchFunction);

export default selectors;
