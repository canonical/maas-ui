import React from "react";
import { useSelector } from "react-redux";

import podSelectors from "app/store/pod/selectors";
import type { RootState } from "app/store/root/types";
import DoubleRow from "app/base/components/DoubleRow";

type Props = { id: number };

const VMsColumn = ({ id }: Props): JSX.Element | null => {
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );

  if (pod) {
    return (
      <DoubleRow
        primary={
          <span data-test="pod-machines-count">
            {pod.composed_machines_count}
          </span>
        }
        primaryClassName="u-align--right"
        secondary={<span data-test="pod-owners-count">{pod.owners_count}</span>}
        secondaryClassName="u-align--right"
      />
    );
  }
  return null;
};

export default VMsColumn;
