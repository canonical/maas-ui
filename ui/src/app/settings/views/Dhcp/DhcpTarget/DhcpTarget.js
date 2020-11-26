import { Spinner } from "@canonical/react-components";
import PropTypes from "prop-types";
import React from "react";

import { useDhcpTarget } from "app/settings/hooks";
import LegacyLink from "app/base/components/LegacyLink";

const DhcpTarget = ({ nodeId, subnetId }) => {
  const { loading, loaded, target, type } = useDhcpTarget(nodeId, subnetId);

  if (loading || !loaded) {
    return <Spinner inline className="u-no-margin u-no-padding" />;
  }

  const name = subnetId ? (
    target.name
  ) : (
    <>
      {target.hostname}
      <small>.{target.domain.name}</small>
    </>
  );

  return (
    <LegacyLink route={`/${type}/${nodeId || subnetId}`}>{name}</LegacyLink>
  );
};

DhcpTarget.propTypes = {
  nodeId: PropTypes.string,
  subnetId: PropTypes.number,
};

export default DhcpTarget;
