import { useEffect } from "react";

import { Input, Row, Col } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";
import { actions } from "app/store/zone";
import zoneSelectors from "app/store/zone/selectors";

type Props = {
  closeForm: () => void;
};

export type CreateZone = {
  name: string;
};

const ZonesListForm = ({ closeForm }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const errors = useSelector(zoneSelectors.errors);
  const saved = useSelector(zoneSelectors.saved);
  const saving = useSelector(zoneSelectors.saving);

  useEffect(() => {
    dispatch(actions.fetch());
  }, [dispatch]);

  return (
    <FormikForm<CreateZone>
      buttonsAlign="right"
      buttonsBordered={false}
      errors={errors}
      initialValues={{
        name: "",
      }}
      onCancel={closeForm}
      onSuccess={closeForm}
      onSubmit={(values: CreateZone) => {
        dispatch(
          actions.create({
            name: values.name,
          })
        );
      }}
      resetOnSave={true}
      saved={saved}
      saving={saving}
      submitLabel="Add AZ"
    >
      <Row>
        <Col size="6">
          <FormikField
            component={Input}
            label="Name"
            placeholder="Name"
            type="text"
            name="name"
            required
          />
        </Col>
      </Row>
    </FormikForm>
  );
};

export default ZonesListForm;
