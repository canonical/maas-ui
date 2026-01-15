import type { ReactElement } from "react";

import { ContentSection } from "@canonical/maas-react-components";
import { Notification, Spinner } from "@canonical/react-components";
import { useQueryClient } from "@tanstack/react-query";
import * as Yup from "yup";

import {
  useGetConfiguration,
  useSetConfiguration,
} from "@/app/api/query/configurations";
import {
  useGetImageSource,
  useImageSources,
  useUpdateImageSource,
} from "@/app/api/query/imageSources";
import {
  useCustomImageStatuses,
  useSelectionStatuses,
} from "@/app/api/query/images";
import {
  getBootsourceQueryKey,
  getConfigurationQueryKey,
  getConfigurationsQueryKey,
  listBootsourcesQueryKey,
} from "@/app/apiclient/@tanstack/react-query.gen";
import FormikForm from "@/app/base/components/FormikForm";
import PageContent from "@/app/base/components/PageContent";
import { useWindowTitle } from "@/app/base/hooks";
import { MAAS_IO_DEFAULTS } from "@/app/images/constants";
import { BootResourceSourceType } from "@/app/images/types";
import ChangeSourceFields from "@/app/settings/views/Images/ChangeSource/ChangeSourceFields";
import { ConfigNames } from "@/app/store/config/types";

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

export type ChangeSourceValues = {
  keyring_data: string;
  keyring_filename: string;
  source_type: BootResourceSourceType;
  url: string;
  autoSync: boolean;
};

const ChangeSource = (): ReactElement => {
  const queryClient = useQueryClient();
  const sources = useImageSources();
  // TODO: add support for multiple sources when v3 is ready
  const source = useGetImageSource(
    {
      path: { boot_source_id: sources.data?.items[0].id ?? -1 },
    },
    sources.isSuccess
  );
  const { data: selectionStatuses, error: selectionStatusesError } =
    useSelectionStatuses();
  const { data: customImageStatuses, error: customImageStatusesError } =
    useCustomImageStatuses();

  const importConfig = useGetConfiguration({
    path: { name: ConfigNames.BOOT_IMAGES_AUTO_IMPORT },
  });
  const configETag = importConfig.data?.headers?.get("ETag");
  const autoImport = importConfig.data?.value as boolean;
  const updateConfig = useSetConfiguration();
  const updateImageSource = useUpdateImageSource();

  const loading =
    sources.isPending || source.isPending || importConfig.isPending;

  const saving = updateConfig.isPending || updateImageSource.isPending;
  const saved = updateConfig.isSuccess && updateImageSource.isSuccess;

  const errors =
    sources.error ||
    selectionStatusesError ||
    customImageStatusesError ||
    importConfig.error ||
    updateConfig.error ||
    updateImageSource.error;

  useWindowTitle("Source");

  const canChangeSource =
    selectionStatuses &&
    customImageStatuses &&
    selectionStatuses.items.every(
      (s) => s.status !== "Downloading" && s.update_status !== "Downloading"
    ) &&
    customImageStatuses.items.every(
      (s) => s.status === "Downloading" && s.update_status !== "Downloading"
    );
  const sourceType = new RegExp(MAAS_IO_DEFAULTS.url).test(
    source.data?.url ?? ""
  )
    ? BootResourceSourceType.MAAS_IO
    : BootResourceSourceType.CUSTOM;

  const initialValues: ChangeSourceValues = {
    keyring_data: source.data?.keyring_data ?? "",
    keyring_filename: source.data?.keyring_filename ?? "",
    url: source.data?.url ?? "",
    source_type: sourceType,
    autoSync: autoImport || false,
  };

  return (
    <PageContent>
      <ContentSection variant="narrow">
        <ContentSection.Title className="section-header__title">
          Source
        </ContentSection.Title>
        <ContentSection.Content>
          {loading && <Spinner text="Loading..." />}
          {!canChangeSource && (
            <Notification
              data-testid="cannot-change-source-warning"
              severity="caution"
            >
              Image import is in progress, cannot change source settings.
            </Notification>
          )}
          {!loading && (
            <FormikForm
              aria-label="Choose source"
              enableReinitialize
              errors={errors}
              initialValues={initialValues}
              onSubmit={(values) => {
                updateConfig.mutate({
                  headers: {
                    ETag: configETag,
                  },
                  body: {
                    value: values.autoSync,
                  },
                  path: { name: ConfigNames.BOOT_IMAGES_AUTO_IMPORT },
                });
                updateImageSource.mutate({
                  body: {
                    ...values,
                    // TODO: add priority field when multiple sources are supported
                    priority: 10,
                  },
                  path: {
                    boot_source_id: source.data?.id ?? -1,
                  },
                });
              }}
              onSuccess={async () => {
                await queryClient.invalidateQueries({
                  queryKey: getConfigurationsQueryKey(),
                });
                await queryClient.invalidateQueries({
                  queryKey: getConfigurationQueryKey({
                    path: { name: ConfigNames.BOOT_IMAGES_AUTO_IMPORT },
                  }),
                });
                await queryClient.invalidateQueries({
                  queryKey: listBootsourcesQueryKey(),
                });
                await queryClient.invalidateQueries({
                  queryKey: getBootsourceQueryKey({
                    path: { boot_source_id: source.data?.id ?? -1 },
                  }),
                });
              }}
              saved={saved}
              saving={saving}
              submitDisabled={!canChangeSource}
              submitLabel="Save"
              validationSchema={ChangeSourceSchema}
            >
              <ChangeSourceFields saved={saved} saving={saving} />
            </FormikForm>
          )}
        </ContentSection.Content>
      </ContentSection>
    </PageContent>
  );
};

export default ChangeSource;
