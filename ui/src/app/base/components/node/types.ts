import type { CommonActionFormProps } from "app/base/types";
import type { Node } from "app/store/types/node";

export type NodeActionFormProps<E = null> = CommonActionFormProps<E> & {
  cleanup?: () => void;
  nodes: Node[];
  modelName: string;
};
