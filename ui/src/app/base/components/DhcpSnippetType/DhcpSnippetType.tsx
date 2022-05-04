import { Spinner } from "@canonical/react-components";

import { useDhcpTarget } from "app/settings/hooks";
import type { DHCPSnippet } from "app/store/dhcpsnippet/types";

type Props = {
  nodeId?: DHCPSnippet["node"];
  subnetId?: DHCPSnippet["subnet"];
};

const dhcpTypeLabels = {
  controller: "Controller",
  device: "Device",
  global: "Global",
  machine: "Machine",
  subnet: "Subnet",
};

const DhcpSnippetType = ({ nodeId, subnetId }: Props): JSX.Element | null => {
  const { loading, loaded, type } = useDhcpTarget(nodeId || null, subnetId);

  if (!nodeId && !subnetId) return <>{dhcpTypeLabels.global}</>;

  if (loading || !loaded) {
    return <Spinner className="u-no-margin u-no-padding" />;
  }
  return <>{type ? dhcpTypeLabels[type] : null}</>;
};

export default DhcpSnippetType;
