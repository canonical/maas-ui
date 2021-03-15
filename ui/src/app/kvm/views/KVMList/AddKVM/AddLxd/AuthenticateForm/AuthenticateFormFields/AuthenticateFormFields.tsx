import { Col, Row } from "@canonical/react-components";

import FormikField from "app/base/components/FormikField";
import ResourcePoolSelect from "app/base/components/ResourcePoolSelect";
import ZoneSelect from "app/base/components/ZoneSelect";
import type { SetKvmType } from "app/kvm/views/KVMList/AddKVM";
import KvmTypeSelect from "app/kvm/views/KVMList/AddKVM/KvmTypeSelect";
import { PodType } from "app/store/pod/types";

type Props = {
  setKvmType: SetKvmType;
};

export const AuthenticateFormFields = ({ setKvmType }: Props): JSX.Element => {
  return (
    <Row>
      <Col size="5">
        <KvmTypeSelect kvmType={PodType.LXD} setKvmType={setKvmType} />
      </Col>
      <Col size="5">
        <FormikField label="Name" name="name" required type="text" />
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
      </Col>
    </Row>
  );
};

export default AuthenticateFormFields;
