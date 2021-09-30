import { useCallback, useEffect, useRef } from "react";

import { Row, Col, Textarea } from "@canonical/react-components";
import { nanoid } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";
import type { RootState } from "app/store/root/types";
import { actions as zoneActions } from "app/store/zone";
import zoneSelectors from "app/store/zone/selectors";

type Props = {
  id: number;
  closeForm: () => void;
};

export type CreateZoneValues = {
  description: string;
  name: string;
};

const ZoneDetailsForm = ({ id, closeForm }: Props): JSX.Element | null => {
  const formId = useRef(nanoid());
  const dispatch = useDispatch();
  const cleanup = useCallback(() => zoneActions.cleanup(), []);
  const zone = useSelector((state: RootState) =>
    zoneSelectors.getById(state, id)
  );
  const error = useSelector((state: RootState) =>
    zoneSelectors.getLatestFormError(state, formId.current)
  );
  const updated = useSelector(zoneSelectors.updated).includes(id);
  const updating = useSelector(zoneSelectors.updating).includes(id);

  useEffect(() => {
    dispatch(zoneActions.fetch());
  }, [dispatch]);

  if (zone) {
    return (
      <FormikForm<CreateZoneValues>
        buttonsAlign="right"
        buttonsBordered={false}
        cleanup={cleanup}
        errors={error}
        initialValues={{
          description: zone.description,
          name: zone.name,
        }}
        onCancel={closeForm}
        onSuccess={closeForm}
        onSubmit={(values) => {
          dispatch(cleanup());
          dispatch(
            zoneActions.update(
              {
                id: id,
                description: values.description,
                name: values.name,
              },
              formId.current
            )
          );
        }}
        resetOnSave={true}
        saved={updated}
        saving={updating}
        submitLabel="Update AZ"
      >
        <Row>
          <Col size={6}>
            <FormikField
              label="Name"
              placeholder="Name"
              type="text"
              name="name"
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
  }
  return null;
};

export default ZoneDetailsForm;
