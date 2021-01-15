import { useEffect } from "react";

import pluralize from "pluralize";
import { useDispatch, useSelector } from "react-redux";

import type { SetSelectedAction } from "../MachineSummary";

import NodeDevicesWarning from "./NodeDevicesWarning";

import DoubleRow from "app/base/components/DoubleRow";
import LegacyLink from "app/base/components/LegacyLink";
import Placeholder from "app/base/components/Placeholder";
import { HardwareType } from "app/base/enum";
import type { MachineDetails } from "app/store/machine/types";
import { actions as nodeDeviceActions } from "app/store/nodedevice";
import nodeDeviceSelectors from "app/store/nodedevice/selectors";
import { NodeDeviceBus } from "app/store/nodedevice/types";
import type { NodeDevice } from "app/store/nodedevice/types";
import type { RootState } from "app/store/root/types";

type Props = {
  bus: NodeDeviceBus;
  machine: MachineDetails;
  setSelectedAction: SetSelectedAction;
};
type NodeDeviceGroup = {
  hardwareTypes: HardwareType[];
  items: NodeDevice[];
  label: string;
  pathname?: string;
};

const generateGroup = (
  bus: NodeDeviceBus,
  group: NodeDeviceGroup,
  machine: MachineDetails
) =>
  group.items.map((nodeDevice, i) => {
    const {
      bus_number,
      commissioning_driver,
      device_number,
      id,
      numa_node_id,
      pci_address,
      product_id,
      product_name,
      vendor_id,
      vendor_name,
    } = nodeDevice;
    const groupLabel = i === 0;
    const numaNode = machine.numa_nodes.find(
      (numa) => numa.id === numa_node_id
    );

    return (
      <tr
        className={`node-devices-table__row${
          groupLabel ? "" : " truncated-border"
        }`}
        key={`node-device-${id}`}
      >
        <td className="group-col">
          {groupLabel && (
            <DoubleRow
              data-test="group-label"
              primary={
                <strong>
                  {group.pathname ? (
                    <LegacyLink
                      route={`/machine/${machine.system_id}?area=${group.pathname}`}
                    >
                      {group.label}
                    </LegacyLink>
                  ) : (
                    group.label
                  )}
                </strong>
              }
              secondary={pluralize("device", group.items.length, true)}
            />
          )}
        </td>
        <td className="vendor-col">
          <DoubleRow primary={vendor_name} secondary={vendor_id} />
        </td>
        <td className="product-col">{product_name}</td>
        <td className="product-id-col">{product_id}</td>
        <td className="driver-col">{commissioning_driver}</td>
        <td
          className="numa-node-col u-align--right"
          data-test={`node-device-${id}-numa`}
        >
          {numaNode?.index ?? ""}
        </td>
        {bus === NodeDeviceBus.PCIE ? (
          <td className="pci-address-col u-align--right">{pci_address}</td>
        ) : (
          <>
            <td className="bus-address-col u-align--right">{bus_number}</td>
            <td className="device-address-col u-align--right">
              {device_number}
            </td>
          </>
        )}
      </tr>
    );
  });

const NodeDevices = ({
  bus,
  machine,
  setSelectedAction,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const nodeDevices = useSelector((state: RootState) =>
    nodeDeviceSelectors.getByMachineId(state, machine.id)
  );
  const nodeDevicesLoading = useSelector(nodeDeviceSelectors.loading);
  const loaded = nodeDevices.some(
    (nodeDevice) => nodeDevice.node_id === machine.id
  );

  useEffect(() => {
    if (!loaded) {
      dispatch(nodeDeviceActions.getByMachineId(machine.system_id));
    }
  }, [dispatch, loaded, machine.system_id]);

  const groupedDevices = nodeDevices
    .reduce<NodeDeviceGroup[]>(
      (groups, nodeDevice) => {
        const group = groups.find((group) =>
          group.hardwareTypes.includes(nodeDevice.hardware_type)
        );
        if (group && nodeDevice.bus === bus) {
          group.items.push(nodeDevice);
        }
        return groups;
      },
      [
        {
          hardwareTypes: [HardwareType.Network],
          label: "Network",
          pathname: "network",
          items: [],
        },
        {
          hardwareTypes: [HardwareType.Storage],
          label: "Storage",
          pathname: "storage",
          items: [],
        },
        {
          hardwareTypes: [HardwareType.GPU],
          label: "GPU",
          items: [],
        },
        {
          hardwareTypes: [
            HardwareType.CPU,
            HardwareType.Memory,
            HardwareType.Node,
          ],
          label: "Generic",
          items: [],
        },
      ]
    )
    .filter((group) => group.items.length > 0);

  return (
    <>
      <table
        className={`node-devices-table--${
          bus === NodeDeviceBus.PCIE ? "pci" : "usb"
        }`}
      >
        <thead>
          <tr>
            <th className="group-col"></th>
            <th className="vendor-col">
              <div>Vendor</div>
              <div>ID</div>
            </th>
            <th className="product-col">Product</th>
            <th className="product-id-col">Product ID</th>
            <th className="driver-col">Driver</th>
            <th className="numa-node-col u-align--right">NUMA node</th>
            {bus === NodeDeviceBus.PCIE ? (
              <th
                className="pci-address-col u-align--right"
                data-test="pci-address-col"
              >
                PCI address
              </th>
            ) : (
              <>
                <th
                  className="bus-address-col u-align--right"
                  data-test="bus-address-col"
                >
                  Bus address
                </th>
                <th
                  className="device-address-col u-align--right"
                  data-test="device-address-col"
                >
                  Device address
                </th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {nodeDevicesLoading ? (
            <>
              {Array.from(Array(5)).map((_, i) => (
                <tr key={`${bus}-placeholder-${i}`}>
                  <td className="group-col">
                    <DoubleRow
                      primary={<Placeholder>Group name</Placeholder>}
                      secondary={<Placeholder>X devices</Placeholder>}
                    />
                  </td>
                  <td className="vendor-col">
                    <DoubleRow
                      primary={<Placeholder>Example vendor</Placeholder>}
                      secondary={<Placeholder>0000</Placeholder>}
                    />
                  </td>
                  <td className="product-col">
                    <Placeholder>Example product description</Placeholder>
                  </td>
                  <td className="product-id-col">
                    <Placeholder>0000</Placeholder>
                  </td>
                  <td className="driver-col">
                    <Placeholder>Driver name</Placeholder>
                  </td>
                  <td className="numa-node-col u-align--right">
                    <Placeholder>0000</Placeholder>
                  </td>
                  {bus === NodeDeviceBus.PCIE ? (
                    <td className="pci-address-col u-align--right">
                      <Placeholder>0000:00:00.0</Placeholder>
                    </td>
                  ) : (
                    <>
                      <td className="bus-address-col u-align--right">
                        <Placeholder>0000</Placeholder>
                      </td>
                      <td className="device-address-col u-align--right">
                        <Placeholder>0000</Placeholder>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </>
          ) : (
            groupedDevices.map((group) => generateGroup(bus, group, machine))
          )}
        </tbody>
      </table>
      {!nodeDevicesLoading && (
        <NodeDevicesWarning
          bus={bus}
          machine={machine}
          nodeDevices={nodeDevices}
          setSelectedAction={setSelectedAction}
        />
      )}
    </>
  );
};

export default NodeDevices;
