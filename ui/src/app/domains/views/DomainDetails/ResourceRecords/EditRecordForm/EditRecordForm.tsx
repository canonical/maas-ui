import { useCallback } from "react";

import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import type { SchemaOf } from "yup";

import FormikForm from "app/base/components/FormikForm";
import RecordFields from "app/domains/components/RecordFields";
import { actions as domainActions } from "app/store/domain";
import { MIN_TTL } from "app/store/domain/constants";
import domainSelectors from "app/store/domain/selectors";
import type { Domain, DomainResource } from "app/store/domain/types";

type Props = {
  closeForm: () => void;
  id: Domain["id"];
  resource: DomainResource;
};

export type EditRecordValues = {
  name: DomainResource["name"];
  rrdata: DomainResource["rrdata"];
  rrtype: DomainResource["rrtype"];
  ttl: DomainResource["ttl"] | "";
};

const EditRecordSchema: SchemaOf<EditRecordValues> = Yup.object()
  .shape({
    name: Yup.string().required("Name is required."),
    rrdata: Yup.string().required("Record data is required."),
    rrtype: Yup.string().required("Record type is required."),
    ttl: Yup.number().min(MIN_TTL, "TTL must be greater than 1."),
  })
  .defined();

const EditRecordForm = ({ closeForm, id, resource }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const errors = useSelector(domainSelectors.errors);
  const saved = useSelector(domainSelectors.saved);
  const saving = useSelector(domainSelectors.saving);
  const cleanup = useCallback(() => domainActions.cleanup(), []);

  return (
    <FormikForm<EditRecordValues>
      buttonsBordered={false}
      cleanup={cleanup}
      errors={errors}
      initialValues={{
        name: resource.name || "",
        rrdata: resource.rrdata || "",
        rrtype: resource.rrtype,
        ttl: resource.ttl || "",
      }}
      onCancel={closeForm}
      onSubmit={(values) => {
        dispatch(cleanup());
        const params = {
          domain: id,
          name: values.name,
          rrdata: values.rrdata,
          rrset: resource,
          ttl: Number(values.ttl) || null,
        };
        dispatch(domainActions.updateRecord(params));
      }}
      onSuccess={() => {
        closeForm();
      }}
      saving={saving}
      saved={saved}
      submitLabel="Save record"
      submitDisabled={false}
      validationSchema={EditRecordSchema}
    >
      <RecordFields editing />
    </FormikForm>
  );
};

export default EditRecordForm;
