import React from "react";

import GeneralForm from "../../components/GeneralForm";

const Configuration = () => {
  return (
    <>
      <h4>Configuration</h4>
      <GeneralForm maasName="my-maas" enableAnalytics={true} />
    </>
  )
};

export default Configuration;
