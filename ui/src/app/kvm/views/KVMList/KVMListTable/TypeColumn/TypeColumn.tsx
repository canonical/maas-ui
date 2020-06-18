import React from "react";
import { useSelector } from "react-redux";

import { pod as podSelectors } from "app/base/selectors";
import { RootState } from "app/base/types";
import DoubleRow from "app/base/components/DoubleRow";

const formatHostType = (type: string) => {
  switch (type) {
    case "lxd":
      return "LXD";
    case "virsh":
      return "Virsh";
    default:
      return type;
  }
};

type Props = { id: number };

const TypeColumn = ({ id }: Props): JSX.Element => {
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );

  return (
    <DoubleRow
      primary={<span data-test="pod-type">{formatHostType(pod.type)}</span>}
    />
  );
};

export default TypeColumn;
