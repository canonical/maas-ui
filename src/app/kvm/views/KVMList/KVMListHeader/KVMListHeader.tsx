import { useEffect } from "react";

import { Button } from "@canonical/react-components";
import pluralize from "pluralize";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import type { SectionHeaderProps } from "app/base/components/SectionHeader";
import SectionHeader from "app/base/components/SectionHeader";
import urls from "app/base/urls";
import { KVMSidePanelViews } from "app/kvm/constants";
import type { KVMSetSidePanelContent } from "app/kvm/types";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";

type Props = Required<Pick<SectionHeaderProps, "title">> & {
  setSidePanelContent: KVMSetSidePanelContent;
};

const KVMListHeader = ({ setSidePanelContent, title }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const location = useLocation();
  const kvms = useSelector(podSelectors.kvms);
  const podsLoaded = useSelector(podSelectors.loaded);
  const lxdTabActive = location.pathname.endsWith(urls.kvm.lxd.index);

  useEffect(() => {
    dispatch(podActions.fetch());
  }, [dispatch]);

  return (
    <SectionHeader
      buttons={[
        <Button
          appearance="positive"
          data-testid="add-kvm"
          key="add-kvm"
          onClick={() =>
            setSidePanelContent({
              view: lxdTabActive
                ? KVMSidePanelViews.ADD_LXD_HOST
                : KVMSidePanelViews.ADD_VIRSH_HOST,
            })
          }
        >
          Add {lxdTabActive ? "LXD" : "Virsh"} host
        </Button>,
      ]}
      subtitle={`${pluralize("KVM host", kvms.length, true)} available`}
      subtitleLoading={!podsLoaded}
      title={title}
    />
  );
};

export default KVMListHeader;
