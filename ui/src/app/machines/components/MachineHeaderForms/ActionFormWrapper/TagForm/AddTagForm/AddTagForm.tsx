import { useEffect, useState } from "react";

import { Col, Row } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";
import type { Machine } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import { actions as tagActions } from "app/store/tag";
import tagSelectors from "app/store/tag/selectors";
import type { CreateParams, Tag } from "app/store/tag/types";
import { NodeStatus } from "app/store/types/node";
import KernelOptionsField from "app/tags/components/KernelOptionsField";

type Props = {
  machines: Machine[];
  name: string | null;
  onTagCreated: (tag: Tag) => void;
};

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
  machines,
  name,
  onTagCreated,
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
    <FormikForm<CreateParams>
      aria-label={Label.Form}
      allowUnchanged
      buttonsAlign="left"
      buttonsBordered={false}
      cleanup={tagActions.cleanup}
      errors={errors}
      initialValues={{
        comment: "",
        kernel_opts: "",
        name: name ?? "",
      }}
      onSaveAnalytics={{
        action: "Manual tag created",
        category: "Machine list create tag form",
        label: "Save",
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
      submitAppearance="neutral"
      submitLabel="Create and add to tag changes"
      validationSchema={AddTagFormSchema}
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
            generateDeployedMessage={(count: number) =>
              count === 1
                ? `${count} selected machine is deployed. The new kernel options will not be applied to this machine until it is redeployed.`
                : `${count} selected machines are deployed. The new kernel options will not be applied to these machines until they are redeployed.`
            }
            deployedMachines={machines.filter(
              ({ status }) => status === NodeStatus.DEPLOYED
            )}
          />
        </Col>
      </Row>
    </FormikForm>
  );
};

export default AddTagForm;
