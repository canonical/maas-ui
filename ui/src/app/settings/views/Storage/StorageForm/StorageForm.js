import { Formik } from "formik";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import actions from "app/settings/actions";
import config from "app/settings/selectors/config";
import { formikFormDisabled } from "app/settings/utils";
import ActionButton from "app/base/components/ActionButton";
import Col from "app/base/components/Col";
import Form from "app/base/components/Form";
import Loader from "app/base/components/Loader";
import Row from "app/base/components/Row";
import StorageFormFields from "../StorageFormFields";

const StorageSchema = Yup.object().shape({
  default_storage_layout: Yup.string().required(),
  disk_erase_with_quick_erase: Yup.boolean().required(),
  disk_erase_with_secure_erase: Yup.boolean().required(),
  enable_disk_erasing_on_release: Yup.boolean().required()
});

const StorageForm = () => {
  const dispatch = useDispatch();
  const updateConfig = actions.config.update;

  const loaded = useSelector(config.loaded);
  const loading = useSelector(config.loading);
  const saved = useSelector(config.saved);
  const saving = useSelector(config.saving);

  const defaultStorageLayout = useSelector(config.defaultStorageLayout);
  const diskEraseWithQuick = useSelector(config.diskEraseWithQuick);
  const diskEraseWithSecure = useSelector(config.diskEraseWithSecure);
  const enableDiskErasing = useSelector(config.enableDiskErasing);

  return (
    <Row>
      <Col size={6}>
        {loading && <Loader text="Loading..." />}
        {loaded && (
          <Formik
            initialValues={{
              default_storage_layout: defaultStorageLayout,
              disk_erase_with_quick_erase: diskEraseWithQuick,
              disk_erase_with_secure_erase: diskEraseWithSecure,
              enable_disk_erasing_on_release: enableDiskErasing
            }}
            onSubmit={(values, { resetForm }) => {
              dispatch(updateConfig(values));
              resetForm(values);
            }}
            validationSchema={StorageSchema}
            render={formikProps => (
              <Form onSubmit={formikProps.handleSubmit}>
                <StorageFormFields formikProps={formikProps} />
                <ActionButton
                  appearance="positive"
                  className="u-no-margin--bottom"
                  type="submit"
                  disabled={formikFormDisabled(formikProps)}
                  loading={saving}
                  success={saved}
                >
                  Save
                </ActionButton>
              </Form>
            )}
          />
        )}
      </Col>
    </Row>
  );
};

export default StorageForm;
