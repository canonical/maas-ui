import { Col, Row } from "@canonical/react-components";

import type { SetKvmType } from "../../AddKVM";
import KvmTypeSelect from "../../KvmTypeSelect";

import FormikField from "app/base/components/FormikField";
import ResourcePoolSelect from "app/base/components/ResourcePoolSelect";
import ZoneSelect from "app/base/components/ZoneSelect";
import { PodType } from "app/store/pod/types";

type Props = {
  setKvmType: SetKvmType;
};

export const AddLxdFields = ({ setKvmType }: Props): JSX.Element => {
  return (
    <Row>
      <Col size="5">
        <KvmTypeSelect kvmType={PodType.LXD} setKvmType={setKvmType} />
      </Col>
      <Col size="5">
        <FormikField label="Name" name="name" type="text" />
        <ZoneSelect name="zone" required valueKey="id" />
        <ResourcePoolSelect name="pool" required valueKey="id" />
        <FormikField
          label="LXD address"
          name="power_address"
          required
          type="text"
        />
        <FormikField
          label="LXD password (optional)"
          name="password"
          type="password"
        />
        <FormikField label="LXD project" name="project" type="text" />
      </Col>
    </Row>
  );
};

export default AddLxdFields;
