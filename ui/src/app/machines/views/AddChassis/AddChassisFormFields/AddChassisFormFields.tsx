import { Col, Row } from "@canonical/react-components";

import DomainSelect from "app/base/components/DomainSelect";
import PowerTypeFields from "app/base/components/PowerTypeFields";
import { PowerFieldScope } from "app/store/general/types";

export const AddChassisFormFields = (): JSX.Element => {
  return (
    <Row>
      <Col size="5">
        <DomainSelect name="domain" required />
      </Col>
      <Col size="5">
        <PowerTypeFields fieldScopes={[PowerFieldScope.BMC]} forChassis />
      </Col>
    </Row>
  );
};

export default AddChassisFormFields;
