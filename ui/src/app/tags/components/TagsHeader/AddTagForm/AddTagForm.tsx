import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";

import AddTagFormFields from "./AddTagFormFields";

import FormikForm from "app/base/components/FormikForm";
import type { RootState } from "app/store/root/types";
import { actions as tagActions } from "app/store/tag";
import tagSelectors from "app/store/tag/selectors";
import type { CreateParams, Tag } from "app/store/tag/types";
import tagsURLs from "app/tags/urls";

type Props = {
  onClose: () => void;
};

const AddTagFormSchema = Yup.object().shape({
  comment: Yup.string(),
  definition: Yup.string(),
  kernel_opts: Yup.string(),
  name: Yup.string().required("Name is required."),
});

export const AddTagForm = ({ onClose }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [savedName, setSavedName] = useState<Tag["name"] | null>(null);
  const saved = useSelector(tagSelectors.saved);
  const saving = useSelector(tagSelectors.saving);
  const errors = useSelector(tagSelectors.errors);
  const tag = useSelector((state: RootState) =>
    // Tag names are unique so fetch the newly created tag using the name
    // provided in this form.
    tagSelectors.getByName(state, savedName)
  );

  useEffect(() => {
    if (tag) {
      history.push({ pathname: tagsURLs.tag.index({ id: tag.id }) });
      onClose();
    }
  }, [history, onClose, tag]);

  return (
    <FormikForm<CreateParams>
      aria-label="Create tag"
      buttonsAlign="right"
      buttonsBordered={true}
      cleanup={tagActions.cleanup}
      errors={errors}
      initialValues={{
        comment: "",
        definition: "",
        kernel_opts: "",
        name: "",
      }}
      onCancel={onClose}
      onSaveAnalytics={{
        action: "Submit",
        category: "Create tag form",
        label: "Create tag",
      }}
      onSubmit={(values) => {
        dispatch(tagActions.cleanup());
        dispatch(tagActions.create(values));
      }}
      onSuccess={({ name }) => {
        setSavedName(name);
      }}
      saved={saved}
      saving={saving}
      submitLabel="Save"
      validationSchema={AddTagFormSchema}
    >
      <AddTagFormFields />
    </FormikForm>
  );
};

export default AddTagForm;
