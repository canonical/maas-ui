import { Link } from "react-router-dom";
import { Spinner } from "@canonical/react-components";
import PropTypes from "prop-types";

import baseURLs from "app/base/urls";
import machineURLs from "app/machines/urls";
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
  let route;
  if (type === "machine") {
    return <Link to={machineURLs.machine.index({ id: nodeId })}>{name}</Link>;
  } else if (type === "controller") {
    route = baseURLs.controller({ id: nodeId });
  } else if (type === "device") {
    route = baseURLs.device({ id: nodeId });
  } else if (type === "subnet") {
    route = baseURLs.subnet({ id: subnetId });
  }

  return <LegacyLink route={route}>{name}</LegacyLink>;
};

DhcpTarget.propTypes = {
  nodeId: PropTypes.string,
  subnetId: PropTypes.number,
};

export default DhcpTarget;
