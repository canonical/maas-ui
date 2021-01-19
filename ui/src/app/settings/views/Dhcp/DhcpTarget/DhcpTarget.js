import { Link } from "react-router-dom";
import { Spinner } from "@canonical/react-components";
import PropTypes from "prop-types";

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
  if (type === "machine") {
    return <Link to={`/${type}/${nodeId || subnetId}`}>{name}</Link>;
  }

  return (
    <LegacyLink route={`/${type}/${nodeId || subnetId}`}>{name}</LegacyLink>
  );
};

DhcpTarget.propTypes = {
  nodeId: PropTypes.string,
  subnetId: PropTypes.number,
};

export default DhcpTarget;
