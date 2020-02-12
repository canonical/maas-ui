import { Button, Loader } from "@canonical/react-components";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
  domain as domainActions,
  general as generalActions,
  resourcepool as resourcePoolActions,
  zone as zoneActions
} from "app/base/actions";
import {
  domain as domainSelectors,
  general as generalSelectors,
  resourcepool as resourcePoolSelectors,
  zone as zoneSelectors
} from "app/base/selectors";
import { useWindowTitle } from "app/base/hooks";
import FormCard from "app/base/components/FormCard";

export const AddMachine = () => {
  const dispatch = useDispatch();

  const architecturesLoaded = useSelector(
    generalSelectors.architectures.loaded
  );
  const defaultMinHweKernelLoaded = useSelector(
    generalSelectors.defaultMinHweKernel.loaded
  );
  const domainsLoaded = useSelector(domainSelectors.loaded);
  const hweKernelsLoaded = useSelector(generalSelectors.hweKernels.loaded);
  const powerTypesLoaded = useSelector(generalSelectors.powerTypes.loaded);
  const resourcePoolsLoaded = useSelector(resourcePoolSelectors.loaded);
  const zonesLoaded = useSelector(zoneSelectors.loaded);

  const allLoaded =
    domainsLoaded &&
    architecturesLoaded &&
    defaultMinHweKernelLoaded &&
    hweKernelsLoaded &&
    powerTypesLoaded &&
    resourcePoolsLoaded &&
    zonesLoaded;

  useEffect(() => {
    if (!allLoaded) {
      dispatch(domainActions.fetch());
      dispatch(generalActions.fetchArchitectures());
      dispatch(generalActions.fetchDefaultMinHweKernel());
      dispatch(generalActions.fetchHweKernels());
      dispatch(generalActions.fetchPowerTypes());
      dispatch(resourcePoolActions.fetch());
      dispatch(zoneActions.fetch());
    }
  }, [dispatch, allLoaded]);

  useWindowTitle("Add machine");

  return (
    <FormCard sidebar={false} title="Add machine">
      {!allLoaded ? (
        <Loader inline text="Loading" />
      ) : (
        <>
          <hr />
          <div className="u-align--right">
            <Button
              appearance="base"
              className="u-no-margin--bottom"
              element={Link}
              style={{ marginRight: "1rem" }}
              to="/machines"
            >
              Cancel
            </Button>
            <Button
              appearance="neutral"
              className="u-no-margin--bottom"
              disabled
            >
              Save and add another
            </Button>
            <Button
              appearance="positive"
              className="u-no-margin--bottom"
              disabled
            >
              Save machine
            </Button>
          </div>
        </>
      )}
    </FormCard>
  );
};

export default AddMachine;
