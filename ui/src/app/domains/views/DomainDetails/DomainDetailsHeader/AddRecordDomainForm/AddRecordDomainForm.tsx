import { useCallback } from "react";

import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import type { SchemaOf } from "yup";

import AddRecordFields from "./AddRecordFields";

import FormikForm from "app/base/components/FormikForm";
import { actions as domainActions } from "app/store/domain";
import domainSelectors from "app/store/domain/selectors";
import type { Domain, DomainResource } from "app/store/domain/types/base";
import { RecordType } from "app/store/domain/types/base";

type Props = {
  closeForm: () => void;
  id: Domain["id"];
};

export type CreateRecordValues = {
  name: DomainResource["name"];
  rrtype: DomainResource["rrtype"];
  rrdata: DomainResource["rrdata"];
  ttl: DomainResource["ttl"] | "";
};

const AddRecordDomainForm = ({ closeForm, id }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const errors = useSelector(domainSelectors.errors);
  const saved = useSelector(domainSelectors.saved);
  const saving = useSelector(domainSelectors.saving);
  const cleanup = useCallback(() => domainActions.cleanup(), []);

  const CreateRecordSchema: SchemaOf<CreateRecordValues> = Yup.object()
    .shape({
      name: Yup.string().required("Name is required."),
      rrtype: Yup.string().required("Record type is required"),
      rrdata: Yup.string().required("Record data is required"),
      ttl: Yup.number().min(
        0,
        "Ensure this value is greater than or equal to 0."
      ),
    })
    .defined();

  return (
    <FormikForm<CreateRecordValues>
      buttonsBordered={false}
      cleanup={cleanup}
      errors={errors}
      initialValues={{
        name: "",
        rrtype: RecordType.A,
        rrdata: "",
        ttl: "",
      }}
      onCancel={closeForm}
      onSubmit={(values) => {
        dispatch(cleanup());
        if ([RecordType.A, RecordType.AAAA].includes(values.rrtype)) {
          const params = {
            address_ttl: Number(values.ttl) || null,
            domain: id,
            ip_addresses: (values.rrdata ?? "").split(/[ ,]+/),
            name: values.name,
          };
          dispatch(domainActions.createAddressRecord(params));
        } else {
          const params = {
            domain: id,
            name: values.name,
            rrdata: values.rrdata,
            rrtype: values.rrtype,
            ttl: Number(values.ttl) || null,
          };
          dispatch(domainActions.createDNSData(params));
        }
      }}
      onSuccess={() => {
        closeForm();
      }}
      saving={saving}
      saved={saved}
      submitLabel="Add record"
      validationSchema={CreateRecordSchema}
    >
      <AddRecordFields />
    </FormikForm>
  );
};

export default AddRecordDomainForm;
