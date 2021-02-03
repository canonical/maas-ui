import { Col, Row } from "@canonical/react-components";
import { useFormikContext } from "formik";

import DomainSelect from "app/base/components/DomainSelect";
import PowerTypeFields from "app/machines/components/PowerTypeFields";

export const AddChassisFormFields = ({ chassisPowerTypes }) => {
  const formikProps = useFormikContext();
  const { values } = formikProps;

  return (
    <Row>
      <Col size="5">
        <DomainSelect name="domain" required />
      </Col>
      <Col size="5">
        <PowerTypeFields
          driverType="chassis"
          formikProps={formikProps}
          powerTypes={chassisPowerTypes}
          selectedPowerType={values.power_type}
        />
      </Col>
    </Row>
  );
};

export default AddChassisFormFields;
