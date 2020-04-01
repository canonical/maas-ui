import { Button, Col, Input, Row, Select } from "@canonical/react-components";
import React, { useEffect, useState } from "react";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";

import {
  domain as domainSelectors,
  general as generalSelectors,
  resourcepool as resourcePoolSelectors,
  zone as zoneSelectors,
} from "app/base/selectors";
import FormikField from "app/base/components/FormikField";
import PowerTypeFields from "app/machines/components/PowerTypeFields";

export const AddMachineFormFields = ({ saved }) => {
  const architectures = useSelector(generalSelectors.architectures.get);
  const domains = useSelector(domainSelectors.all);
  const hweKernels = useSelector(generalSelectors.hweKernels.get);
  const powerTypes = useSelector(generalSelectors.powerTypes.get);
  const resourcePools = useSelector(resourcePoolSelectors.all);
  const zones = useSelector(zoneSelectors.all);

  const [extraMACs, setExtraMACs] = useState([]);

  const formikProps = useFormikContext();
  const { setFieldValue, values } = formikProps;

  useEffect(() => {
    if (saved) {
      setExtraMACs([]);
    }
  }, [saved]);

  const architectureOptions = [
    {
      label: "Select your architecture",
      value: "",
      disabled: true,
    },
    ...architectures.map((arch) => ({
      key: arch,
      label: arch,
      value: arch,
    })),
  ];
  const domainOptions = [
    { label: "Select your domain", value: "", disabled: true },
    ...domains.map((domain) => ({
      key: `domain-${domain.id}`,
      label: domain.name,
      value: domain.name,
    })),
  ];
  const hweKernelOptions = [
    {
      label: "Select your minimum kernel",
      value: null,
      disabled: true,
    },
    { label: "No minimum kernel", value: "" },
    ...hweKernels.map((kernel) => ({
      key: `kernel-${kernel[1]}`,
      label: kernel[1],
      value: kernel[0],
    })),
  ];
  const resourcePoolOptions = [
    { label: "Select your resource pool", value: "", disabled: true },
    ...resourcePools.map((pool) => ({
      key: `pool-${pool.id}`,
      label: pool.name,
      value: pool.name,
    })),
  ];
  const zoneOptions = [
    { label: "Select your zone", value: "", disabled: true },
    ...zones.map((zone) => ({
      key: `zone-${zone.id}`,
      label: zone.name,
      value: zone.name,
    })),
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
        {extraMACs.map((mac, i) => (
          <div
            className="p-input--closeable"
            data-test={`extra-macs-${i}`}
            key={`extra-macs-${i}`}
          >
            <Input
              maxLength="17"
              onChange={(e) => {
                const newExtraMACs = [...extraMACs];
                newExtraMACs[i] = e.target.value;
                setExtraMACs(newExtraMACs);
                setFieldValue("extra_macs", newExtraMACs);
              }}
              placeholder="00:00:00:00:00:00"
              type="text"
              value={mac}
            />
            <Button
              className="p-close-input"
              hasIcon
              onClick={() => {
                const newExtraMACs = extraMACs.filter((_, j) => j !== i);
                setExtraMACs(newExtraMACs);
                setFieldValue("extra_macs", newExtraMACs);
              }}
              type="button"
            >
              <i className="p-icon--close" />
            </Button>
          </div>
        ))}
        <div className="u-align--right">
          <Button
            data-test="add-extra-mac"
            hasIcon
            onClick={() => setExtraMACs([...extraMACs, ""])}
            type="button"
          >
            <i className="p-icon--plus" />
            <span>Add MAC address</span>
          </Button>
        </div>
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
