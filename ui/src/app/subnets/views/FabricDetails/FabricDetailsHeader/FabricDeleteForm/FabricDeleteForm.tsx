import type { ReactNode } from "react";
import { useCallback } from "react";

import { Notification } from "@canonical/react-components";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";

import FormikFormContent from "app/base/components/FormikFormContent";
import type { EmptyObject } from "app/base/types";
import { actions as fabricActions } from "app/store/fabric";
import fabricSelectors from "app/store/fabric/selectors";
import type { Fabric, FabricMeta } from "app/store/fabric/types";
import type { RootState } from "app/store/root/types";
import subnetSelectors from "app/store/subnet/selectors";
import subnetURLs from "app/subnets/urls";
import { isId } from "app/utils";

type Props = {
  closeForm: () => void;
  id?: Fabric[FabricMeta.PK] | null;
};

const FabricDeleteForm = ({ closeForm, id }: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const fabric = useSelector((state: RootState) =>
    fabricSelectors.getById(state, id)
  );
  const subnetsInFabric = useSelector((state: RootState) =>
    subnetSelectors.getByFabric(state, id)
  );
  const errors = useSelector(fabricSelectors.errors);
  const saved = useSelector(fabricSelectors.saved);
  const saving = useSelector(fabricSelectors.saving);
  const cleanup = useCallback(() => fabricActions.cleanup(), []);

  if (!isId(id) || !fabric) {
    return null;
  }

  const fabricIsDefault = fabric.id === 0;
  const hasSubnets = subnetsInFabric.length > 0;
  let warning: ReactNode;
  if (fabricIsDefault) {
    warning = (
      <Notification borderless inline severity="negative">
        This fabric cannot be deleted because it is the default fabric for this
        MAAS.
      </Notification>
    );
  } else if (hasSubnets) {
    warning = (
      <Notification borderless inline severity="negative">
        This fabric cannot be deleted because it has subnets attached. Remove
        all subnets from the VLANs on this fabric to allow deletion.
      </Notification>
    );
  } else {
    warning = (
      <Notification borderless inline severity="caution">
        Are you sure you want to delete this fabric?
      </Notification>
    );
  }
  return (
    <Formik
      initialValues={{}}
      onSubmit={() => {
        dispatch(cleanup());
        dispatch(fabricActions.delete(id));
      }}
    >
      <FormikFormContent<EmptyObject>
        buttonsBordered={false}
        cleanup={cleanup}
        errors={errors}
        onCancel={closeForm}
        savedRedirect={subnetURLs.indexWithParams({ by: "fabric" })}
        saved={saved}
        saving={saving}
        submitAppearance="negative"
        submitDisabled={fabricIsDefault || hasSubnets}
        submitLabel="Delete fabric"
      >
        {warning}
      </FormikFormContent>
    </Formik>
  );
};

export default FabricDeleteForm;
