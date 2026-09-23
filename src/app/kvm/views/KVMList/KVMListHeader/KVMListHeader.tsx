import type { ReactElement } from "react";

import { MainToolbar, useSidePanel } from "@canonical/maas-react-components";
import { Button, Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";

import ModelListSubtitle from "@/app/base/components/ModelListSubtitle";
import type { SectionHeaderProps } from "@/app/base/components/SectionHeader";
import { useFetchActions } from "@/app/base/hooks";
import { useHasEntitlements } from "@/app/base/hooks/permissions";
import urls from "@/app/base/urls";
import AddLxd from "@/app/kvm/components/AddLxd";
import AddVirsh from "@/app/kvm/components/AddVirsh";
import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import { podActions } from "@/app/store/pod";
import podSelectors from "@/app/store/pod/selectors";

type Props = Required<Pick<SectionHeaderProps, "title">>;

const KVMListHeader = ({ title }: Props): ReactElement => {
  const location = useLocation();
  const { openSidePanel } = useSidePanel();
  const kvms = useSelector(podSelectors.kvms);
  const podsLoaded = useSelector(podSelectors.loaded);
  const lxdTabActive = location.pathname.endsWith(urls.kvm.lxd.index);
  const canEdit = useHasEntitlements([Entitlement.CAN_EDIT_MACHINES]);

  useFetchActions([podActions.fetch]);

  return (
    <MainToolbar>
      <MainToolbar.Title>{title}</MainToolbar.Title>
      {podsLoaded ? (
        <ModelListSubtitle available={kvms.length} modelName="KVM host" />
      ) : (
        <Spinner text="Loading" />
      )}
      <MainToolbar.Controls>
        <Button
          appearance="positive"
          data-testid="add-kvm"
          disabled={!canEdit}
          key="add-kvm"
          onClick={() => {
            if (lxdTabActive) {
              openSidePanel({
                component: AddLxd,
                title: "Add LXD host",
              });
            } else {
              openSidePanel({
                component: AddVirsh,
                title: "Add Virsh host",
              });
            }
          }}
        >
          Add {lxdTabActive ? "LXD" : "Virsh"} host
        </Button>
      </MainToolbar.Controls>
    </MainToolbar>
  );
};

export default KVMListHeader;
