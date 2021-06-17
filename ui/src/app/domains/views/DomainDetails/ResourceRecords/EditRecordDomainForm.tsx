import { useCallback } from "react";

import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import type { SchemaOf } from "yup";

import RecordFormFields from "./RecordFormFields";

import FormikForm from "app/base/components/FormikForm";
import { actions as domainActions } from "app/store/domain";
import domainSelectors from "app/store/domain/selectors";
import type { Domain, DomainResource } from "app/store/domain/types/base";

//import { RecordType } from "app/store/domain/types/base";

// const SelectValues = Object.values(RecordType).map((value) => {
//   return {
//     value: value,
//     label: value,
//   };
// });

type Props = {
  id: Domain["id"];
  resource: DomainResource;
  closeForm: () => void;
};

export type CreateRecordValues = {
  name: DomainResource["name"];
  rrtype: DomainResource["rrtype"] | "";
  rrdata: DomainResource["rrdata"];
  ttl: DomainResource["ttl"] | "";
};

const EditRecordDomainForm = ({
  id,
  resource,
  closeForm,
}: Props): JSX.Element => {
  console.log(id);
  const dispatch = useDispatch();
  const errors = useSelector(domainSelectors.errors);
  const saved = useSelector(domainSelectors.saved);
  const saving = useSelector(domainSelectors.saving);
  const cleanup = useCallback(() => domainActions.cleanup(), []);

  const CreateRecordSchema: SchemaOf<CreateRecordValues> = Yup.object()
    .shape({
      name: Yup.string().required("This field is required name"),
      rrtype: Yup.string().required("This field is required tuype"),
      rrdata: Yup.string().required("This field is required data"),
      ttl: Yup.number()
        .nullable(true)
        .min(0, "Ensure this value is greater than or equal to 0."),
    })
    .defined();

  const createRecord = (values: CreateRecordValues) => {
    dispatch(cleanup());
    console.log(values);
    // dispatch(
    //   domainActions.createRecord(
    //     id,
    //     values.name,
    //     values.rrtype,
    //     values.rrdata,
    //     values.ttl
    //   )
    // );
  };

  return (
    <FormikForm<CreateRecordValues>
      buttonsBordered={false}
      cleanup={cleanup}
      errors={errors}
      initialValues={{
        name: resource.name || "",
        rrtype: resource.rrtype || "",
        rrdata: resource.rrdata || "",
        ttl: resource.ttl || "",
      }}
      onCancel={closeForm}
      onSubmit={(values) => {
        createRecord(values);
      }}
      onSuccess={() => {
        closeForm();
      }}
      saving={saving}
      saved={saved}
      submitLabel="Add record"
      submitDisabled={false}
      validationSchema={CreateRecordSchema}
    >
      <RecordFormFields />
    </FormikForm>
  );
};

export default EditRecordDomainForm;
