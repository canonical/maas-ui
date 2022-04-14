import { useEffect, useState } from "react";

import { Button, Spinner } from "@canonical/react-components";
import { usePrevious } from "@canonical/react-components/dist/hooks";
import type { FormikErrors } from "formik";
import { Formik } from "formik";
import * as Yup from "yup";

import NodeNameFields from "./NodeNameFields";

import FormikFormContent from "app/base/components/FormikFormContent";
import { useCanEdit } from "app/base/hooks";
import type { Device } from "app/store/device/types";
import type { Domain, DomainMeta } from "app/store/domain/types";
import type { Machine } from "app/store/machine/types";
import type { SimpleNode } from "app/store/types/node";

export type Props = {
  editingName: boolean;
  // Machines and devices can edit their name, but no controllers.
  node: Machine | Device | null;
  onSubmit: (
    hostname: SimpleNode["hostname"],
    domain: Domain[DomainMeta.PK]
  ) => void;
  setEditingName: (editingName: boolean) => void;
  saved?: boolean;
  saving?: boolean;
};

export type FormValues = {
  hostname: string;
  domain: string;
};

const hostnamePattern = /^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])*$/;

export enum Label {
  HostnamePatternError = "Hostname must only contain letters, numbers and hyphens.",
}

const Schema = Yup.object().shape({
  hostname: Yup.string()
    .max(63, "Hostname must be 63 characters or less.")
    .matches(hostnamePattern, Label.HostnamePatternError)
    .required(),
  domain: Yup.string(),
});

const NodeName = ({
  editingName,
  node,
  onSubmit,
  setEditingName,
  saved,
  saving,
}: Props): JSX.Element => {
  const [hostnameError, setHostnameError] = useState<
    FormikErrors<FormValues>["hostname"] | null
  >(null);
  const canEdit = useCanEdit(node);
  const previousSaving = usePrevious(saving);

  useEffect(() => {
    // The node has transitioned from saving to saved so close the form.
    if (saved && !saving && previousSaving) {
      setEditingName(false);
    }
  }, [previousSaving, saved, saving, setEditingName]);

  if (!node) {
    return <Spinner />;
  }
  if (!canEdit) {
    return <span className="node-name">{node.fqdn}</span>;
  }
  if (!editingName) {
    return (
      <Button
        appearance="base"
        className="node-name--editable"
        onClick={() => setEditingName(true)}
      >
        {node.fqdn}
      </Button>
    );
  }
  return (
    <Formik
      initialValues={{
        domain: String(node.domain.id),
        hostname: node.hostname,
      }}
      onSubmit={({ hostname, domain }) => {
        onSubmit(hostname, Number(domain));
      }}
      validationSchema={Schema}
    >
      <FormikFormContent<FormValues>
        buttonsAlign="right"
        buttonsBordered={false}
        className="node-name"
        footer={
          hostnameError ? (
            <div className="node-name__error is-error">
              <p className="p-form-validation__message u-no-margin--bottom">
                <strong>Error:</strong> {hostnameError}
              </p>
            </div>
          ) : null
        }
        inline
        onCancel={() => setEditingName(false)}
        onSaveAnalytics={{
          action: "Saved",
          category: "Node details header",
          label: "name",
        }}
        saving={saving}
        saved={saved}
      >
        <NodeNameFields saving={saving} setHostnameError={setHostnameError} />
      </FormikFormContent>
    </Formik>
  );
};

export default NodeName;
