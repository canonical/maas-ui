import { Button, Spinner } from "@canonical/react-components";
import pluralize from "pluralize";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Route, useLocation } from "react-router-dom";

import { actions as podActions } from "app/store/pod";
import { pod as podSelectors } from "app/base/selectors";
import { Pod } from "app/store/pod/types";
import KVMActionFormWrapper from "./KVMActionFormWrapper";
import KVMListActionMenu from "./KVMListActionMenu";

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
  const [selectedAction, setSelectedAction] = useState("");

  useEffect(() => {
    dispatch(podActions.fetch());
  }, [dispatch]);

  useEffect(() => {
    if (location.pathname !== "/kvm") {
      setSelectedAction(null);
    }
  }, [location.pathname, setSelectedAction]);

  return (
    <>
      <div className="u-flex--between u-flex--wrap">
        <ul className="p-inline-list">
          <li className="p-inline-list__item p-heading--four">KVM</li>
          {podsLoaded ? (
            <li
              className="p-inline-list__item last-item u-text--light"
              data-test="pod-count"
            >
              {getPodCount(pods, selectedPodIDs)}
            </li>
          ) : (
            <Spinner
              className="u-no-padding u-no-margin"
              inline
              text="Loading..."
            />
          )}
        </ul>
        <Route exact path="/kvm">
          <ul className="p-inline-list u-no-margin--bottom">
            <li className="p-inline-list__item">
              <Button
                appearance="neutral"
                className="u-no-margin--bottom"
                data-test="add-kvm"
                disabled={selectedPodIDs.length > 0}
                element={Link}
                to={"/kvm/add"}
              >
                Add KVM
              </Button>
            </li>
            <li className="p-inline-list__item last-item">
              <KVMListActionMenu setSelectedAction={setSelectedAction} />
            </li>
          </ul>
        </Route>
      </div>
      <KVMActionFormWrapper
        selectedAction={selectedAction}
        setSelectedAction={setSelectedAction}
      />
    </>
  );
};

export default KVMListHeader;
