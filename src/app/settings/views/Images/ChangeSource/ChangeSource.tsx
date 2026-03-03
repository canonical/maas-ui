import type { ReactElement } from "react";
import { useEffect, useState } from "react";

import { ContentSection } from "@canonical/maas-react-components";
import {
  Col,
  Notification as NotificationBanner,
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
import type { BootSourceCreateRequest } from "@/app/apiclient";
import PageContent from "@/app/base/components/PageContent";
import { useWindowTitle } from "@/app/base/hooks";
import ChangeSourceForm from "@/app/settings/views/Images/ChangeSource/ChangeSourceForm";
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
    url: Yup.string().required("URL is required"),
    autoSync: Yup.boolean(),
  })
  .defined();

export type ChangeSourceValues = BootSourceCreateRequest & {
  keyring_type: "keyring_data" | "keyring_filename" | "keyring_unsigned";
  autoSync: boolean;
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

  const canChangeSource =
    !!selectionStatuses &&
    !!customImageStatuses &&
    [...selectionStatuses.items, ...customImageStatuses.items].every(
      (s) => s.status !== "Downloading" && s.update_status !== "Downloading"
    );

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

    setIsValidated(false);
    return Promise.resolve();
  };

  const onSubmitSource = (
    values: ChangeSourceValues,
    initialValues: ChangeSourceValues
  ) => {
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
                <ChangeSourceForm
                  autoImport={autoImport}
                  canChangeSource={canChangeSource}
                  errors={errors}
                  installType={installTypeData}
                  lastValidatedValues={lastValidatedValues}
                  onSubmitSource={onSubmitSource}
                  onValidateSource={onValidateSource}
                  saved={saved}
                  saving={saving}
                  setIsValidated={setIsValidated}
                  source={source.data!}
                  validated={isValidated}
                  validating={fetchImageSource.isPending}
                />
              </Col>
            </Row>
          )}
        </ContentSection.Content>
      </ContentSection>
    </PageContent>
  );
};

export default ChangeSource;
