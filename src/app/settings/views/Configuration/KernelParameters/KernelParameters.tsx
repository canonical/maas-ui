import { useEffect } from "react";

import { Col, Spinner, Row } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import KernelParametersForm from "../KernelParametersForm";

import { useWindowTitle } from "app/base/hooks";
import { actions as configActions } from "app/store/config";
import configSelectors from "app/store/config/selectors";

export enum Labels {
  Loading = "Loading...",
}

const KernelParameters = (): JSX.Element => {
  const loaded = useSelector(configSelectors.loaded);
  const loading = useSelector(configSelectors.loading);
  const dispatch = useDispatch();

  useWindowTitle("Kernel parameters");

  useEffect(() => {
    if (!loaded) {
      dispatch(configActions.fetch());
    }
  }, [dispatch, loaded]);

  return (
    <Row>
      <Col size={6}>
        {loading && <Spinner text={Labels.Loading} />}
        {loaded && <KernelParametersForm />}
      </Col>
    </Row>
  );
};

export default KernelParameters;
