import { useEffect } from "react";

import { NotificationSeverity, Spinner } from "@canonical/react-components";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import * as Yup from "yup";

import TagUpdateFormFields from "./TagUpdateFormFields";

import FormikFormContent from "app/base/components/FormikFormContent";
import { actions as messageActions } from "app/store/message";
import type { RootState } from "app/store/root/types";
import { actions as tagActions } from "app/store/tag";
import tagSelectors from "app/store/tag/selectors";
import type { Tag, UpdateParams, TagMeta } from "app/store/tag/types";
import { NewDefinitionMessage } from "app/tags/constants";
import tagURLs from "app/tags/urls";

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
  const history = useHistory();
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
      history.goBack();
    } else {
      history.replace({
        pathname: tagURLs.tag.index({ id }),
      });
    }
  };

  return (
    <Formik
      initialValues={{
        comment: tag.comment ?? "",
        definition: tag.definition ?? "",
        id: tag.id,
        kernel_opts: tag.kernel_opts ?? "",
        name: tag.name,
      }}
      onSubmit={(values) => {
        dispatch(tagActions.cleanup());
        dispatch(tagActions.update(values));
      }}
      validationSchema={isAuto ? UpdateAutoTagFormSchema : UpdateTagFormSchema}
    >
      <FormikFormContent<UpdateParams>
        aria-label="Update tag"
        buttonsAlign="right"
        buttonsBordered={true}
        cleanup={tagActions.cleanup}
        errors={errors}
        onCancel={onClose}
        onSaveAnalytics={{
          action: "Submit",
          category: "Update tag form",
          label: "Update tag",
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
      >
        <TagUpdateFormFields id={id} />
      </FormikFormContent>
    </Formik>
  );
};

export default TagUpdate;
