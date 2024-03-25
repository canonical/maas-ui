import type { ReactNode } from "react";
import { useEffect } from "react";

import classNames from "classnames";
import pluralize from "pluralize";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import NodeDevicesWarning from "./NodeDevicesWarning";

import DoubleRow from "@/app/base/components/DoubleRow";
import Placeholder from "@/app/base/components/Placeholder";
import { HardwareType } from "@/app/base/enum";
import urls from "@/app/base/urls";
import type { MachineSetSidePanelContent } from "@/app/machines/types";
import type { ControllerDetails } from "@/app/store/controller/types";
import type { MachineDetails } from "@/app/store/machine/types";
import { nodeDeviceActions } from "@/app/store/nodedevice";
import nodeDeviceSelectors from "@/app/store/nodedevice/selectors";
import { NodeDeviceBus } from "@/app/store/nodedevice/types";
import type { NodeDevice } from "@/app/store/nodedevice/types";
import type { RootState } from "@/app/store/root/types";
import { nodeIsMachine } from "@/app/store/utils";

type Props = {
  bus: NodeDeviceBus;
  node: ControllerDetails | MachineDetails;
  setSidePanelContent?: MachineSetSidePanelContent;
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
  node: Props["node"]
) => {
  const isMachine = nodeIsMachine(node);
  const storageURL = isMachine
    ? urls.machines.machine.storage({ id: node.system_id })
    : urls.controllers.controller.storage({ id: node.system_id });
  const networkURL = isMachine
    ? urls.machines.machine.network({ id: node.system_id })
    : urls.controllers.controller.network({ id: node.system_id });

  return group.items.map((nodeDevice, i) => {
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
    const numaNode = node.numa_nodes.find((numa) => numa.id === numa_node_id);

    const showGroupLabel = i === 0;
    let groupLabel: ReactNode;
    if (showGroupLabel) {
      if (group.pathname === "storage") {
        groupLabel = <Link to={storageURL}>{group.label}</Link>;
      } else if (group.pathname === "network") {
        groupLabel = <Link to={networkURL}>{group.label}</Link>;
      } else {
        groupLabel = group.label;
      }
    }

    return (
      <tr
        className={classNames("node-devices-table__row", {
          "truncated-border": !showGroupLabel,
        })}
        key={`node-device-${id}`}
      >
        <td className="group-col">
          {showGroupLabel && (
            <DoubleRow
              data-testid="group-label"
              primary={<strong>{groupLabel}</strong>}
              secondary={pluralize("device", group.items.length, true)}
            />
          )}
        </td>
        <td className="vendor-col">
          <DoubleRow
            primary={vendor_name}
            primaryTitle={vendor_name}
            secondary={vendor_id}
          />
        </td>
        <td className="product-col">
          <DoubleRow
            primary={product_name || "—"}
            primaryTitle={product_name}
            secondary={product_id}
          />
        </td>
        <td className="driver-col">{commissioning_driver}</td>
        <td
          className="numa-node-col u-align--right"
          data-testid={`node-device-${id}-numa`}
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
};

const NodeDevices = ({
  bus,
  node,
  setSidePanelContent,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const nodeDevices = useSelector((state: RootState) =>
    nodeDeviceSelectors.getByNodeId(state, node.id)
  );
  const nodeDevicesLoading = useSelector(nodeDeviceSelectors.loading);
  const loaded = nodeDevices.some(
    (nodeDevice) => nodeDevice.node_id === node.id
  );

  useEffect(() => {
    if (!loaded) {
      dispatch(nodeDeviceActions.getByNodeId(node.system_id));
    }
  }, [dispatch, loaded, node.system_id]);

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
            <th className="product-col">
              <div>Product</div>
              <div>ID</div>
            </th>
            <th className="driver-col">Driver</th>
            <th className="numa-node-col u-align--right">NUMA node</th>
            {bus === NodeDeviceBus.PCIE ? (
              <th
                className="pci-address-col u-align--right"
                data-testid="pci-address-col"
              >
                PCI address
              </th>
            ) : (
              <>
                <th
                  className="bus-address-col u-align--right"
                  data-testid="bus-address-col"
                >
                  Bus address
                </th>
                <th
                  className="device-address-col u-align--right"
                  data-testid="device-address-col"
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
                    <DoubleRow
                      primary={
                        <Placeholder>Example product description</Placeholder>
                      }
                      secondary={<Placeholder>0000</Placeholder>}
                    />
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
            groupedDevices.map((group) => generateGroup(bus, group, node))
          )}
        </tbody>
      </table>
      {!nodeDevicesLoading && (
        <NodeDevicesWarning
          bus={bus}
          node={node}
          nodeDevices={nodeDevices}
          setSidePanelContent={setSidePanelContent}
        />
      )}
    </>
  );
};

export default NodeDevices;
