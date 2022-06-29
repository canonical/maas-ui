import { useEffect } from "react";

import { NotificationSeverity, Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom-v5-compat";
import * as Yup from "yup";

import TagUpdateFormFields from "./TagUpdateFormFields";

import FormikForm from "app/base/components/FormikForm";
import urls from "app/base/urls";
import { actions as messageActions } from "app/store/message";
import type { RootState } from "app/store/root/types";
import { actions as tagActions } from "app/store/tag";
import tagSelectors from "app/store/tag/selectors";
import type { Tag, UpdateParams, TagMeta } from "app/store/tag/types";
import { NewDefinitionMessage } from "app/tags/constants";

type Props = {
  id: Tag[TagMeta.PK];
};

export enum Label {
  Form = "Update tag",
}

const UpdateTagFormSchema = Yup.object().shape({
  comment: Yup.string(),
  kernel_opts: Yup.string(),
  name: Yup.string().required("Name is required."),
});

const UpdateAutoTagFormSchema = Yup.object().shape({
  comment: Yup.string(),
  definition: Yup.string().required(
    "Removing the definition of automatic tags is not allowed. Please, consider creating a new tag."
  ),
  kernel_opts: Yup.string(),
  name: Yup.string().required("Name is required."),
});

const TagUpdate = ({ id }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation<{ canGoBack?: boolean }>();
  const tag = useSelector((state: RootState) =>
    tagSelectors.getById(state, id)
  );
  const saved = useSelector(tagSelectors.saved);
  const saving = useSelector(tagSelectors.saving);
  const errors = useSelector(tagSelectors.errors);

  useEffect(() => {
    dispatch(tagActions.fetch());
  }, [dispatch]);

  if (!tag) {
    return <Spinner data-testid="Spinner" />;
  }

  const isAuto = !!tag.definition;
  const onClose = () => {
    if (location.state?.canGoBack) {
      navigate(-1);
    } else {
      navigate(
        {
          pathname: urls.tags.tag.index({ id }),
        },
        { replace: true }
      );
    }
  };

  return (
    <FormikForm<UpdateParams>
      aria-label="Update tag"
      buttonsAlign="right"
      buttonsBordered={true}
      cleanup={tagActions.cleanup}
      errors={errors}
      initialValues={{
        comment: tag.comment ?? "",
        definition: tag.definition ?? "",
        id: tag.id,
        kernel_opts: tag.kernel_opts ?? "",
        name: tag.name,
      }}
      onCancel={onClose}
      onSaveAnalytics={{
        action: "Submit",
        category: "Update tag form",
        label: "Update tag",
      }}
      onSubmit={(values) => {
        dispatch(tagActions.cleanup());
        dispatch(tagActions.update(values));
      }}
      onSuccess={(values) => {
        if (isAuto && values.definition !== tag.definition) {
          dispatch(
            messageActions.add(
              `Updated ${tag.name}. ${NewDefinitionMessage}`,
              NotificationSeverity.POSITIVE
            )
          );
        }
        onClose();
      }}
      saved={saved}
      saving={saving}
      submitLabel="Save changes"
      validationSchema={isAuto ? UpdateAutoTagFormSchema : UpdateTagFormSchema}
    >
      <TagUpdateFormFields id={id} />
    </FormikForm>
  );
};

export default TagUpdate;
