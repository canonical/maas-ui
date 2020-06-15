import React from "react";
import { useSelector } from "react-redux";

import { pod as podSelectors } from "app/base/selectors";

const VMsColumn = ({ id }) => {
  const pod = useSelector((state) => podSelectors.getById(state, id));

  return (
    <>
      <span data-test="pod-machines-count">{pod.composed_machines_count}</span>
      <br />
      <small className="u-text--light" data-test="pod-owners-count">
        {pod.owners_count}
      </small>
    </>
  );
};

export default VMsColumn;
