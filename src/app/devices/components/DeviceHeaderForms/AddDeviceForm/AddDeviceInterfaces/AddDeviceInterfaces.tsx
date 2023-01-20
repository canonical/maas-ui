import type { ChangeEvent } from "react";
import { useRef } from "react";

import { Button, Card, Icon } from "@canonical/react-components";
import { useFormikContext } from "formik";

import type { AddDeviceValues } from "../types";

import FormikField from "app/base/components/FormikField";
import IpAssignmentSelect from "app/base/components/IpAssignmentSelect";
import MacAddressField from "app/base/components/MacAddressField";
import SubnetSelect from "app/base/components/SubnetSelect";
import { DeviceIpAssignment } from "app/store/device/types";
import { getNextName } from "app/utils";

export const AddDeviceInterfaces = (): JSX.Element => {
  const currentId = useRef<number>(0);
  const {
    handleChange,
    setFieldValue,
    values: { interfaces },
  } = useFormikContext<AddDeviceValues>();

  const addInterface = () => {
    currentId.current += 1;
    setFieldValue("interfaces", [
      ...interfaces,
      {
        id: currentId.current,
        ip_address: "",
        ip_assignment: DeviceIpAssignment.DYNAMIC,
        mac: "",
        name: getNextName(
          interfaces.map((iface) => iface.name),
          "eth"
        ),
        subnet: "",
      },
    ]);
  };

  const removeInterface = (id: number) => {
    setFieldValue(
      "interfaces",
      interfaces.filter((iface) => iface.id !== id)
    );
  };

  return (
    <>
      <h4>Interfaces</h4>
      {interfaces.map((iface, i) => {
        const showSubnetField =
          iface.ip_assignment === DeviceIpAssignment.STATIC;
        const showIpAddressField =
          iface.ip_assignment === DeviceIpAssignment.STATIC ||
          iface.ip_assignment === DeviceIpAssignment.EXTERNAL;
        const deleteDisabled = interfaces.length <= 1;

        return (
          <Card data-testid="interface-card" key={iface.id}>
            <FormikField
              label="Name"
              name={`interfaces[${i}].name`}
              type="text"
            />
            <MacAddressField
              label="MAC address"
              name={`interfaces[${i}].mac`}
              required
            />
            <IpAssignmentSelect
              name={`interfaces[${i}].ip_assignment`}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                handleChange(e);
                setFieldValue(`interfaces[${i}].subnet`, "");
                setFieldValue(`interfaces[${i}].ip_address`, "");
              }}
              required
            />
            {showSubnetField ? (
              <SubnetSelect
                data-testid="subnet-field"
                name={`interfaces[${i}].subnet`}
              />
            ) : null}
            {showIpAddressField ? (
              <FormikField
                data-testid="ip-address-field"
                label="IP address"
                name={`interfaces[${i}].ip_address`}
                type="text"
              />
            ) : null}
            {!deleteDisabled ? (
              <div className="u-align--right">
                <Button onClick={() => removeInterface(iface.id)} type="button">
                  Delete
                </Button>
              </div>
            ) : null}
          </Card>
        );
      })}
      <Button
        data-testid="add-interface"
        hasIcon
        onClick={() => addInterface()}
        type="button"
      >
        <Icon name="plus" />
        <span>Add interface</span>
      </Button>
    </>
  );
};

export default AddDeviceInterfaces;
