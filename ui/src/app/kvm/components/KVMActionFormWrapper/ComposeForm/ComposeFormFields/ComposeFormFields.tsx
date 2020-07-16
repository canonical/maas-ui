import { Col, Row, Select } from "@canonical/react-components";
import React from "react";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";

import type { ComposeFormValues } from "../ComposeForm";
import type { Pod } from "app/store/pod/types";
import FormikField from "app/base/components/FormikField";
import domainSelectors from "app/store/domain/selectors";
import resourcePoolSelectors from "app/store/resourcepool/selectors";
import zoneSelectors from "app/store/zone/selectors";

type Props = {
  architectures: Pod["architectures"];
  availableCores: number;
  availableMemory: number; // MiB
};

export const ComposeFormFields = ({
  architectures,
  availableCores,
  availableMemory,
}: Props): JSX.Element => {
  const domains = useSelector(domainSelectors.all);
  const resourcePools = useSelector(resourcePoolSelectors.all);
  const zones = useSelector(zoneSelectors.all);
  const formikProps = useFormikContext<ComposeFormValues>();
  const { initialValues } = formikProps;

  return (
    <Row>
      <Col size="5">
        <FormikField
          label="Hostname"
          name="hostname"
          placeholder="Optional"
          type="text"
        />
        <FormikField
          component={Select}
          label="Domain"
          name="domain"
          options={[
            { label: "Select your domain", value: "", disabled: true },
            ...domains.map((domain) => ({
              key: `domain-${domain.id}`,
              label: domain.name,
              value: domain.id,
            })),
          ]}
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
          label="Pool"
          name="pool"
          options={[
            { label: "Select your pool", value: "", disabled: true },
            ...resourcePools.map((pool) => ({
              key: `pool-${pool.id}`,
              label: pool.name,
              value: pool.id,
            })),
          ]}
        />
      </Col>
      <Col size="5" emptyLarge="7">
        <FormikField
          component={Select}
          label="Architecture"
          name="architecture"
          options={[
            { label: "Select your architecture", value: "", disabled: true },
            ...architectures.map((architecture) => ({
              key: architecture,
              label: architecture,
              value: architecture,
            })),
          ]}
        />
        <FormikField
          help={`${availableCores} cores available`}
          label="Cores"
          max={`${availableCores}`}
          min="1"
          name="cores"
          placeholder={`${initialValues.cores}`}
          step="1"
          type="number"
        />
        <FormikField
          help={`${availableMemory} MiB available`}
          label="RAM (MiB)"
          max={`${availableMemory}`}
          min="1"
          name="memory"
          placeholder={`${initialValues.memory}`}
          type="number"
        />
      </Col>
    </Row>
  );
};

export default ComposeFormFields;
