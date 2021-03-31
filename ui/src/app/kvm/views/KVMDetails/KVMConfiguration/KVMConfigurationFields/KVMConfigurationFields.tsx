import * as React from "react";

import { Col, Input, Row, Slider } from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";

import type { KVMConfigurationValues } from "../KVMConfiguration";

import FormikField from "app/base/components/FormikField";
import ResourcePoolSelect from "app/base/components/ResourcePoolSelect";
import TagField from "app/base/components/TagField";
import ZoneSelect from "app/base/components/ZoneSelect";
import { formatHostType } from "app/store/pod/utils";
import tagSelectors from "app/store/tag/selectors";

const KVMConfigurationFields = (): JSX.Element => {
  const tags = useSelector(tagSelectors.all);
  const { setFieldValue, values } = useFormikContext<KVMConfigurationValues>();

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
        <ZoneSelect name="zone" required valueKey="id" />
        <ResourcePoolSelect name="pool" required valueKey="id" />
        <TagField tagList={tags.map(({ name }) => name)} />
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
