import type { ChangeEvent } from "react";
import { useRef } from "react";

import { Button, Icon, MainTable, Select } from "@canonical/react-components";
import { useFormikContext } from "formik";

import type { AddDeviceValues } from "../types";

import FormikField from "app/base/components/FormikField";
import MacAddressField from "app/base/components/MacAddressField";
import SubnetSelect from "app/base/components/SubnetSelect";
import TableActions from "app/base/components/TableActions";
import { DeviceIpAssignment } from "app/store/device/types";
import { getIpAssignmentDisplay } from "app/store/device/utils";
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
      <MainTable
        className="p-form--table"
        headers={[
          { className: "u-no-padding--left", content: "Name" },
          { content: "* MAC address" },
          { content: "* IP assignment" },
          { content: "Subnet" },
          { content: "IP address" },
          {
            className: "u-align--right u-no-padding--right",
            content: "Actions",
          },
        ]}
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
                className: "u-no-padding--left",
                content: (
                  <FormikField name={`interfaces[${i}].name`} type="text" />
                ),
              },
              {
                content: (
                  <MacAddressField name={`interfaces[${i}].mac`} required />
                ),
              },
              {
                content: (
                  <FormikField
                    // TODO: Convert to common component as an almost
                    // identical version is used in DiscoveryAddForm.
                    // https://github.com/canonical-web-and-design/app-tribe/issues/554
                    component={Select}
                    name={`interfaces[${i}].ip_assignment`}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                      handleChange(e);
                      setFieldValue(`interfaces[${i}].subnet`, "");
                      setFieldValue(`interfaces[${i}].ip_address`, "");
                    }}
                    options={[
                      {
                        label: "Select IP assignment",
                        value: "",
                        disabled: true,
                      },
                      {
                        label: getIpAssignmentDisplay(
                          DeviceIpAssignment.DYNAMIC
                        ),
                        value: DeviceIpAssignment.DYNAMIC,
                      },
                      {
                        label: getIpAssignmentDisplay(
                          DeviceIpAssignment.STATIC
                        ),
                        value: DeviceIpAssignment.STATIC,
                      },
                      {
                        label: getIpAssignmentDisplay(
                          DeviceIpAssignment.EXTERNAL
                        ),
                        value: DeviceIpAssignment.EXTERNAL,
                      },
                    ]}
                    required
                  />
                ),
              },
              {
                content: showSubnetField ? (
                  <SubnetSelect
                    data-test="subnet-field"
                    labelClassName="u-hide"
                    name={`interfaces[${i}].subnet`}
                  />
                ) : null,
              },
              {
                content: showIpAddressField ? (
                  <FormikField
                    data-test="ip-address-field"
                    name={`interfaces[${i}].ip_address`}
                    type="text"
                  />
                ) : null,
              },
              {
                className:
                  "u-align--right u-align-non-field u-no-padding--right",
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
            "data-test": "interface-row",
          };
        })}
      />
      <Button
        data-test="add-interface"
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
