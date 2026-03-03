import type { ReactElement } from "react";
import React, { useRef, useEffect, useState } from "react";

import { Icon, Select, Tooltip } from "@canonical/react-components";
import type { FormikContextType } from "formik";

import type {
  NotFoundBodyResponse,
  ValidationErrorBodyResponse,
} from "@/app/apiclient";
import FormikField, {
  FormikFieldChangeError,
} from "@/app/base/components/FormikField/FormikField";
import FormikForm from "@/app/base/components/FormikForm";
import { MAAS_IO_URLS } from "@/app/images/constants";
import type { ChangeSourceValues } from "@/app/settings/views/Images/ChangeSource/ChangeSource";
import { ChangeSourceSchema } from "@/app/settings/views/Images/ChangeSource/ChangeSource";
import { Labels } from "@/app/settings/views/Images/ChangeSource/ChangeSourceFields/ChangeSourceFields";

type MaasIoSourceFormProps = {
  enabled: boolean;
  errors: NotFoundBodyResponse | ValidationErrorBodyResponse | null;
  initialValues: ChangeSourceValues;
  serverValues: ChangeSourceValues;
  onSubmit: (values: ChangeSourceValues) => void;
  onValuesChanged: (values: ChangeSourceValues) => void;
  saved: boolean;
  saving: boolean;
};

const getSelectedChannel = (url: string): "candidate" | "stable" => {
  if (url.includes("candidate")) {
    return "candidate";
  }
  return "stable";
};

const MaasIoSourceForm = ({
  enabled,
  errors,
  initialValues,
  serverValues,
  onSubmit,
  onValuesChanged,
  saved,
  saving,
}: MaasIoSourceFormProps): ReactElement => {
  // Determine the selected MAAS.io release channel from the URL
  const [selectedChannel, setSelectedChannel] = useState<
    "candidate" | "stable"
  >(getSelectedChannel(initialValues.url));

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
    setSelectedChannel(getSelectedChannel(initialValues.url));
  }, [initialValues.url]);

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
      submitDisabled={!enabled}
      submitLabel="Save"
      validationSchema={ChangeSourceSchema}
    >
      {({ setFieldValue }: FormikContextType<ChangeSourceValues>) => {
        return (
          <>
            <Select
              label="Stream"
              name="maas-io-stream"
              onChange={async (e: React.ChangeEvent<HTMLSelectElement>) => {
                const newChannel = e.target.value as "candidate" | "stable";
                setSelectedChannel(newChannel);
                const newUrl = MAAS_IO_URLS[newChannel];
                await setFieldValue("url", newUrl).catch((reason: unknown) => {
                  throw new FormikFieldChangeError(
                    "url",
                    "setFieldValue",
                    reason as string
                  );
                });
              }}
              options={[
                { label: `Stable (${MAAS_IO_URLS.stable})`, value: "stable" },
                {
                  label: `Candidate (${MAAS_IO_URLS.candidate})`,
                  value: "candidate",
                },
              ]}
              required
              value={selectedChannel}
            />
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

export default MaasIoSourceForm;
