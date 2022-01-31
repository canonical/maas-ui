import {
  Button,
  Strip,
  Notification,
  Row,
  Col,
  ActionButton,
} from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

import { useCycled } from "app/base/hooks";
import { actions as spaceActions } from "app/store/space";
import { default as spaceSelectors } from "app/store/space/selectors";
import type { Space } from "app/store/space/types";
import { getCanBeDeleted } from "app/store/space/utils";
import urls from "app/subnets/urls";
import { formatErrors } from "app/utils";

type SpaceDeleteProps = {
  space: Space;
  handleClose?: () => void;
};

export const SpaceDelete = ({
  space,
  handleClose,
}: SpaceDeleteProps): JSX.Element => {
  const canBeDeleted = getCanBeDeleted(space);
  const dispatch = useDispatch();
  const history = useHistory();
  const errors = useSelector(spaceSelectors.errors);
  const saving = useSelector(spaceSelectors.saving);
  const saved = useSelector(spaceSelectors.saved);
  const errorMessage = formatErrors(errors);

  const handleDelete = () => {
    dispatch(spaceActions.delete(space.id));
  };
  useCycled(saved, () => {
    if (saved) {
      history.replace(urls.indexBy({ by: "space" }));
    }
  });

  return (
    <Strip shallow element="section">
      <Row>
        {errors ? (
          <Notification inline severity="negative" title="Error:">
            {errorMessage}
          </Notification>
        ) : null}
        {!canBeDeleted ? (
          <Notification
            inline
            severity="negative"
            title="Error:"
            onDismiss={handleClose}
          >
            Space cannot be deleted because it has subnets attached. Remove all
            subnets from the space to allow deletion.
          </Notification>
        ) : null}
        {canBeDeleted ? (
          <>
            <Col size={8}>
              <p>Are you sure you want to delete {space.name} space?</p>
            </Col>
            <Col size={4} className="u-align--right">
              <ActionButton
                appearance="negative"
                onClick={handleDelete}
                disabled={saving}
              >
                Yes, delete space
              </ActionButton>
              <Button onClick={handleClose} disabled={saving}>
                No, cancel
              </Button>
            </Col>
          </>
        ) : null}
      </Row>
    </Strip>
  );
};

export default SpaceDelete;
