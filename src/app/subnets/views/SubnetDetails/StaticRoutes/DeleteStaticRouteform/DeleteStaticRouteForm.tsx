import { useDispatch, useSelector } from "react-redux";

import ModelDeleteForm from "@/app/base/components/ModelDeleteForm";
import type { SetSidePanelContent } from "@/app/base/side-panel-context";
import { actions as staticRouteActions } from "@/app/store/staticroute";
import staticRouteSelectors from "@/app/store/staticroute/selectors";
import type { Subnet, SubnetMeta } from "@/app/store/subnet/types";

type Props = {
  id: Subnet[SubnetMeta.PK];
  setActiveForm: SetSidePanelContent;
};

const DeleteStaticRouteForm = ({ id, setActiveForm }: Props) => {
  const dispatch = useDispatch();
  const saved = useSelector(staticRouteSelectors.saved);
  const saving = useSelector(staticRouteSelectors.saving);
  return (
    <ModelDeleteForm
      aria-label="Confirm static route deletion"
      initialValues={{}}
      modelType="static route"
      onCancel={() => setActiveForm(null)}
      onSubmit={() => {
        dispatch(staticRouteActions.delete(id));
      }}
      saved={saved}
      saving={saving}
    />
  );
};

export default DeleteStaticRouteForm;
