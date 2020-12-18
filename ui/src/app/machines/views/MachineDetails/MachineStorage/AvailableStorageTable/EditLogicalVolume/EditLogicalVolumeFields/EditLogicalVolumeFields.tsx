import { Col, Input, Row } from "@canonical/react-components";
import { useFormikContext } from "formik";

import FilesystemFields from "../../FilesystemFields";
import type { EditLogicalVolumeValues } from "../EditLogicalVolume";

import FormikField from "app/base/components/FormikField";
import TagSelector from "app/base/components/TagSelector";
import type { Disk, Machine } from "app/store/machine/types";
import { formatSize } from "app/store/machine/utils";

type Props = {
  disk: Disk;
  systemId: Machine["system_id"];
};

export const EditLogicalVolumeFields = ({
  disk,
  systemId,
}: Props): JSX.Element => {
  const {
    initialValues,
    setFieldValue,
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
        <FilesystemFields systemId={systemId} />
      </Col>
    </Row>
  );
};

export default EditLogicalVolumeFields;
