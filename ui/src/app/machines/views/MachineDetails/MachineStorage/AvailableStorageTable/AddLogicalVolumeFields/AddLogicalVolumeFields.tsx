import { Col, Input, Row, Select } from "@canonical/react-components";
import { useFormikContext } from "formik";

import type { AddLogicalVolumeValues } from "../AddLogicalVolume";

import FormikField from "app/base/components/FormikField";
import TagSelector from "app/base/components/TagSelector";

type Props = {
  filesystemOptions: { label: string; value: string }[];
};

export const AddLogicalVolumeFields = ({
  filesystemOptions,
}: Props): JSX.Element => {
  const {
    initialValues,
    setFieldValue,
    values,
  } = useFormikContext<AddLogicalVolumeValues>();
  const initialTags = initialValues.tags.map((tag) => ({ name: tag }));

  return (
    <Row>
      <Col size="5">
        <FormikField label="Name" name="name" required type="text" />
        <Input disabled label="Type" value="Logical volume" type="text" />
        <FormikField label="Size" min="0" name="size" required type="number" />
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
        <FormikField
          component={Select}
          label="Filesystem"
          name="fstype"
          options={[
            {
              label: "Select filesystem type",
              value: null,
              disabled: true,
            },
            {
              label: "Unformatted",
              value: "",
            },
            ...filesystemOptions,
          ]}
        />
        {!!values.fstype && (
          <>
            <FormikField
              label="Mount point"
              name="mountPoint"
              placeholder="/path/to/partition"
              required
              type="text"
            />
            <FormikField
              help='Comma-separated list without spaces, e.g. "noexec,size=1024k".'
              label="Mount options"
              name="mountOptions"
              type="text"
            />
          </>
        )}
      </Col>
    </Row>
  );
};

export default AddLogicalVolumeFields;
