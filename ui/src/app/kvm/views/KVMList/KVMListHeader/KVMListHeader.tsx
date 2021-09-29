import { useEffect } from "react";

import { Button } from "@canonical/react-components";
import pluralize from "pluralize";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

import SectionHeader from "app/base/components/SectionHeader";
import KVMHeaderForms from "app/kvm/components/KVMHeaderForms";
import { KVMHeaderViews } from "app/kvm/constants";
import type { KVMHeaderContent, KVMSetHeaderContent } from "app/kvm/types";
import kvmURLs from "app/kvm/urls";
import { getHeaderTitle } from "app/kvm/utils";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";

type Props = {
  headerContent: KVMHeaderContent | null;
  setHeaderContent: KVMSetHeaderContent;
  showLXDtab?: boolean;
  showVirshtab?: boolean;
};

const KVMListHeader = ({
  headerContent,
  setHeaderContent,
  showLXDtab,
  showVirshtab,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const location = useLocation();
  const kvms = useSelector(podSelectors.kvms);
  const podsLoaded = useSelector(podSelectors.loaded);

  useEffect(() => {
    dispatch(podActions.fetch());
  }, [dispatch]);

  return (
    <SectionHeader
      buttons={[
        <Button
          appearance="positive"
          data-test="add-kvm"
          key="add-kvm"
          onClick={() => setHeaderContent({ view: KVMHeaderViews.ADD_KVM })}
        >
          Add KVM
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
      loading={!podsLoaded}
      subtitle={`${pluralize("VM host", kvms.length, true)} available`}
      tabLinks={[
        ...(showLXDtab
          ? [
              {
                active: location.pathname.endsWith(kvmURLs.lxd),
                component: Link,
                "data-test": "lxd-tab",
                label: "LXD",
                to: kvmURLs.lxd,
              },
            ]
          : []),
        ...(showVirshtab
          ? [
              {
                active: location.pathname.endsWith(kvmURLs.virsh),
                component: Link,
                "data-test": "virsh-tab",
                label: "Virsh",
                to: kvmURLs.virsh,
              },
            ]
          : []),
      ]}
      title={getHeaderTitle("KVM", headerContent)}
    />
  );
};

export default KVMListHeader;
