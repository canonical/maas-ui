import { useEffect } from "react";

import { Button, Col, Icon, Row, Strip } from "@canonical/react-components";
import pluralize from "pluralize";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { Link } from "react-router-dom";

import type { SetSelectedAction } from "../MachineSummary";

import DoubleRow from "app/base/components/DoubleRow";
import Placeholder from "app/base/components/Placeholder";
import { HardwareType } from "app/base/enum";
import { useWindowTitle } from "app/base/hooks";
import type { RouteParams } from "app/base/types";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import { actions as nodeDeviceActions } from "app/store/nodedevice";
import nodeDeviceSelectors from "app/store/nodedevice/selectors";
import { NodeDeviceBus } from "app/store/nodedevice/types";
import type { NodeDevice } from "app/store/nodedevice/types";
import type { RootState } from "app/store/root/types";
import { NodeActions } from "app/store/types/node";

type NodeDeviceGroup = {
  hardwareTypes: HardwareType[];
  items: NodeDevice[];
  label: string;
  pathname?: string;
};

type Props = { setSelectedAction: SetSelectedAction };

const generateGroup = (group: NodeDeviceGroup, machine: Machine) =>
  group.items.map((nodeDevice, i) => {
    const {
      commissioning_driver,
      id,
      numa_node_id,
      pci_address,
      product_id,
      product_name,
      vendor_id,
      vendor_name,
    } = nodeDevice;
    const numaNode =
      "numa_nodes" in machine
        ? machine.numa_nodes.find((numa) => numa.id === numa_node_id)
        : null;

    return (
      <tr key={`pci-device-${id}`}>
        <td>
          {i === 0 && (
            <DoubleRow
              data-test="group-label"
              primary={
                <strong>
                  {group.pathname ? (
                    <Link to={`/machine/${machine.system_id}${group.pathname}`}>
                      {group.label}
                    </Link>
                  ) : (
                    group.label
                  )}
                </strong>
              }
              secondary={pluralize("device", group.items.length, true)}
            />
          )}
        </td>
        <td>
          <DoubleRow primary={vendor_name} secondary={vendor_id} />
        </td>
        <td>{product_name}</td>
        <td>{product_id}</td>
        <td>{commissioning_driver}</td>
        <td className="u-align--right" data-test="pci-numa">
          {numaNode?.index}
        </td>
        <td className="u-align--right">{pci_address}</td>
      </tr>
    );
  });

const MachinePCIDevices = ({ setSelectedAction }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const params = useParams<RouteParams>();
  const { id } = params;
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, id)
  );
  const nodeDevices = useSelector((state: RootState) =>
    nodeDeviceSelectors.getByMachineId(state, machine?.id || null)
  );
  const nodeDevicesLoading = useSelector(nodeDeviceSelectors.loading);

  useWindowTitle(`${`${machine?.fqdn} ` || "Machine"} PCI devices`);
  const canBeCommissioned = machine?.actions.includes(NodeActions.COMMISSION);

  useEffect(() => {
    dispatch(nodeDeviceActions.getByMachineId(id));
  }, [dispatch, id]);

  const groupedDevices = nodeDevices
    .reduce<NodeDeviceGroup[]>(
      (groups, nodeDevice) => {
        const group = groups.find((group) =>
          group.hardwareTypes.includes(nodeDevice.hardware_type)
        );
        if (group && nodeDevice.bus === NodeDeviceBus.PCIE) {
          group.items.push(nodeDevice);
        }
        return groups;
      },
      [
        {
          hardwareTypes: [HardwareType.Network],
          label: "Network",
          pathname: "/network",
          items: [],
        },
        {
          hardwareTypes: [HardwareType.Storage],
          label: "Storage",
          pathname: "/storage",
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
      <table>
        <thead>
          <tr>
            <th></th>
            <th>
              <div>Vendor</div>
              <div>ID</div>
            </th>
            <th>Product</th>
            <th>Product ID</th>
            <th>Driver</th>
            <th className="u-align--right">NUMA node</th>
            <th className="u-align--right">PCI address</th>
          </tr>
        </thead>
        <tbody>
          {nodeDevicesLoading || machine === null ? (
            <>
              {Array.from(Array(5)).map((_, i) => (
                <tr key={`pci-placeholder-${i}`}>
                  <td>
                    <Placeholder>Group name</Placeholder>
                  </td>
                  <td>
                    <Placeholder>Example vendor description</Placeholder>
                  </td>
                  <td>
                    <Placeholder>Example product description</Placeholder>
                  </td>
                  <td>
                    <Placeholder>0000</Placeholder>
                  </td>
                  <td>
                    <Placeholder>Driver name</Placeholder>
                  </td>
                  <td className="u-align--right">
                    <Placeholder>0000</Placeholder>
                  </td>
                  <td className="u-align--right">
                    <Placeholder>0000:00:00.0</Placeholder>
                  </td>
                </tr>
              ))}
            </>
          ) : (
            groupedDevices.map((group) => generateGroup(group, machine))
          )}
        </tbody>
      </table>
      {!nodeDevicesLoading && nodeDevices.length === 0 && (
        <Strip data-test="information-unavailable" shallow>
          <Row>
            <Col className="u-flex" emptyLarge={4} size={6}>
              <h4>
                <Icon name="warning" />
              </h4>
              <div className="u-flex--grow u-nudge-right">
                <h4>PCI information not available</h4>
                <p className="u-sv1">
                  Try commissioning this machine to load PCI information.
                </p>
                {canBeCommissioned && (
                  <Button
                    appearance="positive"
                    data-test="commission-machine"
                    onClick={() =>
                      setSelectedAction({ name: NodeActions.COMMISSION })
                    }
                  >
                    Commission
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </Strip>
      )}
    </>
  );
};

export default MachinePCIDevices;
