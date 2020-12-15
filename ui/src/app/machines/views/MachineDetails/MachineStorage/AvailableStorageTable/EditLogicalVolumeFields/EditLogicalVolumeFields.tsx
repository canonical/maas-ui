import { Col, Input, Row, Select } from "@canonical/react-components";
import { useFormikContext } from "formik";

import type { EditLogicalVolumeValues } from "../EditLogicalVolume";

import FormikField from "app/base/components/FormikField";
import TagSelector from "app/base/components/TagSelector";
import type { Disk } from "app/store/machine/types";
import { formatSize } from "app/store/machine/utils";

type Props = {
  disk: Disk;
  filesystemOptions: { label: string; value: string }[];
};

export const EditLogicalVolumeFields = ({
  disk,
  filesystemOptions,
}: Props): JSX.Element => {
  const {
    initialValues,
    setFieldValue,
    values,
  } = useFormikContext<EditLogicalVolumeValues>();
  const initialTags = initialValues.tags.map((tag) => ({ name: tag }));

  return (
    <Row>
      <Col size="5">
        <Input disabled label="Name" type="text" value={disk.name} />
        <Input disabled label="Type" type="text" value="Logical volume" />
        <Input
          disabled
          label="Size"
          type="text"
          value={formatSize(disk.size)}
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
          tags={initialTags}
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

export default EditLogicalVolumeFields;
