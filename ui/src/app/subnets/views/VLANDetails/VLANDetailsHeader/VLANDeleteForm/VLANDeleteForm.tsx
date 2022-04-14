import { useCallback } from "react";

import { Notification } from "@canonical/react-components";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";

import FabricLink from "app/base/components/FabricLink";
import FormikFormContent from "app/base/components/FormikFormContent";
import type { EmptyObject } from "app/base/types";
import fabricSelectors from "app/store/fabric/selectors";
import type { RootState } from "app/store/root/types";
import { actions as vlanActions } from "app/store/vlan";
import vlanSelectors from "app/store/vlan/selectors";
import type { VLAN, VLANMeta } from "app/store/vlan/types";
import subnetURLs from "app/subnets/urls";
import { isId } from "app/utils";

type Props = {
  closeForm: () => void;
  id?: VLAN[VLANMeta.PK] | null;
};

const VLANDeleteForm = ({ closeForm, id }: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const vlan = useSelector((state: RootState) =>
    vlanSelectors.getById(state, id)
  );
  const fabric = useSelector((state: RootState) =>
    fabricSelectors.getById(state, vlan?.fabric)
  );
  const errors = useSelector(vlanSelectors.errors);
  const saved = useSelector(vlanSelectors.saved);
  const saving = useSelector(vlanSelectors.saving);
  const cleanup = useCallback(() => vlanActions.cleanup(), []);

  if (!isId(id) || !vlan || !fabric) {
    return null;
  }

  const isDefaultVLAN = vlan.id === fabric.default_vlan_id;
  return (
    <Formik
      initialValues={{}}
      onSubmit={() => {
        dispatch(cleanup());
        dispatch(vlanActions.delete(id));
      }}
    >
      <FormikFormContent<EmptyObject>
        buttonsBordered={false}
        cleanup={cleanup}
        errors={errors}
        onCancel={closeForm}
        savedRedirect={subnetURLs.index}
        saved={saved}
        saving={saving}
        submitAppearance="negative"
        submitDisabled={isDefaultVLAN}
        submitLabel="Delete VLAN"
      >
        {isDefaultVLAN ? (
          <Notification borderless inline severity="negative">
            This VLAN cannot be deleted because it is the default VLAN for{" "}
            <FabricLink id={fabric.id} />.
          </Notification>
        ) : (
          <Notification borderless inline severity="caution">
            Are you sure you want to delete this VLAN?
          </Notification>
        )}
      </FormikFormContent>
    </Formik>
  );
};

export default VLANDeleteForm;
