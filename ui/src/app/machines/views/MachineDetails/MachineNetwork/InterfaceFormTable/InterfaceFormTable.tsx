import type { ReactNode } from "react";

import { MainTable, Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import DHCPColumn from "../NetworkTable/DHCPColumn";
import FabricColumn from "../NetworkTable/FabricColumn";
import IPColumn from "../NetworkTable/IPColumn";
import NameColumn from "../NetworkTable/NameColumn";
import PXEColumn from "../NetworkTable/PXEColumn";
import SpeedColumn from "../NetworkTable/SpeedColumn";
import SubnetColumn from "../NetworkTable/SubnetColumn";
import TypeColumn from "../NetworkTable/TypeColumn";

import TableHeader from "app/base/components/TableHeader";
import machineSelectors from "app/store/machine/selectors";
import type {
  NetworkInterface,
  NetworkLink,
  Machine,
} from "app/store/machine/types";
import { getInterfaceName } from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";

// TODO: This should eventually extend the react-components table row type
// when it has been migrated to TypeScript.
type NetworkRow = {
  columns: { className?: string; content: ReactNode }[];
  key: NetworkInterface["name"];
};

const generateRow = (machine: Machine, nic: NetworkInterface): NetworkRow => {
  const name = getInterfaceName(machine, nic);
  return {
    columns: [
      {
        content: <NameColumn nic={nic} systemId={machine.system_id} />,
      },
      {
        content: <PXEColumn nic={nic} systemId={machine.system_id} />,
      },
      {
        content: <SpeedColumn nic={nic} systemId={machine.system_id} />,
      },
      {
        content: <TypeColumn nic={nic} systemId={machine.system_id} />,
      },
      {
        content: <FabricColumn nic={nic} systemId={machine.system_id} />,
      },
      {
        content: <SubnetColumn nic={nic} systemId={machine.system_id} />,
      },
      {
        content: <IPColumn nic={nic} systemId={machine.system_id} />,
      },
      {
        content: <DHCPColumn nic={nic} systemId={machine.system_id} />,
      },
    ],
    key: name,
  };
};

type Props = {
  linkId?: NetworkLink["id"] | null;
  nicId?: NetworkInterface["id"] | null;
  systemId: Machine["system_id"];
};

const NetworkTable = ({ linkId, nicId, systemId }: Props): JSX.Element => {
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const nic = useSelector((state: RootState) =>
    machineSelectors.getInterfaceById(state, systemId, nicId, linkId)
  );

  if (!machine || !("interfaces" in machine) || !nic) {
    return <Spinner />;
  }

  const row = generateRow(machine, nic);
  return (
    <MainTable
      headers={[
        {
          content: (
            <>
              <TableHeader>Name</TableHeader>
              <TableHeader>MAC</TableHeader>
            </>
          ),
        },
        {
          content: (
            <>
              <TableHeader className="u-align--center">PXE</TableHeader>
            </>
          ),
        },
        {
          content: (
            <TableHeader className="p-double-row__header-spacer">
              Link/interface speed
            </TableHeader>
          ),
        },
        {
          content: (
            <div>
              <TableHeader className="p-double-row__header-spacer">
                Type
              </TableHeader>
              <TableHeader className="p-double-row__header-spacer">
                NUMA node
              </TableHeader>
            </div>
          ),
        },
        {
          content: (
            <div>
              <TableHeader>Fabric</TableHeader>
              <TableHeader>VLAN</TableHeader>
            </div>
          ),
        },
        {
          content: (
            <div>
              <TableHeader>Subnet</TableHeader>
              <TableHeader>Name</TableHeader>
            </div>
          ),
        },
        {
          content: (
            <div>
              <TableHeader>IP Address</TableHeader>
              <TableHeader>Status</TableHeader>
            </div>
          ),
        },
        {
          content: (
            <TableHeader className="p-double-row__header-spacer">
              DHCP
            </TableHeader>
          ),
        },
      ]}
      rows={[row]}
    />
  );
};

export default NetworkTable;
