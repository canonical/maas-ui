import { Col, Spinner, Row } from "@canonical/react-components";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import { config as configActions } from "app/settings/actions";
import configSelectors from "app/store/config/selectors";
import { useWindowTitle } from "app/base/hooks";
import FormikForm from "app/base/components/FormikForm";
import StorageFormFields from "../StorageFormFields";

const StorageSchema = Yup.object().shape({
  default_storage_layout: Yup.string().required(),
  disk_erase_with_quick_erase: Yup.boolean().required(),
  disk_erase_with_secure_erase: Yup.boolean().required(),
  enable_disk_erasing_on_release: Yup.boolean().required(),
});

const StorageForm = () => {
  const dispatch = useDispatch();
  const updateConfig = configActions.update;

  const loaded = useSelector(configSelectors.loaded);
  const loading = useSelector(configSelectors.loading);
  const saved = useSelector(configSelectors.saved);
  const saving = useSelector(configSelectors.saving);

  const defaultStorageLayout = useSelector(
    configSelectors.defaultStorageLayout
  );
  const diskEraseWithQuick = useSelector(configSelectors.diskEraseWithQuick);
  const diskEraseWithSecure = useSelector(configSelectors.diskEraseWithSecure);
  const enableDiskErasing = useSelector(configSelectors.enableDiskErasing);

  useWindowTitle("Storage");

  useEffect(() => {
    if (!loaded) {
      dispatch(configActions.fetch());
    }
  }, [dispatch, loaded]);

  return (
    <Row>
      <Col size={6}>
        {loading && <Spinner text="Loading..." />}
        {loaded && (
          <FormikForm
            initialValues={{
              default_storage_layout: defaultStorageLayout,
              disk_erase_with_quick_erase: diskEraseWithQuick,
              disk_erase_with_secure_erase: diskEraseWithSecure,
              enable_disk_erasing_on_release: enableDiskErasing,
            }}
            onSaveAnalytics={{
              action: "Saved",
              category: "Storage settings",
              label: "Storage form",
            }}
            onSubmit={(values, { resetForm }) => {
              dispatch(updateConfig(values));
              resetForm({ values });
            }}
            saving={saving}
            saved={saved}
            validationSchema={StorageSchema}
          >
            <StorageFormFields />
          </FormikForm>
        )}
      </Col>
    </Row>
  );
};

export default StorageForm;
