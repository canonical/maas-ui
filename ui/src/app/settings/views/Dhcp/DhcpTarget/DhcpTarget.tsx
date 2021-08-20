import type { ReactNode } from "react";

import { Spinner } from "@canonical/react-components";
import { Link } from "react-router-dom";

import LegacyLink from "app/base/components/LegacyLink";
import baseURLs from "app/base/urls";
import machineURLs from "app/machines/urls";
import { useDhcpTarget } from "app/settings/hooks";
import type { DHCPSnippet } from "app/store/dhcpsnippet/types";

type Props = {
  nodeId?: DHCPSnippet["node"];
  subnetId?: DHCPSnippet["subnet"];
};

const DhcpTarget = ({ nodeId, subnetId }: Props): JSX.Element | null => {
  const { loading, loaded, target, type } = useDhcpTarget(
    nodeId || null,
    subnetId
  );

  if (loading || !loaded) {
    return <Spinner className="u-no-margin u-no-padding" />;
  }
  if (!target) {
    return null;
  }
  let name: ReactNode = null;
  if (subnetId && "name" in target) {
    name = target.name;
  } else if ("hostname" in target) {
    name = (
      <>
        {target.hostname}
        <small>.{target.domain.name}</small>
      </>
    );
  }
  let route;
  if (type === "machine" && nodeId) {
    return <Link to={machineURLs.machine.index({ id: nodeId })}>{name}</Link>;
  } else if (type === "controller" && nodeId) {
    route = baseURLs.controller({ id: nodeId });
  } else if (type === "device" && nodeId) {
    route = baseURLs.device({ id: nodeId });
  } else if (type === "subnet" && subnetId) {
    route = baseURLs.subnet({ id: subnetId });
  }

  return route ? <LegacyLink route={route}>{name}</LegacyLink> : null;
};

export default DhcpTarget;
