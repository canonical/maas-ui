import { Col, Input, Row } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import type { SchemaOf } from "yup";

import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";
import { actions as domainActions } from "app/store/domain";
import domainSelectors from "app/store/domain/selectors";

type Props = {
  closeForm: () => void;
};

export type CreateDomain = {
  name: string;
  isAuthoritative: boolean;
};

const DomainListHeaderForm = ({ closeForm }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const errors = useSelector(domainSelectors.errors);
  const saved = useSelector(domainSelectors.saved);
  const saving = useSelector(domainSelectors.saving);

  // Pattern that matches a domainname.
  // XXX 2016-02-24 lamont: This also matches "example.com.",
  // which is wrong.
  const domainnamePattern = /^([a-z\d]|[a-z\d][a-z\d-.]*[a-z\d])*$/i;

  const domainNameSchema: SchemaOf<CreateDomain> = Yup.object().shape({
    name: Yup.string()
      .required("Domain name cannot be empty")
      .matches(domainnamePattern, "The domain name is incorrect")
      .max(253, "Domain name is too long"),
    isAuthoritative: Yup.bool(),
  });

  return (
    <FormikForm<CreateDomain>
      buttonsBordered={false}
      errors={errors}
      initialValues={{
        name: "",
        isAuthoritative: true,
      }}
      inline={true}
      onCancel={closeForm}
      onSubmit={(values: CreateDomain) => {
        dispatch(
          domainActions.create({
            authoritative: values.isAuthoritative,
            name: values.name,
          })
        );
      }}
      resetOnSave={true}
      saving={saving}
      saved={saved}
      submitLabel="Save domain"
      validationSchema={domainNameSchema}
    >
      <Row style={{ width: "50%", marginRight: "auto" }}>
        <Col size="6">
          <FormikField
            component={Input}
            label="Name"
            type="text"
            name="name"
            placeHolder="Domain name"
            required
          />
        </Col>
        <Col size="6">
          <FormikField
            component={Input}
            label="Authoritative"
            type="checkbox"
            name="isAuthoritative"
          />
        </Col>
      </Row>
    </FormikForm>
  );
};

export default DomainListHeaderForm;
