import { Formik } from "formik";
import { Redirect } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import React, { useEffect } from "react";

import { sshkey as sshkeyActions } from "app/preferences/actions";
import { sshkey as sshkeySelectors } from "app/preferences/selectors";
import { useAddMessage } from "app/base/hooks";
import SSHKeyFormFields from "../SSHKeyFormFields";
import FormCard from "app/base/components/FormCard";

const SSHKeySchema = Yup.object().shape({
  protocol: Yup.string().required("Source is required"),
  auth_id: Yup.string().when("protocol", {
    is: val => val && val !== "upload",
    then: Yup.string().required("ID is required")
  }),
  key: Yup.string().when("protocol", {
    is: val => val === "upload",
    then: Yup.string().required("Key is required")
  })
});

export const AddSSHKey = () => {
  const saved = useSelector(sshkeySelectors.saved);
  const dispatch = useDispatch();
  useAddMessage(saved, sshkeyActions.cleanup, "SSH key successfully imported.");

  useEffect(() => {
    return () => {
      // Clean up saved and error states on unmount.
      dispatch(sshkeyActions.cleanup());
    };
  }, [dispatch]);

  if (saved) {
    // The snippet was successfully created/updated so redirect to the list.
    return <Redirect to="/account/prefs/ssh-keys" />;
  }

  return (
    <FormCard title="Add SSH key">
      <Formik
        initialValues={{ auth_id: "", protocol: "", key: "" }}
        validationSchema={SSHKeySchema}
        onSubmit={values => {
          if (values.key && values.key !== "") {
            dispatch(sshkeyActions.create(values));
          } else {
            dispatch(sshkeyActions.import(values));
          }
        }}
        render={formikProps => <SSHKeyFormFields formikProps={formikProps} />}
      ></Formik>
    </FormCard>
  );
};

export default AddSSHKey;
