import { Col, Input, Row, Select } from "@canonical/react-components";
import { useFormikContext } from "formik";

import type { EditPartitionValues } from "../EditPartition";

import FormikField from "app/base/components/FormikField";
import type { Partition } from "app/store/machine/types";
import { formatSize, formatType } from "app/store/machine/utils";

type Props = {
  filesystemOptions: { label: string; value: string }[];
  partition: Partition;
};

export const EditPartitionFields = ({
  filesystemOptions,
  partition,
}: Props): JSX.Element => {
  const { values } = useFormikContext<EditPartitionValues>();

  return (
    <Row>
      <Col size="5">
        <Input disabled label="Name" value={partition.name} type="text" />
        <Input
          disabled
          label="Type"
          value={formatType(partition)}
          type="text"
        />
        <Input
          disabled
          label="Size"
          value={formatSize(partition.size)}
          type="text"
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
        {Boolean(values.fstype) && (
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

export default EditPartitionFields;
