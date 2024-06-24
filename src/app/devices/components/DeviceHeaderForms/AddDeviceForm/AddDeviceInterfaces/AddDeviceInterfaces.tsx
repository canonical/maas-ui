import type { ChangeEvent } from "react";
import { useEffect, useRef } from "react";

import { Button, Card, Icon } from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";

import type { AddDeviceInterface, AddDeviceValues } from "../types";

import FormikField from "@/app/base/components/FormikField";
import IpAssignmentSelect from "@/app/base/components/IpAssignmentSelect";
import MacAddressField from "@/app/base/components/MacAddressField";
import PrefixedIpInput from "@/app/base/components/PrefixedIpInput";
import SubnetSelect from "@/app/base/components/SubnetSelect";
import { DeviceIpAssignment } from "@/app/store/device/types";
import type { RootState } from "@/app/store/root/types";
import subnetSelectors from "@/app/store/subnet/selectors";
import { getNextName } from "@/app/utils";

const AddDeviceInterfaceFields = ({
  deleteDisabled,
  iface,
  index,
  removeInterface,
}: {
  deleteDisabled: boolean;
  iface: AddDeviceInterface;
  index: number;
  removeInterface: (id: number) => void;
}) => {
  const { handleChange, setFieldValue } = useFormikContext<AddDeviceValues>();
  const subnet = useSelector((state: RootState) =>
    subnetSelectors.getById(state, parseInt(iface.subnet))
  );

  useEffect(() => {
    if (iface.ip_assignment === DeviceIpAssignment.STATIC && subnet) {
      setFieldValue(`interfaces[${index}].subnet_cidr`, subnet.cidr);
    }
  }, [iface.ip_assignment, index, setFieldValue, subnet]);

  const showSubnetField = iface.ip_assignment === DeviceIpAssignment.STATIC;

  return (
    <Card data-testid="interface-card" key={iface.id}>
      <FormikField
        label="Name"
        name={`interfaces[${index}].name`}
        type="text"
      />
      <MacAddressField
        label="MAC address"
        name={`interfaces[${index}].mac`}
        required
      />
      <IpAssignmentSelect
        name={`interfaces[${index}].ip_assignment`}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
          handleChange(e);
          setFieldValue(`interfaces[${index}].subnet`, "");
          setFieldValue(`interfaces[${index}].ip_address`, "");
        }}
        required
      />
      {showSubnetField ? (
        <SubnetSelect
          data-testid="subnet-field"
          name={`interfaces[${index}].subnet`}
        />
      ) : null}
      {iface.ip_assignment === DeviceIpAssignment.STATIC ? (
        subnet ? (
          <FormikField
            cidr={subnet.cidr}
            component={PrefixedIpInput}
            data-testid="prefixed-ip-address-field"
            label="IP address"
            name={`interfaces[${index}].ip_address`}
          />
        ) : null
      ) : iface.ip_assignment === DeviceIpAssignment.EXTERNAL ? (
        <FormikField
          data-testid="ip-address-field"
          label="IP address"
          name={`interfaces[${index}].ip_address`}
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
};

export const AddDeviceInterfaces = (): JSX.Element => {
  const currentId = useRef<number>(0);
  const {
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
      {interfaces.map((iface, i) => (
        <AddDeviceInterfaceFields
          deleteDisabled={interfaces.length === 1}
          iface={iface}
          index={i}
          key={iface.id}
          removeInterface={removeInterface}
        />
      ))}
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
