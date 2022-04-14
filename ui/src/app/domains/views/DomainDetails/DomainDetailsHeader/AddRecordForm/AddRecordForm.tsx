import { useCallback } from "react";

import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import type { SchemaOf } from "yup";

import FormikFormContent from "app/base/components/FormikFormContent";
import RecordFields from "app/domains/components/RecordFields";
import { actions as domainActions } from "app/store/domain";
import { MIN_TTL } from "app/store/domain/constants";
import domainSelectors from "app/store/domain/selectors";
import type { Domain, DomainResource } from "app/store/domain/types";
import { RecordType } from "app/store/domain/types";
import { isAddressRecord } from "app/store/domain/utils";

type Props = {
  closeForm: () => void;
  id: Domain["id"];
};

type CreateRecordValues = {
  name: DomainResource["name"];
  rrtype: DomainResource["rrtype"];
  rrdata: DomainResource["rrdata"];
  ttl: DomainResource["ttl"] | "";
};

const CreateRecordSchema: SchemaOf<CreateRecordValues> = Yup.object()
  .shape({
    name: Yup.string().required("Name is required."),
    rrtype: Yup.string().required("Record type is required."),
    rrdata: Yup.string().required("Record data is required."),
    ttl: Yup.number().min(
      MIN_TTL,
      "Ensure this value is greater than or equal to 1."
    ),
  })
  .defined();

const AddRecordForm = ({ closeForm, id }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const errors = useSelector(domainSelectors.errors);
  const saved = useSelector(domainSelectors.saved);
  const saving = useSelector(domainSelectors.saving);
  const cleanup = useCallback(() => domainActions.cleanup(), []);

  return (
    <Formik
      initialValues={{
        name: "",
        rrtype: RecordType.A,
        rrdata: "",
        ttl: "",
      }}
      onSubmit={(values) => {
        dispatch(cleanup());
        if (isAddressRecord(values.rrtype)) {
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
      validationSchema={CreateRecordSchema}
    >
      <FormikFormContent<CreateRecordValues>
        buttonsBordered={false}
        cleanup={cleanup}
        errors={errors}
        onCancel={closeForm}
        onSuccess={() => {
          closeForm();
        }}
        saving={saving}
        saved={saved}
        submitLabel="Add record"
      >
        <RecordFields />
      </FormikFormContent>
    </Formik>
  );
};

export default AddRecordForm;
