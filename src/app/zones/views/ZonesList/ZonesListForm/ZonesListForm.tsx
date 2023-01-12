import { useCallback } from "react";

import { Row, Col, Textarea } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";
import type { RootState } from "app/store/root/types";
import { actions as zoneActions } from "app/store/zone";
import { ZONE_ACTIONS } from "app/store/zone/constants";
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
  const cleanup = useCallback(
    () => zoneActions.cleanup([ZONE_ACTIONS.create]),
    []
  );
  const created = useSelector(zoneSelectors.created);
  const creating = useSelector(zoneSelectors.creating);
  const errors = useSelector((state: RootState) =>
    zoneSelectors.getLatestError(state, ZONE_ACTIONS.create)
  );

  return (
    <FormikForm<CreateZoneValues>
      aria-label="Add AZ"
      buttonsAlign="right"
      buttonsBordered={false}
      cleanup={cleanup}
      errors={errors}
      initialValues={{
        description: "",
        name: "",
      }}
      onCancel={closeForm}
      onSubmit={(values) => {
        dispatch(
          zoneActions.create({
            description: values.description,
            name: values.name,
          })
        );
      }}
      onSuccess={closeForm}
      resetOnSave={true}
      saved={created}
      saving={creating}
      submitLabel="Add AZ"
    >
      <Row>
        <Col size={12}>
          <FormikField
            label="Name"
            name="name"
            placeholder="Name"
            required
            type="text"
          />
          <FormikField
            component={Textarea}
            label="Description"
            name="description"
          />
        </Col>
      </Row>
    </FormikForm>
  );
};

export default ZonesListForm;
