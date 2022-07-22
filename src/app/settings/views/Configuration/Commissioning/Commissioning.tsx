import { useEffect } from "react";

import { Col, Spinner, Row } from "@canonical/react-components";
import { useSelector, useDispatch } from "react-redux";

import CommissioningForm from "../CommissioningForm";

import { useWindowTitle } from "app/base/hooks";
import { actions as configActions } from "app/store/config";
import configSelectors from "app/store/config/selectors";
import { actions as generalActions } from "app/store/general";
import { osInfo as osInfoSelectors } from "app/store/general/selectors";

export enum Labels {
  Loading = "Loading...",
}

const Commissioning = (): JSX.Element => {
  const configLoaded = useSelector(configSelectors.loaded);
  const configLoading = useSelector(configSelectors.loading);
  const osInfoLoaded = useSelector(osInfoSelectors.loaded);
  const osInfoLoading = useSelector(osInfoSelectors.loading);
  const loaded = configLoaded && osInfoLoaded;
  const loading = configLoading || osInfoLoading;
  const dispatch = useDispatch();

  useWindowTitle("Commissioning");

  useEffect(() => {
    if (!loaded) {
      dispatch(configActions.fetch());
      dispatch(generalActions.fetchOsInfo());
    }
  }, [dispatch, loaded]);

  return (
    <Row>
      <Col size={6}>
        {loading && <Spinner text={Labels.Loading} />}
        {loaded && <CommissioningForm />}
      </Col>
    </Row>
  );
};

export default Commissioning;
