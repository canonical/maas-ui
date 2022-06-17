import { Notification } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import FormikForm from "app/base/components/FormikForm";
import type { EmptyObject } from "app/base/types";
import { actions as spaceActions } from "app/store/space";
import spaceSelectors from "app/store/space/selectors";
import type { Space } from "app/store/space/types";
import { getCanBeDeleted } from "app/store/space/utils";
import urls from "app/subnets/urls";

type SpaceDeleteProps = {
  handleClose?: () => void;
  space: Space;
};

export const SpaceDelete = ({
  handleClose,
  space,
}: SpaceDeleteProps): JSX.Element => {
  const canBeDeleted = getCanBeDeleted(space);
  const dispatch = useDispatch();
  const errors = useSelector(spaceSelectors.errors);
  const saving = useSelector(spaceSelectors.saving);
  const saved = useSelector(spaceSelectors.saved);

  return (
    <FormikForm<EmptyObject>
      buttonsBordered={false}
      cleanup={spaceActions.cleanup}
      errors={errors}
      initialValues={{}}
      onCancel={handleClose}
      onSubmit={() => {
        dispatch(spaceActions.cleanup());
        dispatch(spaceActions.delete(space.id));
      }}
      saved={saved}
      savedRedirect={urls.indexWithParams({ by: "fabric" })}
      saving={saving}
      submitAppearance="negative"
      submitDisabled={!canBeDeleted}
      submitLabel="Delete space"
    >
      {canBeDeleted ? (
        <Notification borderless severity="caution">
          Are you sure you want to delete this space?
        </Notification>
      ) : (
        <Notification borderless severity="negative">
          Space cannot be deleted because it has subnets attached. Remove all
          subnets from the space to allow deletion.
        </Notification>
      )}
    </FormikForm>
  );
};

export default SpaceDelete;
