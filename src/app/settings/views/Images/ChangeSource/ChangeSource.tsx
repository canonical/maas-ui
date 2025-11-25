import type { ReactElement } from "react";
import { useCallback, useEffect } from "react";

import { ContentSection } from "@canonical/maas-react-components";
import { Notification, Spinner } from "@canonical/react-components";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
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
  getConfigurationQueryKey,
  getConfigurationsQueryKey,
} from "@/app/apiclient/@tanstack/react-query.gen";
import FormikForm from "@/app/base/components/FormikForm";
import PageContent from "@/app/base/components/PageContent";
import { useWindowTitle } from "@/app/base/hooks";
import ChangeSourceFields from "@/app/settings/views/Images/ChangeSource/ChangeSourceFields";
import { bootResourceActions } from "@/app/store/bootresource";
import bootResourceSelectors from "@/app/store/bootresource/selectors";
import { BootResourceSourceType } from "@/app/store/bootresource/types";
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
  const dispatch = useDispatch();
  const resources = useSelector(bootResourceSelectors.resources);
  const pollingSources = useSelector(bootResourceSelectors.polling);
  const cleanup = useCallback(() => {
    return bootResourceActions.cleanup();
  }, []);

  const queryClient = useQueryClient();
  const sources = useImageSources();
  // TODO: add support for multiple sources when v3 is ready
  const source = useGetImageSource(
    {
      path: { boot_source_id: sources.data?.items[0].id ?? -1 },
    },
    sources.isSuccess
  );
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

  useWindowTitle("Source");
  useEffect(() => {
    dispatch(bootResourceActions.poll({ continuous: false }));
    return () => {
      dispatch(bootResourceActions.pollStop());
      dispatch(bootResourceActions.cleanup());
    };
  }, [dispatch]);

  const canChangeSource = resources.every((resource) => !resource.downloading);
  const sourceType = /^https?:\/\/images\.maas\.io\/.*\/stable\/?$/.test(
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

  const onlyAutoSyncChanged = (
    values: ChangeSourceValues,
    initial: ChangeSourceValues
  ) =>
    values.autoSync !== initial.autoSync &&
    values.url === initial.url &&
    values.keyring_data === initial.keyring_data &&
    values.keyring_filename === initial.keyring_filename &&
    values.source_type === initial.source_type;

  return (
    <PageContent sidePanelContent={null} sidePanelTitle={null}>
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
          {!pollingSources && !loading && (
            <FormikForm
              aria-label="Choose source"
              cleanup={cleanup}
              errors={updateImageSource.error}
              initialValues={initialValues}
              onSubmit={(values) => {
                dispatch(cleanup());
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
              }}
              saved={saved}
              saving={saving}
              submitDisabled={!canChangeSource}
              submitLabel="Save"
              validationSchema={ChangeSourceSchema}
            >
              {(formikContext: {
                values: ChangeSourceValues;
                initialValues: ChangeSourceValues;
              }) => (
                <>
                  <ChangeSourceFields />
                  {!saved &&
                    !onlyAutoSyncChanged(
                      formikContext.values,
                      formikContext.initialValues
                    ) &&
                    (formikContext.values.url !==
                      formikContext.initialValues.url ||
                      formikContext.values.keyring_data !==
                        formikContext.initialValues.keyring_data ||
                      formikContext.values.keyring_filename !==
                        formikContext.initialValues.keyring_filename ||
                      formikContext.values.source_type !==
                        formikContext.initialValues.source_type) && (
                      <Notification
                        data-testid="source-change-warning"
                        severity="caution"
                      >
                        Changing the image source will remove all currently
                        downloaded images.
                      </Notification>
                    )}
                </>
              )}
            </FormikForm>
          )}
        </ContentSection.Content>
      </ContentSection>
    </PageContent>
  );
};

export default ChangeSource;
