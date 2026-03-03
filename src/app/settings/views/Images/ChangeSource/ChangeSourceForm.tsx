import type { Dispatch, ReactElement, SetStateAction } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  RadioInput,
  Notification as NotificationBanner,
} from "@canonical/react-components";

import MaasIoSourceForm from "./MaasIoSourceForm/MaasIoSourceForm";

import type {
  BootSourceResponse,
  NotFoundBodyResponse,
  SourceAvailableImageListResponse,
  ValidationErrorBodyResponse,
} from "@/app/apiclient";
import {
  MAAS_IO_DEFAULT_KEYRING_FILE_PATHS,
  MAAS_IO_URLS,
} from "@/app/images/constants";
import { BootResourceSourceType } from "@/app/images/types";
import type { ChangeSourceValues } from "@/app/settings/views/Images/ChangeSource/ChangeSource";
import { Labels } from "@/app/settings/views/Images/ChangeSource/ChangeSourceFields/ChangeSourceFields";
import CustomSourceForm from "@/app/settings/views/Images/ChangeSource/CustomSourceForm/CustomSourceForm";

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

type ChangeSourceFormProps = {
  errors: NotFoundBodyResponse | ValidationErrorBodyResponse | null;
  canChangeSource: boolean;
  autoImport: boolean;
  source: BootSourceResponse;
  installType: string;
  onSubmitSource: (
    values: ChangeSourceValues,
    initialValues: ChangeSourceValues
  ) => void;
  onValidateSource: (
    values: ChangeSourceValues
  ) =>
    | Promise<SourceAvailableImageListResponse & { headers?: Headers }>
    | Promise<void>;
  saved: boolean;
  saving: boolean;
  validated: boolean;
  validating: boolean;
  lastValidatedValues: ChangeSourceValues | null;
  setIsValidated: Dispatch<SetStateAction<boolean>>;
};

const ChangeSourceForm = ({
  canChangeSource,
  autoImport,
  source,
  installType,
  saved,
  saving,
  validated,
  validating,
  errors,
  onValidateSource,
  onSubmitSource,
  lastValidatedValues,
  setIsValidated,
}: ChangeSourceFormProps): ReactElement => {
  const [sourceType, setSourceType] = useState<BootResourceSourceType>(
    BootResourceSourceType.MAAS_IO
  );
  const [showSourceChangeWarning, setShowSourceChangeWarning] = useState(false);

  const defaultKeyringFilename = source.keyring_filename?.length
    ? source.keyring_filename
    : installType === "deb"
      ? MAAS_IO_DEFAULT_KEYRING_FILE_PATHS.deb
      : MAAS_IO_DEFAULT_KEYRING_FILE_PATHS.snap;

  const serverValues: ChangeSourceValues = useMemo(
    () => ({
      keyring_data: source.keyring_data ?? "",
      keyring_filename: source.keyring_filename ?? "",
      keyring_type:
        getSourceType(source.url ?? "") === BootResourceSourceType.MAAS_IO
          ? "keyring_filename"
          : getKeyringType(source.keyring_filename, source.keyring_data),
      url: source.url ?? "",
      autoSync: autoImport,
      priority: source.priority === 10 ? 9 : 10,
    }),
    [
      source.keyring_data,
      source.keyring_filename,
      source.url,
      source.priority,
      autoImport,
    ]
  );

  const initialValues: ChangeSourceValues = useMemo(
    () => ({
      keyring_data: source.keyring_data ?? "",
      keyring_filename: defaultKeyringFilename,
      keyring_type:
        getSourceType(source.url ?? "") === BootResourceSourceType.MAAS_IO
          ? "keyring_filename"
          : getKeyringType(source.keyring_filename, source.keyring_data),
      url: source.url ?? "",
      autoSync: autoImport || false,
      // TODO: add priority field when multiple sources are supported.
      //  Since priority must be unique, fake uniqueness by switching
      //  between 10 and 9 until multiple sources introduce an explicit
      //  priority field
      priority: source.priority === 10 ? 9 : 10,
    }),
    [
      source.keyring_data,
      source.keyring_filename,
      source.url,
      source.priority,
      autoImport,
      defaultKeyringFilename,
    ]
  );

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

  const autoSyncRef = useRef<boolean>(autoImport || false);
  useEffect(() => {
    autoSyncRef.current = autoImport || false;
  }, [autoImport]);

  useEffect(() => {
    if (source.url) {
      const resolvedSourceType = getSourceType(source.url);
      setSourceType(resolvedSourceType);
      if (resolvedSourceType === BootResourceSourceType.CUSTOM) {
        customValuesRef.current = {
          url: source.url,
          keyring_filename: defaultKeyringFilename,
          keyring_data: source.keyring_data ?? "",
          keyring_type: getKeyringType(
            source.keyring_filename,
            source.keyring_data
          ),
        };
      }
    }
  }, [
    source.url,
    source.keyring_data,
    source.keyring_filename,
    defaultKeyringFilename,
  ]);

  const onValuesChanged = (values: ChangeSourceValues) => {
    autoSyncRef.current = values.autoSync;

    if (sourceType === BootResourceSourceType.CUSTOM) {
      customValuesRef.current = {
        url: values.url,
        keyring_filename: values.keyring_filename ?? "",
        keyring_data: values.keyring_data ?? "",
        keyring_type: values.keyring_type,
      };
    }

    const sourceSettingsChanged =
      values.url !== (source.url ?? "") ||
      values.keyring_data !== (source.keyring_data ?? "") ||
      values.keyring_filename !== (source.keyring_filename ?? "");

    setShowSourceChangeWarning(!saved && !saving && sourceSettingsChanged);

    if (
      lastValidatedValues &&
      JSON.stringify(values) !== JSON.stringify(lastValidatedValues)
    ) {
      setIsValidated(false);
    }
  };

  return (
    <>
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
          Changing the image source will remove all currently downloaded images.
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
              onSubmitSource(values, initialValues);
            });
          }}
          onValuesChanged={onValuesChanged}
          saved={saved}
          saving={saving}
          serverValues={serverValues}
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
          onSubmit={(values) => {
            onSubmitSource(values, initialValues);
          }}
          onValidate={onValidateSource}
          onValuesChanged={onValuesChanged}
          saved={saved}
          saving={saving}
          serverValues={serverValues}
          validated={validated}
          validating={validating}
        />
      )}
    </>
  );
};

export default ChangeSourceForm;
