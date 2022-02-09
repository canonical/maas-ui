import { useEffect } from "react";

import { Button, Spinner, Strip } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import { actions as generalActions } from "app/store/general";
import { knownBootArchitectures as knownBootArchitecturesSelectors } from "app/store/general/selectors";
import type { RootState } from "app/store/root/types";
import subnetSelectors from "app/store/subnet/selectors";
import type { SubnetActionProps } from "app/subnets/views/SubnetDetails/types";

export const MapSubnet = ({
  id,
  setActiveForm,
}: Omit<SubnetActionProps, "activeForm">): JSX.Element | null => {
  const dispatch = useDispatch();
  const architecturesLoading = useSelector(
    knownBootArchitecturesSelectors.loading
  );
  const subnet = useSelector((state: RootState) =>
    subnetSelectors.getById(state, id)
  );

  useEffect(() => {
    dispatch(generalActions.fetchKnownBootArchitectures());
  }, [dispatch]);

  if (!subnet || architecturesLoading) {
    return (
      <Strip data-testid="loading-data" shallow>
        <Spinner text="Loading..." />
      </Strip>
    );
  }

  const closeForm = () => setActiveForm(null);
  return <Button onClick={closeForm}>Close</Button>;
};

export default MapSubnet;
