import { MainTable, Spinner } from "@canonical/react-components";
import type { MainTableRow } from "@canonical/react-components/dist/components/MainTable/MainTable";
import { useSelector } from "react-redux";

import IPColumn from "../NetworkTable/IPColumn";
import { generateUniqueId } from "../NetworkTable/NetworkTable";
import PXEColumn from "../NetworkTable/PXEColumn";
import SpeedColumn from "../NetworkTable/SpeedColumn";

import TableHeader from "app/base/components/TableHeader";
import DHCPColumn from "app/base/components/node/networking/DHCPColumn";
import FabricColumn from "app/base/components/node/networking/FabricColumn";
import NameColumn from "app/base/components/node/networking/NameColumn";
import SubnetColumn from "app/base/components/node/networking/SubnetColumn";
import TypeColumn from "app/base/components/node/networking/TypeColumn";
import type {
  Selected,
  SetSelected,
} from "app/base/components/node/networking/types";
import machineSelectors from "app/store/machine/selectors";
import type { Machine, MachineDetails } from "app/store/machine/types";
import { isMachineDetails } from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";
import type { NetworkInterface, NetworkLink } from "app/store/types/node";
import {
  getInterfaceById,
  getInterfaceName,
  getLinkFromNic,
} from "app/store/utils";
import { generateCheckboxHandlers, simpleSortByKey } from "app/utils";
import type { CheckboxHandlers } from "app/utils/generateCheckboxHandlers";

export type InterfaceRow = {
  linkId?: NetworkLink["id"] | null;
  nicId?: NetworkInterface["id"] | null;
};

const generateRow = (
  machine: MachineDetails,
  interfaceRow: InterfaceRow,
  selected: Selected[] = [],
  handleRowCheckbox?: CheckboxHandlers<Selected>["handleRowCheckbox"] | null,
  checkSelected?: CheckboxHandlers<Selected>["checkSelected"] | null,
  selectedEditable?: boolean
): MainTableRow => {
  const { linkId, nicId } = interfaceRow;
  const nic = getInterfaceById(machine, nicId, linkId);
  const link = getLinkFromNic(nic, linkId);
  const isSelected = checkSelected
    ? checkSelected({ linkId, nicId }, selected)
    : false;
  return {
    className: isSelected || !selectedEditable ? null : "p-table__row--muted",
    columns: [
      {
        content: (
          <NameColumn
            checkSelected={checkSelected}
            handleRowCheckbox={handleRowCheckbox}
            link={link}
            nic={nic}
            node={machine}
            selected={selected}
            showCheckbox={selectedEditable}
          />
        ),
      },
      {
        className: "u-align--center",
        content: (
          <PXEColumn link={link} nic={nic} systemId={machine.system_id} />
        ),
      },
      {
        content: (
          <SpeedColumn link={link} nic={nic} systemId={machine.system_id} />
        ),
      },
      {
        content: <TypeColumn link={link} nic={nic} node={machine} />,
      },
      {
        content: <FabricColumn link={link} nic={nic} node={machine} />,
      },
      {
        content: <SubnetColumn link={link} nic={nic} node={machine} />,
      },
      {
        content: (
          <IPColumn link={link} nic={nic} systemId={machine.system_id} />
        ),
      },
      {
        content: <DHCPColumn nic={nic} />,
      },
    ],
    key: getInterfaceName(machine, nic, link),
  };
};

type Props = {
  interfaces: InterfaceRow[];
  selected?: Selected[];
  selectedEditable?: boolean;
  setSelected?: SetSelected | null;
  systemId: Machine["system_id"];
};

const InterfaceFormTable = ({
  interfaces,
  selected = [],
  selectedEditable,
  setSelected,
  systemId,
}: Props): JSX.Element => {
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  let handleRowCheckbox: CheckboxHandlers<Selected>["handleRowCheckbox"] | null;
  let checkSelected: CheckboxHandlers<Selected>["checkSelected"] | null;
  if (setSelected) {
    const handlers = generateCheckboxHandlers<Selected>(
      setSelected,
      generateUniqueId
    );
    checkSelected = handlers.checkSelected;
    handleRowCheckbox = handlers.handleRowCheckbox;
  }

  if (!isMachineDetails(machine) || interfaces.length === 0) {
    return <Spinner />;
  }

  const rows = interfaces
    .map((interfaceRow) =>
      generateRow(
        machine,
        interfaceRow,
        selected,
        handleRowCheckbox,
        checkSelected,
        selectedEditable
      )
    )
    .sort(simpleSortByKey("key"));
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
      rows={rows}
    />
  );
};

export default InterfaceFormTable;
