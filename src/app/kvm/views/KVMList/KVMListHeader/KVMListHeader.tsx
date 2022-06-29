import { useEffect } from "react";

import { Button } from "@canonical/react-components";
import pluralize from "pluralize";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom-v5-compat";

import SectionHeader from "app/base/components/SectionHeader";
import urls from "app/base/urls";
import KVMHeaderForms from "app/kvm/components/KVMHeaderForms";
import { KVMHeaderViews } from "app/kvm/constants";
import type { KVMHeaderContent, KVMSetHeaderContent } from "app/kvm/types";
import { getFormTitle } from "app/kvm/utils";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";

type Props = {
  headerContent: KVMHeaderContent | null;
  setHeaderContent: KVMSetHeaderContent;
};

const KVMListHeader = ({
  headerContent,
  setHeaderContent,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const location = useLocation();
  const kvms = useSelector(podSelectors.kvms);
  const podsLoaded = useSelector(podSelectors.loaded);
  const lxdTabActive = location.pathname.endsWith(urls.kvm.lxd.index);
  const virshTabActive = location.pathname.endsWith(urls.kvm.virsh.index);

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
            setHeaderContent({
              view: lxdTabActive
                ? KVMHeaderViews.ADD_LXD_HOST
                : KVMHeaderViews.ADD_VIRSH_HOST,
            })
          }
        >
          Add {lxdTabActive ? "LXD" : "Virsh"} host
        </Button>,
      ]}
      headerContent={
        headerContent ? (
          <KVMHeaderForms
            headerContent={headerContent}
            setHeaderContent={setHeaderContent}
          />
        ) : null
      }
      subtitle={`${pluralize("KVM host", kvms.length, true)} available`}
      subtitleLoading={!podsLoaded}
      tabLinks={[
        {
          active: lxdTabActive,
          component: Link,
          "data-testid": "lxd-tab",
          label: "LXD",
          to: urls.kvm.lxd.index,
        },
        {
          active: virshTabActive,
          component: Link,
          "data-testid": "virsh-tab",
          label: "Virsh",
          to: urls.kvm.virsh.index,
        },
      ]}
      title={headerContent ? getFormTitle(headerContent) : "KVM"}
    />
  );
};

export default KVMListHeader;
