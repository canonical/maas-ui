import { Spinner } from "@canonical/react-components";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { pod as podActions } from "app/base/actions";
import { pod as podSelectors } from "app/base/selectors";

const KVMListHeader = (): JSX.Element => {
  const dispatch = useDispatch();
  const pods = useSelector(podSelectors.all);
  const podsLoaded = useSelector(podSelectors.loaded);

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
            {`${pods.length} VM hosts available`}
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
