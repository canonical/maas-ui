import type { ReactNode } from "react";

import { Spinner } from "@canonical/react-components";
import { Link } from "react-router-dom";

import LegacyLink from "app/base/components/LegacyLink";
import controllersURLs from "app/controllers/urls";
import deviceURLs from "app/devices/urls";
import machineURLs from "app/machines/urls";
import { useDhcpTarget } from "app/settings/hooks";
import type { DHCPSnippet } from "app/store/dhcpsnippet/types";
import subnetsURLs from "app/subnets/urls";

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
    route = machineURLs.machine.index({ id: nodeId });
  } else if (type === "controller" && nodeId) {
    return (
      <LegacyLink route={controllersURLs.controller.index({ id: nodeId })}>
        {name}
      </LegacyLink>
    );
  } else if (type === "device" && nodeId) {
    route = deviceURLs.device.index({ id: nodeId });
  } else if (type === "subnet" && subnetId) {
    route = subnetsURLs.subnet.index({ id: subnetId });
  }
  return route ? <Link to={route}>{name}</Link> : null;
};

export default DhcpTarget;
