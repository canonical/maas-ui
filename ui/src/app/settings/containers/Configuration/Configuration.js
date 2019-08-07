import React from "react";
import { useSelector } from "react-redux";

import selectors from "app/settings/selectors";
import Loader from "app/base/components/Loader";
import GeneralForm from "app/settings/components/GeneralForm";

const Configuration = () => {
  const loaded = useSelector(selectors.config.loaded);
  const loading = useSelector(selectors.config.loading);

  return (
    <>
      <h4>
        Configuration
        {loading && <Loader text="Loading..." inline />}
      </h4>

      {loaded && <GeneralForm />}
    </>
  );
};

export default Configuration;
