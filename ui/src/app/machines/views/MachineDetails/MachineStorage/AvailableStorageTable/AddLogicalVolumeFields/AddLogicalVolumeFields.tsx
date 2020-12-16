import { Col, Input, Row, Select } from "@canonical/react-components";
import { useFormikContext } from "formik";

import type { AddLogicalVolumeValues } from "../AddLogicalVolume";
import FilesystemFields from "../FilesystemFields";

import FormikField from "app/base/components/FormikField";
import TagSelector from "app/base/components/TagSelector";
import type { Machine } from "app/store/machine/types";

type Props = {
  systemId: Machine["system_id"];
};

export const AddLogicalVolumeFields = ({ systemId }: Props): JSX.Element => {
  const {
    handleChange,
    initialValues,
    setFieldTouched,
    setFieldValue,
  } = useFormikContext<AddLogicalVolumeValues>();
  const initialTags = initialValues.tags.map((tag) => ({ name: tag }));

  return (
    <Row>
      <Col size="5">
        <FormikField label="Name" name="name" required type="text" />
        <Input disabled label="Type" value="Logical volume" type="text" />
        <FormikField
          label="Size"
          min="0"
          name="size"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const value =
              e.target.value !== "" ? parseFloat(e.target.value) : "";
            handleChange(e);
            setFieldValue("size", value);
            setFieldTouched("size", true, false);
          }}
          required
          step="any"
          type="number"
        />
        <FormikField
          component={Select}
          label="Unit"
          name="unit"
          options={[
            {
              label: "Select volume size unit",
              value: null,
              disabled: true,
            },
            { label: "MB", value: "MB" },
            { label: "GB", value: "GB" },
            { label: "TB", value: "TB" },
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
              selectedTags.map((tag) => tag.name)
            );
          }}
          placeholder="Select or create tags"
          tags={[]}
        />
      </Col>
      <Col emptyLarge="7" size="5">
        <FilesystemFields systemId={systemId} />
      </Col>
    </Row>
  );
};

export default AddLogicalVolumeFields;
