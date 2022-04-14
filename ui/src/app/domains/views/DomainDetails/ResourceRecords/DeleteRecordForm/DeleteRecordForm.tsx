import { useCallback } from "react";

import { Icon } from "@canonical/react-components";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";

import FormikFormContent from "app/base/components/FormikFormContent";
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
    <Formik
      initialValues={{}}
      onSubmit={() => {
        dispatch(cleanup());
        const params = {
          deleteResource: !hasMultipleRecords,
          domain: id,
          rrset: resource,
        };
        dispatch(domainActions.deleteRecord(params));
      }}
    >
      <FormikFormContent<EmptyObject>
        buttonsBordered={false}
        cleanup={cleanup}
        errors={errors}
        onCancel={closeForm}
        onSuccess={() => {
          closeForm();
        }}
        saving={saving}
        saved={saved}
        submitAppearance="negative"
        submitLabel="Delete record"
      >
        <p className="u-no-margin--bottom u-no-max-width">
          <Icon name="error" className="is-inline" />
          Are you sure you want to delete this record?
        </p>
      </FormikFormContent>
    </Formik>
  );
};

export default DeleteRecordForm;
