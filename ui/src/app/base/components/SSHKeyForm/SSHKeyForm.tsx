import { useState } from "react";

import type { FormikErrors } from "formik";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import SSHKeyFormFields from "./SSHKeyFormFields";
import type { SSHKeyFormValues } from "./types";

import FormikFormContent from "app/base/components/FormikFormContent";
import type { Props as FormikFormContentProps } from "app/base/components/FormikFormContent";
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
} & Partial<
  FormikFormContentProps<SSHKeyFormValues, FormikErrors<SSHKeyFormValues>>
>;

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
    <Formik
      initialValues={{ auth_id: "", protocol: "", key: "" }}
      onSubmit={(values) => {
        setAdding(true);
        if (values.key && values.key !== "") {
          dispatch(sshkeyActions.create(values));
        } else {
          dispatch(sshkeyActions.import(values));
        }
      }}
      validationSchema={SSHKeySchema}
    >
      <FormikFormContent<SSHKeyFormValues>
        cleanup={sshkeyActions.cleanup}
        errors={errors}
        saving={saving}
        saved={saved}
        submitLabel="Import SSH key"
        {...props}
      >
        <SSHKeyFormFields cols={cols} />
      </FormikFormContent>
    </Formik>
  );
};

export default SSHKeyForm;
