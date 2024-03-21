import { useEffect } from "react";

import { ContentSection } from "@canonical/maas-react-components";
import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import StorageFormFields from "./StorageFormFields";
import type { StorageFormValues } from "./types";

import FormikForm from "@/app/base/components/FormikForm";
import { useWindowTitle } from "@/app/base/hooks";
import { configActions } from "@/app/store/config";
import configSelectors from "@/app/store/config/selectors";

const StorageSchema = Yup.object().shape({
  default_storage_layout: Yup.string().required(),
  disk_erase_with_quick_erase: Yup.boolean().required(),
  disk_erase_with_secure_erase: Yup.boolean().required(),
  enable_disk_erasing_on_release: Yup.boolean().required(),
});

const StorageForm = (): JSX.Element => {
  const dispatch = useDispatch();
  const loaded = useSelector(configSelectors.loaded);
  const loading = useSelector(configSelectors.loading);
  const saved = useSelector(configSelectors.saved);
  const saving = useSelector(configSelectors.saving);
  const errors = useSelector(configSelectors.errors);

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
    <ContentSection variant="narrow">
      <ContentSection.Title className="section-header__title">
        Storage
      </ContentSection.Title>
      <ContentSection.Content>
        {loading && <Spinner text="Loading..." />}
        {loaded && (
          <FormikForm<StorageFormValues>
            cleanup={configActions.cleanup}
            errors={errors}
            initialValues={{
              default_storage_layout: defaultStorageLayout || "",
              disk_erase_with_quick_erase: diskEraseWithQuick || false,
              disk_erase_with_secure_erase: diskEraseWithSecure || false,
              enable_disk_erasing_on_release: enableDiskErasing || false,
            }}
            onSaveAnalytics={{
              action: "Saved",
              category: "Storage settings",
              label: "Storage form",
            }}
            onSubmit={(values, { resetForm }) => {
              dispatch(configActions.update(values));
              resetForm({ values });
            }}
            saved={saved}
            saving={saving}
            validationSchema={StorageSchema}
          >
            <StorageFormFields />
          </FormikForm>
        )}
      </ContentSection.Content>
    </ContentSection>
  );
};

export default StorageForm;
