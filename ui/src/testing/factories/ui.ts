import { define } from "cooky-cutter";

import { MachineMeta } from "app/store/machine/types";
import { NodeActions } from "app/store/types/node";
import type { HeaderForm } from "app/store/ui/types";

export const headerForm = define<HeaderForm>({
  model: MachineMeta.MODEL,
  name: NodeActions.COMMISSION,
});
