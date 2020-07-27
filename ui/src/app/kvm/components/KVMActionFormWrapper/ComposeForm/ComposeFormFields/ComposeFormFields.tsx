import { Col, Row, Select } from "@canonical/react-components";
import React from "react";
import { useSelector } from "react-redux";

import type { Pod } from "app/store/pod/types";
import FormikField from "app/base/components/FormikField";
import domainSelectors from "app/store/domain/selectors";
import resourcePoolSelectors from "app/store/resourcepool/selectors";
import zoneSelectors from "app/store/zone/selectors";

type Props = {
  architectures: Pod["architectures"];
  available: {
    cores: number;
    memory: number; // MiB
  };
  defaults: {
    cores: number;
    memory: number; // MiB
  };
};

export const ComposeFormFields = ({
  architectures,
  available,
  defaults,
}: Props): JSX.Element => {
  const domains = useSelector(domainSelectors.all);
  const resourcePools = useSelector(resourcePoolSelectors.all);
  const zones = useSelector(zoneSelectors.all);

  const coresCaution = available.cores < defaults.cores;
  const memoryCaution = available.memory < defaults.memory;

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
          caution={
            coresCaution
              ? `The available cores (${available.cores}) is less than the
                recommended default (${defaults.cores}).`
              : undefined
          }
          help={
            coresCaution ? undefined : `${available.cores} cores available.`
          }
          label="Cores"
          max={`${available.cores}`}
          min="1"
          name="cores"
          placeholder={`${defaults.cores} (default)`}
          step="1"
          type="number"
        />
        <FormikField
          caution={
            memoryCaution
              ? `The available memory (${available.memory}MiB) is less than the
                recommended default (${defaults.memory}MiB).`
              : undefined
          }
          help={
            memoryCaution ? undefined : `${available.memory} MiB available.`
          }
          label="RAM (MiB)"
          max={`${available.memory}`}
          min="1024"
          name="memory"
          placeholder={`${defaults.memory} (default)`}
          type="number"
        />
      </Col>
    </Row>
  );
};

export default ComposeFormFields;
