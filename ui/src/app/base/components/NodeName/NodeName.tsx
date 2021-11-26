import { useEffect } from "react";

import { Button, Spinner } from "@canonical/react-components";
import { usePrevious } from "@canonical/react-components/dist/hooks";
import * as Yup from "yup";

import NodeNameFields from "./NodeNameFields";

import FormikForm from "app/base/components/FormikForm";
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

const Schema = Yup.object().shape({
  hostname: Yup.string()
    .max(63, "Hostname must be 63 characters or less.")
    .matches(
      hostnamePattern,
      "Hostname must only contain letters, numbers and hyphens."
    )
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
    <FormikForm<FormValues>
      buttonsAlign="right"
      buttonsBordered={false}
      initialValues={{
        domain: String(node.domain.id),
        hostname: node.hostname,
      }}
      inline
      onCancel={() => setEditingName(false)}
      onSaveAnalytics={{
        action: "Saved",
        category: "Node details header",
        label: "name",
      }}
      onSubmit={({ hostname, domain }) => {
        onSubmit(hostname, parseInt(domain, 10));
      }}
      saving={saving}
      saved={saved}
      validationSchema={Schema}
    >
      <NodeNameFields saving={saving} />
    </FormikForm>
  );
};

export default NodeName;
