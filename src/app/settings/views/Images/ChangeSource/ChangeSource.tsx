import type { ReactElement } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ContentSection } from "@canonical/maas-react-components";
import {
  Col,
  Notification as NotificationBanner,
  RadioInput,
  Row,
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
  useFetchImageSource,
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
import PageContent from "@/app/base/components/PageContent";
import { useWindowTitle } from "@/app/base/hooks";
import {
  MAAS_IO_DEFAULT_KEYRING_FILE_PATHS,
  MAAS_IO_URLS,
} from "@/app/images/constants";
import { BootResourceSourceType } from "@/app/images/types";
import { Labels } from "@/app/settings/views/Images/ChangeSource/ChangeSourceFields/ChangeSourceFields";
import CustomSourceForm from "@/app/settings/views/Images/ChangeSource/CustomSourceForm/CustomSourceForm";
import MaasIoSourceForm from "@/app/settings/views/Images/ChangeSource/MaasIoSourceForm/MaasIoSourceForm";
import { ConfigNames } from "@/app/store/config/types";
import { generalActions } from "@/app/store/general";
import { installType } from "@/app/store/general/selectors";

export const ChangeSourceSchema = Yup.object()
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
  const isMaasIo =
    new RegExp(MAAS_IO_URLS.stable).test(url) ||
    new RegExp(MAAS_IO_URLS.candidate).test(url);
  return isMaasIo
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
  const [isValidated, setIsValidated] = useState(false);
  const [lastValidatedValues, setLastValidatedValues] =
    useState<ChangeSourceValues | null>(null);
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
  const fetchImageSource = useFetchImageSource();
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
    fetchImageSource.error ||
    updateConfig.error ||
    changeImageSource.error;

  useWindowTitle("Source");

  const canChangeSource = checkCanChangeSource(
    selectionStatuses,
    customImageStatuses
  );

  const [sourceType, setSourceType] = useState<BootResourceSourceType>(
    BootResourceSourceType.MAAS_IO
  );

  useEffect(() => {
    if (source.isSuccess && source.data?.url) {
      setSourceType(getSourceType(source.data.url));
    }
  }, [source.isSuccess, source.data?.url]);

  const getDefaultKeyringFilename = useCallback((): string => {
    if (source.data?.keyring_filename?.length) {
      return source.data.keyring_filename;
    }
    return installTypeData === "deb"
      ? MAAS_IO_DEFAULT_KEYRING_FILE_PATHS.deb
      : MAAS_IO_DEFAULT_KEYRING_FILE_PATHS.snap;
  }, [installTypeData, source.data?.keyring_filename]);

  const initialValues: ChangeSourceValues = useMemo(
    () => ({
      keyring_data: source.data?.keyring_data ?? "",
      keyring_filename: getDefaultKeyringFilename(),
      keyring_type:
        getSourceType(source.data?.url ?? "") === BootResourceSourceType.MAAS_IO
          ? "keyring_filename"
          : getKeyringType(
              source.data?.keyring_filename,
              source.data?.keyring_data
            ),
      url: source.data?.url ?? "",
      autoSync: autoImport || false,
      // TODO: add priority field when multiple sources are supported.
      //  Since priority must be unique, fake uniqueness by switching
      //  between 10 and 9 until multiple sources introduce an explicit
      //  priority field
      priority: source.data?.priority === 10 ? 9 : 10,
    }),
    [
      source.data?.keyring_data,
      source.data?.keyring_filename,
      source.data?.url,
      source.data?.priority,
      getDefaultKeyringFilename,
      autoImport,
    ]
  );

  // Preserve the last-entered custom field values so they can be restored
  // when the user switches back to Custom after visiting MAAS.io.
  const customValuesRef = useRef<{
    url: string;
    keyring_filename: string;
    keyring_data: string;
    keyring_type: "keyring_data" | "keyring_filename" | "keyring_unsigned";
  }>({
    url: "",
    keyring_filename: "",
    keyring_data: "",
    keyring_type: "keyring_filename",
  });

  // Persist autoSync across source type switches — it is a shared field
  // between both forms and should not reset when toggling source type.
  const autoSyncRef = useRef<boolean>(autoImport || false);

  useEffect(() => {
    if (source.isSuccess && source.data?.url) {
      const resolvedSourceType = getSourceType(source.data.url);
      if (resolvedSourceType === BootResourceSourceType.CUSTOM) {
        customValuesRef.current = {
          url: source.data.url,
          keyring_filename: getDefaultKeyringFilename(),
          keyring_data: source.data.keyring_data ?? "",
          keyring_type: getKeyringType(
            source.data.keyring_filename,
            source.data.keyring_data
          ),
        };
      }
    }
  }, [
    source.isSuccess,
    source.data?.url,
    source.data?.keyring_data,
    source.data?.keyring_filename,
    getDefaultKeyringFilename,
  ]);

  // Track latest form values for the source-change warning
  const currentValuesRef = useRef<ChangeSourceValues | null>(null);
  const [showSourceChangeWarning, setShowSourceChangeWarning] = useState(false);

  const onValuesChanged = (values: ChangeSourceValues) => {
    currentValuesRef.current = values;
    autoSyncRef.current = values.autoSync;

    if (sourceType === BootResourceSourceType.CUSTOM) {
      customValuesRef.current = {
        url: values.url,
        keyring_filename: values.keyring_filename ?? "",
        keyring_data: values.keyring_data ?? "",
        keyring_type: values.keyring_type,
      };
    }

    const serverUrl = source.data?.url ?? "";
    const serverKeyringData = source.data?.keyring_data ?? "";
    const serverKeyringFilename = source.data?.keyring_filename ?? "";

    const sourceSettingsChanged =
      values.url !== serverUrl ||
      values.keyring_data !== serverKeyringData ||
      values.keyring_filename !== serverKeyringFilename;

    const onlyAutoSyncChanged =
      values.autoSync !== (autoImport || false) && !sourceSettingsChanged;

    setShowSourceChangeWarning(
      !saved && !saving && !onlyAutoSyncChanged && sourceSettingsChanged
    );

    if (
      lastValidatedValues &&
      JSON.stringify(values) !== JSON.stringify(lastValidatedValues)
    ) {
      setIsValidated(false);
    }
  };

  const onValidateSource = (values: ChangeSourceValues) => {
    if (!isValidated) {
      return fetchImageSource.mutateAsync(
        {
          body: {
            url: values.url,
            keyring_filename:
              values.keyring_type === "keyring_filename"
                ? values.keyring_filename
                : undefined,
            keyring_data:
              values.keyring_type === "keyring_data"
                ? values.keyring_data
                : undefined,
            skip_keyring_verification:
              values.keyring_type === "keyring_unsigned" ? true : undefined,
          },
        },
        {
          onSuccess: () => {
            setIsValidated(true);
            setLastValidatedValues(values);
          },
        }
      );
    }

    // Reset validation state after successful save
    return (async () => {
      setIsValidated(false);
    })();
  };

  const onSubmitSource = (values: ChangeSourceValues) => {
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
          values.keyring_type === "keyring_unsigned" ? true : undefined,
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
            <Row>
              <Col size={12}>
                <ul className="p-inline-list">
                  <li className="p-inline-list__item u-display--inline-block">
                    <RadioInput
                      checked={sourceType === BootResourceSourceType.MAAS_IO}
                      id="maas-source"
                      label={Labels.MaasIo}
                      name="source_type"
                      onChange={() => {
                        setSourceType(BootResourceSourceType.MAAS_IO);
                      }}
                      value={BootResourceSourceType.MAAS_IO}
                    />
                  </li>
                  <li className="p-inline-list__item u-display--inline-block u-nudge-right">
                    <RadioInput
                      checked={sourceType === BootResourceSourceType.CUSTOM}
                      id="custom-source"
                      label={Labels.Custom}
                      name="source_type"
                      onChange={() => {
                        setSourceType(BootResourceSourceType.CUSTOM);
                      }}
                      value={BootResourceSourceType.CUSTOM}
                    />
                  </li>
                </ul>
                {showSourceChangeWarning && (
                  <NotificationBanner
                    data-testid="source-change-warning"
                    severity="caution"
                  >
                    Changing the image source will remove all currently
                    downloaded images.
                  </NotificationBanner>
                )}
                {sourceType === BootResourceSourceType.MAAS_IO ? (
                  <MaasIoSourceForm
                    enabled={canChangeSource}
                    errors={errors}
                    initialValues={{
                      ...initialValues,
                      autoSync: autoSyncRef.current,
                    }}
                    onSubmit={(values: ChangeSourceValues) => {
                      // Silently validate when saving a maas.io source
                      onValidateSource(values).then(() => {
                        onSubmitSource(values);
                      });
                    }}
                    onValuesChanged={onValuesChanged}
                    saved={saved}
                    saving={saving}
                  />
                ) : (
                  <CustomSourceForm
                    enabled={canChangeSource}
                    errors={errors}
                    initialValues={{
                      ...initialValues,
                      autoSync: autoSyncRef.current,
                      url: customValuesRef.current.url,
                      keyring_type: customValuesRef.current.keyring_type,
                      keyring_filename:
                        customValuesRef.current.keyring_filename ||
                        initialValues.keyring_filename,
                      keyring_data: customValuesRef.current.keyring_data,
                    }}
                    onSubmit={onSubmitSource}
                    onValidate={onValidateSource}
                    onValuesChanged={onValuesChanged}
                    saved={saved}
                    saving={saving}
                    validated={isValidated}
                    validating={fetchImageSource.isPending}
                  />
                )}
              </Col>
            </Row>
          )}
        </ContentSection.Content>
      </ContentSection>
    </PageContent>
  );
};

export default ChangeSource;
