import { useState } from "react";

import { Col, Input, Row, Select } from "@canonical/react-components";
import { useFormikContext } from "formik";

import type { ComposeFormDefaults } from "../ComposeForm";

import DomainSelect from "app/base/components/DomainSelect";
import FormikField from "app/base/components/FormikField";
import ResourcePoolSelect from "app/base/components/ResourcePoolSelect";
import ZoneSelect from "app/base/components/ZoneSelect";
import type { Pod } from "app/store/pod/types";
import { getRanges } from "app/utils";

type Props = {
  architectures: Pod["architectures"];
  available: {
    cores: number;
    memory: number; // MiB
    pinnedCores: number[];
  };
  defaults: ComposeFormDefaults;
};

export const ComposeFormFields = ({
  architectures,
  available,
  defaults,
}: Props): JSX.Element => {
  const { setFieldValue } = useFormikContext();
  const [pinningCores, setPinningCores] = useState(false);
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
          wrapperClassName="u-sv2"
        />
        <FormikField
          label="Enable hugepages"
          name="hugepagesBacked"
          type="checkbox"
        />
        <p>Cores</p>
        <Input
          checked={!pinningCores}
          id="not-pinning-cores"
          label="Use any available core(s)"
          onChange={() => {
            setPinningCores(false);
            setFieldValue("pinnedCores", "");
          }}
          type="radio"
        />
        {!pinningCores && (
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
            max={`${available.cores}`}
            min="1"
            name="cores"
            placeholder={`${defaults.cores} (default)`}
            step="1"
            type="number"
            wrapperClassName="u-nudge-right--x-large u-sv2"
          />
        )}
        <Input
          checked={pinningCores}
          id="pinning-cores"
          label="Pin VM to specific core(s)"
          onChange={() => {
            setPinningCores(true);
            setFieldValue("cores", "");
          }}
          type="radio"
        />
        {pinningCores && (
          <FormikField
            help={`${
              available.cores
            } cores available (free indices: ${getRanges(
              available.pinnedCores
            )})`}
            name="pinnedCores"
            placeholder='Separate by comma or input a range, e.g. "1,2,4-12"'
            type="text"
            wrapperClassName="u-nudge-right--x-large u-sv2"
          />
        )}
      </Col>
    </Row>
  );
};

export default ComposeFormFields;
