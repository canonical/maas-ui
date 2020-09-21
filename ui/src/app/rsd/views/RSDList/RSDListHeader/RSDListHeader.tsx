import { Button } from "@canonical/react-components";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

import { getVMHostCount } from "app/kvm/utils";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";
import RSDActionFormWrapper from "app/rsd/components/RSDActionFormWrapper";
import RSDListActionMenu from "./RSDListActionMenu";
import SectionHeader from "app/base/components/SectionHeader";

const RSDListHeader = (): JSX.Element => {
  const dispatch = useDispatch();
  const location = useLocation();
  const rsds = useSelector(podSelectors.rsds);
  const podsLoaded = useSelector(podSelectors.loaded);
  const selectedRSDs = useSelector(podSelectors.selectedRSDs);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  useEffect(() => {
    dispatch(podActions.fetch());
  }, [dispatch]);

  // If path is not exactly "/rsd" or no RSDs are selected, close the form.
  useEffect(() => {
    if (location.pathname !== "/rsd" || selectedRSDs.length === 0) {
      setSelectedAction(null);
    }
  }, [location.pathname, selectedRSDs, setSelectedAction]);

  return (
    <SectionHeader
      buttons={
        location.pathname === "/rsd" && !selectedAction
          ? [
              <Button
                appearance="neutral"
                data-test="add-rsd"
                disabled={selectedRSDs.length > 0}
                element={Link}
                key="add-rsd"
                to="/rsd/add"
              >
                Add RSD
              </Button>,
              <RSDListActionMenu
                key="action-dropdown"
                setSelectedAction={setSelectedAction}
              />,
            ]
          : undefined
      }
      formWrapper={
        selectedAction ? (
          <RSDActionFormWrapper
            selectedAction={selectedAction}
            setSelectedAction={setSelectedAction}
          />
        ) : undefined
      }
      loading={!podsLoaded}
      subtitle={getVMHostCount(rsds.length, selectedRSDs.length)}
      title="RSD"
    />
  );
};

export default RSDListHeader;
