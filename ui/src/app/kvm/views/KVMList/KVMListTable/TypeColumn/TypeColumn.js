import React from "react";
import { useSelector } from "react-redux";

import { pod as podSelectors } from "app/base/selectors";
import DoubleRow from "app/base/components/DoubleRow";

const formatHostType = (type) => {
  switch (type) {
    case "lxd":
      return "LXD";
    case "virsh":
      return "Virsh";
    default:
      return type;
  }
};

const TypeColumn = ({ id }) => {
  const pod = useSelector((state) => podSelectors.getById(state, id));

  return (
    <DoubleRow
      primary={<span data-test="pod-type">{formatHostType(pod.type)}</span>}
    />
  );
};

export default TypeColumn;
