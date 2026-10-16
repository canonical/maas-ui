import type { ReactElement } from "react";

import { useDispatch, useSelector } from "react-redux";

import ModelActionForm from "@/app/base/components/ModelActionForm";
import { useModal } from "@/app/base/modal-context";
import { Labels } from "@/app/domains/components/DomainsTable/DomainsTable";
import { domainActions } from "@/app/store/domain";
import domainSelectors from "@/app/store/domain/selectors";
import type { Domain, DomainMeta } from "@/app/store/domain/types";

type Props = {
  id: Domain[DomainMeta.PK];
};
const SetDefaultForm = ({ id }: Props): ReactElement => {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  const errors = useSelector(domainSelectors.errors);
  const saving = useSelector(domainSelectors.saving);
  const saved = useSelector(domainSelectors.saved);
  return (
    <ModelActionForm
      aria-label={Labels.FormTitle}
      errors={errors}
      initialValues={{}}
      message={Labels.AreYouSure}
      modelType="DNS"
      onCancel={() => {
        dispatch(domainActions.cleanup());
        closeModal();
      }}
      onSubmit={() => {
        dispatch(domainActions.setDefault(id));
      }}
      onSuccess={() => {
        dispatch(domainActions.cleanup());
        closeModal();
      }}
      saved={saved}
      saving={saving}
      submitAppearance="positive"
      submitLabel={Labels.ConfirmSetDefault}
    />
  );
};

export default SetDefaultForm;
