import { Col, Input, Row, Select } from "@canonical/react-components";
import { useFormikContext } from "formik";
import React from "react";
import { useSelector } from "react-redux";

import type { KVMConfigurationValues } from "../KVMConfiguration";
import {
  resourcepool as resourcePoolSelectors,
  tag as tagSelectors,
  zone as zoneSelectors,
} from "app/base/selectors";
import { formatHostType } from "app/kvm/utils";
import FormikField from "app/base/components/FormikField";
import Slider from "app/base/components/Slider";
import TagSelector from "app/base/components/TagSelector";

const KVMConfigurationFields = (): JSX.Element => {
  const resourcePools = useSelector(resourcePoolSelectors.all);
  const allTags = useSelector(tagSelectors.all);
  const zones = useSelector(zoneSelectors.all);
  const { initialValues, setFieldValue, values } = useFormikContext<
    KVMConfigurationValues
  >();
  // Tags in state is an array of objects
  const allTagsSorted = [...allTags].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  // pod.tags is an array of strings, so needs to be converted into objects
  const initialTags = [...initialValues.tags]
    .sort()
    .map((tag) => ({ name: tag }));

  return (
    <Row>
      <Col size="5">
        <Input
          disabled
          label="KVM host type"
          name="type"
          value={formatHostType(values.type)}
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
            {
              label: "Select your resource pool",
              value: "",
              disabled: true,
            },
            ...resourcePools.map((pool) => ({
              key: `pool-${pool.id}`,
              label: pool.name,
              value: pool.id,
            })),
          ]}
        />
        <FormikField
          allowNewTags
          component={TagSelector}
          initialSelected={initialTags}
          label="Tags"
          name="tags"
          onTagsUpdate={(selectedTags: { name: string }[]) => {
            setFieldValue(
              "tags",
              // Convert back to array of strings
              selectedTags.map((tag) => tag.name)
            );
          }}
          placeholder="Select or create tags"
          tags={allTagsSorted}
        />
      </Col>
      <Col size="5">
        <FormikField label="Address" name="power_address" type="text" />
        <FormikField
          label="Password (optional)"
          name="password"
          type="password"
        />
        <FormikField
          component={Slider}
          inputDisabled
          label="CPU overcommit"
          max={10}
          min={0.1}
          name="cpu_over_commit_ratio"
          onChange={(e: React.FormEvent<HTMLInputElement>) =>
            setFieldValue(
              "cpu_over_commit_ratio",
              Number(e.currentTarget.value)
            )
          }
          showInput
          step={0.1}
          value={values.cpu_over_commit_ratio}
        />
        <FormikField
          component={Slider}
          inputDisabled
          label="Memory overcommit"
          max={10}
          min={0.1}
          name="memory_over_commit_ratio"
          onChange={(e: React.FormEvent<HTMLInputElement>) =>
            setFieldValue(
              "memory_over_commit_ratio",
              Number(e.currentTarget.value)
            )
          }
          showInput
          step={0.1}
          value={values.memory_over_commit_ratio}
        />
      </Col>
    </Row>
  );
};

export default KVMConfigurationFields;
