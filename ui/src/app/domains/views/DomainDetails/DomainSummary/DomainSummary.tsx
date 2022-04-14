import { useCallback } from "react";

import { Col, Row } from "@canonical/react-components";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import Definition from "app/base/components/Definition";
import EditableSection from "app/base/components/EditableSection";
import FormikField from "app/base/components/FormikField";
import FormikFormContent from "app/base/components/FormikFormContent";
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
  const isAdmin = useSelector(authSelectors.isAdmin);
  const domain = useSelector((state: RootState) =>
    domainsSelectors.getById(state, id)
  );
  const errors = useSelector(domainsSelectors.errors);
  const saved = useSelector(domainsSelectors.saved);
  const saving = useSelector(domainsSelectors.saving);
  const cleanup = useCallback(() => domainActions.cleanup(), []);

  if (!domain) {
    return null;
  }

  return (
    <EditableSection
      canEdit={isAdmin}
      hasSidebarTitle
      renderContent={(editing, setEditing) =>
        editing ? (
          <Formik<EditDomainValues>
            initialValues={{
              authoritative: domain.authoritative,
              name: domain.name || "",
              ttl: domain.ttl || "",
            }}
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
            validationSchema={EditDomainSchema}
          >
            <FormikFormContent<EditDomainValues>
              buttonsAlign="right"
              buttonsBordered={false}
              cleanup={cleanup}
              data-testid="domain-summary-form"
              errors={errors}
              onCancel={() => setEditing(false)}
              onSuccess={() => setEditing(false)}
              saved={saved}
              saving={saving}
              submitLabel="Save"
            >
              <Row>
                <Col size={6}>
                  <FormikField
                    label="Name"
                    name="name"
                    placeholder="Name"
                    required
                    type="text"
                  />
                </Col>
                <Col size={6}>
                  <FormikField
                    label="TTL"
                    min={MIN_TTL}
                    name="ttl"
                    type="number"
                  />
                </Col>
              </Row>
              <Row>
                <Col size={6}>
                  <FormikField
                    label="Authoritative"
                    name="authoritative"
                    type="checkbox"
                  />
                </Col>
              </Row>
            </FormikFormContent>
          </Formik>
        ) : (
          <Row data-testid="domain-summary">
            <Col size={6}>
              <Definition label="Name">{domain.name}</Definition>
              <Definition label="TTL">{domain.ttl || "(default)"}</Definition>
              <Definition label="Authoritative">
                {domain.authoritative ? "Yes" : "No"}
              </Definition>
            </Col>
          </Row>
        )
      }
      title="Domain summary"
    />
  );
};

export default DomainSummary;
