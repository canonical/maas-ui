import { createStandardActions } from "app/utils/redux";

import { Pod } from "app/base/types";

const pod = createStandardActions("pod");

pod.setSelected = (pods: Pod[]) => {
  return {
    type: "SET_SELECTED_PODS",
    payload: pods.map((pod) => pod.id),
  };
};

export default pod;
