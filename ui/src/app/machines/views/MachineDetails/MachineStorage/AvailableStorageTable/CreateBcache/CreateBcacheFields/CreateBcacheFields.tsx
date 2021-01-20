import { Col, Input, Row, Select } from "@canonical/react-components";
import { useFormikContext } from "formik";

import FilesystemFields from "../../FilesystemFields";
import type { CreateBcacheValues } from "../CreateBcache";

import FormikField from "app/base/components/FormikField";
import TagSelector from "app/base/components/TagSelector";
import type { Disk, Machine, Partition } from "app/store/machine/types";
import { BcacheModes } from "app/store/machine/types";
import { formatSize } from "app/store/machine/utils";

type Props = {
  cacheSets: Disk[];
  storageDevice: Disk | Partition;
  systemId: Machine["system_id"];
};

export const CreateBcacheFields = ({
  cacheSets,
  storageDevice,
  systemId,
}: Props): JSX.Element => {
  const {
    initialValues,
    setFieldValue,
  } = useFormikContext<CreateBcacheValues>();
  const initialTags = initialValues.tags.map((tag) => ({ name: tag }));

  return (
    <Row>
      <Col size="5">
        <FormikField label="Name" name="name" required type="text" />
        <Input
          disabled
          label="Size"
          value={formatSize(storageDevice.size)}
          type="text"
        />
        <FormikField
          component={Select}
          label="Cache set"
          name="cacheSetId"
          options={cacheSets.map((cacheSet) => ({
            key: cacheSet.id,
            label: cacheSet.name,
            value: cacheSet.id,
          }))}
        />
        <FormikField
          component={Select}
          label="Cache mode"
          name="cacheMode"
          options={[
            { label: BcacheModes.WRITE_BACK, value: BcacheModes.WRITE_BACK },
            {
              label: BcacheModes.WRITE_THROUGH,
              value: BcacheModes.WRITE_THROUGH,
            },
            {
              label: BcacheModes.WRITE_AROUND,
              value: BcacheModes.WRITE_AROUND,
            },
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

export default CreateBcacheFields;
