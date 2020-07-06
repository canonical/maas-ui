import type { Pod } from "app/store/pod/types";
import { createStandardActions } from "app/utils/redux";

const pod = createStandardActions("pod");

pod.refresh = (podID: Pod["id"]) => {
  return {
    type: "REFRESH_POD",
    meta: {
      model: "pod",
      method: "refresh",
    },
    payload: {
      params: { id: podID },
    },
  };
};

pod.setSelected = (podIDs: Pod["id"][]) => {
  return {
    type: "SET_SELECTED_PODS",
    payload: podIDs,
  };
};

export default pod;
