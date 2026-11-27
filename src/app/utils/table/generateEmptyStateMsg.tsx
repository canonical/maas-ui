import type { ReactNode } from "react";

import type { TableStatus } from "./getTableStatus";

import Spinner from "@/app/base/components/Spinner";

export const generateEmptyStateMsg = (
  status: TableStatus,
  customLabelMapping: Partial<Record<TableStatus, ReactNode>> = {}
): ReactNode => {
  const defaultLabelMapping = {
    loading: <Spinner text="Loading..." />,
    filtered: "No data matches the search criteria.",
    default: "No data is available.",
  };

  const labelMapping = {
    ...defaultLabelMapping,
    ...customLabelMapping,
  };

  return labelMapping[status];
};
