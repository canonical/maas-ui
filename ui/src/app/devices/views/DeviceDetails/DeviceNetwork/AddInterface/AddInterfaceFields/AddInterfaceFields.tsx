import type { ChangeEvent } from "react";

import { Col, Input, Row } from "@canonical/react-components";
import { useFormikContext } from "formik";

import type { AddInterfaceValues } from "../AddInterface";

import FormikField from "app/base/components/FormikField";
import IpAssignmentSelect from "app/base/components/IpAssignmentSelect";
import MacAddressField from "app/base/components/MacAddressField";
import SubnetSelect from "app/base/components/SubnetSelect";
import TagField from "app/base/components/TagField";
import { DeviceIpAssignment } from "app/store/device/types";

const AddInterfaceFields = (): JSX.Element => {
  const { handleChange, setFieldValue, values } =
    useFormikContext<AddInterfaceValues>();
  const showSubnetField = values.ip_assignment === DeviceIpAssignment.STATIC;
  const showIpAddressField =
    values.ip_assignment === DeviceIpAssignment.STATIC ||
    values.ip_assignment === DeviceIpAssignment.EXTERNAL;

  return (
    <>
      <Row>
        <Col size={6}>
          <FormikField label="Name" type="text" name="name" />
        </Col>
      </Row>
      <hr />
      <Row>
        <Col size={6}>
          <Input
            disabled
            label="Type"
            value="Physical"
            type="text"
            name="type"
          />
          <MacAddressField label="MAC address" name="mac_address" />
          <TagField name="tags" />
        </Col>
        <Col size={6}>
          <IpAssignmentSelect
            data-testid="ip-assignment-field"
            name="ip_assignment"
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              handleChange(e);
              setFieldValue("subnet", "");
              setFieldValue("ip_address", "");
            }}
          />
          {showSubnetField && (
            <SubnetSelect data-testid="subnet-field" name="subnet" />
          )}
          {showIpAddressField && (
            <FormikField
              data-testid="ip-address-field"
              label="IP address"
              name="ip_address"
              type="text"
            />
          )}
        </Col>
      </Row>
    </>
  );
};

export default AddInterfaceFields;
