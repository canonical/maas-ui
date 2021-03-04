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
import type { Expanded, Selected } from "./NetworkTable/types";
import { ExpandedState } from "./NetworkTable/types";

import { useWindowTitle } from "app/base/hooks";
import type { RouteParams } from "app/base/types";
import machineSelectors from "app/store/machine/selectors";
import type { RootState } from "app/store/root/types";

type Props = { setSelectedAction: SetSelectedAction };

const MachineNetwork = ({ setSelectedAction }: Props): JSX.Element => {
  const params = useParams<RouteParams>();
  const { id } = params;
  const [selected, setSelected] = useState<Selected[]>([]);
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

  if (interfaceExpanded?.content === ExpandedState.EDIT) {
    return (
      <EditInterface
        close={() => setInterfaceExpanded(null)}
        linkId={interfaceExpanded?.linkId}
        nicId={interfaceExpanded?.nicId}
        systemId={id}
      />
    );
  } else if (interfaceExpanded?.content === ExpandedState.ADD_BOND) {
    // Temporary placeholder for the form.
    return (
      <>
        Add bond{" "}
        <button onClick={() => setInterfaceExpanded(null)}>cancel</button>
      </>
    );
  } else if (interfaceExpanded?.content === ExpandedState.ADD_BRIDGE) {
    // Temporary placeholder for the form.
    return (
      <>
        Add bridge{" "}
        <button onClick={() => setInterfaceExpanded(null)}>cancel</button>
      </>
    );
  }

  return (
    <>
      <NetworkActions
        expanded={interfaceExpanded}
        selected={selected}
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
