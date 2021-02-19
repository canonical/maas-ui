import { useState } from "react";

import { Spinner, Strip } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

import type { SetSelectedAction } from "../types";

import AddInterface from "./AddInterface";
import DHCPTable from "./DHCPTable";
import EditInterface from "./EditInterface";
import NetworkActions from "./NetworkActions";
import NetworkTable from "./NetworkTable";
import type { Expanded } from "./NetworkTable/types";
import { ExpandedState } from "./NetworkTable/types";

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
  const [interfaceExpanded, setInterfaceExpanded] = useState<Expanded | null>(
    null
  );
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, id)
  );

  useWindowTitle(`${`${machine?.fqdn} ` || "Machine"} network`);

  if (!machine) {
    return <Spinner text="Loading..." />;
  }

  return interfaceExpanded?.content === ExpandedState.EDIT ? (
    <EditInterface
      close={() => setInterfaceExpanded(null)}
      linkId={interfaceExpanded?.linkId}
      nicId={interfaceExpanded?.nicId}
      systemId={id}
    />
  ) : (
    <>
      <NetworkActions
        expanded={interfaceExpanded}
        setExpanded={setInterfaceExpanded}
        setSelectedAction={setSelectedAction}
        systemId={id}
      />
      <Strip>
        <NetworkTable
          expanded={interfaceExpanded}
          selected={selected}
          setExpanded={setInterfaceExpanded}
          setSelected={setSelected}
          systemId={id}
        />
        {interfaceExpanded?.content === ExpandedState.ADD_PHYSICAL ? (
          <AddInterface
            close={() => setInterfaceExpanded(null)}
            systemId={id}
          />
        ) : null}
      </Strip>
      <DHCPTable systemId={id} />
    </>
  );
};

export default MachineNetwork;
