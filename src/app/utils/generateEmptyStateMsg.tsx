import type { ReactNode } from "react";

import { Spinner } from "@canonical/react-components";

export const generateEmptyStateMsg = ({
  emptyStateMsg,
  isLoading,
  hasFilter,
  emptySearchMsg = "No data matches the search criteria",
}: {
  emptyStateMsg: ReactNode;
  isLoading?: boolean;
  hasFilter?: boolean;
  emptySearchMsg?: ReactNode;
}): ReactNode => {
  if (isLoading) {
    return <Spinner text="Loading..." />;
  } else if (hasFilter) {
    return emptySearchMsg;
  }

  return emptyStateMsg;
};
