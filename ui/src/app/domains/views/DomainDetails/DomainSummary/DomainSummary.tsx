import { useState } from "react";

import { Button, Col, Row, Strip } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import type { CreateDomainValues } from "../../DomainsList/DomainListHeaderForm/DomainListHeaderForm";

import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";
import authSelectors from "app/store/auth/selectors";
import { actions as domainActions } from "app/store/domain";
import domainsSelectors from "app/store/domain/selectors";
import type { Domain } from "app/store/domain/types";
import type { RootState } from "app/store/root/types";

type Props = {
  id: Domain["id"];
};

const DomainSummary = ({ id }: Props): JSX.Element | null => {
  const dispatch = useDispatch();

  const domain = useSelector((state: RootState) =>
    domainsSelectors.getById(state, Number(id))
  );
  const errors = useSelector(domainsSelectors.errors);
  const saved = useSelector(domainsSelectors.saved);
  const saving = useSelector(domainsSelectors.saving);

  const isAdmin = useSelector(authSelectors.isAdmin);
  const [isFormOpen, setFormOpen] = useState(false);

  if (!domain) {
    return null;
  }

  const form = (
    <FormikForm<CreateDomainValues>
      buttonsAlign="right"
      buttonsBordered={false}
      errors={errors}
      initialValues={{
        name: domain.name,
        authoritative: domain.authoritative,
        ttl: domain.ttl,
      }}
      onSuccess={() => setFormOpen(false)}
      onSubmit={(values) => {
        dispatch(
          domainActions.update({
            id: domain.id,
            ttl: values.ttl,
            name: values.name,
            authoritative: values.authoritative,
          })
        );
      }}
      onCancel={() => setFormOpen(false)}
      submitLabel="Save summary"
      saved={saved}
      saving={saving}
      cleanup={() => dispatch(domainActions.cleanup())}
    >
      <Row>
        <Col size="6">
          <FormikField
            label="Name"
            placeholder="Name"
            type="text"
            name="name"
          />
        </Col>
        <Col size="6">
          <FormikField
            label="TTL"
            placeholder="30 (default)"
            type="text"
            name="ttl"
          />
        </Col>
      </Row>
      <Row>
        <Col size="6">
          <FormikField
            label="Authoritative"
            type="checkbox"
            name="authoritative"
          />
        </Col>
      </Row>
    </FormikForm>
  );

  const details = (
    <>
      <Row>
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
          <p>{domain.ttl}</p>
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
    <Strip>
      <Row>
        <Col size="8">
          <h3 className="p-heading--4">Domain summary</h3>
        </Col>
        {isAdmin && !isFormOpen && (
          <Col size="4" className="u-align--right">
            <Button onClick={() => setFormOpen(true)}>Edit</Button>
          </Col>
        )}
      </Row>
      {isFormOpen ? form : details}
    </Strip>
  );
};

export default DomainSummary;
