import { Link, Spinner } from "@canonical/react-components";
import PropTypes from "prop-types";
import React from "react";

import { generateLegacyURL } from "app/utils";
import { useDhcpTarget } from "app/settings/hooks";

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
  const url = generateLegacyURL(`/${type}/${nodeId || subnetId}`);
  return (
    <Link
      href={url}
      onClick={(evt) => {
        evt.preventDefault();
        window.history.pushState(null, null, url);
      }}
    >
      {name}
    </Link>
  );
};

DhcpTarget.propTypes = {
  nodeId: PropTypes.string,
  subnetId: PropTypes.number,
};

export default DhcpTarget;
