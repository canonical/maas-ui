import type { ReactElement } from "react";

import { Notification } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import FormikForm from "@/app/base/components/FormikForm";
import { useSidePanel } from "@/app/base/side-panel-context-new";
import type { EmptyObject } from "@/app/base/types";
import urls from "@/app/networks/urls";
import { spaceActions } from "@/app/store/space";
import spaceSelectors from "@/app/store/space/selectors";
import type { Space } from "@/app/store/space/types";
import { getCanBeDeleted } from "@/app/store/space/utils";

type DeleteSpaceProps = {
  space: Space;
};

export const DeleteSpace = ({ space }: DeleteSpaceProps): ReactElement => {
  const { closeSidePanel } = useSidePanel();
  const canBeDeleted = getCanBeDeleted(space);
  const dispatch = useDispatch();
  const errors = useSelector(spaceSelectors.errors);
  const saving = useSelector(spaceSelectors.saving);
  const saved = useSelector(spaceSelectors.saved);

  return (
    <FormikForm<EmptyObject>
      cleanup={spaceActions.cleanup}
      errors={errors}
      initialValues={{}}
      onCancel={closeSidePanel}
      onSubmit={() => {
        dispatch(spaceActions.cleanup());
        dispatch(spaceActions.delete(space.id));
      }}
      onSuccess={closeSidePanel}
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

export default DeleteSpace;
