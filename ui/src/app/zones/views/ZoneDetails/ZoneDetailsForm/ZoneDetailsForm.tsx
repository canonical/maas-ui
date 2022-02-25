import { useCallback, useEffect } from "react";

import { Row, Col, Textarea } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";
import { ACTION_STATUS } from "app/base/constants";
import type { RootState } from "app/store/root/types";
import { actions as zoneActions } from "app/store/zone";
import { ZONE_ACTIONS } from "app/store/zone/constants";
import zoneSelectors from "app/store/zone/selectors";

type Props = {
  id: number;
  closeForm: () => void;
};

export type CreateZoneValues = {
  description: string;
  name: string;
};

const ZoneForm = ({ id, closeForm }: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const cleanup = useCallback(() => zoneActions.cleanup(), []);
  const zone = useSelector((state: RootState) =>
    zoneSelectors.getById(state, id)
  );
  const errors = useSelector((state: RootState) =>
    zoneSelectors.getLatestActionError(state, ZONE_ACTIONS.create)
  );
  const updateStatus = useSelector((state: RootState) =>
    zoneSelectors.getModelActionStatus(state, id, ZONE_ACTIONS.update)
  );

  useEffect(() => {
    dispatch(zoneActions.fetch());
  }, [dispatch]);

  if (zone) {
    return (
      <FormikForm<CreateZoneValues>
        cleanup={cleanup}
        errors={errors}
        initialValues={{
          description: zone.description,
          name: zone.name,
        }}
        onCancel={closeForm}
        onSuccess={closeForm}
        onSubmit={(values) => {
          dispatch(cleanup());
          dispatch(
            zoneActions.update({
              id: id,
              description: values.description,
              name: values.name,
            })
          );
        }}
        saved={updateStatus === ACTION_STATUS.successful}
        saving={updateStatus === ACTION_STATUS.processing}
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

export default ZoneForm;
