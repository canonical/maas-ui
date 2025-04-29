import type { ReactElement } from "react";

import { useDispatch, useSelector } from "react-redux";

import ModelActionForm from "@/app/base/components/ModelActionForm";
import type { SetSidePanelContent } from "@/app/base/side-panel-context";
import { staticRouteActions } from "@/app/store/staticroute";
import staticRouteSelectors from "@/app/store/staticroute/selectors";
import type {
  StaticRoute,
  StaticRouteMeta,
} from "@/app/store/staticroute/types";

type Props = {
  staticRouteId?: StaticRoute[StaticRouteMeta.PK];
  setSidePanelContent: SetSidePanelContent;
};

const DeleteStaticRouteForm = ({
  staticRouteId,
  setSidePanelContent,
}: Props): ReactElement | null => {
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
      onCancel={() => {
        setSidePanelContent(null);
      }}
      onSubmit={() => {
        dispatch(staticRouteActions.delete(staticRouteId));
      }}
      onSuccess={() => {
        setSidePanelContent(null);
      }}
      saved={saved}
      saving={saving}
    />
  );
};

export default DeleteStaticRouteForm;
