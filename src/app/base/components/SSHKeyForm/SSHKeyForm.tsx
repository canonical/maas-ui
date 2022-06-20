import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import SSHKeyFormFields from "./SSHKeyFormFields";
import type { SSHKeyFormValues } from "./types";

import FormikForm from "app/base/components/FormikForm";
import type { Props as FormikFormProps } from "app/base/components/FormikForm/FormikForm";
import { useAddMessage } from "app/base/hooks";
import { actions as sshkeyActions } from "app/store/sshkey";
import sshkeySelectors from "app/store/sshkey/selectors";

const SSHKeySchema = Yup.object().shape({
  protocol: Yup.string().required("Source is required"),
  auth_id: Yup.string().when("protocol", {
    is: (val: string) => val && val !== "upload",
    then: Yup.string().required("ID is required"),
  }),
  key: Yup.string().when("protocol", {
    is: (val: string) => val === "upload",
    then: Yup.string().required("Key is required"),
  }),
});

type Props = {
  cols?: number;
} & Partial<FormikFormProps<SSHKeyFormValues>>;

export const SSHKeyForm = ({ cols, ...props }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const [adding, setAdding] = useState(false);
  const errors = useSelector(sshkeySelectors.errors);
  const saved = useSelector(sshkeySelectors.saved);
  const saving = useSelector(sshkeySelectors.saving);

  useAddMessage(
    adding && saved,
    sshkeyActions.cleanup,
    "SSH key successfully imported.",
    () => setAdding(false)
  );

  return (
    <FormikForm<SSHKeyFormValues>
      cleanup={sshkeyActions.cleanup}
      errors={errors}
      initialValues={{ auth_id: "", protocol: "", key: "" }}
      onSubmit={(values) => {
        setAdding(true);
        if (values.key && values.key !== "") {
          dispatch(sshkeyActions.create(values));
        } else {
          dispatch(sshkeyActions.import(values));
        }
      }}
      saved={saved}
      saving={saving}
      submitLabel="Import SSH key"
      validationSchema={SSHKeySchema}
      {...props}
    >
      <SSHKeyFormFields cols={cols} />
    </FormikForm>
  );
};

export default SSHKeyForm;
