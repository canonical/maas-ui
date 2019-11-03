import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { config as configActions } from "app/settings/actions";
import { config as configSelectors } from "app/settings/selectors";
import { useWindowTitle } from "app/base/hooks";
import { Col } from "@canonical/react-components";
import { Loader } from "@canonical/react-components";
import { Row } from "@canonical/react-components";
import WindowsForm from "../WindowsForm";

const Windows = () => {
  const loaded = useSelector(configSelectors.loaded);
  const loading = useSelector(configSelectors.loading);
  const dispatch = useDispatch();

  useWindowTitle("Windows");

  useEffect(() => {
    if (!loaded) {
      dispatch(configActions.fetch());
    }
  }, [dispatch, loaded]);

  return (
    <Row>
      <Col size={6}>
        {loading && <Loader text="Loading..." />}
        {loaded && <WindowsForm />}
      </Col>
    </Row>
  );
};

export default Windows;
