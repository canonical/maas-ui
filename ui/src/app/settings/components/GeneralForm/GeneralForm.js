import { Formik } from "formik";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import * as Yup from "yup";

import actions from "app/settings/actions";
import selectors from "app/settings/selectors";
import Button from "app/base/components/Button";
import Form from "app/base/components/Form";
import Loader from "app/base/components/Loader";
import Row from "app/base/components/Row";
import Col from "app/base/components/Col";
import FormikField from "app/base/components/FormikField";

const GeneralSchema = Yup.object().shape({
  maas_name: Yup.string().required(),
  enable_analytics: Yup.boolean()
});

const GeneralForm = () => {
  const dispatch = useDispatch();
  const updateConfig = actions.config.update;

  const maasName = useSelector(selectors.config.maasName);
  const analyticsEnabled = useSelector(selectors.config.analyticsEnabled);

  return (
    <Row>
      <Col size="6">
        <Formik
          initialValues={{
            maas_name: maasName,
            enable_analytics: analyticsEnabled
          }}
          validationSchema={GeneralSchema}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              dispatch(updateConfig(values));
              setSubmitting(false);
            }, 500);
          }}
        >
          {({
            errors,
            isSubmitting,
            touched,
            handleSubmit,
            handleChange,
            handleBlur,
            setFieldTouched,
            values
          }) => {
            const formikProps = {
              errors,
              handleBlur,
              handleChange,
              touched,
              setFieldTouched,
              values
            };
            return (
              <Form onSubmit={handleSubmit}>
                <FormikField
                  fieldKey="maas_name"
                  label="MAAS name"
                  required={true}
                  type="text"
                  formikProps={formikProps}
                />
                <FormikField
                  fieldKey="enable_analytics"
                  label="Enable Google Analytics in MAAS UI to shape improvements in user experience"
                  type="checkbox"
                  checked={values.enable_analytics}
                  formikProps={formikProps}
                />
                <Button
                  appearance="positive"
                  type="submit"
                  disabled={isSubmitting || !values.maas_name}
                >
                  {isSubmitting ? <Loader text="Saving..." isLight /> : "Save"}
                </Button>
              </Form>
            );
          }}
        </Formik>
      </Col>
    </Row>
  );
};

export default GeneralForm;
