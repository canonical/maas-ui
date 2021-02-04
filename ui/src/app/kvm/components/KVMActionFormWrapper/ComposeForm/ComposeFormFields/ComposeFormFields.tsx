import { Col, Row, Select } from "@canonical/react-components";

import type { ComposeFormDefaults } from "../ComposeForm";

import DomainSelect from "app/base/components/DomainSelect";
import FormikField from "app/base/components/FormikField";
import ResourcePoolSelect from "app/base/components/ResourcePoolSelect";
import ZoneSelect from "app/base/components/ZoneSelect";
import type { Pod } from "app/store/pod/types";

type Props = {
  architectures: Pod["architectures"];
  available: {
    cores: number;
    memory: number; // MiB
  };
  defaults: ComposeFormDefaults;
};

export const ComposeFormFields = ({
  architectures,
  available,
  defaults,
}: Props): JSX.Element => {
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
        <DomainSelect name="domain" required valueKey="id" />
        <ZoneSelect name="zone" required valueKey="id" />
        <ResourcePoolSelect name="pool" required valueKey="id" />
      </Col>
      <Col size="5" emptyLarge="7">
        <FormikField
          component={Select}
          label="Architecture"
          name="architecture"
          options={[
            { label: "Select architecture", value: "", disabled: true },
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
