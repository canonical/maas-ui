import { Col, Row } from "@canonical/react-components";
import { useFormikContext } from "formik";

import FormikField from "app/base/components/FormikField";
import ResourcePoolSelect from "app/base/components/ResourcePoolSelect";

export const SetPoolFormFields = () => {
  const {
    handleChange,
    values,
    setFieldValue,
    setFieldTouched,
  } = useFormikContext();

  const handleRadioChange = (evt) => {
    handleChange(evt);
    // Reset the name field when changing the radio options otherwise the
    // selected/provided name will appear in the different name inputs.
    setFieldValue("name", "");
    setFieldTouched("name", false, false);
  };

  return (
    <Row>
      <Col size="6">
        <ul className="p-inline-list u-equal-height u-no-margin--bottom">
          <li className="p-inline-list__item">
            <FormikField
              data-test="select-pool"
              label="Select pool"
              name="poolSelection"
              onChange={handleRadioChange}
              type="radio"
              value="select"
            />
          </li>
          <li className="p-inline-list__item">
            <FormikField
              data-test="create-pool"
              label="Create pool"
              name="poolSelection"
              onChange={handleRadioChange}
              type="radio"
              value="create"
            />
          </li>
        </ul>
        {values.poolSelection === "select" ? (
          <ResourcePoolSelect name="name" required />
        ) : (
          <>
            <FormikField label="Name" name="name" required type="text" />
            <FormikField label="Description" name="description" type="text" />
          </>
        )}
      </Col>
    </Row>
  );
};

export default SetPoolFormFields;
