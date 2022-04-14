import { useCallback } from "react";

import { Row, Col, Textarea } from "@canonical/react-components";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";

import FormikField from "app/base/components/FormikField";
import FormikFormContent from "app/base/components/FormikFormContent";
import { actions as zoneActions } from "app/store/zone";
import zoneSelectors from "app/store/zone/selectors";

type Props = {
  closeForm: () => void;
};

export type CreateZoneValues = {
  description: string;
  name: string;
};

const ZonesListForm = ({ closeForm }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const errors = useSelector(zoneSelectors.errors);
  const saved = useSelector(zoneSelectors.saved);
  const saving = useSelector(zoneSelectors.saving);
  const cleanup = useCallback(() => zoneActions.cleanup(), []);

  return (
    <Formik
      initialValues={{
        description: "",
        name: "",
      }}
      onSubmit={(values) => {
        dispatch(
          zoneActions.create({
            description: values.description,
            name: values.name,
          })
        );
      }}
    >
      <FormikFormContent<CreateZoneValues>
        buttonsAlign="right"
        buttonsBordered={false}
        cleanup={cleanup}
        errors={errors}
        onCancel={closeForm}
        onSuccess={closeForm}
        resetOnSave={true}
        saved={saved}
        saving={saving}
        submitLabel="Add AZ"
      >
        <Row>
          <Col size={6}>
            <FormikField
              label="Name"
              placeholder="Name"
              type="text"
              name="name"
              required
            />
            <FormikField
              component={Textarea}
              label="Description"
              name="description"
            />
          </Col>
        </Row>
      </FormikFormContent>
    </Formik>
  );
};

export default ZonesListForm;
