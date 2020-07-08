import { Button } from "@canonical/react-components";
import pluralize from "pluralize";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

import { pod as podActions } from "app/base/actions";
import { pod as podSelectors } from "app/base/selectors";
import type { Pod } from "app/store/pod/types";
import KVMActionFormWrapper from "app/kvm/components/KVMActionFormWrapper";
import KVMListActionMenu from "./KVMListActionMenu";
import SectionHeader from "app/base/components/SectionHeader";

const getPodCount = (pods: Pod[], selectedPodIDs: number[]) => {
  const podCountString = pluralize("VM host", pods.length, true);
  if (selectedPodIDs.length) {
    if (pods.length === selectedPodIDs.length) {
      return "All VM hosts selected";
    }
    return `${selectedPodIDs.length} of ${podCountString} selected`;
  }
  return `${podCountString} available`;
};

const KVMListHeader = (): JSX.Element => {
  const dispatch = useDispatch();
  const location = useLocation();
  const pods = useSelector(podSelectors.kvm);
  const podsLoaded = useSelector(podSelectors.loaded);
  const selectedPodIDs = useSelector(podSelectors.selectedIDs);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  useEffect(() => {
    dispatch(podActions.fetch());
  }, [dispatch]);

  // If path is not exactly "/kvm" or no KVMs are selected, close the form.
  useEffect(() => {
    if (location.pathname !== "/kvm" || selectedPodIDs.length === 0) {
      setSelectedAction(null);
    }
  }, [location.pathname, selectedPodIDs, setSelectedAction]);

  return (
    <SectionHeader
      buttons={
        location.pathname === "/kvm" &&
        !selectedAction && [
          <Button
            appearance="neutral"
            className="u-no-margin--bottom"
            data-test="add-kvm"
            disabled={selectedPodIDs.length > 0}
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
      subtitle={getPodCount(pods, selectedPodIDs)}
      title="KVM"
    />
  );
};

export default KVMListHeader;
