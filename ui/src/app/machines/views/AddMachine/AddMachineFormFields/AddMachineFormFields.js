import { Col, Row, Select } from "@canonical/react-components";
import React from "react";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";

import {
  domain as domainSelectors,
  general as generalSelectors,
  resourcepool as resourcePoolSelectors,
  zone as zoneSelectors
} from "app/base/selectors";
import FormikField from "app/base/components/FormikField";
import PowerTypeFields from "app/machines/components/PowerTypeFields";

export const AddMachineFormFields = () => {
  const architectures = useSelector(generalSelectors.architectures.get);
  const domains = useSelector(domainSelectors.all);
  const hweKernels = useSelector(generalSelectors.hweKernels.get);
  const powerTypes = useSelector(generalSelectors.powerTypes.get);
  const resourcePools = useSelector(resourcePoolSelectors.all);
  const zones = useSelector(zoneSelectors.all);

  const formikProps = useFormikContext();
  const { values } = formikProps;

  const architectureOptions = [
    {
      label: "Select your architecture",
      value: "",
      disabled: true
    },
    ...architectures.map(arch => ({
      key: arch,
      label: arch,
      value: arch
    }))
  ];
  const domainOptions = [
    { label: "Select your domain", value: "", disabled: true },
    ...domains.map(domain => ({
      key: `domain-${domain.id}`,
      label: domain.name,
      value: domain.name
    }))
  ];
  const hweKernelOptions = [
    {
      label: "Select your minimum kernel",
      value: null,
      disabled: true
    },
    { label: "No minimum kernel", value: "" },
    ...hweKernels.map(kernel => ({
      key: `kernel-${kernel[1]}`,
      label: kernel[1],
      value: kernel[0]
    }))
  ];
  const resourcePoolOptions = [
    { label: "Select your resource pool", value: "", disabled: true },
    ...resourcePools.map(pool => ({
      key: `pool-${pool.id}`,
      label: pool.name,
      value: pool.name
    }))
  ];
  const zoneOptions = [
    { label: "Select your zone", value: "", disabled: true },
    ...zones.map(zone => ({
      key: `zone-${zone.id}`,
      label: zone.name,
      value: zone.name
    }))
  ];

  return (
    <Row>
      <Col size="5">
        <FormikField
          label="Machine name"
          name="hostname"
          placeholder="Machine name (optional)"
          type="text"
        />
        <FormikField
          component={Select}
          label="Domain"
          name="domain"
          options={domainOptions}
          required
        />
        <FormikField
          component={Select}
          label="Architecture"
          name="architecture"
          options={architectureOptions}
          required
        />
        <FormikField
          component={Select}
          label="Minimum kernel"
          name="min_hwe_kernel"
          options={hweKernelOptions}
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
        <FormikField
          label="MAC address"
          maxLength="17"
          name="pxe_mac"
          placeholder="00:00:00:00:00:00"
          required
          type="text"
        />
      </Col>
      <Col size="5">
        <PowerTypeFields
          formikProps={formikProps}
          powerTypes={powerTypes}
          selectedPowerType={values.power_type}
        />
      </Col>
    </Row>
  );
};

export default AddMachineFormFields;
