import { Col, Input, Row, Select } from "@canonical/react-components";
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

const generatePowerTypeFields = powerType => {
  if (powerType) {
    return powerType.fields.map(field => (
      <FormikField
        component={field.field_type === "choice" ? Select : Input}
        key={field.name}
        label={field.label}
        name={`power_parameters.${field.name}`}
        options={
          field.field_type === "choice"
            ? field.choices.map(choice => ({
                key: `${field.name}-${choice[0]}`,
                label: choice[1],
                value: choice[0]
              }))
            : undefined
        }
        required={field.required}
        type={field.field_type === "password" ? "password" : "text"}
      />
    ));
  }
};

export const AddMachineFormFields = () => {
  const architectures = useSelector(generalSelectors.architectures.get);
  const domains = useSelector(domainSelectors.all);
  const hweKernels = useSelector(generalSelectors.hweKernels.get);
  const powerTypes = useSelector(generalSelectors.powerTypes.get);
  const resourcePools = useSelector(resourcePoolSelectors.all);
  const zones = useSelector(zoneSelectors.all);

  const { setFieldTouched, setFieldValue, values } = useFormikContext();

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
  const powerTypeOptions = [
    { label: "Select your power type", value: "", disabled: true },
    ...powerTypes.map(powerType => ({
      key: `power-type-${powerType.name}`,
      label: powerType.description,
      value: powerType.name
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
        <FormikField
          component={Select}
          label="Power type"
          name="power_type"
          options={powerTypeOptions}
          onChange={e => {
            setFieldValue("power_type", e.target.value);
            setFieldTouched("power_type", false);
          }}
          required
        />
        {generatePowerTypeFields(
          powerTypes.find(type => type.name === values.power_type)
        )}
      </Col>
    </Row>
  );
};

export default AddMachineFormFields;
