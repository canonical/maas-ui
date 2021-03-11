import type { ReactNode } from "react";

import { Input, MainTable, Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import DHCPColumn from "../NetworkTable/DHCPColumn";
import FabricColumn from "../NetworkTable/FabricColumn";
import IPColumn from "../NetworkTable/IPColumn";
import NameColumn from "../NetworkTable/NameColumn";
import { generateUniqueId } from "../NetworkTable/NetworkTable";
import PXEColumn from "../NetworkTable/PXEColumn";
import SpeedColumn from "../NetworkTable/SpeedColumn";
import SubnetColumn from "../NetworkTable/SubnetColumn";
import TypeColumn from "../NetworkTable/TypeColumn";
import type { Selected, SetSelected } from "../NetworkTable/types";

import FormikField from "app/base/components/FormikField";
import TableHeader from "app/base/components/TableHeader";
import machineSelectors from "app/store/machine/selectors";
import type {
  NetworkInterface,
  NetworkLink,
  Machine,
} from "app/store/machine/types";
import {
  getInterfaceById,
  getInterfaceName,
  getLinkFromNic,
} from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";
import { generateCheckboxHandlers, simpleSortByKey } from "app/utils";
import type { CheckboxHandlers } from "app/utils/generateCheckboxHandlers";

// TODO: This should eventually extend the react-components table row type
// when it has been migrated to TypeScript.
type NetworkRow = {
  className: string | null;
  columns: { className?: string; content: ReactNode }[];
  key: NetworkInterface["name"];
};

export type InterfaceRow = {
  linkId?: NetworkLink["id"] | null;
  nicId?: NetworkInterface["id"] | null;
};

const generateRow = (
  machine: Machine,
  interfaceRow: InterfaceRow,
  editPrimary = false,
  selected: Selected[] = [],
  handleRowCheckbox?: CheckboxHandlers<Selected>["handleRowCheckbox"] | null,
  checkSelected?: CheckboxHandlers<Selected>["checkSelected"] | null,
  selectedEditable?: boolean
): NetworkRow => {
  const { linkId, nicId } = interfaceRow;
  const nic = getInterfaceById(machine, nicId, linkId);
  const link = getLinkFromNic(nic, linkId);
  const isSelected = checkSelected
    ? checkSelected({ nicId, linkId }, selected)
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
            selected={selected}
            showCheckbox={selectedEditable}
            systemId={machine.system_id}
          />
        ),
      },
      {
        content: editPrimary ? (
          <span className="u-align--center">
            <FormikField
              component={Input}
              disabled={!isSelected}
              label=" "
              labelClassName="u-display-inline"
              name="primary"
              type="radio"
              value={nic?.id?.toString()}
            />
          </span>
        ) : (
          <PXEColumn link={link} nic={nic} systemId={machine.system_id} />
        ),
        className: "u-align--center",
      },
      {
        content: (
          <SpeedColumn link={link} nic={nic} systemId={machine.system_id} />
        ),
      },
      {
        content: (
          <TypeColumn link={link} nic={nic} systemId={machine.system_id} />
        ),
      },
      {
        content: (
          <FabricColumn link={link} nic={nic} systemId={machine.system_id} />
        ),
      },
      {
        content: (
          <SubnetColumn link={link} nic={nic} systemId={machine.system_id} />
        ),
      },
      {
        content: (
          <IPColumn link={link} nic={nic} systemId={machine.system_id} />
        ),
      },
      {
        content: <DHCPColumn nic={nic} systemId={machine.system_id} />,
      },
    ],
    key: getInterfaceName(machine, nic, link),
  };
};

type Props = {
  editPrimary?: boolean;
  interfaces: InterfaceRow[];
  selected?: Selected[];
  selectedEditable?: boolean;
  setSelected?: SetSelected | null;
  systemId: Machine["system_id"];
};

const InterfaceFormTable = ({
  editPrimary = false,
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

  if (!machine || !("interfaces" in machine) || interfaces.length === 0) {
    return <Spinner />;
  }

  const rows = interfaces
    .map((interfaceRow) =>
      generateRow(
        machine,
        interfaceRow,
        editPrimary,
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
              <TableHeader className="u-align--center">
                {editPrimary ? "Primary" : "PXE"}
              </TableHeader>
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
