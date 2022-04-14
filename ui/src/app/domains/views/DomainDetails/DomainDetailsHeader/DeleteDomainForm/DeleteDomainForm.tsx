import { useCallback } from "react";

import { Icon } from "@canonical/react-components";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";

import FormikFormContent from "app/base/components/FormikFormContent";
import type { EmptyObject } from "app/base/types";
import domainsURLs from "app/domains/urls";
import { actions as domainActions } from "app/store/domain";
import domainSelectors from "app/store/domain/selectors";
import type { Domain } from "app/store/domain/types";
import type { RootState } from "app/store/root/types";

type Props = {
  closeForm: () => void;
  id: Domain["id"];
};

const DeleteDomainForm = ({ closeForm, id }: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const domain = useSelector((state: RootState) =>
    domainSelectors.getById(state, id)
  );
  const errors = useSelector(domainSelectors.errors);
  const saved = useSelector(domainSelectors.saved);
  const saving = useSelector(domainSelectors.saving);
  const cleanup = useCallback(() => domainActions.cleanup(), []);

  if (!domain) {
    return null;
  }

  const canBeDeleted = domain.resource_count === 0;
  let message = "Are you sure you want to delete this domain?";
  if (!canBeDeleted) {
    message =
      "Domain cannot be deleted because it has resource records. Remove all resource records from the domain to allow deletion.";
  }

  return (
    <Formik
      initialValues={{}}
      onSubmit={() => {
        dispatch(cleanup());
        dispatch(domainActions.delete(id));
      }}
    >
      <FormikFormContent<EmptyObject>
        buttonsBordered={false}
        cleanup={cleanup}
        errors={errors}
        onCancel={closeForm}
        savedRedirect={domainsURLs.domains}
        saved={saved}
        saving={saving}
        submitAppearance="negative"
        submitDisabled={!canBeDeleted}
        submitLabel="Delete domain"
      >
        <p
          className="u-no-margin--bottom u-no-max-width"
          data-testid="delete-message"
        >
          <Icon name="error" className="is-inline" />
          {message}
        </p>
      </FormikFormContent>
    </Formik>
  );
};

export default DeleteDomainForm;
