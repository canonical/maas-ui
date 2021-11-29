import type { ChangeEvent } from "react";
import { useRef } from "react";

import { Button, Icon, MainTable } from "@canonical/react-components";
import classNames from "classnames";
import { useFormikContext } from "formik";

import type { AddDeviceValues } from "../types";

import FormikField from "app/base/components/FormikField";
import IpAssignmentSelect from "app/base/components/IpAssignmentSelect";
import MacAddressField from "app/base/components/MacAddressField";
import SubnetSelect from "app/base/components/SubnetSelect";
import TableActions from "app/base/components/TableActions";
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
      <MainTable
        className="add-device-interfaces p-form--table"
        headers={[
          { className: "name-col u-no-padding--left", content: "Name" },
          { className: "mac-col", content: "* MAC address" },
          { className: "ip-assignment-col", content: "* IP assignment" },
          { className: "subnet-col", content: "Subnet" },
          { className: "ip-address-col", content: "IP address" },
          {
            className: "actions-col u-align--right u-no-padding--right",
            content: "Actions",
          },
        ]}
        responsive
        rows={interfaces.map((iface, i) => {
          const showSubnetField =
            iface.ip_assignment === DeviceIpAssignment.STATIC;
          const showIpAddressField =
            iface.ip_assignment === DeviceIpAssignment.STATIC ||
            iface.ip_assignment === DeviceIpAssignment.EXTERNAL;
          const deleteDisabled = interfaces.length <= 1;

          return {
            columns: [
              {
                "aria-label": "Name",
                className: "name-col u-no-padding--left",
                content: (
                  <FormikField name={`interfaces[${i}].name`} type="text" />
                ),
              },
              {
                "aria-label": "* MAC address",
                className: "mac-col",
                content: (
                  <MacAddressField name={`interfaces[${i}].mac`} required />
                ),
              },
              {
                "aria-label": "* IP assignment",
                className: "ip-assignment-col",
                content: (
                  <IpAssignmentSelect
                    name={`interfaces[${i}].ip_assignment`}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                      handleChange(e);
                      setFieldValue(`interfaces[${i}].subnet`, "");
                      setFieldValue(`interfaces[${i}].ip_address`, "");
                    }}
                    required
                  />
                ),
              },
              {
                "aria-label": "Subnet",
                className: classNames("subnet-col", {
                  "u-align-non-field": !showSubnetField,
                }),
                content: showSubnetField ? (
                  <SubnetSelect
                    data-testid="subnet-field"
                    labelClassName="u-hide"
                    name={`interfaces[${i}].subnet`}
                  />
                ) : (
                  <span>N/A</span>
                ),
              },
              {
                "aria-label": "IP address",
                className: classNames("ip-address-col", {
                  "u-align-non-field": !showIpAddressField,
                }),
                content: showIpAddressField ? (
                  <FormikField
                    data-testid="ip-address-field"
                    name={`interfaces[${i}].ip_address`}
                    type="text"
                  />
                ) : (
                  <span>N/A</span>
                ),
              },
              {
                "aria-label": "Actions",
                className:
                  "actions-col u-align--right u-align-non-field u-no-padding--right",
                content: (
                  <TableActions
                    deleteDisabled={deleteDisabled}
                    deleteTooltip={
                      deleteDisabled
                        ? "At least one interface must be defined"
                        : null
                    }
                    onDelete={() => removeInterface(iface.id)}
                  />
                ),
              },
            ],
            "data-testid": "interface-row",
          };
        })}
      />
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
