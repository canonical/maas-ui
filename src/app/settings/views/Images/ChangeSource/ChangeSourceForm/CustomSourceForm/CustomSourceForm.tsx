import type { ReactElement } from "react";
import React, { useEffect, useRef, useState } from "react";

import { Icon, Select, Textarea, Tooltip } from "@canonical/react-components";
import type { FormikContextType } from "formik";

import type {
  NotFoundBodyResponse,
  ValidationErrorBodyResponse,
} from "@/app/apiclient";
import FormikField from "@/app/base/components/FormikField";
import { FormikFieldChangeError } from "@/app/base/components/FormikField/FormikField";
import FormikForm from "@/app/base/components/FormikForm";
import type { ChangeSourceValues } from "@/app/settings/views/Images/ChangeSource/ChangeSource";
import { ChangeSourceSchema } from "@/app/settings/views/Images/ChangeSource/ChangeSource";
import { Labels } from "@/app/settings/views/Images/ChangeSource/ChangeSourceForm/ChangeSourceForm";

type CustomSourceFormProps = {
  enabled: boolean;
  errors: NotFoundBodyResponse | ValidationErrorBodyResponse | null;
  initialValues: ChangeSourceValues;
  serverValues: ChangeSourceValues;
  onSubmit: (values: ChangeSourceValues) => void;
  onValidate: (values: ChangeSourceValues) => void;
  onValuesChanged: (values: ChangeSourceValues) => void;
  saved: boolean;
  saving: boolean;
  validated: boolean;
  validating: boolean;
};

const CustomSourceForm = ({
  enabled,
  errors,
  initialValues,
  serverValues,
  onSubmit,
  onValidate,
  onValuesChanged,
  saved,
  saving,
  validated,
  validating,
}: CustomSourceFormProps): ReactElement => {
  const [selectedKeyringType, setSelectedKeyringType] = useState<
    "keyring_data" | "keyring_filename" | "keyring_unsigned"
  >(initialValues.keyring_type || "keyring_filename");

  const formikRef = useRef<FormikContextType<ChangeSourceValues>>(null);

  useEffect(() => {
    if (
      formikRef.current &&
      JSON.stringify(initialValues) !== JSON.stringify(serverValues)
    ) {
      formikRef.current.setValues(initialValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const prevServerValuesRef = useRef(serverValues);
  useEffect(() => {
    if (
      JSON.stringify(prevServerValuesRef.current) !==
      JSON.stringify(serverValues)
    ) {
      prevServerValuesRef.current = serverValues;
      formikRef.current?.resetForm({ values: serverValues });
    }
  }, [serverValues]);

  useEffect(() => {
    setSelectedKeyringType(initialValues.keyring_type || "keyring_filename");
  }, [initialValues.keyring_type]);

  return (
    <FormikForm<
      ChangeSourceValues,
      NotFoundBodyResponse | ValidationErrorBodyResponse | null
    >
      aria-label="Choose source"
      buttonsBehavior="independent"
      errors={errors}
      initialValues={serverValues}
      innerRef={formikRef}
      onSubmit={onSubmit}
      onValuesChanged={onValuesChanged}
      saved={saved}
      saving={saving}
      secondarySubmit={onValidate}
      secondarySubmitDisabled={!enabled}
      secondarySubmitLabel={!validated ? "Validate" : undefined}
      secondarySubmitSaved={validated}
      secondarySubmitSaving={validating}
      submitDisabled={!enabled || !validated}
      submitLabel="Save"
      validationSchema={ChangeSourceSchema}
    >
      {({
        setFieldValue,
        validateForm,
      }: FormikContextType<ChangeSourceValues>) => {
        return (
          <>
            <FormikField
              label={Labels.Url}
              name="url"
              placeholder="e.g. http:// or https://"
              required
              type="text"
            />
            <Select
              label="Keyring"
              name="keyring_type"
              onChange={async (e: React.ChangeEvent<HTMLSelectElement>) => {
                const newType = e.target.value as
                  | "keyring_data"
                  | "keyring_filename";
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
            <FormikField
              data-testid="auto-sync-switch"
              id="auto-sync-switch"
              label={
                <>
                  {Labels.AutoSyncImages}
                  <Tooltip
                    className="u-nudge-right--small"
                    message={`Enables hourly image updates (sync) from the source configured above.`}
                  >
                    <div className="u-nudge-right--x-large">
                      <Icon name="help" />
                    </div>
                  </Tooltip>
                </>
              }
              name="autoSync"
              type="checkbox"
            />
          </>
        );
      }}
    </FormikForm>
  );
};

export default CustomSourceForm;
