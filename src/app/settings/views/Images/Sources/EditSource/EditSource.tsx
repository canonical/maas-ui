import type { ReactElement } from "react";
import React, { useState } from "react";

import { Select, Textarea } from "@canonical/react-components";
import type { FormikContextType } from "formik";

import {
  useFetchImageSource,
  useUpdateImageSource,
} from "@/app/api/query/imageSources";
import type {
  BootSourceResponse,
  NotFoundBodyResponse,
  ValidationErrorBodyResponse,
} from "@/app/apiclient";
import FormikField from "@/app/base/components/FormikField";
import { FormikFieldChangeError } from "@/app/base/components/FormikField/FormikField";
import FormikForm from "@/app/base/components/FormikForm";
import { useSidePanel } from "@/app/base/side-panel-context";
import { BootResourceSourceType } from "@/app/images/types";
import { Labels } from "@/app/settings/views/Images/ChangeSource/ChangeSourceForm/ChangeSourceForm";
import type { SourceValues } from "@/app/settings/views/Images/Sources/AddSource/AddSource";
import { SourceSchema } from "@/app/settings/views/Images/Sources/AddSource/AddSource";
import type { ImageSource } from "@/app/settings/views/Images/Sources/Sources";

type EditSourceProps = {
  source: ImageSource;
};

const getInitialKeyringType = (
  source: BootSourceResponse
): "keyring_data" | "keyring_filename" | "keyring_unsigned" => {
  if (source.keyring_filename) return "keyring_filename";
  if (source.keyring_data) return "keyring_data";
  return "keyring_unsigned";
};

const EditSource = ({ source }: EditSourceProps): ReactElement => {
  const { closeSidePanel } = useSidePanel();

  const initialKeyringType = getInitialKeyringType(source);

  const [selectedKeyringType, setSelectedKeyringType] = useState<
    "keyring_data" | "keyring_filename" | "keyring_unsigned"
  >(initialKeyringType);
  const [isValidated, setIsValidated] = useState(false);
  const [lastValidatedValues, setLastValidatedValues] =
    useState<SourceValues | null>(null);

  const updateSource = useUpdateImageSource();
  const fetchImageSource = useFetchImageSource();

  const onValidate = async (values: SourceValues) => {
    if (!isValidated) {
      try {
        await fetchImageSource.mutateAsync(
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
      } catch {
        // Error is surfaced via fetchImageSource.error / the errors variable
      }
      return;
    }
    setIsValidated(false);
  };

  const onValuesChanged = (values: SourceValues) => {
    if (
      lastValidatedValues &&
      JSON.stringify(values) !== JSON.stringify(lastValidatedValues)
    ) {
      setIsValidated(false);
    }
  };

  const errors =
    updateSource.error || fetchImageSource.error
      ? ((updateSource.error ?? fetchImageSource.error) as
          | NotFoundBodyResponse
          | ValidationErrorBodyResponse
          | null)
      : null;

  const isDefault = source.type === BootResourceSourceType.MAAS_IO;

  return (
    <FormikForm<
      SourceValues,
      NotFoundBodyResponse | ValidationErrorBodyResponse | null
    >
      aria-label="Edit source"
      buttonsBehavior="independent"
      errors={errors}
      initialValues={{
        url: source.url,
        keyring_type: initialKeyringType,
        keyring_filename: source.keyring_filename ?? "",
        keyring_data: source.keyring_data ?? "",
        skip_keyring_verification: source.skip_keyring_verification,
        priority: source.priority,
      }}
      onCancel={closeSidePanel}
      onSubmit={(values) => {
        updateSource.mutate(
          {
            path: { boot_source_id: source.id },
            body: {
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
              priority: values.priority,
            },
          },
          { onSuccess: closeSidePanel }
        );
      }}
      onValuesChanged={onValuesChanged}
      saved={updateSource.isSuccess}
      saving={updateSource.isPending}
      secondarySubmit={!isDefault ? onValidate : undefined}
      secondarySubmitLabel={!isValidated && !isDefault ? "Validate" : undefined}
      secondarySubmitSaved={isValidated}
      secondarySubmitSaving={fetchImageSource.isPending}
      submitDisabled={!isValidated}
      submitLabel="Save source"
      validationSchema={SourceSchema}
    >
      {({ setFieldValue, validateForm }: FormikContextType<SourceValues>) => {
        return (
          <>
            {!isDefault && (
              <>
                <FormikField
                  label={Labels.Name}
                  name="name"
                  required
                  type="text"
                />
                <FormikField
                  disabled
                  label={Labels.Url}
                  name="url"
                  type="text"
                />
                <Select
                  label="Keyring"
                  name="keyring_type"
                  onChange={async (e: React.ChangeEvent<HTMLSelectElement>) => {
                    const newType = e.target.value as
                      | "keyring_data"
                      | "keyring_filename"
                      | "keyring_unsigned";
                    setSelectedKeyringType(newType);
                    await setFieldValue("keyring_type", newType).catch(
                      (reason: unknown) => {
                        throw new FormikFieldChangeError(
                          "keyring_type",
                          "setFieldValue",
                          reason as string
                        );
                      }
                    );
                    // Clear the other field when switching types
                    if (newType === "keyring_filename") {
                      await setFieldValue("keyring_data", "").catch(
                        (reason: unknown) => {
                          throw new FormikFieldChangeError(
                            "keyring_data",
                            "setFieldValue",
                            reason as string
                          );
                        }
                      );
                    } else if (newType === "keyring_data") {
                      await setFieldValue("keyring_filename", "").catch(
                        (reason: unknown) => {
                          throw new FormikFieldChangeError(
                            "keyring_filename",
                            "setFieldValue",
                            reason as string
                          );
                        }
                      );
                    }
                    await validateForm();
                  }}
                  options={[
                    { label: "Keyring filename", value: "keyring_filename" },
                    { label: "Keyring data", value: "keyring_data" },
                    { label: "Unsigned", value: "keyring_unsigned" },
                  ]}
                  required
                  value={selectedKeyringType}
                />
                {selectedKeyringType === "keyring_filename" ? (
                  <FormikField
                    aria-label={Labels.KeyringFilename}
                    help="Path to the keyring to validate the mirror path."
                    name="keyring_filename"
                    placeholder="e.g. /usr/share/keyrings/ubuntu-cloudimage-keyring.gpg"
                    required
                    type="text"
                  />
                ) : selectedKeyringType === "keyring_data" ? (
                  <FormikField
                    aria-label={Labels.KeyringData}
                    component={Textarea}
                    help="Contents on the keyring to validate the mirror path."
                    name="keyring_data"
                    placeholder="Contents of GPG key (base64 encoded)"
                    required
                  />
                ) : null}
              </>
            )}
            <FormikField
              help="If the same image is available from several sources, the image from the higher priority takes precedence. 1 is the lowest priority."
              label={Labels.Priority}
              name="priority"
              required
              type="number"
            />
          </>
        );
      }}
    </FormikForm>
  );
};

export default EditSource;
