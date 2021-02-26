import { Col, Row } from "@canonical/react-components";

import type { SetKvmType } from "../../AddKVM";
import KvmTypeSelect from "../../KvmTypeSelect";
import type { AddLxdValues } from "../AddLxd";

import FormikField from "app/base/components/FormikField";
import PowerTypeFields from "app/base/components/PowerTypeFields";
import ResourcePoolSelect from "app/base/components/ResourcePoolSelect";
import ZoneSelect from "app/base/components/ZoneSelect";
import { PowerFieldScope } from "app/store/general/types";
import { PodType } from "app/store/pod/types";

type Props = { setKvmType: SetKvmType };

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
        <PowerTypeFields<AddLxdValues>
          fieldScopes={[PowerFieldScope.BMC]}
          powerTypeValueName="type"
          showSelect={false}
        />
      </Col>
    </Row>
  );
};

export default AddLxdFields;
