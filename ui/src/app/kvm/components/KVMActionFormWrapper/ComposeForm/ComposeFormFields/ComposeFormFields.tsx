import { useState } from "react";

import { Col, Input, Row, Select, Tooltip } from "@canonical/react-components";
import { useFormikContext } from "formik";
import pluralize from "pluralize";

import type { ComposeFormDefaults } from "../ComposeForm";

import DomainSelect from "app/base/components/DomainSelect";
import FormikField from "app/base/components/FormikField";
import ResourcePoolSelect from "app/base/components/ResourcePoolSelect";
import ZoneSelect from "app/base/components/ZoneSelect";
import type { Pod } from "app/store/pod/types";
import { PodType } from "app/store/pod/types";
import { getRanges } from "app/utils";

type Props = {
  architectures: Pod["architectures"];
  available: {
    cores: number;
    hugepages: number;
    memory: number; // MiB
    pinnedCores: number[];
  };
  defaults: ComposeFormDefaults;
  podType: PodType;
};

const getHugepagesTooltip = (isLxd: boolean, hasFreeHugepages: boolean) => {
  if (!isLxd) {
    return "Hugepages are only supported on LXD KVMs.";
  }
  if (!hasFreeHugepages) {
    return "There are no free hugepages on this system.";
  }
  return null;
};

export const ComposeFormFields = ({
  architectures,
  available,
  defaults,
  podType,
}: Props): JSX.Element => {
  const { setFieldValue } = useFormikContext();
  const [pinningCores, setPinningCores] = useState(false);
  const coresCaution = available.cores < defaults.cores;
  const memoryCaution = available.memory < defaults.memory;
  const isLxd = podType === PodType.LXD;
  const hasFreeHugepages = available.hugepages > 0;
  const availableCoresString = pluralize("core", available.cores, true);

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
          help={memoryCaution ? undefined : `${available.memory}MiB available.`}
          label="RAM (MiB)"
          max={`${available.memory}`}
          min="1024"
          name="memory"
          placeholder={`${defaults.memory} (default)`}
          type="number"
          wrapperClassName="u-sv2"
        />
        <Tooltip
          data-test="hugepages-tooltip"
          message={getHugepagesTooltip(isLxd, hasFreeHugepages)}
        >
          <FormikField
            disabled={!isLxd || !hasFreeHugepages}
            label="Enable hugepages"
            name="hugepagesBacked"
            type="checkbox"
          />
        </Tooltip>
        <p>Cores</p>
        <Input
          checked={!pinningCores}
          id="not-pinning-cores"
          label="Use any available core(s)"
          onChange={() => {
            setPinningCores(false);
            setFieldValue("cores", defaults.cores);
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
              coresCaution ? undefined : `${availableCoresString} available.`
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
        <Tooltip
          data-test="core-pin-tooltip"
          message={!isLxd ? "Core pinning is only supported on LXD KVMs" : null}
        >
          <Input
            checked={pinningCores}
            disabled={!isLxd}
            id="pinning-cores"
            label="Pin VM to specific core(s)"
            onChange={() => {
              setPinningCores(true);
              setFieldValue("cores", "");
              setFieldValue("pinnedCores", "");
            }}
            type="radio"
          />
        </Tooltip>
        {pinningCores && (
          <FormikField
            help={`${availableCoresString} available (free indices: ${getRanges(
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
