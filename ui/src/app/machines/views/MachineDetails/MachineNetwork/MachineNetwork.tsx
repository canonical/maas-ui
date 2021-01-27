import { useState } from "react";

import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

import NetworkTable from "./NetworkTable";

import { useWindowTitle } from "app/base/hooks";
import type { RouteParams } from "app/base/types";
import machineSelectors from "app/store/machine/selectors";
import type { NetworkInterface } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";

const MachineNetwork = (): JSX.Element => {
  const params = useParams<RouteParams>();
  const { id } = params;
  const [selected, setSelected] = useState<NetworkInterface["id"][]>([]);
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, id)
  );

  useWindowTitle(`${`${machine?.fqdn} ` || "Machine"} network`);

  if (!machine) {
    return <Spinner text="Loading..." />;
  }

  return (
    <NetworkTable systemId={id} selected={selected} setSelected={setSelected} />
  );
};

export default MachineNetwork;
