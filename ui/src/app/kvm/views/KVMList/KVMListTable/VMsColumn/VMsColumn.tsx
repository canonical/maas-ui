import React from "react";
import { useSelector } from "react-redux";

import { pod as podSelectors } from "app/base/selectors";
import { RootState } from "app/base/types";
import DoubleRow from "app/base/components/DoubleRow";

type Props = { id: number };

const VMsColumn = ({ id }: Props): JSX.Element => {
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );

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
};

export default VMsColumn;
