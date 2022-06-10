import { useState } from "react";

import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import AddBondForm from "./AddBondForm";
import AddBridgeForm from "./AddBridgeForm";
import AddInterface from "./AddInterface";
import EditInterface from "./EditInterface";
import MachineNetworkActions from "./MachineNetworkActions";

import DHCPTable from "app/base/components/DHCPTable";
import NodeNetworkTab from "app/base/components/NodeNetworkTab";
import { ExpandedState } from "app/base/components/NodeNetworkTab/NodeNetworkTab";
import NetworkTable from "app/base/components/node/networking/NetworkTable";
import type { Selected } from "app/base/components/node/networking/types";
import { useWindowTitle } from "app/base/hooks";
import type { MachineSetHeaderContent } from "app/machines/types";
import machineSelectors from "app/store/machine/selectors";
import { MachineMeta } from "app/store/machine/types";
import type { Machine } from "app/store/machine/types";
import { isMachineDetails } from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";

type Props = {
  id: Machine[MachineMeta.PK];
  setHeaderContent: MachineSetHeaderContent;
};

const MachineNetwork = ({ id, setHeaderContent }: Props): JSX.Element => {
  const [selected, setSelected] = useState<Selected[]>([]);
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, id)
  );

  useWindowTitle(`${machine?.fqdn ? `${machine?.fqdn} ` : "Machine"} network`);

  if (!machine || !isMachineDetails(machine)) {
    return <Spinner aria-label="Loading machine" text="Loading..." />;
  }

  return (
    <NodeNetworkTab
      aria-label="Machine network"
      actions={(expanded, setExpanded) => (
        <MachineNetworkActions
          expanded={expanded}
          selected={selected}
          setExpanded={setExpanded}
          setHeaderContent={setHeaderContent}
          systemId={id}
        />
      )}
      addInterface={(_, setExpanded) => (
        <AddInterface close={() => setExpanded(null)} systemId={id} />
      )}
      dhcpTable={() => (
        <DHCPTable
          className="u-no-padding--top"
          node={machine}
          modelName={MachineMeta.MODEL}
        />
      )}
      expandedForm={(expanded, setExpanded) => {
        if (expanded?.content === ExpandedState.EDIT) {
          return (
            <EditInterface
              close={() => setExpanded(null)}
              linkId={expanded?.linkId}
              nicId={expanded?.nicId}
              selected={selected}
              setSelected={setSelected}
              systemId={id}
            />
          );
        } else if (expanded?.content === ExpandedState.ADD_BOND) {
          return (
            <AddBondForm
              close={() => {
                setExpanded(null);
                setSelected([]);
              }}
              selected={selected}
              setSelected={setSelected}
              systemId={id}
            />
          );
        } else if (expanded?.content === ExpandedState.ADD_BRIDGE) {
          return (
            <AddBridgeForm
              close={() => {
                setExpanded(null);
                setSelected([]);
              }}
              selected={selected}
              systemId={id}
            />
          );
        }
        return null;
      }}
      interfaceTable={(expanded, setExpanded) => (
        <NetworkTable
          expanded={expanded}
          selected={selected}
          setExpanded={setExpanded}
          setSelected={setSelected}
          node={machine}
        />
      )}
    />
  );
};

export default MachineNetwork;
