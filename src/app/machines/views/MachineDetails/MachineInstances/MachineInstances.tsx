import type { ReactElement } from "react";
import { useEffect } from "react";

import { GenericTable } from "@canonical/maas-react-components";
import { Row, Col } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { useWindowTitle } from "@/app/base/hooks";
import { useGetURLId } from "@/app/base/hooks/urls";
import type { SyncNavigateFunction } from "@/app/base/types";
import urls from "@/app/base/urls";
import useMachineInstancesColumns, {
  filterCells,
} from "@/app/machines/views/MachineDetails/MachineInstances/useMachineInstancesColumns/useMachineInstancesColumns";
import machineSelectors from "@/app/store/machine/selectors";
import { MachineMeta } from "@/app/store/machine/types";
import { isMachineDetails } from "@/app/store/machine/utils";
import type { RootState } from "@/app/store/root/types";
import type {
  NetworkInterface,
  NetworkLink,
  NodeDeviceRef,
} from "@/app/store/types/node";

import "./_index.scss";

export type MachineInstance = {
  id: string;
  name: NodeDeviceRef["fqdn"];
  mac: NetworkInterface["mac_address"];
  ip: NetworkLink["ip_address"];
  interfaceCount: number;
};

const generateTableData = (devices: NodeDeviceRef[]): MachineInstance[] =>
  devices.flatMap((device): MachineInstance[] => {
    const interfaceCount = device.interfaces?.length ?? 0;
    if (!interfaceCount) {
      return [
        { id: device.fqdn, name: device.fqdn, mac: "", ip: "", interfaceCount },
      ];
    }
    return device.interfaces.flatMap((iface, ifaceIndex) => [
      {
        id: `${device.fqdn}-${ifaceIndex}`,
        name: device.fqdn,
        mac: iface.mac_address,
        ip: iface.links?.[0]?.ip_address ?? "",
        interfaceCount,
      },
      ...(iface.links?.slice(1).map((link, linkIndex) => ({
        id: `${device.fqdn}-${ifaceIndex}-${linkIndex + 1}`,
        name: device.fqdn,
        mac: "",
        ip: link.ip_address ?? "",
        interfaceCount,
      })) ?? []),
    ]);
  });

const MachineInstances = (): ReactElement => {
  const navigate: SyncNavigateFunction = useNavigate();
  const id = useGetURLId(MachineMeta.PK);
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, id)
  );

  useWindowTitle(`${`${machine?.fqdn || "Machine"} `} instances`);

  useEffect(() => {
    if (
      machine &&
      (!isMachineDetails(machine) || machine.devices.length === 0)
    ) {
      navigate(urls.machines.machine.summary({ id: machine.system_id }), {
        replace: true,
      });
    }
  }, [navigate, machine]);

  const data =
    machine && isMachineDetails(machine) && machine.devices.length > 0
      ? generateTableData(machine.devices)
      : [];
  const columns = useMachineInstancesColumns();

  return (
    <Row>
      <Col size={12}>
        <GenericTable
          aria-label="Machine instances table"
          className="machine-instances-table"
          columns={columns}
          data={data}
          filterCells={filterCells}
          groupBy={["name"]}
          isLoading={!machine || !isMachineDetails(machine)}
          showChevron
          variant="full-height"
        />
      </Col>
    </Row>
  );
};

export default MachineInstances;
