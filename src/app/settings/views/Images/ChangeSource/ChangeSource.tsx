import type { ReactElement } from "react";
import { useEffect } from "react";

import { ContentSection } from "@canonical/maas-react-components";
import {
  Notification as NotificationBanner,
  Spinner,
} from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import {
  useGetConfiguration,
  useSetConfiguration,
} from "@/app/api/query/configurations";
import {
  useChangeImageSource,
  useGetImageSource,
  useImageSources,
  useUpdateImageSource,
} from "@/app/api/query/imageSources";
import {
  useCustomImageStatuses,
  useSelectionStatuses,
} from "@/app/api/query/images";
import type {
  BootSourceCreateRequest,
  ImageStatusListResponse,
  ImageStatusResponse,
} from "@/app/apiclient";
import FormikForm from "@/app/base/components/FormikForm";
import PageContent from "@/app/base/components/PageContent";
import { useWindowTitle } from "@/app/base/hooks";
import { MAAS_IO_DEFAULTS } from "@/app/images/constants";
import { BootResourceSourceType } from "@/app/images/types";
import ChangeSourceFields from "@/app/settings/views/Images/ChangeSource/ChangeSourceFields";
import { ConfigNames } from "@/app/store/config/types";
import { generalActions } from "@/app/store/general";
import { installType } from "@/app/store/general/selectors";

const DEB_DEFAULT_KEYRING_FILENAME = "src";
const SNAP_DEFAULT_KEYRING_FILENAME = "src";

const ChangeSourceSchema = Yup.object()
  .shape({
    keyring_type: Yup.string()
      .oneOf(["keyring_data", "keyring_filename", "keyring_unsigned"])
      .required("Keyring type is required"),
    keyring_data: Yup.string().when("keyring_type", {
      is: "keyring_data",
      then: (schema) => schema.required("Keyring data is required"),
      otherwise: (schema) => schema,
    }),
    keyring_filename: Yup.string().when("keyring_type", {
      is: "keyring_filename",
      then: (schema) => schema.required("Keyring filename is required"),
      otherwise: (schema) => schema,
    }),
    source_type: Yup.string().required("Source type is required"),
    url: Yup.string()
      .when("source_type", {
        is: (val: string) => val === BootResourceSourceType.CUSTOM,
        then: (schema) => schema.required("URL is required for custom sources"),
        otherwise: (schema) => schema,
      })
      .when("keyring_type", {
        is: "keyring_unsigned",
        then: (schema) => schema.required("URL is required"),
        otherwise: (schema) => schema,
      }),
    autoSync: Yup.boolean(),
  })
  .defined();

export type ChangeSourceValues = BootSourceCreateRequest & {
  keyring_type: "keyring_data" | "keyring_filename" | "keyring_unsigned";
  source_type: BootResourceSourceType;
  autoSync: boolean;
};

const getKeyringType = (
  keyring_filename?: string,
  keyring_data?: string
): "keyring_data" | "keyring_filename" | "keyring_unsigned" => {
  if (keyring_filename) return "keyring_filename";
  if (keyring_data) return "keyring_data";
  return "keyring_unsigned";
};

const getSourceType = (url: string): BootResourceSourceType => {
  return new RegExp(MAAS_IO_DEFAULTS.url).test(url)
    ? BootResourceSourceType.MAAS_IO
    : BootResourceSourceType.CUSTOM;
};

const checkCanChangeSource = (
  selectionStatuses: ImageStatusListResponse | undefined,
  customImageStatuses: ImageStatusListResponse | undefined
): boolean => {
  if (!selectionStatuses || !customImageStatuses) return false;

  const isNotDownloading = (s: ImageStatusResponse) =>
    s.status !== "Downloading" && s.update_status !== "Downloading";

  return (
    selectionStatuses.items.every(isNotDownloading) &&
    customImageStatuses.items.every(isNotDownloading)
  );
};

const ChangeSource = (): ReactElement => {
  const dispatch = useDispatch();
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

  const installTypeData = useSelector(installType.get);

  useEffect(() => {
    dispatch(generalActions.fetchInstallType());
  });

  const importConfig = useGetConfiguration({
    path: { name: ConfigNames.BOOT_IMAGES_AUTO_IMPORT },
  });
  const configETag = importConfig.data?.headers?.get("ETag");
  const autoImport = importConfig.data?.value as boolean;
  const updateConfig = useSetConfiguration();
  const changeImageSource = useChangeImageSource();
  const updateImageSource = useUpdateImageSource();

  const loading =
    sources.isPending || source.isPending || importConfig.isPending;

  const saving = updateConfig.isPending || changeImageSource.isPending;
  const saved = updateConfig.isSuccess || changeImageSource.isSuccess;

  const errors =
    sources.error ||
    selectionStatusesError ||
    customImageStatusesError ||
    importConfig.error ||
    updateConfig.error ||
    changeImageSource.error;

  useWindowTitle("Source");

  const canChangeSource = checkCanChangeSource(
    selectionStatuses,
    customImageStatuses
  );
  const sourceType = getSourceType(source.data?.url ?? "");

  const getDefaultKeyringFilename = (): string => {
    if (source.data?.keyring_filename) {
      return source.data.keyring_filename;
    }
    return installTypeData === "snap"
      ? SNAP_DEFAULT_KEYRING_FILENAME
      : DEB_DEFAULT_KEYRING_FILENAME;
  };

  const initialValues: ChangeSourceValues = {
    keyring_data: source.data?.keyring_data ?? "",
    keyring_filename: getDefaultKeyringFilename(),
    keyring_type: getKeyringType(
      source.data?.keyring_filename,
      source.data?.keyring_data
    ),
    url: source.data?.url ?? "",
    source_type: sourceType,
    autoSync: autoImport || false,
    // TODO: add priority field when multiple sources are supported.
    //  Since priority must be unique, fake uniqueness by switching
    //  between 10 and 9 until multiple sources introduce an explicit
    //  priority field
    priority: source.data?.priority === 10 ? 9 : 10,
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
            <NotificationBanner
              data-testid="cannot-change-source-warning"
              severity="caution"
            >
              Image import is in progress, cannot change source settings.
            </NotificationBanner>
          )}
          {!loading && (
            <FormikForm
              aria-label="Choose source"
              enableReinitialize
              errors={errors}
              initialValues={initialValues}
              onSubmit={(values) => {
                if (values.autoSync !== initialValues.autoSync) {
                  updateConfig.mutate({
                    headers: {
                      ETag: configETag,
                    },
                    body: {
                      value: values.autoSync,
                    },
                    path: { name: ConfigNames.BOOT_IMAGES_AUTO_IMPORT },
                  });
                }

                if (
                  values.url !== initialValues.url ||
                  values.keyring_data !== initialValues.keyring_data ||
                  values.keyring_filename !== initialValues.keyring_filename ||
                  values.skip_keyring_verification !==
                    initialValues.skip_keyring_verification ||
                  values.priority !== initialValues.priority
                ) {
                  const modificationData = {
                    url: values.url,
                    keyring_data:
                      values.keyring_type === "keyring_data"
                        ? values.keyring_data
                        : undefined,
                    keyring_filename:
                      values.keyring_type === "keyring_filename"
                        ? values.keyring_filename
                        : undefined,
                    skip_keyring_verification:
                      values.keyring_type === "keyring_unsigned"
                        ? true
                        : undefined,
                    priority: values.priority,
                    current_boot_source_id: source.data?.id ?? -1,
                  };

                  if (values.url !== initialValues.url) {
                    changeImageSource.mutate({
                      body: modificationData,
                    });
                  } else {
                    updateImageSource.mutate({
                      path: {
                        boot_source_id: source.data?.id ?? -1,
                      },
                      body: modificationData,
                    });
                  }
                }
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
