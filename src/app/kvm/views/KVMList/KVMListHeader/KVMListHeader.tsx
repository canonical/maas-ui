import { MainToolbar } from "@canonical/maas-react-components";
import { Button, Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";

import ModelListSubtitle from "@/app/base/components/ModelListSubtitle";
import type { SectionHeaderProps } from "@/app/base/components/SectionHeader";
import { useFetchActions } from "@/app/base/hooks";
import urls from "@/app/base/urls";
import { KVMSidePanelViews } from "@/app/kvm/constants";
import type { KVMSetSidePanelContent } from "@/app/kvm/types";
import { podActions } from "@/app/store/pod";
import podSelectors from "@/app/store/pod/selectors";

type Props = Required<Pick<SectionHeaderProps, "title">> & {
  readonly setSidePanelContent: KVMSetSidePanelContent;
};

const KVMListHeader = ({
  setSidePanelContent,
  title,
}: Props): React.ReactElement => {
  const location = useLocation();
  const kvms = useSelector(podSelectors.kvms);
  const podsLoaded = useSelector(podSelectors.loaded);
  const lxdTabActive = location.pathname.endsWith(urls.kvm.lxd.index);

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
          key="add-kvm"
          onClick={() => {
            setSidePanelContent({
              view: lxdTabActive
                ? KVMSidePanelViews.ADD_LXD_HOST
                : KVMSidePanelViews.ADD_VIRSH_HOST,
            });
          }}
        >
          Add {lxdTabActive ? "LXD" : "Virsh"} host
        </Button>
      </MainToolbar.Controls>
    </MainToolbar>
  );
};

export default KVMListHeader;
