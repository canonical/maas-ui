import React from "react";

import { Spinner, Row, Col, MainTable } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { Redirect, useParams } from "react-router";

import { useWindowTitle } from "app/base/hooks";
import type { RouteParams } from "app/base/types";
import machineSelectors from "app/store/machine/selectors";
import type {
  MachineDevice,
  NetworkInterface,
  NetworkLink,
} from "app/store/machine/types";
import type { RootState } from "app/store/root/types";

type InterfaceRow = {
  key: string;
  columns: { content: JSX.Element }[];
};

const formatRowData = (
  name: MachineDevice["fqdn"],
  macAddress: NetworkInterface["mac_address"],
  ipAddress: NetworkLink["ip_address"]
): InterfaceRow => {
  return {
    key: name + macAddress + ipAddress,
    columns: [
      { content: <span data-test="name">{name}</span> },
      { content: <span data-test="mac">{macAddress}</span> },
      { content: <span data-test="ip">{ipAddress}</span> },
    ],
  };
};

const generateRows = (devices: MachineDevice[]) => {
  const formattedDevices: InterfaceRow[] = [];

  devices.forEach((device) => {
    let deviceName = device.fqdn;
    if (device.interfaces && device.interfaces.length > 0) {
      device.interfaces.forEach((deviceInterface, deviceIndex) => {
        // Remove device name so it is not duplicated in the table since this
        // is another MAC address on this device.
        if (deviceIndex > 0) {
          deviceName = "";
        }

        let interfaceMacAddress = deviceInterface.mac_address;

        if (deviceInterface.links && deviceInterface.links.length > 0) {
          deviceInterface.links.forEach((interfaceLink, interfaceIndex) => {
            // Remove the MAC address so it is not duplicated in the table
            // since this is another link on this interface.
            if (interfaceIndex > 0) {
              interfaceMacAddress = "";
              deviceName = "";
            }

            formattedDevices.push(
              formatRowData(
                deviceName,
                interfaceMacAddress,
                interfaceLink.ip_address
              )
            );
          });
        } else {
          formattedDevices.push(
            formatRowData(deviceName, interfaceMacAddress, "")
          );
        }
      });
    } else {
      formattedDevices.push(formatRowData(deviceName, "", ""));
    }
  });

  return formattedDevices;
};

const MachineInstances = (): JSX.Element => {
  const params = useParams<RouteParams>();
  const { id } = params;
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, id)
  );

  useWindowTitle(`${`${machine?.fqdn} ` || "Machine"} instances`);

  if (!machine) {
    return <Spinner text="Loading..." />;
  }

  if (!("devices" in machine) || machine.devices.length === 0) {
    return <Redirect to={`/machine/${machine.system_id}/summary`} />;
  }

  return (
    <Row>
      <Col size={12}>
        <MainTable
          headers={[
            {
              content: "Name",
            },
            {
              content: "MAC",
            },
            {
              content: "IP Address",
            },
          ]}
          paginate={50}
          rows={generateRows(machine.devices)}
        />
      </Col>
    </Row>
  );
};

export default MachineInstances;
