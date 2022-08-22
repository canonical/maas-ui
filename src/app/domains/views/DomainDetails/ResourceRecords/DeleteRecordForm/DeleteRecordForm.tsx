import { useCallback } from "react";

import { Icon } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import FormikForm from "app/base/components/FormikForm";
import type { EmptyObject } from "app/base/types";
import { actions as domainActions } from "app/store/domain";
import domainSelectors from "app/store/domain/selectors";
import type { Domain, DomainResource } from "app/store/domain/types";
import { isDomainDetails } from "app/store/domain/utils";
import type { RootState } from "app/store/root/types";

type Props = {
  closeForm: () => void;
  id: Domain["id"];
  resource: DomainResource;
};

export enum Labels {
  FormLabel = "Delete record",
  SubmitLabel = "Delete record",
  AreYouSure = "Are you sure you want to delete this record?",
}

const DeleteRecordForm = ({
  closeForm,
  id,
  resource,
}: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const domain = useSelector((state: RootState) =>
    domainSelectors.getById(state, id)
  );
  const errors = useSelector(domainSelectors.errors);
  const saved = useSelector(domainSelectors.saved);
  const saving = useSelector(domainSelectors.saving);
  const cleanup = useCallback(() => domainActions.cleanup(), []);

  if (!isDomainDetails(domain)) {
    return null;
  }

  const hasMultipleRecords =
    domain.rrsets.filter(
      (rrset) => rrset.dnsresource_id === resource.dnsresource_id
    ).length > 1;

  return (
    <FormikForm<EmptyObject>
      aria-label={Labels.FormLabel}
      buttonsBordered={false}
      cleanup={cleanup}
      errors={errors}
      initialValues={{}}
      onCancel={closeForm}
      onSubmit={() => {
        dispatch(cleanup());
        const params = {
          deleteResource: !hasMultipleRecords,
          domain: id,
          rrset: resource,
        };
        dispatch(domainActions.deleteRecord(params));
      }}
      onSuccess={() => {
        closeForm();
      }}
      saved={saved}
      saving={saving}
      submitAppearance="negative"
      submitLabel={Labels.SubmitLabel}
    >
      <p className="u-no-margin--bottom u-no-max-width">
        <Icon className="is-inline" name="error" />
        {Labels.AreYouSure}
      </p>
    </FormikForm>
  );
};

export default DeleteRecordForm;
