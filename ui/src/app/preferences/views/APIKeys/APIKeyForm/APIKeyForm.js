import { Col, Row } from "@canonical/react-components";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";

import { actions as tokenActions } from "app/store/token";
import tokenSelectors from "app/store/token/selectors";
import { useAddMessage } from "app/base/hooks";
import { useWindowTitle } from "app/base/hooks";
import FormCard from "app/base/components/FormCard";
import FormCardButtons from "app/base/components/FormCardButtons";
import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";

const APIKeyAddSchema = Yup.object().shape({
  name: Yup.string().notRequired(),
});

const APIKeyEditSchema = Yup.object().shape({
  name: Yup.string().required("API key name is required"),
});

export const APIKeyForm = ({ token }) => {
  const editing = !!token;
  const dispatch = useDispatch();
  const history = useHistory();
  const errors = useSelector(tokenSelectors.errors);
  const saved = useSelector(tokenSelectors.saved);
  const saving = useSelector(tokenSelectors.saving);
  const title = editing ? "Edit MAAS API key" : "Generate MAAS API key";

  useWindowTitle(title);
  useAddMessage(
    saved,
    tokenActions.cleanup,
    `API key successfully ${editing ? "updated" : "generated"}.`
  );

  return (
    <FormCard title={title}>
      <FormikForm
        allowAllEmpty={!editing}
        buttons={FormCardButtons}
        cleanup={tokenActions.cleanup}
        errors={errors}
        initialValues={{
          name: token ? token.consumer.name : "",
        }}
        onCancel={() => history.push({ pathname: "/account/prefs/api-keys" })}
        onSaveAnalytics={{
          action: "Saved",
          category: "API keys preferences",
          label: "Generate API key form",
        }}
        onSubmit={(values) => {
          if (editing) {
            dispatch(
              tokenActions.update({
                id: token.id,
                name: values.name,
              })
            );
          } else {
            dispatch(tokenActions.create(values));
          }
        }}
        saving={saving}
        saved={saved}
        savedRedirect="/account/prefs/api-keys"
        submitLabel={editing ? "Save API key" : "Generate API key"}
        validationSchema={editing ? APIKeyEditSchema : APIKeyAddSchema}
      >
        <Row>
          <Col size="4">
            <FormikField
              name="name"
              label={`API key name${editing ? "" : " (optional)"}`}
              required={editing}
              type="text"
            />
          </Col>
          <Col size="4">
            <p className="form-card__help">
              The API key is used to log in to the API from the MAAS CLI and by
              other services connecting to MAAS, such as Juju.
            </p>
          </Col>
        </Row>
      </FormikForm>
    </FormCard>
  );
};

APIKeyForm.propTypes = {
  token: PropTypes.shape({
    consumer: PropTypes.shape({
      key: PropTypes.string,
      name: PropTypes.string,
    }),
    id: PropTypes.number,
    key: PropTypes.string,
    secret: PropTypes.string,
  }),
};

export default APIKeyForm;
