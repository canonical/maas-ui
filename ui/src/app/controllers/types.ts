import type { ValueOf } from "@canonical/react-components";

import type { HeaderContent, SetHeaderContent } from "app/base/types";
import type { ControllerHeaderViews } from "app/controllers/constants";

export type ControllerHeaderContent = HeaderContent<
  ValueOf<typeof ControllerHeaderViews>
>;

export type ControllerSetHeaderContent =
  SetHeaderContent<ControllerHeaderContent>;
