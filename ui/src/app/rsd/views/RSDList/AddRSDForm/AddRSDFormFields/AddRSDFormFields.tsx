import React from "react";

import { Col, Row, Select } from "@canonical/react-components";
import { useSelector } from "react-redux";

import FormikField from "app/base/components/FormikField";
import resourcePoolSelectors from "app/store/resourcepool/selectors";
import zoneSelectors from "app/store/zone/selectors";

export const AddRSDFormFields = (): JSX.Element => {
  const resourcePools = useSelector(resourcePoolSelectors.all);
  const zones = useSelector(zoneSelectors.all);

  return (
    <Row>
      <Col size="5">
        <FormikField
          label="Name"
          name="name"
          placeholder="Name (optional)"
          type="text"
        />
        <FormikField
          component={Select}
          label="Zone"
          name="zone"
          options={[
            { label: "Select your zone", value: "", disabled: true },
            ...zones.map((zone) => ({
              key: `zone-${zone.id}`,
              label: zone.name,
              value: zone.id,
            })),
          ]}
        />
        <FormikField
          component={Select}
          label="Resource pool"
          name="pool"
          options={[
            { label: "Select your resource pool", value: "", disabled: true },
            ...resourcePools.map((pool) => ({
              key: `pool-${pool.id}`,
              label: pool.name,
              value: pool.id,
            })),
          ]}
        />
      </Col>
      <Col size="5">
        <FormikField
          label="Address"
          name="power_address"
          type="text"
          required
        />
        <FormikField label="User" name="power_user" type="text" required />
        <FormikField
          label="Password"
          name="power_pass"
          type="password"
          required
        />
      </Col>
    </Row>
  );
};

export default AddRSDFormFields;
