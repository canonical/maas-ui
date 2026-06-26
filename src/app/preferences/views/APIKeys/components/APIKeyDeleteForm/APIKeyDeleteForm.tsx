import type { ReactElement } from "react";

import { useSidePanel } from "@canonical/maas-react-components";
import { useDispatch, useSelector } from "react-redux";

import ModelActionForm from "@/app/base/components/ModelActionForm";
import { tokenActions } from "@/app/store/token";
import tokenSelectors from "@/app/store/token/selectors";

const APIKeyDeleteForm = ({ id }: { id: number }): ReactElement => {
  const dispatch = useDispatch();
  const { closeSidePanel } = useSidePanel();
  const saved = useSelector(tokenSelectors.saved);
  const saving = useSelector(tokenSelectors.saving);

  return (
    <ModelActionForm
      aria-label="Delete API Key"
      initialValues={{}}
      modelType="API key"
      onCancel={closeSidePanel}
      onSubmit={() => {
        dispatch(tokenActions.delete(id));
      }}
      onSuccess={closeSidePanel}
      saved={saved}
      saving={saving}
      submitAppearance="negative"
      submitLabel="Delete"
    />
  );
};

export default APIKeyDeleteForm;
