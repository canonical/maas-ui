import type { AnyAction } from "redux";

import type { CommonActionFormProps } from "app/base/types";
import type { SelectedMachines } from "app/store/machine/types";
import type { Node } from "app/store/types/node";

export type NodeActionFormProps<E = null> = CommonActionFormProps<E> & {
  cleanup?: () => AnyAction;
  nodes?: Node[];
  selectedCount: number;
  selected?: SelectedMachines;
  modelName: string;
};
