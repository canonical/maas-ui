import { useState } from "react";

import { Spinner, Strip } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

import type { SetSelectedAction } from "../types";

import DHCPTable from "./DHCPTable";
import NetworkActions from "./NetworkActions";
import NetworkTable from "./NetworkTable";

import { useWindowTitle } from "app/base/hooks";
import type { RouteParams } from "app/base/types";
import machineSelectors from "app/store/machine/selectors";
import type { NetworkInterface } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";

type Props = { setSelectedAction: SetSelectedAction };

const MachineNetwork = ({ setSelectedAction }: Props): JSX.Element => {
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
    <>
      <NetworkActions setSelectedAction={setSelectedAction} systemId={id} />
      <Strip>
        <NetworkTable
          systemId={id}
          selected={selected}
          setSelected={setSelected}
        />
      </Strip>
      <DHCPTable systemId={id} />
    </>
  );
};

export default MachineNetwork;
