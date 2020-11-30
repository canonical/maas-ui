import { Col, Input, Row, Select } from "@canonical/react-components";
import { useFormikContext } from "formik";

import type { AddPartitionValues } from "../AddPartition";

import FormikField from "app/base/components/FormikField";

type Props = {
  filesystemOptions: { label: string; value: string }[];
  partitionName: string;
};

export const AddPartitionFields = ({
  filesystemOptions,
  partitionName,
}: Props): JSX.Element => {
  const { values } = useFormikContext<AddPartitionValues>();

  return (
    <Row>
      <Col size="5">
        <Input disabled label="Name" value={partitionName} type="text" />
        <Input disabled label="Type" value="Partition" type="text" />
        <FormikField
          label="Size"
          min="0"
          name="partitionSize"
          required
          type="number"
        />
        <FormikField
          component={Select}
          label="Unit"
          name="unit"
          options={[
            {
              label: "Select partition size unit",
              value: null,
              disabled: true,
            },
            { label: "MB", value: "2" },
            { label: "GB", value: "3" },
            { label: "TB", value: "4" },
          ]}
        />
      </Col>
      <Col emptyLarge="7" size="5">
        <FormikField
          component={Select}
          label="Filesystem"
          name="filesystemType"
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
        {!!values.filesystemType && (
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

export default AddPartitionFields;
