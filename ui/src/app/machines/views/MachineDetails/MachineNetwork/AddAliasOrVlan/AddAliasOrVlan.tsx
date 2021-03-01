import { useCallback, useState } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import {
  networkFieldsInitialValues,
  networkFieldsSchema,
} from "../NetworkFields/NetworkFields";

import AddAliasOrVlanFields from "./AddAliasOrVlanFields";
import type { AddAliasOrVlanValues } from "./types";

import FormCardButtons from "app/base/components/FormCardButtons";
import FormikForm from "app/base/components/FormikForm";
import { useScrollOnRender } from "app/base/hooks";
import { useMachineDetailsForm } from "app/machines/hooks";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type {
  Machine,
  MachineDetails,
  NetworkInterface,
} from "app/store/machine/types";
import { NetworkInterfaceTypes } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import vlanSelectors from "app/store/vlan/selectors";

type Props = {
  close: () => void;
  nic?: NetworkInterface | null;
  interfaceType: NetworkInterfaceTypes.ALIAS | NetworkInterfaceTypes.VLAN;
  systemId: MachineDetails["system_id"];
};

const InterfaceSchema = Yup.object().shape({
  ...networkFieldsSchema,
  tags: Yup.array().of(Yup.string()),
});

const AddAliasOrVlan = ({
  close,
  nic,
  interfaceType,
  systemId,
}: Props): JSX.Element | null => {
  const [secondarySubmit, setSecondarySubmit] = useState(false);
  const dispatch = useDispatch();
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const unusedVLANs = useSelector((state: RootState) =>
    vlanSelectors.getUnusedForInterface(state, machine, nic)
  );
  const cleanup = useCallback(() => machineActions.cleanup(), []);
  const isAlias = interfaceType === NetworkInterfaceTypes.ALIAS;
  const { errors, saved, saving } = useMachineDetailsForm(
    systemId,
    isAlias ? "linkingSubnet" : "creatingVlan",
    isAlias ? "linkSubnet" : "createVlan",
    () => {
      if (secondarySubmit) {
        // Reset the flag for the action that submitted the form.
        setSecondarySubmit(false);
      } else {
        close();
      }
    }
  );
  const onRenderRef = useScrollOnRender<HTMLDivElement>();
  const canAddAnother = isAlias || (!isAlias && unusedVLANs.length > 1);

  if (!nic || !machine || !("interfaces" in machine)) {
    return <Spinner text="Loading..." />;
  }
  return (
    <div ref={onRenderRef}>
      <FormikForm
        buttons={FormCardButtons}
        cleanup={cleanup}
        errors={errors}
        initialValues={{
          ...networkFieldsInitialValues,
          ...(isAlias ? {} : { tags: [] }),
        }}
        onSaveAnalytics={{
          action: `Add ${interfaceType}`,
          category: "Machine details networking",
          label: `Add ${interfaceType} form`,
        }}
        onCancel={close}
        onSubmit={(values: AddAliasOrVlanValues) => {
          // Clear the errors from the previous submission.
          dispatch(cleanup());
          type Payload = AddAliasOrVlanValues & {
            system_id: Machine["system_id"];
          };
          const payload: Payload = {
            ...values,
            system_id: systemId,
          };
          // Remove all empty values.
          Object.entries(payload).forEach(([key, value]) => {
            if (value === "") {
              delete payload[key as keyof Payload];
            }
          });
          if (isAlias) {
            // Create an alias.
            dispatch(
              machineActions.linkSubnet({
                ...payload,
                interface_id: nic.id,
              })
            );
          } else {
            // Create a VLAN.
            dispatch(
              machineActions.createVlan({
                ...payload,
                parent: nic.id,
              })
            );
          }
        }}
        resetOnSave
        saved={saved}
        saving={saving}
        secondarySubmit={() => {
          // Flag that the form was submitted by the secondary action.
          setSecondarySubmit(true);
        }}
        secondarySubmitDisabled={!canAddAnother}
        secondarySubmitLabel="Save and add another"
        secondarySubmitTooltip={
          canAddAnother
            ? null
            : "There are no more unused VLANS for this interface."
        }
        submitLabel="Save interface"
        validationSchema={InterfaceSchema}
      >
        <AddAliasOrVlanFields
          nic={nic}
          interfaceType={interfaceType}
          systemId={systemId}
        />
      </FormikForm>
    </div>
  );
};

export default AddAliasOrVlan;
