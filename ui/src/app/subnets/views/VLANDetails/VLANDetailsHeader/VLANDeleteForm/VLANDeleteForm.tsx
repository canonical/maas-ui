import { useCallback } from "react";

import { Icon } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import FormikForm from "app/base/components/FormikForm";
import type { EmptyObject } from "app/base/types";
import type { RootState } from "app/store/root/types";
import { actions as vlanActions } from "app/store/vlan";
import vlanSelectors from "app/store/vlan/selectors";
import type { VLAN, VLANMeta } from "app/store/vlan/types";
import subnetURLs from "app/subnets/urls";

type Props = {
  closeForm: () => void;
  id?: VLAN[VLANMeta.PK] | null;
};

const VLANDeleteForm = ({ closeForm, id }: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const vlan = useSelector((state: RootState) =>
    vlanSelectors.getById(state, id)
  );
  const errors = useSelector(vlanSelectors.errors);
  const saved = useSelector(vlanSelectors.saved);
  const saving = useSelector(vlanSelectors.saving);
  const cleanup = useCallback(() => vlanActions.cleanup(), []);

  if (!id || !vlan) {
    return null;
  }

  return (
    <FormikForm<EmptyObject>
      buttonsBordered={false}
      cleanup={cleanup}
      errors={errors}
      initialValues={{}}
      onCancel={closeForm}
      onSubmit={() => {
        dispatch(cleanup());
        dispatch(vlanActions.delete(id));
      }}
      savedRedirect={subnetURLs.index}
      saved={saved}
      saving={saving}
      submitAppearance="negative"
      submitLabel="Delete vlan"
    >
      <p
        className="u-no-margin--bottom u-no-max-width"
        data-testid="delete-message"
      >
        <Icon name="warning" className="is-inline" />
        Are you sure you want to delete this VLAN?
      </p>
    </FormikForm>
  );
};

export default VLANDeleteForm;
