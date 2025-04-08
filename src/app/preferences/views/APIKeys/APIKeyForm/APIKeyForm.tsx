import { Col, Row, useOnEscapePressed } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import * as Yup from "yup";

import FormikField from "@/app/base/components/FormikField";
import FormikForm from "@/app/base/components/FormikForm";
import { useAddMessage } from "@/app/base/hooks";
import urls from "@/app/base/urls";
import { tokenActions } from "@/app/store/token";
import tokenSelectors from "@/app/store/token/selectors";
import type { Token } from "@/app/store/token/types";

export enum Label {
  AddTitle = "Generate MAAS API key",
  EditTitle = "Edit MAAS API key",
  AddFormLabel = "Generate MAAS API key form",
  EditFormLabel = "Edit MAAS API key form",
  AddNameLabel = "API key name (optional)",
  EditNameLabel = "API key name",
  AddSubmit = "Generate API key",
  EditSubmit = "Save API key",
}

type Props = {
  token?: Token;
};

const APIKeyAddSchema = Yup.object().shape({
  name: Yup.string().notRequired(),
});

const APIKeyEditSchema = Yup.object().shape({
  name: Yup.string().required("API key name is required"),
});

export const APIKeyForm = ({ token }: Props): React.ReactElement => {
  const editing = !!token;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const errors = useSelector(tokenSelectors.errors);
  const saved = useSelector(tokenSelectors.saved);
  const saving = useSelector(tokenSelectors.saving);
  const onCancel = () => navigate({ pathname: urls.preferences.apiKeys.index });
  useOnEscapePressed(() => onCancel());

  useAddMessage(
    saved,
    tokenActions.cleanup,
    `API key successfully ${editing ? "updated" : "generated"}.`
  );

  return (
    <FormikForm
      allowAllEmpty={!editing}
      aria-label={editing ? Label.EditFormLabel : Label.AddFormLabel}
      cleanup={tokenActions.cleanup}
      errors={errors}
      initialValues={{
        name: token ? token.consumer.name : "",
      }}
      onCancel={onCancel}
      onSaveAnalytics={{
        action: "Saved",
        category: "API keys preferences",
        label: "Generate API key form",
      }}
      onSubmit={(values) => {
        if (editing) {
          if (token) {
            dispatch(
              tokenActions.update({
                id: token.id,
                name: values.name,
              })
            );
          }
        } else {
          dispatch(tokenActions.create(values));
        }
      }}
      saved={saved}
      savedRedirect={urls.preferences.apiKeys.index}
      saving={saving}
      submitLabel={editing ? Label.EditSubmit : Label.AddSubmit}
      validationSchema={editing ? APIKeyEditSchema : APIKeyAddSchema}
    >
      <Row>
        <Col size={12}>
          <FormikField
            label={editing ? Label.EditNameLabel : Label.AddNameLabel}
            name="name"
            required={editing}
            type="text"
          />
        </Col>
        <Col size={12}>
          <p className="form-card__help">
            The API key is used to log in to the API from the MAAS CLI and by
            other services connecting to MAAS, such as Juju.
          </p>
        </Col>
      </Row>
    </FormikForm>
  );
};

export default APIKeyForm;
