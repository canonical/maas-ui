import { Fragment } from "react";

import { Tooltip, Icon } from "@canonical/react-components";

const ZonesListTitle = (): JSX.Element => {
  return (
    <Fragment>
      <span className="p-heading--four">Availability zones</span>
      <span style={{ marginLeft: "1rem" }}>
        <Tooltip
          message="A representation of a grouping of nodes, typically by physical
            location."
        >
          <Icon name="help" />
        </Tooltip>
      </span>
    </Fragment>
  );
};

export default ZonesListTitle;
