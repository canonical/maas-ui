import { Col, Input, Row, Select } from "@canonical/react-components";
import { useFormikContext } from "formik";

import FilesystemFields from "../../FilesystemFields";
import type { AddPartitionValues } from "../AddPartition";

import FormikField from "app/base/components/FormikField";
import type { Machine } from "app/store/machine/types";

type Props = {
  partitionName: string;
  systemId: Machine["system_id"];
};

export const AddPartitionFields = ({
  partitionName,
  systemId,
}: Props): JSX.Element => {
  const {
    handleChange,
    setFieldTouched,
    setFieldValue,
  } = useFormikContext<AddPartitionValues>();

  return (
    <Row>
      <Col size="5">
        <Input disabled label="Name" value={partitionName} type="text" />
        <Input disabled label="Type" value="Partition" type="text" />
        <FormikField
          label="Size"
          min="0"
          name="partitionSize"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const value =
              e.target.value !== "" ? parseFloat(e.target.value) : "";
            handleChange(e);
            setFieldValue("partitionSize", value);
            setFieldTouched("partitionSize", true, false);
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
              label: "Select partition size unit",
              value: null,
              disabled: true,
            },
            { label: "MB", value: "MB" },
            { label: "GB", value: "GB" },
            { label: "TB", value: "TB" },
          ]}
        />
      </Col>
      <Col emptyLarge="7" size="5">
        <FilesystemFields systemId={systemId} />
      </Col>
    </Row>
  );
};

export default AddPartitionFields;
