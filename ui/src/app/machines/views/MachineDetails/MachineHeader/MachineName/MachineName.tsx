import React, { useEffect } from "react";

import { Button, Spinner } from "@canonical/react-components";
import { usePrevious } from "@canonical/react-components/dist/hooks";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import MachineNameFields from "../MachineNameFields";

import FormikForm from "app/base/components/FormikForm";
import { actions as domainActions } from "app/store/domain";
import domainSelectors from "app/store/domain/selectors";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import { useCanEdit } from "app/store/machine/utils";

import type { Machine } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";

type Props = {
  editingName: boolean;
  id: Machine["system_id"];
  setEditingName: (editingName: boolean) => void;
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

const MachineName = ({
  editingName,
  id,
  setEditingName,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, id)
  );
  const saved = useSelector(machineSelectors.saved);
  const saving = useSelector(machineSelectors.saving);
  const domains = useSelector(domainSelectors.all);
  const canEdit = useCanEdit(machine);
  const previousSaving = usePrevious(saving);

  useEffect(() => {
    // The machine has transitioned from saving to saved so close the form.
    if (saved && !saving && previousSaving) {
      setEditingName(false);
    }
  }, [previousSaving, saved, saving, setEditingName]);

  useEffect(() => {
    dispatch(domainActions.fetch());
  }, [dispatch]);

  if (!machine) {
    return <Spinner />;
  }
  if (!canEdit) {
    return <span className="machine-name">{machine.fqdn}</span>;
  }
  if (!editingName) {
    return (
      <Button
        appearance="base"
        className="machine-name--editable"
        onClick={() => setEditingName(true)}
      >
        {machine.fqdn}
      </Button>
    );
  }
  return (
    <FormikForm
      initialValues={{
        domain: machine.domain.id,
        hostname: machine.hostname,
      }}
      inline
      onCancel={() => setEditingName(false)}
      onSaveAnalytics={{
        action: "Saved",
        category: "Machine details header",
        label: "name",
      }}
      onSubmit={({ hostname, domain }) => {
        dispatch(
          machineActions.update({
            ...machine,
            domain: domains.find(({ id }) => id === parseInt(domain, 10)),
            hostname,
          })
        );
      }}
      saving={saving}
      saved={saved}
      validationSchema={Schema}
    >
      <MachineNameFields saving={saving} />
    </FormikForm>
  );
};

export default MachineName;
