import { Formik } from "formik";
import React from "react";
import { useSelector } from "react-redux";
import * as Yup from "yup";

import selectors from "app/settings/selectors";
import Button from "app/base/components/Button";
import Form from "app/base/components/Form";
import Input from "app/base/components/Input";

const GeneralSchema = Yup.object().shape({
  maasName: Yup.string().required(),
  enableAnalytics: Yup.boolean()
});

const GeneralForm = () => {
  const maasName = useSelector(selectors.config.maasName);
  const enableAnalytics = useSelector(selectors.config.enableAnalytics);

  return (
    <Formik
      initialValues={{
        maasName,
        enableAnalytics
      }}
      validationSchema={GeneralSchema}
    >
      {({
        errors,
        isSubmitting,
        touched,
        handleSubmit,
        handleChange,
        handleBlur,
        values
      }) => (
        <Form onSubmit={handleSubmit}>
          <Input
            error={touched.naasName && errors.maasName}
            id="maasName"
            label="MAAS name"
            onBlur={handleBlur}
            onChange={handleChange}
            required={true}
            type="text"
            value={values.maasName}
          />
          <Input
            error={touched.enableAnalytics && errors.enableAnalytics}
            id="enableAnalytics"
            label="Enable Google Analytics in MAAS UI to shape improvements in user experience"
            onBlur={handleBlur}
            onChange={handleChange}
            type="checkbox"
            value={values.enableAnalytics}
            checked={values.enableAnalytics}
          />
          <Button
            appearance="positive"
            type="submit"
            disabled={isSubmitting || !values.maasName}
          >
            Save
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default GeneralForm;
