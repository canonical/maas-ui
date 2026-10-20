import type { ReactElement } from "react";

import { useDispatch, useSelector } from "react-redux";

import ModelActionForm from "@/app/base/components/ModelActionForm";
import { useModal } from "@/app/base/modal-context";
import { staticRouteActions } from "@/app/store/staticroute";
import staticRouteSelectors from "@/app/store/staticroute/selectors";
import type {
  StaticRoute,
  StaticRouteMeta,
} from "@/app/store/staticroute/types";

type DeleteStaticRouteFormProps = {
  staticRouteId?: StaticRoute[StaticRouteMeta.PK];
};

const DeleteStaticRouteForm = ({
  staticRouteId,
}: DeleteStaticRouteFormProps): ReactElement | null => {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  const saved = useSelector(staticRouteSelectors.saved);
  const saving = useSelector(staticRouteSelectors.saving);

  if (!staticRouteId) {
    return null;
  }
  return (
    <ModelActionForm
      aria-label="Confirm static route deletion"
      initialValues={{}}
      modelType="static route"
      onCancel={closeModal}
      onSubmit={() => {
        dispatch(staticRouteActions.delete(staticRouteId));
      }}
      onSuccess={closeModal}
      saved={saved}
      saving={saving}
    />
  );
};

export default DeleteStaticRouteForm;
