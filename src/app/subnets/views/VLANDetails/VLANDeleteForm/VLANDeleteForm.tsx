import { useCallback } from "react";

import { Notification } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import type { VLANActionFormProps } from "../VLANActionForms/VLANActionForms";

import FabricLink from "@/app/base/components/FabricLink";
import FormikForm from "@/app/base/components/FormikForm";
import type { EmptyObject } from "@/app/base/types";
import fabricSelectors from "@/app/store/fabric/selectors";
import type { RootState } from "@/app/store/root/types";
import { vlanActions } from "@/app/store/vlan";
import vlanSelectors from "@/app/store/vlan/selectors";
import subnetURLs from "@/app/subnets/urls";
import { isId } from "@/app/utils";

const VLANDeleteForm = ({
  setSidePanelContent,
  vlanId,
}: Pick<
  VLANActionFormProps,
  "setSidePanelContent" | "vlanId"
>): JSX.Element | null => {
  const dispatch = useDispatch();
  const vlan = useSelector((state: RootState) =>
    vlanSelectors.getById(state, vlanId)
  );
  const fabric = useSelector((state: RootState) =>
    fabricSelectors.getById(state, vlan?.fabric)
  );
  const errors = useSelector(vlanSelectors.errors);
  const saved = useSelector(vlanSelectors.saved);
  const saving = useSelector(vlanSelectors.saving);
  const cleanup = useCallback(() => vlanActions.cleanup(), []);

  if (!isId(vlanId) || !vlan || !fabric) {
    return null;
  }

  const isDefaultVLAN = vlan.id === fabric.default_vlan_id;
  return (
    <FormikForm<EmptyObject>
      cleanup={cleanup}
      errors={errors}
      initialValues={{}}
      onCancel={() => setSidePanelContent(null)}
      onSubmit={() => {
        dispatch(cleanup());
        dispatch(vlanActions.delete(vlanId));
      }}
      onSuccess={() => setSidePanelContent(null)}
      saved={saved}
      savedRedirect={subnetURLs.index}
      saving={saving}
      submitAppearance="negative"
      submitDisabled={isDefaultVLAN}
      submitLabel="Delete VLAN"
    >
      {isDefaultVLAN ? (
        <Notification borderless severity="negative">
          This VLAN cannot be deleted because it is the default VLAN for{" "}
          <FabricLink id={fabric.id} />.
        </Notification>
      ) : (
        <Notification borderless severity="caution">
          Are you sure you want to delete this VLAN?
        </Notification>
      )}
    </FormikForm>
  );
};

export default VLANDeleteForm;
