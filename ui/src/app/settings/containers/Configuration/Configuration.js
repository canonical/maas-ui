import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";

import actions from "app/settings/actions";
import selectors from "app/settings/selectors";
import baseSelectors from "app/base/selectors";
import Loader from "app/base/components/Loader";

const Configuration = () => {
  const dispatch = useDispatch();
  const configuration = useSelector(state =>
    selectors.configuration.all(state)
  );
  const loading = useSelector(selectors.configuration.loading);
  const loaded = useSelector(selectors.configuration.loaded);

  dispatch(actions.configuration.fetch());

  return (
    <>
      <h4>
        Configuration
        {loading && <Loader text="Loading..." inline />}
      </h4>
      {loaded && <div>{configuration[0].name}</div>}
    </>
  );
};

export default Configuration;
