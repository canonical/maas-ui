import { Col, Row } from "@canonical/react-components";
import { useFormikContext } from "formik";

import type { ReleaseFormValues } from "../ReleaseForm";

import FormikField from "@/app/base/components/FormikField";

export const ReleaseFormFields = (): React.ReactElement => {
  const { handleChange, setFieldValue, values } =
    useFormikContext<ReleaseFormValues>();

  return (
    <Row>
      <Col size={12}>
        <FormikField
          label="Erase disks before releasing"
          name="enableErase"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleChange(e);
            if (!e.target.checked) {
              setFieldValue("quickErase", false).catch((reason) => {
                throw new Error(reason);
              });
              setFieldValue("secureErase", false).catch((reason) => {
                throw new Error(reason);
              });
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
