import { useMemo } from "react";

import { ModularTable } from "@canonical/react-components";

import { columnLabels, ControllerVLANsColumns } from "./constants";
import { useControllerVLANsTable } from "./hooks";

import ControllerLink from "app/base/components/ControllerLink";
import FabricLink from "app/base/components/FabricLink";
import SubnetLink from "app/base/components/SubnetLink";
import VLANLink from "app/base/components/VLANLink";
import type { Controller, ControllerMeta } from "app/store/controller/types";
import type { Fabric } from "app/store/fabric/types";
import type { Subnet } from "app/store/subnet/types";
import type { VLAN } from "app/store/vlan/types";

type Props = {
  systemId: Controller[ControllerMeta.PK];
};

const getVlanDhcpStatus = ({ vlan }: { vlan: VLAN }): string =>
  vlan.dhcp_on === true || vlan.relay_vlan !== null || !!vlan.external_dhcp
    ? "Enabled"
    : "Disabled";

const ControllerVLANsTable = ({ systemId }: Props): JSX.Element => {
  const { data, loaded } = useControllerVLANsTable({ systemId });

  return (
    <ModularTable
      emptyMsg={loaded ? "No VLANs found" : "Loading..."}
      className="controller-vlans-table"
      aria-label="Controller VLANs"
      columns={useMemo(
        () => [
          {
            Header: columnLabels[ControllerVLANsColumns.FABRIC],
            accessor: ControllerVLANsColumns.FABRIC,
            Cell: ({ value }: { value: Fabric }) => <FabricLink {...value} />,
          },
          {
            Header: columnLabels[ControllerVLANsColumns.VLAN],
            accessor: ControllerVLANsColumns.VLAN,
            Cell: ({ value }: { value: VLAN }) => <VLANLink {...value} />,
          },
          {
            id: ControllerVLANsColumns.DHCP,
            Header: columnLabels[ControllerVLANsColumns.DHCP],
            accessor: ControllerVLANsColumns.VLAN,
            Cell: ({ value }: { value: VLAN }) =>
              getVlanDhcpStatus({ vlan: value }),
          },
          {
            Header: columnLabels[ControllerVLANsColumns.SUBNET],
            accessor: ControllerVLANsColumns.SUBNET,
            Cell: ({ value }: { value: Subnet[] }) => (
              <>
                {value?.map((subnet: Subnet) => (
                  <div key={subnet.id}>
                    <SubnetLink {...subnet} />
                  </div>
                ))}
              </>
            ),
          },
          {
            Header: columnLabels[ControllerVLANsColumns.PRIMARY_RACK],
            accessor: ControllerVLANsColumns.PRIMARY_RACK,
            Cell: ({ value }: { value: string }) => (
              <ControllerLink systemId={value} />
            ),
          },
          {
            Header: columnLabels[ControllerVLANsColumns.SECONDARY_RACK],
            accessor: ControllerVLANsColumns.SECONDARY_RACK,
            Cell: ({ value }: { value: string }) => (
              <ControllerLink systemId={value} />
            ),
          },
        ],
        []
      )}
      data={data}
    />
  );
};

export default ControllerVLANsTable;
