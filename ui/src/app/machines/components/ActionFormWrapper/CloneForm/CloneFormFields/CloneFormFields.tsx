import { Col, Row } from "@canonical/react-components";
import { useFormikContext } from "formik";

import type { CloneFormValues } from "../CloneForm";

import SourceMachineSelect from "./SourceMachineSelect";

import FormikField from "app/base/components/FormikField";
import type { Machine } from "app/store/machine/types";

export const CloneFormFields = (): JSX.Element => {
  const { setFieldValue, values } = useFormikContext<CloneFormValues>();

  return (
    <Row>
      <Col size={4}>
        <p>1. Select the source machine</p>
        <SourceMachineSelect
          source={values.source}
          setSource={(id: Machine["system_id"] | null) =>
            setFieldValue("source", id || "")
          }
        />
      </Col>
      <Col size={8}>
        <p>2. Select what to clone</p>
        <FormikField
          label="Clone network configuration"
          name="interfaces"
          type="checkbox"
        />
        <FormikField
          label="Clone storage configuration"
          name="storage"
          type="checkbox"
        />
      </Col>
    </Row>
  );
};

export default CloneFormFields;
