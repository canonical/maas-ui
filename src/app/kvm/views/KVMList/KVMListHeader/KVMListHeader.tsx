import { useEffect } from "react";

import { Button } from "@canonical/react-components";
import pluralize from "pluralize";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import type { SectionHeaderProps } from "app/base/components/SectionHeader";
import SectionHeader from "app/base/components/SectionHeader";
import urls from "app/base/urls";
import KVMHeaderForms from "app/kvm/components/KVMHeaderForms";
import { KVMHeaderViews } from "app/kvm/constants";
import type {
  KVMSidePanelContent,
  KVMSetSidePanelContent,
} from "app/kvm/types";
import { getFormTitle } from "app/kvm/utils";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";

type Props = Required<Pick<SectionHeaderProps, "title">> & {
  sidePanelContent: KVMSidePanelContent | null;
  setSidePanelContent: KVMSetSidePanelContent;
};

const KVMListHeader = ({
  sidePanelContent,
  setSidePanelContent,
  title,
}: Props): JSX.Element => {
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
                ? KVMHeaderViews.ADD_LXD_HOST
                : KVMHeaderViews.ADD_VIRSH_HOST,
            })
          }
        >
          Add {lxdTabActive ? "LXD" : "Virsh"} host
        </Button>,
      ]}
      sidePanelContent={
        sidePanelContent ? (
          <KVMHeaderForms
            setSidePanelContent={setSidePanelContent}
            sidePanelContent={sidePanelContent}
          />
        ) : null
      }
      sidePanelTitle={sidePanelContent ? getFormTitle(sidePanelContent) : "KVM"}
      subtitle={`${pluralize("KVM host", kvms.length, true)} available`}
      subtitleLoading={!podsLoaded}
      title={title}
    />
  );
};

export default KVMListHeader;
