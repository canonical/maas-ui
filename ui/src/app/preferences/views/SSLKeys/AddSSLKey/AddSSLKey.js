import { Formik } from "formik";
import { Redirect } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import React, { useEffect } from "react";

import { sslkey as sslkeyActions } from "app/preferences/actions";
import { sslkey as sslkeySelectors } from "app/preferences/selectors";
import { useAddMessage } from "app/base/hooks";
import SSLKeyFormFields from "../SSLKeyFormFields";
import FormCard from "app/base/components/FormCard";

const SSLKeySchema = Yup.object().shape({
  key: Yup.string().required("SSL key is required")
});

export const AddSSLKey = () => {
  const saved = useSelector(sslkeySelectors.saved);
  const dispatch = useDispatch();
  useAddMessage(saved, sslkeyActions.cleanup, "SSL key successfully added.");

  useEffect(() => {
    return () => {
      // Clean up saved and error states on unmount.
      dispatch(sslkeyActions.cleanup());
    };
  }, [dispatch]);

  if (saved) {
    // The snippet was successfully created/updated so redirect to the list.
    return <Redirect to="/account/prefs/ssl-keys" />;
  }

  return (
    <FormCard title="Add SSL key">
      <Formik
        initialValues={{ key: "" }}
        validationSchema={SSLKeySchema}
        onSubmit={values => {
          dispatch(sslkeyActions.create(values));
        }}
        render={formikProps => <SSLKeyFormFields formikProps={formikProps} />}
      ></Formik>
    </FormCard>
  );
};

export default AddSSLKey;
