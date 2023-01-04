import { Col, Row } from "@canonical/react-components";
import { useFormikContext } from "formik";

import type { ReleaseFormValues } from "../ReleaseForm";

import FormikField from "app/base/components/FormikField";

export const ReleaseFormFields = (): JSX.Element => {
  const { handleChange, setFieldValue, values } =
    useFormikContext<ReleaseFormValues>();

  return (
    <Row>
      <Col size={6}>
        <FormikField
          label="Erase disks before releasing"
          name="enableErase"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleChange(e);
            if (e.target.checked === false) {
              setFieldValue("quickErase", false);
              setFieldValue("secureErase", false);
            }
          }}
          type="checkbox"
        />
        <FormikField
          disabled={!values.enableErase}
          label="Use secure erase"
          name="secureErase"
          type="checkbox"
        />
        <FormikField
          disabled={!values.enableErase}
          label="Use quick erase (not secure)"
          name="quickErase"
          type="checkbox"
        />
      </Col>
    </Row>
  );
};

export default ReleaseFormFields;
