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
      bus_number,
      commissioning_driver,
      device_number,
      id,
      numa_node_id,
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
      <tr key={`usb-device-${id}`}>
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
        <td className="u-align--right" data-test="usb-numa">
          {numaNode?.index}
        </td>
        <td className="u-align--right">{bus_number}</td>
        <td className="u-align--right">{device_number}</td>
      </tr>
    );
  });

const MachineUSBDevices = ({ setSelectedAction }: Props): JSX.Element => {
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

  useWindowTitle(`${`${machine?.fqdn} ` || "Machine"} USB devices`);
  const canBeCommissioned = machine?.actions.includes(NodeActions.COMMISSION);

  useEffect(() => {
    dispatch(nodeDeviceActions.getByMachineId(id));
  }, [dispatch, id]);

  const usbDevices = nodeDevices.filter(
    (nodeDevice) => nodeDevice.bus === NodeDeviceBus.USB
  );
  const groupedDevices = usbDevices
    .reduce<NodeDeviceGroup[]>(
      (groups, nodeDevice) => {
        const group = groups.find((group) =>
          group.hardwareTypes.includes(nodeDevice.hardware_type)
        );
        if (group) {
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

  const noDevices = nodeDevices.length === 0;
  const noUsb = usbDevices.length === 0;

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
            <th className="u-align--right">Bus address</th>
            <th className="u-align--right">Device address</th>
          </tr>
        </thead>
        <tbody>
          {nodeDevicesLoading || machine === null ? (
            <>
              {Array.from(Array(5)).map((_, i) => (
                <tr key={`usb-placeholder-${i}`}>
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
                    <Placeholder>0000</Placeholder>
                  </td>
                  <td className="u-align--right">
                    <Placeholder>0000</Placeholder>
                  </td>
                </tr>
              ))}
            </>
          ) : (
            groupedDevices.map((group) => generateGroup(group, machine))
          )}
        </tbody>
      </table>
      {!nodeDevicesLoading && (noDevices || noUsb) && (
        <Strip shallow>
          <Row>
            <Col className="u-flex" emptyLarge={4} size={6}>
              <h4>
                <Icon name="warning" />
              </h4>
              <div className="u-flex--grow u-nudge-right">
                <h4>USB information not available</h4>
                {noDevices && (
                  <>
                    <p className="u-sv1" data-test="information-unavailable">
                      Try commissioning this machine to load USB information.
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
                  </>
                )}
                {noUsb && (
                  <p className="u-sv1" data-test="no-usb">
                    No USB devices discovered during commissioning.
                  </p>
                )}
              </div>
            </Col>
          </Row>
        </Strip>
      )}
    </>
  );
};

export default MachineUSBDevices;
