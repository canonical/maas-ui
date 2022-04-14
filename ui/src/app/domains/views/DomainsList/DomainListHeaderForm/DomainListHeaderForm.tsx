import { useCallback, useState } from "react";

import { Col, Row } from "@canonical/react-components";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import type { SchemaOf } from "yup";

import FormikField from "app/base/components/FormikField";
import FormikFormContent from "app/base/components/FormikFormContent";
import { DOMAIN_NAME_REGEX } from "app/base/validation";
import { actions as domainActions } from "app/store/domain";
import domainSelectors from "app/store/domain/selectors";
import type { Domain } from "app/store/domain/types";

type Props = {
  closeForm: () => void;
};

export type CreateDomainValues = {
  name: Domain["name"];
  authoritative: Domain["authoritative"];
  ttl?: Domain["ttl"] | ""; // allow empty string for Formik initial values
};

const DomainListHeaderForm = ({ closeForm }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const errors = useSelector(domainSelectors.errors);
  const saved = useSelector(domainSelectors.saved);
  const saving = useSelector(domainSelectors.saving);
  const cleanup = useCallback(() => domainActions.cleanup(), []);
  const [shouldClose, setShouldClose] = useState(false);

  const CreateDomainSchema: SchemaOf<CreateDomainValues> = Yup.object()
    .shape({
      name: Yup.string()
        .required("Domain name cannot be empty")
        .matches(DOMAIN_NAME_REGEX, "The domain name is invalid")
        .max(253, "Domain name is too long"),
      authoritative: Yup.bool(),
    })
    .defined();

  const createDomain = (values: CreateDomainValues) => {
    dispatch(cleanup());
    dispatch(
      domainActions.create({
        authoritative: values.authoritative,
        name: values.name,
      })
    );
  };

  return (
    <Formik
      initialValues={{
        name: "",
        authoritative: true,
      }}
      onSubmit={(values) => {
        createDomain(values);
        setShouldClose(true);
      }}
      validationSchema={CreateDomainSchema}
    >
      <FormikFormContent<CreateDomainValues>
        buttonsBordered={false}
        cleanup={cleanup}
        errors={errors}
        onCancel={closeForm}
        onSuccess={() => {
          if (shouldClose) {
            closeForm();
          }
        }}
        resetOnSave={!shouldClose}
        saving={saving}
        saved={saved}
        submitLabel="Save domain"
        secondarySubmit={(values) => {
          createDomain(values);
          setShouldClose(false);
        }}
        secondarySubmitLabel="Save and add another"
      >
        <Row>
          <Col size={6}>
            <FormikField
              label="Name"
              type="text"
              name="name"
              placeholder="Domain name"
              required
            />
            <FormikField
              label="Authoritative"
              type="checkbox"
              name="authoritative"
            />
          </Col>
        </Row>
      </FormikFormContent>
    </Formik>
  );
};

export default DomainListHeaderForm;
