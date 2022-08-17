import { useCallback, useState } from "react";

import { Col, Row } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import type { SchemaOf } from "yup";

import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";
import { DOMAIN_NAME_REGEX } from "app/base/validation";
import { actions as domainActions } from "app/store/domain";
import domainSelectors from "app/store/domain/selectors";
import type { Domain } from "app/store/domain/types";

export enum Labels {
  Name = "Name",
  Authoritative = "Authoritative",
  SubmitLabel = "Save domain",
  SecondarySubmitLabel = "Save and add another",
  FormLabel = "Add domains",
}

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
    <FormikForm<CreateDomainValues>
      aria-label={Labels.FormLabel}
      buttonsBordered={false}
      cleanup={cleanup}
      errors={errors}
      initialValues={{
        name: "",
        authoritative: true,
      }}
      onCancel={closeForm}
      onSubmit={(values) => {
        createDomain(values);
        setShouldClose(true);
      }}
      onSuccess={() => {
        if (shouldClose) {
          closeForm();
        }
      }}
      resetOnSave={!shouldClose}
      saved={saved}
      saving={saving}
      secondarySubmit={(values) => {
        createDomain(values);
        setShouldClose(false);
      }}
      secondarySubmitLabel={Labels.SecondarySubmitLabel}
      submitLabel={Labels.SubmitLabel}
      validationSchema={CreateDomainSchema}
    >
      <Row>
        <Col size={6}>
          <FormikField
            label={Labels.Name}
            name="name"
            placeholder="Domain name"
            required
            type="text"
          />
          <FormikField
            label={Labels.Authoritative}
            name="authoritative"
            type="checkbox"
          />
        </Col>
      </Row>
    </FormikForm>
  );
};

export default DomainListHeaderForm;
