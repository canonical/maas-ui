import { useEffect, useState } from "react";

import { Button } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import VLANDeleteForm from "./VLANDeleteForm";

import SectionHeader from "app/base/components/SectionHeader";
import authSelectors from "app/store/auth/selectors";
import { actions as fabricActions } from "app/store/fabric";
import fabricSelectors from "app/store/fabric/selectors";
import type { Fabric } from "app/store/fabric/types";
import type { RootState } from "app/store/root/types";
import vlanSelectors from "app/store/vlan/selectors";
import type { VLAN, VLANMeta } from "app/store/vlan/types";
import { VlanVid } from "app/store/vlan/types";
import { isVLANDetails } from "app/store/vlan/utils";

type Props = {
  id?: VLAN[VLANMeta.PK] | null;
};

enum HeaderForms {
  Delete,
}

const generateTitle = (
  vlan?: VLAN | null,
  fabric?: Fabric | null
): string | null => {
  if (!vlan || !fabric) {
    return null;
  }
  let title: string;
  if (vlan.name) {
    title = vlan.name;
  } else if (vlan.vid === VlanVid.UNTAGGED) {
    title = "Default VLAN";
  } else {
    title = `VLAN ${vlan.vid}`;
  }
  return `${title} in ${fabric.name}`;
};

const VLANDetailsHeader = ({ id }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const vlan = useSelector((state: RootState) =>
    vlanSelectors.getById(state, id)
  );
  const fabricId = vlan?.fabric;
  const fabric = useSelector((state: RootState) =>
    fabricSelectors.getById(state, fabricId)
  );
  const isAdmin = useSelector(authSelectors.isAdmin);
  const [formOpen, setFormOpen] = useState<HeaderForms | null>(null);

  useEffect(() => {
    dispatch(fabricActions.fetch());
  }, [dispatch]);

  const buttons = [];
  if (isAdmin) {
    buttons.push(
      <Button
        data-testid="delete-vlan"
        key="delete-vlan"
        onClick={() => setFormOpen(HeaderForms.Delete)}
      >
        Delete VLAN
      </Button>
    );
  }
  const closeForm = () => {
    setFormOpen(null);
  };

  return (
    <SectionHeader
      buttons={buttons}
      sidePanelContent={
        formOpen === null ? null : (
          <>
            {formOpen === HeaderForms.Delete && (
              <VLANDeleteForm closeForm={closeForm} id={id} />
            )}
          </>
        )
      }
      subtitleLoading={!isVLANDetails(vlan)}
      title={generateTitle(vlan, fabric)}
    />
  );
};

export default VLANDetailsHeader;
