import { Col, Input, Row, Select } from "@canonical/react-components";
import { useFormikContext } from "formik";

import FilesystemFields from "../../FilesystemFields";
import type { AddLogicalVolumeValues } from "../AddLogicalVolume";

import FormikField from "app/base/components/FormikField";
import TagField from "app/base/components/TagField";
import type { Machine } from "app/store/machine/types";

type Props = {
  systemId: Machine["system_id"];
};

export const AddLogicalVolumeFields = ({ systemId }: Props): JSX.Element => {
  const {
    handleChange,
    setFieldTouched,
    setFieldValue,
  } = useFormikContext<AddLogicalVolumeValues>();

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
        <TagField />
      </Col>
      <Col emptyLarge="7" size="5">
        <FilesystemFields systemId={systemId} />
      </Col>
    </Row>
  );
};

export default AddLogicalVolumeFields;
