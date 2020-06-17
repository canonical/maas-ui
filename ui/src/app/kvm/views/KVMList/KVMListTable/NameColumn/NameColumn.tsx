import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { pod as podSelectors } from "app/base/selectors";
import { RootState } from "app/base/types";
import DoubleRow from "app/base/components/DoubleRow";

type Props = { id: number };

const NameColumn = ({ id }: Props): JSX.Element => {
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );

  return (
    <DoubleRow
      primary={
        <Link to={`/kvm/${pod.id}`}>
          <strong>{pod.name}</strong>
        </Link>
      }
    />
  );
};

export default NameColumn;
