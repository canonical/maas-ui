import { Button } from "@canonical/react-components";
import pluralize from "pluralize";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";
import KVMActionFormWrapper from "app/kvm/components/KVMActionFormWrapper";
import KVMListActionMenu from "./KVMListActionMenu";
import SectionHeader from "app/base/components/SectionHeader";

const getKVMCount = (kvmCount: number, selectedKVMCount: number) => {
  const kvmCountString = pluralize("VM host", kvmCount, true);
  if (selectedKVMCount > 0) {
    if (kvmCount === selectedKVMCount) {
      return "All VM hosts selected";
    }
    return `${selectedKVMCount} of ${kvmCountString} selected`;
  }
  return `${kvmCountString} available`;
};

const KVMListHeader = (): JSX.Element => {
  const dispatch = useDispatch();
  const location = useLocation();
  const kvms = useSelector(podSelectors.kvms);
  const podsLoaded = useSelector(podSelectors.loaded);
  const selectedKVMs = useSelector(podSelectors.selectedKVMs);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  useEffect(() => {
    dispatch(podActions.fetch());
  }, [dispatch]);

  // If path is not exactly "/kvm" or no KVMs are selected, close the form.
  useEffect(() => {
    if (location.pathname !== "/kvm" || selectedKVMs.length === 0) {
      setSelectedAction(null);
    }
  }, [location.pathname, selectedKVMs, setSelectedAction]);

  return (
    <SectionHeader
      buttons={
        location.pathname === "/kvm" &&
        !selectedAction && [
          <Button
            appearance="neutral"
            data-test="add-kvm"
            disabled={selectedKVMs.length > 0}
            element={Link}
            key="add-kvm"
            to="/kvm/add"
          >
            Add KVM
          </Button>,
          <KVMListActionMenu
            key="action-dropdown"
            setSelectedAction={setSelectedAction}
          />,
        ]
      }
      formWrapper={
        selectedAction && (
          <KVMActionFormWrapper
            selectedAction={selectedAction}
            setSelectedAction={setSelectedAction}
          />
        )
      }
      loading={!podsLoaded}
      subtitle={getKVMCount(kvms.length, selectedKVMs.length)}
      title="KVM"
    />
  );
};

export default KVMListHeader;
