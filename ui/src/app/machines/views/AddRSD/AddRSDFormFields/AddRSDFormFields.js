import { Col, Row, Select } from "@canonical/react-components";
import React from "react";
import { useSelector } from "react-redux";

import {
  resourcepool as resourcePoolSelectors,
  zone as zoneSelectors,
} from "app/base/selectors";
import FormikField from "app/base/components/FormikField";

export const AddRSDFormFields = () => {
  const resourcePools = useSelector(resourcePoolSelectors.all);
  const zones = useSelector(zoneSelectors.all);

  const resourcePoolOptions = [
    { label: "Select your resource pool", value: "", disabled: true },
    ...resourcePools.map((pool) => ({
      key: `pool-${pool.id}`,
      label: pool.name,
      value: pool.id,
    })),
  ];
  const zoneOptions = [
    { label: "Select your zone", value: "", disabled: true },
    ...zones.map((zone) => ({
      key: `zone-${zone.id}`,
      label: zone.name,
      value: zone.id,
    })),
  ];

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
          options={zoneOptions}
          required
        />
        <FormikField
          component={Select}
          label="Resource pool"
          name="pool"
          options={resourcePoolOptions}
          required
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
