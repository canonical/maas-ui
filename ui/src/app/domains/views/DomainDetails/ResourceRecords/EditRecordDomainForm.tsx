import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import type { SchemaOf } from "yup";

import AddRecordFields from "../DomainDetailsHeader/AddRecordDomainForm/AddRecordFields";

import FormikForm from "app/base/components/FormikForm";
import { actions as domainActions } from "app/store/domain";
import domainSelectors from "app/store/domain/selectors";
import type {
  UpdateResourceParams,
  UpdateAddressRecordParams,
} from "app/store/domain/types";
import type { Domain, DomainResource } from "app/store/domain/types/base";
import { RecordType } from "app/store/domain/types/base";

type Props = {
  id: Domain["id"];
  resource: DomainResource;
  closeForm: () => void;
};

export type CreateRecordValues = {
  name: DomainResource["name"];
  rrtype: DomainResource["rrtype"];
  rrdata: DomainResource["rrdata"];
  ttl: DomainResource["ttl"] | "";
};

const EditRecordDomainForm = ({
  id,
  resource,
  closeForm,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const errors = useSelector(domainSelectors.errors);
  const saved = useSelector(domainSelectors.saved);
  const saving = useSelector(domainSelectors.saving);
  const cleanup = () => dispatch(domainActions.cleanup());

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

  const updateAddressRecord = (values: CreateRecordValues) => {
    const params: UpdateAddressRecordParams = {
      ...resource,
      domain: id,
      previous_name: resource["name"],
      previous_rrdata: resource["rrdata"],
      previous_rrtype: resource["rrtype"],
      previous_ttl: resource["ttl"],
      name: values.name,
      rrdata: values.rrdata,
      rrtype: values.rrtype,
      address_ttl:
        values.ttl === "" || values.ttl === null ? null : Number(values.ttl),
      ip_addresses: (values.rrdata ?? "").split(/[ ,]+/),
    };

    if (values.name !== resource.name) {
      dispatch(domainActions.updateDnsResource(params));
    }

    dispatch(domainActions.updateAddressRecord(params));
  };

  const updateDnsRecord = (values: CreateRecordValues) => {
    const params: UpdateResourceParams = {
      ...resource,
      domain: id,
      previous_name: resource["name"],
      previous_rrdata: resource["rrdata"],
      previous_rrtype: resource["rrtype"],
      previous_ttl: resource["ttl"],
      name: values.name,
      rrdata: values.rrdata,
      rrtype: values.rrtype,
      ttl: values.ttl === "" || values.ttl === null ? null : Number(values.ttl),
    };

    if (values.name !== resource.name) {
      dispatch(domainActions.updateDnsResource(params));
    }

    dispatch(domainActions.updateDnsData(params));
  };

  const updateRecord = (values: CreateRecordValues) => {
    cleanup();

    if (values.rrtype === RecordType.A || values.rrtype === RecordType.AAAA) {
      updateAddressRecord(values);
    } else {
      updateDnsRecord(values);
    }
  };

  return (
    <FormikForm<CreateRecordValues>
      buttonsBordered={false}
      // FIXME
      // this form seems to be unmounted after submit, so errors are cleared before they can render
      // cleanup={cleanup}
      errors={errors}
      initialValues={{
        name: resource.name || "",
        rrtype: resource.rrtype,
        rrdata: resource.rrdata || "",
        ttl: resource.ttl || "",
      }}
      onCancel={closeForm}
      onSubmit={(values) => {
        updateRecord(values);
      }}
      onSuccess={() => {
        closeForm();
      }}
      saving={saving}
      saved={saved}
      submitLabel="Edit record"
      submitDisabled={false}
      validationSchema={CreateRecordSchema}
    >
      <AddRecordFields editRecord />
    </FormikForm>
  );
};

export default EditRecordDomainForm;
