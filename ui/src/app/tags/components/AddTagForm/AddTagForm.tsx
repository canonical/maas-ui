import { useEffect, useState } from "react";

import type { PropsWithSpread } from "@canonical/react-components";
import { Col, Row } from "@canonical/react-components";
import type { FormikErrors } from "formik";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import FormikField from "app/base/components/FormikField";
import FormikFormContent from "app/base/components/FormikFormContent";
import type { Props as FormikFormContentProps } from "app/base/components/FormikFormContent";
import type { RootState } from "app/store/root/types";
import { actions as tagActions } from "app/store/tag";
import tagSelectors from "app/store/tag/selectors";
import type { CreateParams, Tag } from "app/store/tag/types";
import KernelOptionsField from "app/tags/components/KernelOptionsField";
import type { Props as KernelOptionsFieldProps } from "app/tags/components/KernelOptionsField/KernelOptionsField";

type Props = PropsWithSpread<
  {
    deployedMachines?: KernelOptionsFieldProps["deployedMachines"];
    generateDeployedMessage?: KernelOptionsFieldProps["generateDeployedMessage"];
    name: string | null;
    onTagCreated: (tag: Tag) => void;
  },
  Partial<FormikFormContentProps<CreateParams, FormikErrors<CreateParams>>>
>;

export enum Label {
  Form = "Create tag",
  Comment = "Comment",
  Name = "Tag name",
}

const AddTagFormSchema = Yup.object().shape({
  comment: Yup.string(),
  kernel_opts: Yup.string(),
  name: Yup.string().required("Name is required."),
});

export const AddTagForm = ({
  deployedMachines,
  generateDeployedMessage,
  name,
  onTagCreated,
  ...props
}: Props): JSX.Element => {
  const dispatch = useDispatch();
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
      onTagCreated(tag);
    }
  }, [onTagCreated, tag]);

  return (
    <Formik
      initialValues={{
        comment: "",
        kernel_opts: "",
        name: name ?? "",
      }}
      onSubmit={(values) => {
        dispatch(tagActions.cleanup());
        dispatch(tagActions.create(values));
      }}
      validationSchema={AddTagFormSchema}
    >
      <FormikFormContent<CreateParams>
        aria-label={Label.Form}
        allowUnchanged
        buttonsAlign="left"
        buttonsBordered={false}
        cleanup={tagActions.cleanup}
        errors={errors}
        onSuccess={({ name }) => {
          setSavedName(name);
        }}
        saved={saved}
        saving={saving}
        submitAppearance="neutral"
        submitLabel="Create and add to tag changes"
        {...props}
      >
        <Row className="u-no-padding">
          <Col size={12}>
            <FormikField
              label={Label.Name}
              name="name"
              placeholder="Enter a name for the tag."
              type="text"
              required
            />
            <FormikField
              label={Label.Comment}
              name="comment"
              placeholder="Add a comment as an explanation for this tag."
              type="text"
            />
            <KernelOptionsField
              generateDeployedMessage={generateDeployedMessage}
              deployedMachines={deployedMachines}
            />
          </Col>
        </Row>
      </FormikFormContent>
    </Formik>
  );
};

export default AddTagForm;
