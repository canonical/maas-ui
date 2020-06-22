import { Spinner } from "@canonical/react-components";
import pluralize from "pluralize";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { pod as podActions } from "app/base/actions";
import { pod as podSelectors } from "app/base/selectors";
import { Pod } from "app/base/types";

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
  const pods = useSelector(podSelectors.all);
  const podsLoaded = useSelector(podSelectors.loaded);
  const selectedPodIDs = useSelector(podSelectors.selectedIDs);

  useEffect(() => {
    dispatch(podActions.fetch());
  }, [dispatch]);

  return (
    <div className="u-flex--between u-flex--wrap">
      <ul className="p-inline-list u-no-margin--bottom">
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
    </div>
  );
};

export default KVMListHeader;
