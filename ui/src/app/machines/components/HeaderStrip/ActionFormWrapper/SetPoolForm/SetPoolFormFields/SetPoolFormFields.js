import { Col, Row, Select } from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";
import React from "react";

import { resourcepool as resourcePoolSelectors } from "app/base/selectors";

import FormikField from "app/base/components/FormikField";

export const SetPoolFormFields = () => {
  const resourcePools = useSelector(resourcePoolSelectors.all);
  const { values } = useFormikContext();

  const resourcePoolOptions = [
    { label: "Select resource pool", value: "", disabled: true },
    ...resourcePools.map((pool) => ({
      key: `pool-${pool.id}`,
      label: pool.name,
      value: pool.name,
    })),
  ];

  return (
    <Row>
      <Col size="6">
        <ul className="p-inline-list u-equal-height u-no-margin--bottom">
          <li className="p-inline-list__item">
            <FormikField
              data-test="select-pool"
              label="Select pool"
              name="poolSelection"
              type="radio"
              value="select"
            />
          </li>
          <li className="p-inline-list__item">
            <FormikField
              data-test="create-pool"
              label="Create pool"
              name="poolSelection"
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
