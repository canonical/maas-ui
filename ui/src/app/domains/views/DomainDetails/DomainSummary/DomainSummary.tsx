import { useCallback, useState } from "react";

import { Button, Col, Row, Strip } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";
import authSelectors from "app/store/auth/selectors";
import { actions as domainActions } from "app/store/domain";
import { MIN_TTL } from "app/store/domain/constants";
import domainsSelectors from "app/store/domain/selectors";
import type { Domain } from "app/store/domain/types";
import type { RootState } from "app/store/root/types";

const EditDomainSchema = Yup.object().shape({
  authoritative: Yup.boolean(),
  name: Yup.string().required("Name is required."),
  ttl: Yup.number().min(MIN_TTL, "TTL must be greater than 1."),
});

type EditDomainValues = {
  authoritative: Domain["authoritative"];
  name: Domain["name"];
  ttl: Domain["ttl"] | "";
};

type Props = {
  id: Domain["id"];
};

const DomainSummary = ({ id }: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const domain = useSelector((state: RootState) =>
    domainsSelectors.getById(state, id)
  );
  const errors = useSelector(domainsSelectors.errors);
  const saved = useSelector(domainsSelectors.saved);
  const saving = useSelector(domainsSelectors.saving);
  const cleanup = useCallback(() => domainActions.cleanup(), []);

  const isAdmin = useSelector(authSelectors.isAdmin);
  const [isFormOpen, setFormOpen] = useState(false);

  if (!domain) {
    return null;
  }

  const form = (
    <FormikForm<EditDomainValues>
      buttonsAlign="right"
      buttonsBordered={false}
      cleanup={cleanup}
      data-test="domain-summary-form"
      errors={errors}
      initialValues={{
        authoritative: domain.authoritative,
        name: domain.name || "",
        ttl: domain.ttl || "",
      }}
      onCancel={() => setFormOpen(false)}
      onSubmit={(values) => {
        dispatch(cleanup());
        dispatch(
          domainActions.update({
            authoritative: values.authoritative,
            id: domain.id,
            name: values.name,
            ttl: values.ttl || null,
          })
        );
      }}
      onSuccess={() => setFormOpen(false)}
      saved={saved}
      saving={saving}
      submitLabel="Save"
      validationSchema={EditDomainSchema}
    >
      <Row>
        <Col size="6">
          <FormikField
            label="Name"
            name="name"
            placeholder="Name"
            required
            type="text"
          />
        </Col>
        <Col size="6">
          <FormikField label="TTL" min={MIN_TTL} name="ttl" type="number" />
        </Col>
      </Row>
      <Row>
        <Col size="6">
          <FormikField
            label="Authoritative"
            name="authoritative"
            type="checkbox"
          />
        </Col>
      </Row>
    </FormikForm>
  );

  const details = (
    <>
      <Row data-test="domain-summary">
        <Col size="2">
          <p className="u-text--muted">Name:</p>
        </Col>
        <Col size="4">
          <p>{domain.name}</p>
        </Col>
        <Col size="2">
          <p className="u-text--muted">TTL:</p>
        </Col>
        <Col size="4">
          <p>{domain.ttl || "(default)"}</p>
        </Col>
      </Row>
      <Row>
        <Col size="2">
          <p className="u-text--muted">Authoritative:</p>
        </Col>
        <Col size="4">
          <p>{domain.authoritative ? "Yes" : "No"}</p>
        </Col>
      </Row>
    </>
  );
  return (
    <Strip shallow>
      <Row>
        <Col size="8">
          <h3 className="p-heading--4">Domain summary</h3>
        </Col>
        {isAdmin && !isFormOpen && (
          <Col size="4" className="u-align--right">
            <Button onClick={() => setFormOpen(true)} data-test="edit-domain">
              Edit
            </Button>
          </Col>
        )}
      </Row>
      {isFormOpen ? form : details}
    </Strip>
  );
};

export default DomainSummary;
