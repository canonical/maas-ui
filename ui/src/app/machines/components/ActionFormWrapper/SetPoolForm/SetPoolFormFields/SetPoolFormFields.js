import { Col, Row, Select } from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";

import resourcePoolSelectors from "app/store/resourcepool/selectors";

import FormikField from "app/base/components/FormikField";

export const SetPoolFormFields = () => {
  const resourcePools = useSelector(resourcePoolSelectors.all);
  const {
    handleChange,
    values,
    setFieldValue,
    setFieldTouched,
  } = useFormikContext();

  const resourcePoolOptions = [
    { label: "Select resource pool", value: "", disabled: true },
    ...resourcePools.map((pool) => ({
      key: `pool-${pool.id}`,
      label: pool.name,
      value: pool.name,
    })),
  ];

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
          <FormikField
            component={Select}
            label="Pool"
            name="name"
            options={resourcePoolOptions}
            required
          />
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
