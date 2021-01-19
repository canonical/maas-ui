import { Col, Input, Row } from "@canonical/react-components";
import { useFormikContext } from "formik";

import FilesystemFields from "../../../FilesystemFields";
import type { CreateRaidValues } from "../CreateRaid";

import FormikField from "app/base/components/FormikField";
import TagSelector from "app/base/components/TagSelector";
import type { Disk, Machine, Partition } from "app/store/machine/types";
import { formatSize } from "app/store/machine/utils";

type Props = {
  storageDevices: (Disk | Partition)[];
  systemId: Machine["system_id"];
};

export const CreateRaidFields = ({
  storageDevices,
  systemId,
}: Props): JSX.Element => {
  const { initialValues, setFieldValue } = useFormikContext<CreateRaidValues>();
  const initialTags = initialValues.tags.map((tag) => ({ name: tag }));
  const totalSize = storageDevices.reduce(
    (sum, device) => (sum += device.size),
    0
  );

  return (
    <Row>
      <Col size="5">
        <FormikField label="Name" name="name" required type="text" />
        <Input
          disabled
          label="Size"
          type="text"
          value={formatSize(totalSize)}
        />
        {/* TODO: Replace hardcoded type value with select */}
        <Input disabled label="RAID level" type="text" value="RAID 0" />
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

export default CreateRaidFields;
