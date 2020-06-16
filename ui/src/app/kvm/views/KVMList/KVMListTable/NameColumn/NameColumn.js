import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { pod as podSelectors } from "app/base/selectors";

const NameColumn = ({ id }) => {
  const pod = useSelector((state) => podSelectors.getById(state, id));

  return (
    <Link to={`/kvm/${pod.id}`}>
      <strong>{pod.name}</strong>
    </Link>
  );
};

export default NameColumn;
