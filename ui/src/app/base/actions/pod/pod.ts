import { createStandardActions } from "app/utils/redux";

const pod = createStandardActions("pod");

pod.setSelected = (podIDs: number[]) => {
  return {
    type: "SET_SELECTED_PODS",
    payload: podIDs,
  };
};

export default pod;
