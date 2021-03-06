import { useEffect, useState } from "react";

import { Button, Spinner, Tooltip } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import InterfaceFormTable from "../InterfaceFormTable";
import type { Selected, SetSelected } from "../NetworkTable/types";

import FormCard from "app/base/components/FormCard";
import machineSelectors from "app/store/machine/selectors";
import type { MachineDetails, NetworkInterface } from "app/store/machine/types";
import { NetworkInterfaceTypes } from "app/store/machine/types";
import { isBondOrBridgeParent } from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";
import { actions as vlanActions } from "app/store/vlan";
import vlanSelectors from "app/store/vlan/selectors";

type Props = {
  close: () => void;
  selected: Selected[];
  setSelected: SetSelected;
  systemId: MachineDetails["system_id"];
};

const BondForm = ({
  close,
  selected,
  setSelected,
  systemId,
}: Props): JSX.Element | null => {
  const [editingMembers, setEditingMembers] = useState(false);
  const [bondVLAN, setBondVLAN] = useState<NetworkInterface["vlan_id"] | null>(
    null
  );
  const dispatch = useDispatch();
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  // Use the first selected interface as the canary for the fabric and VLAN.
  const [firstSelected] = selected;
  const firstNic = useSelector((state: RootState) =>
    machineSelectors.getInterfaceById(
      state,
      systemId,
      firstSelected?.nicId,
      firstSelected?.linkId
    )
  );
  const vlan = useSelector((state: RootState) =>
    vlanSelectors.getById(state, bondVLAN || firstNic?.vlan_id)
  );
  const vlansLoaded = useSelector(vlanSelectors.loaded);

  useEffect(() => {
    dispatch(vlanActions.fetch());
  }, [dispatch]);

  useEffect(() => {
    // When the form is first show then store the VLAN for this bond. This needs
    // to be done so that if all interfaces become deselected then the VLAN
    // information is not lost.
    if (!bondVLAN && selected.length > 1 && firstNic) {
      setBondVLAN(firstNic?.vlan_id);
    }
  }, [bondVLAN, firstNic, selected, setBondVLAN]);

  if (!machine || !("interfaces" in machine) || !vlansLoaded) {
    return <Spinner />;
  }
  // Find other nics that could be in this bond. They need to be physical
  // interfaces on the same vlan that are not already in a bond or bridge.
  const validNics = machine.interfaces.filter(
    (networkInterface) =>
      networkInterface.vlan_id === vlan?.id &&
      networkInterface.type === NetworkInterfaceTypes.PHYSICAL &&
      !isBondOrBridgeParent(machine, networkInterface)
  );
  // When editing the bond members then display all valid nics, otherwise just
  // show the selected nics.
  const rows = editingMembers
    ? validNics.map(({ id, links }) => ({ nicId: id, linkId: links[0]?.id }))
    : selected;
  let editTooltip: string | null = null;
  let editDisabled = false;
  if (!editingMembers && validNics.length === 2) {
    // Disable the button to add more members if there are no more to choose
    // from.
    editTooltip = "There are no additional valid members";
    editDisabled = true;
  } else if (editingMembers && selected.length < 2) {
    // Don't let the user update the selection if they haven't chosen at least
    // two interfaces.
    editTooltip = "At least two interfaces must be selected";
    editDisabled = true;
  }

  return (
    <FormCard sidebar={false} stacked title="Create bond">
      <InterfaceFormTable
        editPrimary
        interfaces={rows}
        selected={selected}
        selectedEditable={editingMembers}
        setSelected={setSelected}
        systemId={systemId}
      />
      <Tooltip message={editTooltip}>
        <Button
          data-test="edit-members"
          disabled={editDisabled}
          onClick={() => setEditingMembers(!editingMembers)}
        >
          {editingMembers ? "Update bond members" : "Edit bond members"}
        </Button>
      </Tooltip>
      <button onClick={close}>Cancel</button>
    </FormCard>
  );
};

export default BondForm;
