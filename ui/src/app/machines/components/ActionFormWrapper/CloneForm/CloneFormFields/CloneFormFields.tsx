import { Col, Row, Select } from "@canonical/react-components";

import FormikField from "app/base/components/FormikField";
import type { Machine } from "app/store/machine/types";

type Props = {
  machines: Machine[];
};

export const CloneFormFields = ({ machines }: Props): JSX.Element => {
  return (
    <Row>
      <Col size={6}>
        <FormikField
          component={Select}
          label="Source machine"
          name="source"
          options={[
            {
              label: "Select source machine",
              value: "",
              disabled: true,
            },
            ...machines.map((machine) => ({
              key: machine.system_id,
              label: machine.hostname,
              value: machine.system_id,
            })),
          ]}
        />
        <FormikField
          label="Clone network configuration"
          name="interfaces"
          type="checkbox"
        />
        <FormikField
          label="Clone storage configuration"
          name="storage"
          type="checkbox"
        />
      </Col>
    </Row>
  );
};

export default CloneFormFields;
