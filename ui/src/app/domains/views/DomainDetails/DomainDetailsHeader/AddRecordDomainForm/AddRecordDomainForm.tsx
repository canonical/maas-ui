import { useCallback } from "react";

import { Col, Row, Select } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import * as Yup from "yup";
import type { SchemaOf } from "yup";

import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";
import type { RouteParams } from "app/base/types";
import { actions as domainActions } from "app/store/domain";
import domainSelectors from "app/store/domain/selectors";
import type { DomainResource } from "app/store/domain/types/base";
import { RecordType } from "app/store/domain/types/base";

const SelectValues = Object.values(RecordType).map((value) => {
  return {
    value: value,
    label: value,
  };
});

type Props = {
  closeForm: () => void;
};

export type CreateRecordValues = {
  name: DomainResource["name"];
  rrtype: DomainResource["rrtype"] | "";
  rrdata: DomainResource["rrdata"];
  ttl: DomainResource["ttl"];
};

const AddRecordDomainForm = ({ closeForm }: Props): JSX.Element => {
  const { id } = useParams<RouteParams>();
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
    dispatch(
      domainActions.createRecord(
        parseInt(id),
        values.name,
        values.rrtype,
        values.rrdata,
        values.ttl
      )
    );
  };

  return (
    <FormikForm<CreateRecordValues>
      buttonsBordered={false}
      cleanup={cleanup}
      errors={errors}
      initialValues={{
        name: "",
        rrtype: "",
        rrdata: "",
        ttl: null,
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
      <Row>
        <Col size="6">
          <FormikField
            label="Name"
            type="text"
            name="name"
            placeholder="Name"
            required
          />
          <FormikField
            component={Select}
            name="rrtype"
            label="Type"
            options={[
              { value: "", label: "Type", disabled: true },
              ...SelectValues,
            ]}
            required
          />
        </Col>
        <Col size="6">
          <FormikField
            label="Data"
            type="text"
            name="rrdata"
            placeholder="Data"
            required
          />
          <FormikField
            label="TTL"
            type="number"
            min={0}
            name="ttl"
            placeholder="TTL in seconds (optional)"
          />
        </Col>
      </Row>
    </FormikForm>
  );
};

export default AddRecordDomainForm;
