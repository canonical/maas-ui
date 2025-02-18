import { useCallback } from "react";

import { ContentSection } from "@canonical/maas-react-components";
import { Notification } from "@canonical/react-components";
import { usePrevious } from "@canonical/react-components/dist/hooks";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import FormikForm from "@/app/base/components/FormikForm";
import type { APIError } from "@/app/base/types";
import ChangeSourceFields from "@/app/settings/views/Images/ChangeSource/ChangeSourceFields";
import { bootResourceActions } from "@/app/store/bootresource";
import bootResourceSelectors from "@/app/store/bootresource/selectors";
import { BootResourceSourceType } from "@/app/store/bootresource/types";
import { configActions } from "@/app/store/config";
import configSelectors from "@/app/store/config/selectors";

const ChangeSourceSchema = Yup.object()
  .shape({
    keyring_data: Yup.string(),
    keyring_filename: Yup.string(),
    source_type: Yup.string().required("Source type is required"),
    url: Yup.string().when("source_type", {
      is: (val: string) => val === BootResourceSourceType.CUSTOM,
      then: Yup.string().required("URL is required for custom sources"),
    }),
    autoSync: Yup.boolean(),
  })
  .defined();

type ChangeSourceProps = {
  closeForm: (() => void) | null;
};

export type ChangeSourceValues = {
  keyring_data: string;
  keyring_filename: string;
  source_type: BootResourceSourceType;
  url: string;
  autoSync: boolean;
};

const ChangeSource = ({ closeForm }: ChangeSourceProps) => {
  const dispatch = useDispatch();
  const resources = useSelector(bootResourceSelectors.resources);
  const autoImport = useSelector(configSelectors.bootImagesAutoImport);
  const errors = useSelector(bootResourceSelectors.fetchError);
  const saving = useSelector(bootResourceSelectors.fetching);
  const previousSaving = usePrevious(saving);
  const cleanup = useCallback(() => {
    configActions.cleanup();
    return bootResourceActions.cleanup();
  }, []);
  const saved = !saving && previousSaving && !errors;

  const canChangeSource = resources.every((resource) => !resource.downloading);

  return (
    <ContentSection variant="narrow">
      <ContentSection.Title className="section-header__title">
        Source
      </ContentSection.Title>
      <ContentSection.Content>
        {!canChangeSource && (
          <Notification data-testid="disabled-sync-warning" severity="caution">
            Image import is in progress, cannot change source settings.
          </Notification>
        )}
        <FormikForm<ChangeSourceValues>
          allowUnchanged
          aria-label="Choose source"
          cleanup={cleanup}
          errors={errors as APIError}
          initialValues={{
            keyring_data: "",
            keyring_filename: "",
            source_type: BootResourceSourceType.MAAS_IO,
            url: "",
            autoSync: autoImport || false,
          }}
          onCancel={closeForm}
          onSubmit={(values) => {
            dispatch(cleanup());
            dispatch(bootResourceActions.fetch(values));
            dispatch(
              configActions.update({
                boot_images_auto_import: values.autoSync,
              })
            );
          }}
          saved={saved}
          saving={saving}
          submitDisabled={!canChangeSource}
          submitLabel="Save"
          validationSchema={ChangeSourceSchema}
        >
          <ChangeSourceFields />
        </FormikForm>
      </ContentSection.Content>
    </ContentSection>
  );
};

export default ChangeSource;
